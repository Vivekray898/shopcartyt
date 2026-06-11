"use client";
import React, { useState, useEffect } from "react";
import { useClient } from "sanity";
import { 
  Loader2, Save, Trash2, RefreshCw, Layers, CheckSquare, 
  Square, Tag, Euro, Package, SlidersHorizontal, AlertCircle 
} from "lucide-react";

interface ProductRow {
  _id: string;
  name: string;
  stock: number;
  price: number;
  brandTitle?: string;
  brandRef?: string;
  categoryRefs?: string[];
  variantTitle?: string;
  variantRef?: string;
}

interface ReferenceOption {
  _id: string;
  title: string;
}

export default function BulkEditor() {
  const client = useClient({ apiVersion: "2026-06-11" });
  
  // Data States
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [brands, setBrands] = useState<ReferenceOption[]>([]);
  const [categories, setCategories] = useState<ReferenceOption[]>([]);
  const [variants, setVariants] = useState<ReferenceOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Selection & WooCommerce Bulk Edit States
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [globalPrice, setGlobalPrice] = useState("");
  const [globalStock, setGlobalStock] = useState("");
  const [globalBrand, setGlobalBrand] = useState("no-change");
  const [globalCategory, setGlobalCategory] = useState("no-change");
  const [globalVariant, setGlobalVariant] = useState("no-change");

  // Local inline editing overrides cache
  const [pendingChanges, setPendingChanges] = useState<Record<string, Partial<ProductRow>>>({});

  const fetchData = async () => {
    setLoading(true);
    try {
      const productData = await client.fetch(`
        *[_type == "product"] | order(name asc) {
          _id,
          name,
          stock,
          price,
          "brandTitle": brand->title,
          "brandRef": brand->_ref,
          "categoryRefs": categories[]->_ref,
          "variantTitle": variant->title,
          "variantRef": variant->_ref
        }
      `);
      
      const brandData = await client.fetch(`*[_type == "brand"] | order(title asc) { _id, title }`);
      const categoryData = await client.fetch(`*[_type == "category"] | order(title asc) { _id, title }`);
      const variantData = await client.fetch(`*[_type == "productVariant"] | order(title asc) { _id, title }`);
      
      setProducts(productData);
      setBrands(brandData);
      setCategories(categoryData);
      setVariants(variantData);
      setPendingChanges({});
      setSelectedIds([]);
      resetGlobalModifiers();
    } catch (err) {
      console.error("Bulk Editor Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const resetGlobalModifiers = () => {
    setGlobalPrice("");
    setGlobalStock("");
    setGlobalBrand("no-change");
    setGlobalCategory("no-change");
    setGlobalVariant("no-change");
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleSelectAll = () => {
    if (selectedIds.length === products.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(products.map((p) => p._id));
    }
  };

  const toggleSelectProduct = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleInlineChange = (id: string, field: keyof ProductRow, value: any) => {
    setPendingChanges((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleApplyBulkEdit = () => {
    if (selectedIds.length === 0) {
      alert("Please select at least one product first.");
      return;
    }

    const updatedChanges = { ...pendingChanges };

    selectedIds.forEach((id) => {
      if (!updatedChanges[id]) updatedChanges[id] = {};
      
      if (globalPrice !== "") updatedChanges[id].price = Number(globalPrice);
      if (globalStock !== "") updatedChanges[id].stock = Number(globalStock);
      
      if (globalBrand !== "no-change") {
        updatedChanges[id].brandRef = globalBrand === "clear-all" ? "" : globalBrand;
      }
      
      if (globalCategory !== "no-change") {
        updatedChanges[id].categoryRefs = globalCategory === "clear-all" ? [] : [globalCategory];
      }

      if (globalVariant !== "no-change") {
        updatedChanges[id].variantRef = globalVariant === "clear-all" ? "" : globalVariant;
      }
    });

    setPendingChanges(updatedChanges);
    resetGlobalModifiers();
  };

  const handleSaveChanges = async () => {
    const changeKeys = Object.keys(pendingChanges);
    if (changeKeys.length === 0) return;

    setSaving(true);
    const tx = client.transaction();

    changeKeys.forEach((id) => {
      const fields = pendingChanges[id];
      const patchData: Record<string, any> = {};

      if (fields.price !== undefined) patchData.price = Number(fields.price);
      if (fields.stock !== undefined) patchData.stock = Number(fields.stock);
      
      if (fields.brandRef !== undefined) {
        patchData.brand = fields.brandRef 
          ? { _type: "reference", _ref: fields.brandRef }
          : null;
      }
      
      if (fields.variantRef !== undefined) {
        patchData.variant = fields.variantRef
          ? { _type: "reference", _ref: fields.variantRef }
          : null;
      }
      
      if (fields.categoryRefs !== undefined) {
        patchData.categories = fields.categoryRefs.map((catId) => ({
          _type: "reference",
          _ref: catId,
          _key: `cat-${catId}-${Math.random().toString(36).substr(2, 9)}`,
        }));
      }

      tx.patch(id, (patch) => patch.set(patchData));
    });

    try {
      await tx.commit();
      await fetchData();
    } catch (err) {
      console.error("Bulk Commit Failed:", err);
      alert("Changes failed to save.");
    } finally {
      setSaving(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete all ${selectedIds.length} selected products at once?`)) return;

    setSaving(true);
    try {
      await Promise.all(selectedIds.map((id) => client.delete(id)));
      await fetchData();
    } catch (err) {
      console.error("Bulk Delete Error:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4 px-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-xl flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
        </div>
        <div className="text-center space-y-1">
          <span className="font-bold text-slate-800 text-base block">Syncing Workspace Parameters</span>
          <p className="text-xs text-slate-400 font-medium">Downloading live catalog collections from Sanity...</p>
        </div>
      </div>
    );
  }

  const unsavedChangesCount = Object.keys(pendingChanges).length;

  return (
    <div className="p-4 sm:p-8 bg-slate-50/50 min-h-screen font-sans antialiased text-slate-600 selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* 1. Global Header Component Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/60 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Bulk Catalog Editor</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 font-medium">Mass update product inventories safely from any mobile device or desktop layout grid.</p>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            onClick={fetchData}
            className="p-3 text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200/80 active:scale-95 rounded-xl transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleSaveChanges}
            disabled={unsavedChangesCount === 0 || saving}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider px-4 py-3 rounded-xl transition shadow-md shadow-emerald-600/10 disabled:opacity-40"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes {unsavedChangesCount > 0 && `(${unsavedChangesCount})`}
          </button>
        </div>
      </div>

      {/* 2. Mass Bulk Operations Operator Bar Panel */}
      <div className="mb-6 bg-slate-900 rounded-2xl border border-slate-800 p-4 sm:p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
            <span>Mass Operations Engine</span>
            <span className="ml-2 bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-md font-extrabold text-[10px]">
              {selectedIds.length} Selected
            </span>
          </div>
          {/* Mobile Select All Helper Toggle Button */}
          <button 
            onClick={toggleSelectAll} 
            className="md:hidden text-left text-xs text-emerald-500 font-bold hover:underline"
          >
            {selectedIds.length === products.length ? "Deselect All Items" : "⚡ Select All Live Catalog"}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="relative">
            <Euro className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input
              type="number"
              placeholder="Price (€)"
              value={globalPrice}
              onChange={(e) => setGlobalPrice(e.target.value)}
              className="bg-slate-950 text-white pl-9 pr-3 py-2.5 rounded-xl text-xs font-bold focus:outline-none w-full border border-slate-800"
            />
          </div>

          <div className="relative">
            <Package className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input
              type="number"
              placeholder="Stock Level"
              value={globalStock}
              onChange={(e) => setGlobalStock(e.target.value)}
              className="bg-slate-950 text-white pl-9 pr-3 py-2.5 rounded-xl text-xs font-bold focus:outline-none w-full border border-slate-800"
            />
          </div>

          <select
            value={globalBrand}
            onChange={(e) => setGlobalBrand(e.target.value)}
            className="bg-slate-950 text-slate-300 px-3 py-2.5 rounded-xl text-xs font-bold focus:outline-none border border-slate-800 w-full"
          >
            <option value="no-change"> Keep Current Brands </option>
            <option value="clear-all">❌ Remove Brand</option>
            {brands.map((b) => <option key={b._id} value={b._id}>🏢 {b.title}</option>)}
          </select>

          <select
            value={globalCategory}
            onChange={(e) => setGlobalCategory(e.target.value)}
            className="bg-slate-950 text-slate-300 px-3 py-2.5 rounded-xl text-xs font-bold focus:outline-none border border-slate-800 w-full"
          >
            <option value="no-change"> Keep Categories </option>
            <option value="clear-all">❌ Remove Categories</option>
            {categories.map((c) => <option key={c._id} value={c._id}>📁 {c.title}</option>)}
          </select>

          <select
            value={globalVariant}
            onChange={(e) => setGlobalVariant(e.target.value)}
            className="bg-slate-950 text-emerald-400 px-3 py-2.5 rounded-xl text-xs font-bold focus:outline-none border border-slate-800 w-full"
          >
            <option value="no-change" className="text-slate-300"> Keep Product Types </option>
            <option value="clear-all" className="text-slate-300">❌ Remove Product Type</option>
            {variants.map((v) => <option key={v._id} value={v._id} className="text-slate-300">⚡ {v.title}</option>)}
          </select>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4 pt-4 border-t border-slate-800/60">
          <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            Changes stage in cache locally. Click Save to push to Sanity.
          </p>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleApplyBulkEdit}
              disabled={selectedIds.length === 0}
              className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition disabled:opacity-30"
            >
              Apply Changes
            </button>

            <button
              onClick={handleBulkDelete}
              disabled={selectedIds.length === 0}
              className="bg-rose-500/10 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/20 p-2.5 rounded-xl transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. RESPONSIVE DATA CATALOG WORKSPACE */}
      
      {/* 📱 MOBILE VIEW: Renders as clear, touch-optimized structured row cards on tiny viewports */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {products.map((product) => {
          const currentChanges = pendingChanges[product._id] || {};
          const displayPrice = currentChanges.price !== undefined ? currentChanges.price : product.price;
          const displayStock = currentChanges.stock !== undefined ? currentChanges.stock : product.stock;
          const displayBrand = currentChanges.brandRef !== undefined ? currentChanges.brandRef : product.brandRef;
          const displayVariant = currentChanges.variantRef !== undefined ? currentChanges.variantRef : product.variantRef;

          const isSelected = selectedIds.includes(product._id);
          const isEdited = Object.keys(currentChanges).length > 0;

          return (
            <div 
              key={product._id}
              className={`bg-white border rounded-2xl p-4 transition-all duration-200 shadow-2xs flex flex-col gap-3 relative ${
                isSelected ? "border-emerald-500 ring-2 ring-emerald-500/10 bg-emerald-50/5" : "border-slate-200"
              }`}
            >
              {/* Card Header row link controls */}
              <div className="flex items-start justify-between gap-3 pb-2 border-b border-slate-100">
                <button 
                  onClick={() => toggleSelectProduct(product._id)}
                  className="flex items-start gap-2.5 text-left group"
                >
                  <span className="text-slate-300 group-hover:text-slate-500 transition mt-0.5 flex-shrink-0">
                    {isSelected ? <CheckSquare className="w-4 h-4 text-emerald-600" /> : <Square className="w-4 h-4" />}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-900 leading-tight">{product.name}</span>
                    <span className="text-[10px] font-mono text-slate-400 mt-0.5">ID: {product._id.slice(0, 8)}...</span>
                  </div>
                </button>

                {isEdited && (
                  <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md flex-shrink-0">
                    Edited
                  </span>
                )}
              </div>

              {/* Card Input Grid Form Context Wrapper */}
              <div className="grid grid-cols-2 gap-3">
                {/* Mobile Price input */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1">
                    <span>Price Matrix</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">€</span>
                    <input
                      type="number"
                      value={displayPrice || 0}
                      onChange={(e) => handleInlineChange(product._id, "price", e.target.value)}
                      className="w-full pl-6 pr-2 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 bg-white"
                    />
                  </div>
                </div>

                {/* Mobile Stock input */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Stock Buffer</label>
                  <input
                    type="number"
                    value={displayStock || 0}
                    onChange={(e) => handleInlineChange(product._id, "stock", e.target.value)}
                    className={`w-full px-3 py-2 border rounded-xl text-xs font-bold bg-white ${
                      displayStock === 0 ? "border-rose-200 text-rose-700 bg-rose-50/10" : "border-slate-200 text-slate-800"
                    }`}
                  />
                </div>

                {/* Mobile Brand selection drop */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Brand</label>
                  <select
                    value={displayBrand || ""}
                    onChange={(e) => handleInlineChange(product._id, "brandRef", e.target.value)}
                    className="w-full px-2.5 py-2 border border-slate-200 bg-white rounded-xl text-xs font-semibold text-slate-700"
                  >
                    <option value="">None</option>
                    {brands.map((b) => <option key={b._id} value={b._id}>{b.title}</option>)}
                  </select>
                </div>

                {/* Mobile Variant Type selection drop */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-emerald-800">Variant Type</label>
                  <select
                    value={displayVariant || ""}
                    onChange={(e) => handleInlineChange(product._id, "variantRef", e.target.value)}
                    className="w-full px-2.5 py-2 border border-emerald-200 bg-emerald-50/20 rounded-xl text-xs font-bold text-emerald-900"
                  >
                    <option value="">Standard Reference</option>
                    {variants.map((v) => <option key={v._id} value={v._id}>{v.title}</option>)}
                  </select>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 🖥️ DESKTOP SPREADSHEET VIEW: Preserves the clean multi-column dashboard tables for md+ screens */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-200/70 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-400">
                <th className="p-4 w-14 text-center">
                  <button onClick={toggleSelectAll} className="text-slate-400 hover:text-slate-600 transition cursor-pointer">
                    {selectedIds.length === products.length ? <CheckSquare className="w-4 h-4 text-emerald-600" /> : <Square className="w-4 h-4" />}
                  </button>
                </th>
                <th className="p-4 font-extrabold text-slate-500">Product Specifications</th>
                <th className="p-4 font-extrabold text-slate-500 w-36">Price Matrix</th>
                <th className="p-4 font-extrabold text-slate-500 w-36">Stock Buffer</th>
                <th className="p-4 font-extrabold text-slate-500 w-52">Brand Association</th>
                <th className="p-4 font-extrabold text-emerald-800 bg-emerald-50/40 w-52">Product Variant Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((product) => {
                const currentChanges = pendingChanges[product._id] || {};
                const displayPrice = currentChanges.price !== undefined ? currentChanges.price : product.price;
                const displayStock = currentChanges.stock !== undefined ? currentChanges.stock : product.stock;
                const displayBrand = currentChanges.brandRef !== undefined ? currentChanges.brandRef : product.brandRef;
                const displayVariant = currentChanges.variantRef !== undefined ? currentChanges.variantRef : product.variantRef;

                const isSelected = selectedIds.includes(product._id);
                const isEdited = Object.keys(currentChanges).length > 0;

                return (
                  <tr 
                    key={product._id} 
                    className={`transition-all duration-150 ${isSelected ? "bg-slate-50/60" : "hover:bg-slate-50/30"} ${isEdited ? "bg-emerald-50/10" : ""}`}
                  >
                    <td className="p-4 text-center">
                      <button onClick={() => toggleSelectProduct(product._id)} className="text-slate-300 hover:text-slate-500 cursor-pointer">
                        {isSelected ? <CheckSquare className="w-4 h-4 text-emerald-600" /> : <Square className="w-4 h-4" />}
                      </button>
                    </td>

                    <td className="p-4 font-bold text-slate-800 tracking-tight">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-bold text-slate-900">{product.name}</span>
                        <span className="text-[10px] font-mono font-medium text-slate-400 uppercase tracking-tight">ID: {product._id.slice(0, 10)}...</span>
                      </div>
                      {isEdited && (
                        <span className="mt-1.5 inline-flex items-center gap-1 text-[9px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-md font-black uppercase tracking-wider border border-emerald-200/40 w-max">
                          Unsaved Changes
                        </span>
                      )}
                    </td>

                    <td className="p-4">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">€</span>
                        <input
                          type="number"
                          value={displayPrice || 0}
                          onChange={(e) => handleInlineChange(product._id, "price", e.target.value)}
                          className="w-full pl-6 pr-2.5 py-2 border border-slate-200 focus:border-emerald-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/10 font-bold text-slate-800 text-xs bg-white transition shadow-2xs"
                        />
                      </div>
                    </td>

                    <td className="p-4">
                      <input
                        type="number"
                        value={displayStock || 0}
                        onChange={(e) => handleInlineChange(product._id, "stock", e.target.value)}
                        className={`w-full px-3 py-2 border rounded-xl focus:outline-none font-bold text-xs bg-white transition shadow-2xs ${
                          displayStock === 0 ? "border-rose-200 focus:border-rose-500 text-rose-700 bg-rose-50/20" : "border-slate-200 focus:border-emerald-500 text-slate-800"
                        }`}
                      />
                    </td>

                    <td className="p-4">
                      <select
                        value={displayBrand || ""}
                        onChange={(e) => handleInlineChange(product._id, "brandRef", e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 bg-white rounded-xl focus:outline-none focus:border-emerald-500 text-slate-700 text-xs cursor-pointer"
                      >
                        <option value="">No Brand Assigned</option>
                        {brands.map((b) => <option key={b._id} value={b._id}>{b.title}</option>)}
                      </select>
                    </td>

                    <td className="p-4 bg-emerald-50/5">
                      <select
                        value={displayVariant || ""}
                        onChange={(e) => handleInlineChange(product._id, "variantRef", e.target.value)}
                        className="w-full px-3 py-2 border border-emerald-200/60 bg-white rounded-xl focus:outline-none focus:border-emerald-500 text-emerald-800 text-xs cursor-pointer"
                      >
                        <option value="">Standard Reference</option>
                        {variants.map((v) => <option key={v._id} value={v._id} className="text-slate-800 font-semibold">{v.title}</option>)}
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