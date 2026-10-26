import * as React from "react";
import { SellerRegistrationWizard } from "@/features/registration/SellerRegistrationWizard";

export default function SellerRegistrationPage() {
  return (
    <div className="min-h-screen bg-neutral-950 p-4 md:p-8">
      <h1 className="text-3xl font-black text-white text-center mb-8">Seller Registration</h1>
      <SellerRegistrationWizard />
    </div>
  );
}
