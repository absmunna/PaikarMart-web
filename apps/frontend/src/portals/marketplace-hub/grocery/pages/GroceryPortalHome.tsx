import React from 'react';
import { Helmet } from 'react-helmet-async';
import { MarketplacePortalEngine } from '../../components/MarketplacePortalEngine';

export const GroceryPortalHome: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>ডেইলি ফ্রেশ গ্রোসারি (Daily Fresh Grocery) | Paikar Mart</title>
        <meta name="description" content="খাঁটি মধু, চাল, ডাল ও নিত্য প্রয়োজনীয় খাটি পণ্য দ্রুত ডেলিভারি।" />
      </Helmet>
      <MarketplacePortalEngine
        portalId="grocery"
        portalName="Daily Fresh Grocery"
        portalNameBn="ডেইলি ফ্রেশ গ্রোসারি"
        route="/grocery"
        badgeText="Express Grocery"
        taglineBn="খাঁটি মধু, চাল, ডাল ও নিত্য প্রয়োজনীয় খাঁটি খাদ্যপণ্য"
        taglineEn="Farm-fresh groceries, natural honey, and household essentials"
        isGrocery={true}
        accentGradient="from-emerald-600 to-teal-700"
      />
    </>
  );
};

export default GroceryPortalHome;
