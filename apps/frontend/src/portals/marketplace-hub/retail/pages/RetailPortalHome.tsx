import React from 'react';
import { Helmet } from 'react-helmet-async';
import { MarketplacePortalEngine } from '../../components/MarketplacePortalEngine';

export const RetailPortalHome: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>খুচরা মার্কেটপ্লেস (Retail Marketplace) | Paikar Mart</title>
        <meta name="description" content="একক পিস কেনাকাটায় দ্রুত ডেলিভারি ও নিরাপদ ক্যাশ অন ডেলিভারি সুবিধা।" />
      </Helmet>
      <MarketplacePortalEngine
        portalId="retail"
        portalName="Retail Marketplace"
        portalNameBn="খুচরা মার্কেটপ্লেস"
        route="/b2c"
        badgeText="B2C Retail"
        taglineBn="একক পিস কেনাকাটায় দ্রুত ডেলিভারি ও নিরাপদ ক্যাশ অন ডেলিভারি"
        taglineEn="Discover millions of consumer products with instant Buy Now and Cash on Delivery"
        accentGradient="from-orange-500 to-amber-600"
      />
    </>
  );
};

export default RetailPortalHome;
