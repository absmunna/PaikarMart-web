import React, { useEffect, useState } from 'react';
import {
  X,
  Trash2,
  ShoppingBag,
  CheckCircle2,
  CreditCard,
  ArrowRight,
  Plus,
  Minus,
  AlertCircle
} from 'lucide-react';
import { CartItem, Order, User } from '@/types';
import { GuestCheckoutForm } from '@/features/marketplace/components/GuestCheckoutForm';
import { CheckoutSuccessSummary } from '@/features/marketplace/components/CheckoutSuccessSummary';
import { AccountConversionPopup } from '@/features/marketplace/components/AccountConversionPopup';

import { verifyUniqueUser } from '@/features/auth';
import { getEffectiveUnitPrice } from '@/features/marketplace/utils/commerceUtils';
import { retailApiClient } from '@/features/marketplace/services/retailApiClient';

const handleVerifyUser = async (data: any) => {
  return await verifyUniqueUser(data.email, data.phone);
};

interface CartCheckoutDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onOrderPlaced: (order: Order) => void;
  currentUser?: User;
  initialPromoCode?: string;
}

export const CartCheckoutDrawer: React.FC<CartCheckoutDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOrderPlaced,
  currentUser,
  initialPromoCode,
}) => {
  const [deliveryAddress, setDeliveryAddress] = useState('House 12, Road 4, Dhanmondi, Dhaka');
  const [paymentMethod, setPaymentMethod] = useState<'Credit / Debit Card' | 'Mobile Wallet (bKash/Nagad/Rocket)' | 'Cash on Delivery'>('Cash on Delivery');
  const [promoCode, setPromoCode] = useState('');
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);
  const [freeShippingPromo, setFreeShippingPromo] = useState(false);
  const [promoStatus, setPromoStatus] = useState<{ valid: boolean; text: string } | null>(null);
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [showConversion, setShowConversion] = useState(false);
  const [guestData, setGuestData] = useState<any>(null);

  // States for registered user quick checkout
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [tempUserDetails, setTempUserDetails] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    address: currentUser?.location || ''
  });

  useEffect(() => {
    if (currentUser) {
      setTempUserDetails({
        name: currentUser.name,
        phone: currentUser.phone || '',
        address: currentUser.location
      });
    }
  }, [currentUser]);

  const subtotal = items.reduce((acc, item) => {
    const unitPrice = getEffectiveUnitPrice(item.product, item.quantity);
    return acc + (unitPrice * item.quantity);
  }, 0);

  const itemCategories = Array.from(new Set(items.map((item) => item.product.category).filter(Boolean)));

  useEffect(() => {
    if (isOpen && initialPromoCode) {
      setPromoCode(initialPromoCode);
      if (items.length > 0 && subtotal > 0) {
        retailApiClient.validateVoucher(initialPromoCode, subtotal, itemCategories).then((res) => {
          if (res.valid) {
            setDiscount(res.discountBdt);
            setFreeShippingPromo(res.freeShipping);
            setAppliedCode(res.code);
            setPromoStatus({ valid: true, text: res.message });
          } else {
            setDiscount(0);
            setFreeShippingPromo(false);
            setAppliedCode(null);
            setPromoStatus({ valid: false, text: res.message });
          }
        });
      }
    }
  }, [isOpen, initialPromoCode]);

  if (!isOpen) return null;

  const baseDeliveryFee = subtotal > 0 ? (subtotal > 2000 ? 0 : 60) : 0;
  const deliveryFee = freeShippingPromo ? 0 : baseDeliveryFee;
  const tax = Number((subtotal * 0.05).toFixed(2));
  const total = Math.max(0, Number((subtotal + deliveryFee + tax - discount).toFixed(2)));

  const handleApplyPromo = async () => {
    const clean = promoCode.trim().toUpperCase();
    if (!clean) {
      setPromoStatus({ valid: false, text: 'Enter a promo code first.' });
      return;
    }

    setIsApplyingPromo(true);
    const res = await retailApiClient.validateVoucher(clean, subtotal, itemCategories);
    setIsApplyingPromo(false);

    if (res.valid) {
      setDiscount(res.discountBdt);
      setFreeShippingPromo(res.freeShipping);
      setAppliedCode(res.code);
      setPromoStatus({ valid: true, text: res.message });
    } else {
      setDiscount(0);
      setFreeShippingPromo(false);
      setAppliedCode(null);
      setPromoStatus({ valid: false, text: res.message });
    }
  };

  const handlePlaceOrder = async (data?: any) => {
    if (items.length === 0) return;
    setCheckoutError(null);
    setIsProcessing(true);

    const resolvedAddress = data?.address || tempUserDetails.address || deliveryAddress;
    const resolvedPayment = (data?.paymentMethod || paymentMethod) as Order['paymentMethod'];
    const resolvedBuyerName = data?.name || tempUserDetails.name || currentUser?.name;
    const resolvedBuyerPhone = data?.phone || tempUserDetails.phone || currentUser?.handle;
    const idempotencyKey = `cart-${Date.now()}-${items.length}`;

    try {
      const serverRes = await retailApiClient.createServerOrder({
        idempotencyKey,
        items: [...items],
        subtotal,
        deliveryFee,
        tax,
        promoCode: appliedCode || undefined,
        deliveryAddress: resolvedAddress,
        paymentMethod: resolvedPayment,
        estimatedArrival: '30 - 45 Minutes',
        buyerName: resolvedBuyerName,
        buyerPhone: resolvedBuyerPhone,
        storeId: items[0]?.product.storeId,
        storeName: items[0]?.product.storeName,
      });

      const created = serverRes.order;
      const newOrder: Order = {
        id: created.id,
        createdAt: created.createdAt || new Date().toISOString(),
        items: [...items],
        subtotal: Number(created.subtotal ?? subtotal),
        deliveryFee: Number(created.deliveryFee ?? deliveryFee),
        tax: Number(created.tax ?? tax),
        total: Number(created.total ?? total),
        status: 'confirmed',
        deliveryAddress: created.deliveryAddress || resolvedAddress,
        paymentMethod: (created.paymentMethod || resolvedPayment) as Order['paymentMethod'],
        estimatedArrival: created.estimatedArrival || '30 - 45 Minutes',
        trackingStep: 1,
        buyerName: resolvedBuyerName,
        buyerPhone: resolvedBuyerPhone,
        storeId: created.storeId || items[0]?.product.storeId,
        storeName: created.storeName || items[0]?.product.storeName,
      };

      setConfirmedOrder(newOrder);
      onOrderPlaced(newOrder);
      onClearCart();
      setPromoCode('');
      setAppliedCode(null);
      setDiscount(0);
      setFreeShippingPromo(false);
      setPromoStatus(null);

      const isGuest = !currentUser || (!currentUser.isVendor && !currentUser.id.startsWith('user_'));
      if (isGuest && data) {
        setGuestData(data);
        setShowConversion(true);
      }
    } catch (err: any) {
      setCheckoutError(err?.message || 'Unable to place order right now. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-xs animate-fadeIn">
      <div role="dialog" aria-modal="true" aria-labelledby="bag-title" className="relative w-full max-w-lg bg-[var(--pm-card)] text-[var(--pm-text)] border-l border-[var(--pm-border)] shadow-2xl h-full flex flex-col justify-between overflow-y-auto">

        {/* Header */}
        <div className="p-5 border-b border-[var(--pm-border)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[var(--pm-accent)]" />
            <h2 id="bag-title" className="text-lg font-bold text-[var(--pm-text)]">
              Your Unified Bag ({items.reduce((a, b) => a + b.quantity, 0)})
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              setConfirmedOrder(null);
              setCheckoutError(null);
              onClose();
            }}
            aria-label="Close bag"
            className="p-1.5 rounded-full text-[var(--pm-muted)] hover:text-[var(--pm-text)] hover:bg-[var(--pm-surface)] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Confirmed Order State */}
        {confirmedOrder ? (
          <CheckoutSuccessSummary
            order={confirmedOrder}
            onClose={() => {
              setConfirmedOrder(null);
              onClose();
            }}
          />
        ) : (
          <>
            {/* Bag Items List */}
            <div className="p-5 flex-1 overflow-y-auto space-y-4">
              {items.length === 0 ? (
                <div className="py-16 text-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-[var(--pm-surface)] border border-[var(--pm-border)] flex items-center justify-center mx-auto text-[var(--pm-muted)]">
                    <ShoppingBag className="w-7 h-7" />
                  </div>
                  <h4 className="text-base font-bold text-[var(--pm-text)]">
                    Your bag is empty
                  </h4>
                  <p className="text-xs text-[var(--pm-muted)] max-w-xs mx-auto">
                    Add wholesale lots, gourmet meals, retail goods, or service bookings from any commercial portal.
                  </p>
                </div>
              ) : (
                items.map((cartItem) => {
                  const unitPrice = getEffectiveUnitPrice(cartItem.product, cartItem.quantity);
                  const moq = cartItem.product.minWholesaleQty || 20;

                  return (
                    <div
                      key={`${cartItem.product.id}-${cartItem.isWholesale ? 'w' : 'r'}`}
                      className="p-3.5 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] flex items-start gap-3"
                    >
                      <img
                        src={cartItem.product.imageUrl}
                        alt={cartItem.product.title}
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 rounded-xl object-cover shrink-0 bg-[var(--pm-card)] shadow-xs"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <span className={`text-[10px] font-bold uppercase ${cartItem.isWholesale ? 'text-[var(--pm-success)]' : 'text-[var(--pm-accent)]'}`}>
                              {cartItem.isWholesale ? 'B2B Wholesale' : cartItem.product.storeName}
                            </span>
                            <h4 className="text-xs font-bold text-[var(--pm-text)] truncate mt-0.5">
                              {cartItem.product.title}
                            </h4>
                            {cartItem.selectedVariant && (
                              <p className="text-[10px] text-[var(--pm-muted)] truncate">{cartItem.selectedVariant}</p>
                            )}
                            <p className="text-[11px] text-[var(--pm-muted)] font-mono tabular-nums">
                              ৳{unitPrice.toLocaleString()} / unit
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => onRemoveItem(cartItem.product.id)}
                            className="text-[var(--pm-muted)] hover:text-[var(--pm-danger)] p-1 transition-colors cursor-pointer"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <span className="font-mono tabular-nums text-sm font-black text-[var(--pm-text)]">
                            ৳{(unitPrice * cartItem.quantity).toLocaleString()}
                          </span>

                          <div className="flex items-center gap-1 bg-[var(--pm-card)] px-1.5 py-1 rounded-xl border border-[var(--pm-border)] shadow-xs">
                            <button
                              type="button"
                              disabled={cartItem.isWholesale && cartItem.quantity <= moq}
                              onClick={() => onUpdateQuantity(cartItem.product.id, cartItem.quantity - (cartItem.isWholesale ? 10 : 1))}
                              className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-[var(--pm-surface)] text-[var(--pm-muted)] disabled:opacity-30 cursor-pointer"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-xs font-mono tabular-nums font-black px-2 min-w-[2rem] text-center">
                              {cartItem.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(cartItem.product.id, cartItem.quantity + (cartItem.isWholesale ? 10 : 1))}
                              className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-[var(--pm-surface)] text-[var(--pm-muted)] cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}

              {/* Delivery Details & Payment Form */}
              {items.length > 0 && (
                <div className="space-y-4 pt-3 border-t border-[var(--pm-border)]">
                  {!currentUser ? (
                    <GuestCheckoutForm onVerify={handleVerifyUser} onComplete={(data) => handlePlaceOrder(data)} />
                  ) : (
                    <div className="space-y-4">
                      {!isEditingDetails ? (
                        <div className="space-y-3">
                          {currentUser.savedAddresses && currentUser.savedAddresses.length > 0 && (
                            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                              {currentUser.savedAddresses.map(addr => (
                                <button
                                  key={addr.id}
                                  type="button"
                                  onClick={() => setTempUserDetails({
                                    name: addr.recipientName,
                                    phone: addr.phone,
                                    address: addr.streetAddress + ', ' + addr.city
                                  })}
                                  className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase whitespace-nowrap border transition-all cursor-pointer ${
                                    tempUserDetails.address === (addr.streetAddress + ', ' + addr.city)
                                      ? 'bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] border-transparent shadow-sm'
                                      : 'bg-[var(--pm-surface)] text-[var(--pm-muted)] border-[var(--pm-border)]'
                                  }`}
                                >
                                  {addr.label}
                                </button>
                              ))}
                            </div>
                          )}

                          <div className="p-4 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] space-y-3">
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <span className="text-[10px] font-bold text-[var(--pm-muted)] uppercase">Delivery Address</span>
                                <p className="text-xs font-bold text-[var(--pm-text)]">{tempUserDetails.address || currentUser.location}</p>
                              </div>
                              <button type="button" onClick={() => setIsEditingDetails(true)} className="text-[10px] font-black text-[var(--pm-accent)] uppercase cursor-pointer">Edit</button>
                            </div>
                            <div className="space-y-1">
                              <span className="text-[10px] font-bold text-[var(--pm-muted)] uppercase">Contact Info</span>
                              <p className="text-xs font-bold text-[var(--pm-text)]">
                                {tempUserDetails.name || currentUser.name} · {tempUserDetails.phone || currentUser.handle}
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3 p-4 rounded-2xl border border-[var(--pm-accent-border)] bg-[var(--pm-accent-soft)]">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-[var(--pm-muted)] uppercase">Full Name</label>
                            <input
                              type="text"
                              className="w-full p-2 rounded-lg bg-[var(--pm-input)] text-[var(--pm-text)] text-xs border border-[var(--pm-border)] outline-none focus:border-[var(--pm-accent)]"
                              value={tempUserDetails.name}
                              onChange={e => setTempUserDetails({...tempUserDetails, name: e.target.value})}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-[var(--pm-muted)] uppercase">Phone / Handle</label>
                            <input
                              type="text"
                              className="w-full p-2 rounded-lg bg-[var(--pm-input)] text-[var(--pm-text)] text-xs border border-[var(--pm-border)] outline-none focus:border-[var(--pm-accent)]"
                              value={tempUserDetails.phone}
                              onChange={e => setTempUserDetails({...tempUserDetails, phone: e.target.value})}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-[var(--pm-muted)] uppercase">Address</label>
                            <textarea
                              className="w-full p-2 rounded-lg bg-[var(--pm-input)] text-[var(--pm-text)] text-xs border border-[var(--pm-border)] outline-none focus:border-[var(--pm-accent)]"
                              value={tempUserDetails.address}
                              onChange={e => setTempUserDetails({...tempUserDetails, address: e.target.value})}
                            />
                          </div>
                          <button type="button" onClick={() => setIsEditingDetails(false)} className="w-full py-2 rounded-lg bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-[var(--pm-accent-fg)] text-xs font-bold cursor-pointer">Save Changes</button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Payment Method */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[var(--pm-text)] flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-[var(--pm-accent)]" />
                      Payment Gateway Method
                    </label>
                    <div className="grid grid-cols-1 gap-1.5">
                      {(['Credit / Debit Card', 'Mobile Wallet (bKash/Nagad/Rocket)', 'Cash on Delivery'] as const).map((method) => (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setPaymentMethod(method)}
                          className={`p-2.5 rounded-xl border text-xs font-medium text-left flex items-center justify-between transition-colors cursor-pointer ${
                            paymentMethod === method
                              ? 'border-[var(--pm-accent)] bg-[var(--pm-accent-soft)] text-[var(--pm-accent)] font-bold'
                              : 'border-[var(--pm-border)] bg-[var(--pm-surface)] text-[var(--pm-text)]'
                          }`}
                        >
                          <span>{method}</span>
                          {paymentMethod === method && <CheckCircle2 className="w-3.5 h-3.5 text-[var(--pm-accent)]" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Server-Validated Promo Code */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Promo Code (SUPER10, PAIKAR50, FREEDEL)"
                        className="flex-1 px-3 py-2 rounded-xl bg-[var(--pm-input)] text-xs text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] border border-[var(--pm-border)] focus:outline-none focus:border-[var(--pm-accent)]"
                      />
                      <button
                        type="button"
                        disabled={isApplyingPromo}
                        onClick={handleApplyPromo}
                        className="px-3.5 py-2 rounded-xl bg-[var(--pm-surface)] hover:bg-[var(--pm-card-hover)] border border-[var(--pm-border)] text-xs font-bold text-[var(--pm-text)] disabled:opacity-50 cursor-pointer"
                      >
                        {isApplyingPromo ? 'Checking...' : 'Apply'}
                      </button>
                    </div>
                    {promoStatus && (
                      <p className={`text-[11px] font-semibold ${promoStatus.valid ? 'text-[var(--pm-success)]' : 'text-[var(--pm-danger)]'}`}>
                        {promoStatus.text}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Summary & Checkout */}
            {items.length > 0 && (
              <div className="p-5 border-t border-[var(--pm-border)] bg-[var(--pm-surface)] space-y-3">
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-[var(--pm-muted)]">
                    <span>Subtotal:</span>
                    <span className="font-mono tabular-nums text-[var(--pm-text)]">৳{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-[var(--pm-muted)]">
                    <span>Delivery Fee:</span>
                    <span className="font-mono tabular-nums text-[var(--pm-text)]">
                      {deliveryFee === 0 ? 'FREE' : `৳${deliveryFee.toLocaleString()}`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[var(--pm-muted)]">
                    <span>VAT / Service Tax (5%):</span>
                    <span className="font-mono tabular-nums text-[var(--pm-text)]">৳{tax.toLocaleString()}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex items-center justify-between text-[var(--pm-success)] font-bold">
                      <span>Discount ({appliedCode}):</span>
                      <span className="font-mono tabular-nums">-৳{discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between font-bold text-base text-[var(--pm-text)] pt-2 border-t border-[var(--pm-border)]">
                    <span>Total Amount:</span>
                    <span className="font-mono tabular-nums">৳{total.toLocaleString()}</span>
                  </div>
                </div>

                {checkoutError && (
                  <div className="p-2.5 rounded-xl bg-[var(--pm-danger-soft)] border border-[var(--pm-danger)]/30 text-[var(--pm-danger)] text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{checkoutError}</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => handlePlaceOrder()}
                  disabled={isProcessing || isEditingDetails}
                  className="w-full py-3 rounded-xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] disabled:opacity-40 text-[var(--pm-accent-fg)] font-bold text-xs sm:text-sm shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{isProcessing ? 'Processing Secure Order...' : `Place Order · ৳${total.toLocaleString()}`}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}

        <AccountConversionPopup
          isOpen={showConversion}
          onClose={() => setShowConversion(false)}
          onConvert={(pwd) => {
            console.log('Account converted successfully for:', guestData?.email || guestData?.phone);
            setGuestData(null);
          }}
          guestEmail={guestData?.email}
          guestPhone={guestData?.phone}
        />
      </div>
    </div>
  );
};
