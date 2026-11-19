import React from 'react';
import { Helmet } from 'react-helmet-async';
import { MarketplacePortalEngine } from '../../components/MarketplacePortalEngine';

export const PharmacyPortalHome: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>অনলাইন ফার্মেসি ও ওষুধ (Online Pharmacy) | Paikar Mart</title>
        <meta name="description" content="ডিজিডিএ অনুমোদিত জেনুইন ঔষধ ও স্বাস্থ্যসেবা সামগ্রী ৩০ মিনিটে ডেলিভারি।" />
      </Helmet>
      <MarketplacePortalEngine
        portalId="pharmacy"
        portalName="Online Pharmacy"
        portalNameBn="অনলাইন ফার্মেসি"
        route="/pharmacy"
        badgeText="30-Min Pharmacy"
        taglineBn="ডিজিডিএ অনুমোদিত জেনুইন ঔষধ ও স্বাস্থ্যসেবা সামগ্রী"
        taglineEn="100% genuine DGDA certified medicines and healthcare delivered in 30 minutes"
        isPharmacy={true}
        accentGradient="from-rose-600 to-red-600"
      />
    </>
  );
};

export default PharmacyPortalHome;
