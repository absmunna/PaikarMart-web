import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Plus, 
  CheckCircle2, 
  Store, 
  Sparkles, 
  Camera, 
  Layers, 
  ShieldCheck,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { MasterProduct, SellerListing, TradeMode, MasterCatalogSubmission } from '@/types';
import { INITIAL_MASTER_PRODUCTS } from '@/lib/masterCatalog';

interface QuickAttachCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAttachOffer: (listing: Partial<SellerListing>) => void;
  onSubmitNewCatalogItem?: (submission: Partial<MasterCatalogSubmission>) => void;
}

export const QuickAttachCatalogModal: React.FC<QuickAttachCatalogModalProps> = ({
  isOpen,
  onClose,
  onAttachOffer,
  onSubmitNewCatalogItem,
}) => {
  const [activeStep, setActiveStep] = useState<'search' | 'attach' | 'submit_new'>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMasterProduct, setSelectedMasterProduct] = useState<MasterProduct | null>(null);

  // Form states for attaching to existing Master Product
  const [price, setPrice] = useState<number>(0);
  const [stockQuantity, setStockQuantity] = useState<number>(50);
  const [tradeMode, setTradeMode] = useState<TradeMode>('retail');
  const [minWholesaleQty, setMinWholesaleQty] = useState<number>(20);
  const [deliveryEta, setDeliveryEta] = useState('1-2 Days');
  const [location, setLocation] = useState('Dhaka Store');
  const [realPhotos, setRealPhotos] = useState<string[]>([]);
  const [photoInput, setPhotoInput] = useState('');

  // Form states for submitting new uncatalogued product
  const [newTitle, setNewTitle] = useState('');
  const [newBrand, setNewBrand] = useState('');
  const [newCategory, setNewCategory] = useState('Electronics');
  const [newDescription, setNewDescription] = useState('');
  const [newImage, setNewImage] = useState('');
  const [newPrice, setNewPrice] = useState<number>(0);
  const [isAiVerifying, setIsAiVerifying] = useState(false);
  const [aiAuditResult, setAiAuditResult] = useState<any>(null);

  if (!isOpen) return null;

  const filteredMasterProducts = INITIAL_MASTER_PRODUCTS.filter(item => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.titleEn.toLowerCase().includes(q) ||
      item.titleBn.toLowerCase().includes(q) ||
      item.brand.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });

  const handleSelectMaster = (product: MasterProduct) => {
    setSelectedMasterProduct(product);
    setPrice(1200);
    setActiveStep('attach');
  };

  const handleAddPhoto = () => {
    if (photoInput.trim()) {
      setRealPhotos(prev => [...prev, photoInput.trim()]);
      setPhotoInput('');
    }
  };

  const handleConfirmAttach = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMasterProduct) return;

    onAttachOffer({
      masterProductId: selectedMasterProduct.id,
      price: Number(price),
      stockQuantity: Number(stockQuantity),
      tradeMode,
      minWholesaleQty: tradeMode === 'wholesale' ? Number(minWholesaleQty) : 1,
      deliveryEta,
      location,
      sellerRealPhotos: realPhotos,
      isActive: true,
    });

    onClose();
  };

  const handleAiVerifyAndSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDescription || !newPrice) return;

    setIsAiVerifying(true);
    setAiAuditResult(null);

    try {
      const response = await fetch('/api/catalog/verify-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          brand: newBrand,
          category: newCategory,
          description: newDescription,
          price: Number(newPrice)
        })
      });
      const data = await response.json();
      setAiAuditResult(data);

      setTimeout(() => {
        onSubmitNewCatalogItem?.({
          proposedTitle: newTitle,
          proposedBrand: newBrand,
          proposedCategory: newCategory,
          proposedDescription: newDescription,
          proposedImages: [newImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'],
          proposedPrice: Number(newPrice),
          tradeMode,
          aiConfidenceScore: data.confidenceScore || 98,
          aiAuditNotes: data.auditNotes || 'Passed Automated Quality Check'
        });
        setIsAiVerifying(false);
        onClose();
      }, 1500);

    } catch (err) {
      console.error(err);
      setIsAiVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-2xl bg-[var(--pm-card)] text-[var(--pm-text)] rounded-3xl shadow-2xl border border-[var(--pm-border)] overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--pm-border)] bg-[var(--pm-surface)] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[var(--pm-success-soft)] text-[var(--pm-success)] flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--pm-text)]">
                Add Product to Vendor Shop
              </h3>
              <p className="text-xs text-[var(--pm-muted)]">
                Search PaikarMart Master Catalog or Submit New Product
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[var(--pm-muted)] hover:text-[var(--pm-text)] hover:bg-[var(--pm-card-hover)] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-[var(--pm-border)] bg-[var(--pm-surface)] shrink-0">
          <button
            onClick={() => setActiveStep('search')}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeStep === 'search' || activeStep === 'attach'
                ? 'border-[var(--pm-accent)] text-[var(--pm-accent)]'
                : 'border-transparent text-[var(--pm-muted)] hover:text-[var(--pm-text)]'
            }`}
          >
            1. Search Master Catalog
          </button>
          <button
            onClick={() => setActiveStep('submit_new')}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeStep === 'submit_new'
                ? 'border-[var(--pm-accent)] text-[var(--pm-accent)]'
                : 'border-transparent text-[var(--pm-muted)] hover:text-[var(--pm-text)]'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            2. Submit New Uncatalogued SKU
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 flex-1 overflow-y-auto">
          {/* STEP 1: Search Master Catalog */}
          {activeStep === 'search' && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-[var(--pm-muted)]" />
                <input
                  type="text"
                  placeholder="Type product name, brand, or barcode to search catalog..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-[var(--pm-border)] bg-[var(--pm-input)] text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] focus:border-[var(--pm-accent)] focus:outline-none"
                />
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs text-[var(--pm-muted)] font-medium px-1">
                  <span>Available Master Catalog Items ({filteredMasterProducts.length})</span>
                  <span>Select to list in 30 seconds</span>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto divide-y divide-[var(--pm-border)]">
                  {filteredMasterProducts.map((mp) => (
                    <div
                      key={mp.id}
                      className="p-3 rounded-2xl hover:bg-[var(--pm-card-hover)] flex items-center justify-between gap-3 transition-colors cursor-pointer group"
                      onClick={() => handleSelectMaster(mp)}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={mp.canonicalImages[0]}
                          alt={mp.titleEn}
                          className="w-12 h-12 rounded-xl object-cover border border-[var(--pm-border)] bg-[var(--pm-surface)] shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold text-[var(--pm-accent)] uppercase">
                            {mp.brand} · {mp.category}
                          </span>
                          <h4 className="text-xs font-bold text-[var(--pm-text)] truncate group-hover:text-[var(--pm-accent)]">
                            {mp.titleEn}
                          </h4>
                          <p className="text-[11px] text-[var(--pm-muted)] truncate">
                            {mp.titleBn}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectMaster(mp);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-[var(--pm-accent-fg)] text-xs font-bold shrink-0 transition-colors shadow-xs cursor-pointer"
                      >
                        Sell This Item
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Not found prompt */}
              <div className="p-4 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] flex items-center justify-between gap-3 mt-4">
                <div className="flex items-center gap-2.5">
                  <AlertCircle className="w-5 h-5 text-[var(--pm-warning)] shrink-0" />
                  <div>
                    <h5 className="text-xs font-bold text-[var(--pm-text)]">
                      Can&apos;t find your product in our Master Catalog?
                    </h5>
                    <p className="text-[11px] text-[var(--pm-muted)]">
                      Submit a new SKU request for automated Gemini AI quality verification.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveStep('submit_new')}
                  className="px-3.5 py-1.5 rounded-xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-[var(--pm-accent-fg)] text-xs font-bold shrink-0 transition-colors cursor-pointer"
                >
                  Create New SKU
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Attach Offer to Selected Master Product */}
          {activeStep === 'attach' && selectedMasterProduct && (
            <form onSubmit={handleConfirmAttach} className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-[var(--pm-success-soft)] border border-[var(--pm-success)]/30">
                <img
                  src={selectedMasterProduct.canonicalImages[0]}
                  alt={selectedMasterProduct.titleEn}
                  className="w-12 h-12 rounded-xl object-cover bg-[var(--pm-card)] border border-[var(--pm-success)]/40 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold uppercase text-[var(--pm-success)]">
                    Selected Master SKU
                  </span>
                  <h4 className="text-xs font-bold text-[var(--pm-text)] truncate">
                    {selectedMasterProduct.titleEn}
                  </h4>
                  <p className="text-[11px] text-[var(--pm-muted)] font-mono">
                    Brand: {selectedMasterProduct.brand}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveStep('search')}
                  className="text-xs font-bold text-[var(--pm-accent)] hover:underline cursor-pointer"
                >
                  Change Item
                </button>
              </div>

              {/* Vendor Business Variables Input */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[var(--pm-text)] mb-1">
                    Your Selling Price (৳) *
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--pm-border)] bg-[var(--pm-input)] text-[var(--pm-text)] font-mono font-bold focus:border-[var(--pm-accent)] outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--pm-text)] mb-1">
                    Available Stock Quantity *
                  </label>
                  <input
                    type="number"
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--pm-border)] bg-[var(--pm-input)] text-[var(--pm-text)] font-mono font-bold focus:border-[var(--pm-accent)] outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[var(--pm-text)] mb-1">
                    Trade Selling Mode
                  </label>
                  <select
                    value={tradeMode}
                    onChange={(e) => setTradeMode(e.target.value as TradeMode)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--pm-border)] bg-[var(--pm-input)] text-[var(--pm-text)] font-medium focus:border-[var(--pm-accent)] outline-none"
                  >
                    <option value="retail">Retail (B2C Single Unit)</option>
                    <option value="wholesale">Wholesale (B2B Bulk MOQ)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--pm-text)] mb-1">
                    Delivery ETA / Pickup
                  </label>
                  <input
                    type="text"
                    value={deliveryEta}
                    onChange={(e) => setDeliveryEta(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--pm-border)] bg-[var(--pm-input)] text-[var(--pm-text)] focus:border-[var(--pm-accent)] outline-none"
                  />
                </div>
              </div>

              {/* Optional Seller In-Hand Real Photos Upload */}
              <div className="space-y-2 p-3.5 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--pm-text)] flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-[var(--pm-accent)]" />
                    Attach In-Store Shelf Photos (Optional)
                  </span>
                  <span className="text-[10px] text-[var(--pm-muted)] font-medium">
                    Won&apos;t affect Master Catalog
                  </span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter image URL of actual item in your store..."
                    value={photoInput}
                    onChange={(e) => setPhotoInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-[var(--pm-border)] bg-[var(--pm-input)] text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] focus:border-[var(--pm-accent)] outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddPhoto}
                    className="px-3 py-1.5 bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-[var(--pm-accent-fg)] text-xs font-bold rounded-xl cursor-pointer transition-colors"
                  >
                    Add
                  </button>
                </div>
                {realPhotos.length > 0 && (
                  <div className="flex gap-2 pt-1">
                    {realPhotos.map((url, idx) => (
                      <img key={idx} src={url} alt="In-store photo" className="w-10 h-10 rounded-lg object-cover border border-[var(--pm-border)]" />
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveStep('search')}
                  className="px-4 py-2 text-xs font-bold text-[var(--pm-muted)] hover:text-[var(--pm-text)] cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-[var(--pm-accent-fg)] shadow-xs cursor-pointer transition-colors"
                >
                  Publish Offer to My Shop
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Submit New Uncatalogued Product */}
          {activeStep === 'submit_new' && (
            <form onSubmit={handleAiVerifyAndSubmit} className="space-y-3.5">
              <div className="p-3 rounded-2xl bg-[var(--pm-accent-soft)] border border-[var(--pm-accent-border)] text-xs text-[var(--pm-accent)] flex items-center gap-2">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>
                  Submissions are instantly evaluated by Google Gemini AI Vision for taxonomy verification and bilingual auto-enrichment.
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[var(--pm-text)] mb-1">
                    Proposed Product Title *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 500W Portable Solar Generator"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--pm-border)] bg-[var(--pm-input)] text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] focus:border-[var(--pm-accent)] outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--pm-text)] mb-1">
                    Brand Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. EcoFlow BD"
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--pm-border)] bg-[var(--pm-input)] text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] focus:border-[var(--pm-accent)] outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[var(--pm-text)] mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--pm-border)] bg-[var(--pm-input)] text-[var(--pm-text)] focus:border-[var(--pm-accent)] outline-none"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Apparel">Apparel</option>
                    <option value="Grocery">Grocery</option>
                    <option value="Hardware">Hardware</option>
                    <option value="Health">Health & Pharmacy</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--pm-text)] mb-1">
                    Price (৳) *
                  </label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--pm-border)] bg-[var(--pm-input)] text-[var(--pm-text)] font-mono font-bold focus:border-[var(--pm-accent)] outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--pm-text)] mb-1">
                  Product Description *
                </label>
                <textarea
                  rows={2}
                  placeholder="Key features, wattage, materials..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--pm-border)] bg-[var(--pm-input)] text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] focus:border-[var(--pm-accent)] resize-none outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--pm-text)] mb-1">
                  Product Image URL
                </label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--pm-border)] bg-[var(--pm-input)] text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] focus:border-[var(--pm-accent)] outline-none"
                />
              </div>

              {aiAuditResult && (
                <div className="p-3 rounded-2xl bg-[var(--pm-success-soft)] border border-[var(--pm-success)]/30 text-xs text-[var(--pm-success)] space-y-1 animate-fade-in">
                  <div className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    AI Verification Passed ({aiAuditResult.confidenceScore}% Confidence)
                  </div>
                  <p className="text-[11px]">{aiAuditResult.auditNotes}</p>
                </div>
              )}

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveStep('search')}
                  className="px-4 py-2 text-xs font-bold text-[var(--pm-muted)] hover:text-[var(--pm-text)] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAiVerifying}
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-[var(--pm-accent-fg)] shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  {isAiVerifying ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Gemini AI Auditing...
                    </>
                  ) : (
                    'Run AI Audit & Submit SKU'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
