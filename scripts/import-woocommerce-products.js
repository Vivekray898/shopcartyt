const fs = require("fs");
const os = require("os");
const path = require("path");
const { pipeline } = require("stream");
const { promisify } = require("util");
const streamPipeline = promisify(pipeline);
const csvParser = require("csv-parser");
const { createClient } = require("@sanity/client");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const csvFile = process.argv[2];
if (!csvFile) {
  console.error("Usage: node scripts/import-woocommerce-products.js <csv-file>");
  process.exit(1);
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_TOKEN || process.env.SANITY_API_READ_TOKEN;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-03-20";

if (!projectId || !dataset || !token) {
  console.error(
    "Missing environment variables. Ensure NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, and SANITY_API_TOKEN or SANITY_API_READ_TOKEN are set."
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token,
});

const parseCategories = (value) => {
  if (!value) return [];
  return value
    .split(",")
    .map((category) => category.trim())
    .filter(Boolean)
    .map((category) => category.split(">").map((item) => item.trim()).filter(Boolean));
};

const ensureCategory = async (pathSegments) => {
  let parent = null;
  let parentRef = null;

  for (const segment of pathSegments) {
    const slug = segment
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const title = segment;
    const query = parentRef
      ? `*[_type == "category" && title == $title && parent._ref == $parentRef][0]`
      : `*[_type == "category" && title == $title && !defined(parent)][0]`;
    const existing = await client.fetch(query, {
      title,
      parentRef: parentRef?._ref,
    });

    if (existing) {
      parent = existing;
      parentRef = { _type: "reference", _ref: existing._id };
      continue;
    }

    const doc = {
      _type: "category",
      title,
      slug: { _type: "slug", current: slug },
      parent: parentRef,
    };
    parent = await client.create(doc);
    parentRef = { _type: "reference", _ref: parent._id };
  }

  return parent;
};

const parseAttributes = (row) => {
  const attributes = [];

  for (let i = 1; i <= 3; i += 1) {
    const nameKey = `Attribute ${i} name`;
    const valuesKey = `Attribute ${i} value(s)`;
    const name = row[nameKey]?.trim();
    const valueList = row[valuesKey]?.trim();
    if (!name || !valueList) continue;

    const values = valueList.split(",").map((item) => item.trim()).filter(Boolean);
    if (!values.length) continue;

    attributes.push({
      _key: `opt-${i}-${Date.now()}`,
      name,
      values,
    });
  }

  return attributes;
};

const createProductDocument = async (row, categoryRefs, imageAssets) => {
  const id = row.ID || row.id || row.ProductId || `product-${Math.random().toString(36).slice(2)}`;
  const title = row.Name || row.name || "Untitled product";
  const excerpt = row["Short description"] || row.short_description || "";
  const description = row.Description || row.description || "";
  const price = Number(row["Regular price"] || row["regular_price"] || 0);
  const salePrice = Number(row["Sale price"] || row["sale_price"] || 0) || undefined;
  const stock = Number(row.Stock || row.stock || 0);
  const tags = (row.Tags || row.tags || "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
  const sku = row.SKU || row.sku || "";

  const doc = {
    _type: "product",
    _id: `product-${id}`,
    productId: String(id),
    name: title,
    slug: {
      _type: "slug",
      current: title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, ""),
    },
    sku,
    excerpt,
    richText: [
      {
        _type: "block",
        style: "normal",
        children: [{ _type: "span", text: description }],
      },
    ],
    description,
    price,
    salePrice,
    discount: salePrice && salePrice < price ? price - salePrice : 0,
    stock,
    tags,
    categories: categoryRefs,
    options: parseAttributes(row),
    images: imageAssets,
  };

  await client.createOrReplace(doc);
};

const handleImageUpload = async (imagesValue) => {
  if (!imagesValue) return [];
  const urls = imagesValue
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const assets = [];
  for (const [index, url] of urls.entries()) {
    const filename = path.basename(new URL(url).pathname) || `image-${index}.jpg`;
    const tempPath = path.join(os.tmpdir(), `wc-import-${Date.now()}-${index}-${filename}`);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to download image ${url}: ${response.status} ${response.statusText}`);
      }

      await streamPipeline(response.body, fs.createWriteStream(tempPath));
      const asset = await client.assets.upload("image", fs.createReadStream(tempPath), {
        filename,
      });
      assets.push({
        _type: "image",
        _key: `img-${index}-${Date.now()}`,
        asset: { _type: "reference", _ref: asset._id },
      });
    } catch (error) {
      console.warn(`Warning: failed to upload image ${url}: ${error.message}`);
    } finally {
      try {
        await fs.promises.rm(tempPath, { force: true });
      } catch {
        // ignore cleanup errors
      }
    }
  }

  return assets;
};

const importCsv = async () => {
  const rows = [];
  const filePath = path.resolve(process.cwd(), csvFile);
  if (!fs.existsSync(filePath)) {
    throw new Error(`CSV file not found: ${filePath}`);
  }

  await new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csvParser({ skipLines: 0, mapHeaders: ({ header }) => header.trim() }))
      .on("data", (row) => rows.push(row))
      .on("end", resolve)
      .on("error", reject);
  });

  console.log(`Parsed ${rows.length} rows from ${csvFile}`);

  for (const [index, row] of rows.entries()) {
    const categoryPaths = parseCategories(row.Categories || row.categories);
    const categoryRefs = [];

    for (const pathSegments of categoryPaths) {
      if (!pathSegments.length) continue;
      const category = await ensureCategory(pathSegments);
      if (category) {
        categoryRefs.push({
          _type: "reference",
          _key: `cat-${category._id}-${Date.now()}`,
          _ref: category._id,
        });
      }
    }

    const imageAssets = await handleImageUpload(row.Images || row.images);
    await createProductDocument(row, categoryRefs, imageAssets);
    console.log(`Imported product ${index + 1}/${rows.length}: ${row.Name || row.name}`);
  }
};

importCsv()
  .then(() => {
    console.log("WooCommerce import completed.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Import failed:", error);
    process.exit(1);
  });