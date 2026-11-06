import React from "react";
import { Routes, Route } from "react-router-dom";
import SellerDashboard from "./pages/SellerDashboard";
import Inventory from "./pages/Inventory";
import Analytics from "./pages/analytics";
import Orders from "./pages/orders";
import SellerLayout from "./layouts/SellerLayout";

export default function SellerCentral() {
  return (
    <SellerLayout>
      <Routes>
        <Route index element={<SellerDashboard />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="orders" element={<Orders />} />
        <Route path="analytics" element={<Analytics />} />
        {/* Future routes for settings, etc will go here */}
      </Routes>
    </SellerLayout>
  );
}
