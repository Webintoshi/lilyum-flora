import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { HelmetProvider } from 'react-helmet-async';
import { useAdminStore } from "@/store/adminStore";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";
import FlowerAnimation from "@/components/FlowerAnimation";
import MagicDustEffect from "@/components/MagicDustEffect";
import SideCart from "@/components/SideCart";
import BottomNavigation from "@/components/BottomNavigation";
import FloatingButtons from "@/components/FloatingButtons";
import Home from "@/pages/Home";
import Landscaping from "@/pages/Landscaping";
import Catalog from "@/pages/Catalog";
import ProductDetail from "@/pages/ProductDetail";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import CheckoutSuccess from "@/pages/CheckoutSuccess";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Profile from "@/pages/Profile";
import OrderTracking from "@/pages/OrderTracking";
import PaymentPage from "@/pages/PaymentPage";
import Contact from "@/pages/Contact";
import Wishlist from "@/pages/Wishlist";
import GiftFinder from "@/pages/GiftFinder";
import Reminders from "@/pages/Reminders";
import Addresses from "@/pages/Addresses";
import OrderHistory from "@/pages/OrderHistory";
import About from "@/pages/About";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfUse from "@/pages/TermsOfUse";
import ReturnPolicy from "@/pages/ReturnPolicy";
import AdminLogin from "@/pages/admin/AdminLogin";

export default function App() {
  const { fetchSEOSettings, fetchPageSEO } = useAdminStore();

  useEffect(() => {
    fetchSEOSettings();
    fetchPageSEO();
  }, [fetchSEOSettings, fetchPageSEO]);

  return (
    <HelmetProvider>
      <Router>
        <FlowerAnimation />
        <MagicDustEffect />
        <SideCart />
        <BottomNavigation />
        <FloatingButtons />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/products" element={<Navigate to="/catalog" replace />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout/success" element={<CheckoutSuccess />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/addresses" element={<Addresses />} />
          <Route path="/profile/orders" element={<OrderHistory />} />
          <Route path="/order/:id" element={<OrderTracking />} />
          <Route path="/about" element={<About />} />
          <Route path="/landscaping" element={<Landscaping />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/gift-finder" element={<GiftFinder />} />
          <Route path="/reminders" element={<Reminders />} />

          {/* Policy Pages */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-use" element={<TermsOfUse />} />
          <Route path="/return-policy" element={<ReturnPolicy />} />

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </HelmetProvider>
  );
}
