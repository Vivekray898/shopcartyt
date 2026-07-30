"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useClient } from "sanity";
import { 
  Loader2, Save, Trash2, RefreshCw, Search, 
  ChevronDown, Image as ImageIcon 
} from "lucide-react";

interface ProductRow {
  _id: string;
  name: string;
  image?: any;
  stock: number;
  price: number;
  brandRef?: string;
  categoryRefs?: string[];
}

interface ReferenceOption {
  _id: string;
  title: string;
}

export default function WooCommerceBulkEditor() {
  const client = useClient({ apiVersion: "2026-06-11" });

  // Data States
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [brands, setBrands] = useState<ReferenceOption[]>([]);
  const [categories, setCategories] = useState<ReferenceOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterBrand, setFilterBrand] = useState("all");

  // Selection & Bulk Modification States
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showBulkPanel, setShowBulkPanel] = useState(false);
  const [bulkPrice, setBulkPrice] = useState("");
  const [bulkStock, setBulkStock] = useState("");
  const [bulkBrand, setBulkBrand] = useState("no-change");
  const [bulkCategory, setBulkCategory] = useState("no-change");

  // Local Pending Changes Cache
  const [pendingChanges, setPendingChanges] = useState<Record<string, Partial<ProductRow>>>({});

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productData, brandData, categoryData] = await Promise.all([
        client.fetch(`
          *[_type == "product" && !(_id in path('drafts.**'))] | order(name asc) {
            _id,
            name,
            "image": coalesce(images[0].asset->url, image.asset->url, null),
            stock,
            price,
            "brandRef": brand._ref,
            "categoryRefs": categories[]._ref
          }
        `),
        client.fetch(`
          *[_type == "brand" && !(_id in path('drafts.**'))] | order(title asc) { 
            _id, 
            title 
          }
        `),
        client.fetch(`
          *[_type == "category" && !(_id in path('drafts.**'))] | order(title asc) { 
            _id, 
            title 
          }
        `),
      ]);

      // Deduplicate category dropdown options by title
      const uniqueCategories = categoryData.filter(
        (cat: ReferenceOption, index: number, self: ReferenceOption[]) =>
          index === self.findIndex((c) => c.title.trim().toLowerCase() === cat.title.trim().toLowerCase())
      );

      // Deduplicate brand dropdown options by title
      const uniqueBrands = brandData.filter(
        (brand: ReferenceOption, index: number, self: ReferenceOption[]) =>
          index === self.findIndex((b) => b.title.trim().toLowerCase() === brand.title.trim().toLowerCase())
      );

      setProducts(productData);
      setBrands(uniqueBrands);
      setCategories(uniqueCategories);
      setPendingChanges({});
      setSelectedIds([]);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p._id.includes(searchQuery);
      const matchesCategory = filterCategory === "all" || p.categoryRefs?.includes(filterCategory);
      const matchesBrand = filterBrand === "all" || p.brandRef === filterBrand;
      return matchesSearch && matchesCategory && matchesBrand;
    });
  }, [products, searchQuery, filterCategory, filterBrand]);

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProducts.map((p) => p._id));
    }
  };

  const toggleSelectProduct = (id: string) => {
    setSelectedIds((prev) => {
      const newSelection = prev.includes(id) 
        ? prev.filter((i) => i !== id) 
        : [...prev, id];
      
      // Reset bulk choices back to default when multi-selecting
      if (newSelection.length > 1) {
        setBulkBrand("no-change");
        setBulkCategory("no-change");
      }

      return newSelection;
    });
  };

  const handleInlineChange = (id: string, field: keyof ProductRow, value: any) => {
    setPendingChanges((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const applyBulkChanges = () => {
    if (selectedIds.length === 0) return;

    const updated = { ...pendingChanges };
    selectedIds.forEach((id) => {
      if (!updated[id]) updated[id] = {};
      if (bulkPrice !== "") updated[id].price = Number(bulkPrice);
      if (bulkStock !== "") updated[id].stock = Number(bulkStock);
      if (bulkBrand !== "no-change") updated[id].brandRef = bulkBrand === "clear" ? "" : bulkBrand;
      if (bulkCategory !== "no-change") updated[id].categoryRefs = bulkCategory === "clear" ? [] : [bulkCategory];
    });

    setPendingChanges(updated);
    setBulkPrice("");
    setBulkStock("");
    setBulkBrand("no-change");
    setBulkCategory("no-change");
    setShowBulkPanel(false);
  };

  const handleSaveChanges = async () => {
    const changeKeys = Object.keys(pendingChanges);
    if (changeKeys.length === 0) return;

    setSaving(true);
    const tx = client.transaction();

    changeKeys.forEach((id) => {
      const fields = pendingChanges[id];
      const patchData: Record<string, any> = {};

      if (fields.name !== undefined) patchData.name = fields.name;
      if (fields.price !== undefined) patchData.price = Number(fields.price);
      if (fields.stock !== undefined) patchData.stock = Number(fields.stock);
      
      if (fields.brandRef !== undefined) {
        patchData.brand = fields.brandRef 
          ? { _type: "reference", _ref: fields.brandRef } 
          : null;
      }

      if (fields.categoryRefs !== undefined) {
        patchData.categories = fields.categoryRefs.map((catId) => ({
          _type: "reference",
          _ref: catId,
          _key: `cat-${catId}-${Math.random().toString(36).substring(2, 7)}`,
        }));
      }

      tx.patch(id, (patch) => patch.set(patchData));
    });

    try {
      await tx.commit();
      await fetchData();
    } catch (err) {
      console.error("Save Failed:", err);
      alert("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Permanently delete ${selectedIds.length} items?`)) return;

    setSaving(true);
    try {
      await Promise.all(selectedIds.map((id) => client.delete(id)));
      await fetchData();
    } catch (err) {
      console.error("Delete Error:", err);
    } finally {
      setSaving(false);
    }
  };

  const unsavedCount = Object.keys(pendingChanges).length;

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-100 text-slate-600 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-slate-800" />
        <span className="text-xs font-semibold uppercase tracking-wider">Loading WooCommerce Inventory...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f0f1] p-4 sm:p-6 text-slate-800 font-sans text-xs">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 bg-white p-4 border border-slate-300 rounded-md shadow-xs">
        <div>
          <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            Products
            <span className="text-xs font-normal text-slate-500">({products.length} items)</span>
          </h1>
          <p className="text-slate-500 text-xs">Inline bulk edit stock levels, pricing, categories, and references.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchData}
            className="p-2 text-slate-600 hover:text-slate-900 border border-slate-300 rounded bg-slate-50 hover:bg-slate-100 transition cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={handleSaveChanges}
            disabled={unsavedCount === 0 || saving}
            className="flex items-center gap-1.5 bg-[#2271b1] hover:bg-[#135e96] text-white font-semibold px-4 py-2 rounded transition disabled:opacity-50 cursor-pointer"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes {unsavedCount > 0 && `(${unsavedCount})`}
          </button>
        </div>
      </div>

      {/* WooCommerce Action Bar */}
      <div className="bg-white border border-slate-300 rounded-md p-3 mb-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:border-[#2271b1]"
            />
          </div>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border border-slate-300 rounded px-2.5 py-1.5 text-xs bg-white focus:outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>{c.title}</option>
            ))}
          </select>

          {/* Brand Filter */}
          <select
            value={filterBrand}
            onChange={(e) => setFilterBrand(e.target.value)}
            className="border border-slate-300 rounded px-2.5 py-1.5 text-xs bg-white focus:outline-none"
          >
            <option value="all">All Shops/Brands</option>
            {brands.map((b) => (
              <option key={b._id} value={b._id}>{b.title}</option>
            ))}
          </select>
        </div>

        {/* Right: Bulk Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowBulkPanel(!showBulkPanel)}
            disabled={selectedIds.length === 0}
            className="bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 px-3 py-1.5 rounded font-medium flex items-center gap-1 disabled:opacity-40 cursor-pointer"
          >
            Bulk Edit ({selectedIds.length})
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          {selectedIds.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="text-rose-600 hover:bg-rose-50 border border-rose-200 p-1.5 rounded cursor-pointer"
              title="Delete Selected"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Expandable Bulk Edit Drawer */}
      {showBulkPanel && (
        <div className="bg-slate-800 text-slate-200 p-4 rounded-md mb-4 border border-slate-700 shadow-md">
          <div className="text-xs font-bold uppercase text-slate-400 mb-3 flex items-center justify-between">
            <span>Bulk Edit {selectedIds.length} Products</span>
            <button onClick={() => setShowBulkPanel(false)} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
            <div>
              <label className="block text-[10px] text-slate-400 mb-1">Regular Price (€)</label>
              <input
                type="number"
                placeholder="Change price to..."
                value={bulkPrice}
                onChange={(e) => setBulkPrice(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 mb-1">Stock Quantity</label>
              <input
                type="number"
                placeholder="Change stock to..."
                value={bulkStock}
                onChange={(e) => setBulkStock(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 mb-1">Brand/Shop</label>
              <select
                value={bulkBrand}
                onChange={(e) => setBulkBrand(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-xs text-white"
              >
                <option value="no-change">— No Change —</option>
                <option value="clear">Remove Brand</option>
                {brands.map((b) => <option key={b._id} value={b._id}>{b.title}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 mb-1">Category</label>
              <select
                value={bulkCategory}
                onChange={(e) => setBulkCategory(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-xs text-white"
              >
                <option value="no-change">— No Change —</option>
                <option value="clear">Remove Categories</option>
                {categories.map((c) => <option key={c._id} value={c._id}>{c.title}</option>)}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-700">
            <button
              onClick={applyBulkChanges}
              className="bg-[#2271b1] hover:bg-[#135e96] text-white px-4 py-1.5 rounded font-semibold text-xs cursor-pointer"
            >
              Update Selected Items
            </button>
          </div>
        </div>
      )}

      {/* WooCommerce High-Density Table */}
      <div className="bg-white border border-slate-300 rounded-md shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-300 text-slate-600 font-semibold text-[11px]">
                <th className="p-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredProducts.length && filteredProducts.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-slate-300 cursor-pointer"
                  />
                </th>
                <th className="p-3 w-12 text-center">Image</th>
                <th className="p-3">Name</th>
                <th className="p-3 w-28">Stock</th>
                <th className="p-3 w-28">Price (€)</th>
                <th className="p-3 w-44">Brand / Shop</th>
                <th className="p-3 w-48">Category</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {filteredProducts.map((product) => {
                const changes = pendingChanges[product._id] || {};
                const name = changes.name ?? product.name;
                const price = changes.price ?? product.price;
                const stock = changes.stock ?? product.stock;
                const brandRef = changes.brandRef ?? product.brandRef;
                const categoryRefs = changes.categoryRefs ?? product.categoryRefs ?? [];

                const isSelected = selectedIds.includes(product._id);
                const isDirty = Object.keys(changes).length > 0;

                return (
                  <tr
                    key={product._id}
                    className={`hover:bg-slate-50 transition ${
                      isSelected ? "bg-slate-100" : ""
                    } ${isDirty ? "bg-amber-50/50" : ""}`}
                  >
                    {/* Checkbox */}
                    <td className="p-3 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectProduct(product._id)}
                        className="rounded border-slate-300 cursor-pointer"
                      />
                    </td>

                    {/* Image Thumbnail */}
                    <td className="p-3 text-center">
                      <div className="w-9 h-9 border border-slate-200 rounded bg-slate-100 overflow-hidden flex items-center justify-center">
                        {product.image ? (
                          <img src={product.image} alt={name} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                    </td>

                    {/* Name & ID */}
                    <td className="p-3">
                      <div className="flex flex-col">
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => handleInlineChange(product._id, "name", e.target.value)}
                          className="font-medium text-slate-900 border-b border-transparent hover:border-slate-300 focus:border-[#2271b1] focus:bg-white bg-transparent outline-none py-0.5"
                        />
                        <span className="text-[10px] text-slate-400 font-mono">ID: {product._id}</span>
                      </div>
                    </td>

                    {/* Stock */}
                    <td className="p-3">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          value={stock}
                          onChange={(e) => handleInlineChange(product._id, "stock", Number(e.target.value))}
                          className={`w-16 px-2 py-1 border rounded text-xs font-semibold ${
                            stock === 0 ? "border-rose-300 bg-rose-50 text-rose-700" : "border-slate-300"
                          }`}
                        />
                        <span
                          className={`inline-block w-2 h-2 rounded-full ${
                            stock > 0 ? "bg-emerald-500" : "bg-rose-500"
                          }`}
                          title={stock > 0 ? "In Stock" : "Out of Stock"}
                        />
                      </div>
                    </td>

                    {/* Price */}
                    <td className="p-3">
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => handleInlineChange(product._id, "price", Number(e.target.value))}
                        className="w-20 px-2 py-1 border border-slate-300 rounded text-xs font-semibold"
                      />
                    </td>

                    {/* Brand dropdown */}
                    <td className="p-3">
                      <select
                        value={brandRef || ""}
                        onChange={(e) => handleInlineChange(product._id, "brandRef", e.target.value)}
                        className="w-full border border-slate-300 rounded px-2 py-1 text-xs bg-white cursor-pointer"
                      >
                        <option value="">— None —</option>
                        {brands.map((b) => (
                          <option key={b._id} value={b._id}>{b.title}</option>
                        ))}
                      </select>
                    </td>

                    {/* Category dropdown */}
                    <td className="p-3">
                      <select
                        value={categoryRefs[0] || ""}
                        onChange={(e) => handleInlineChange(product._id, "categoryRefs", e.target.value ? [e.target.value] : [])}
                        className="w-full border border-slate-300 rounded px-2 py-1 text-xs bg-white cursor-pointer"
                      >
                        <option value="">— Uncategorized —</option>
                        {categories.map((c) => (
                          <option key={c._id} value={c._id}>{c.title}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}