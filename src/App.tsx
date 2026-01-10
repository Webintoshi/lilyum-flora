import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SEOProvider } from "@/context/SEOContext";
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
import Contact from "@/pages/Contact";
import Wishlist from "@/pages/Wishlist";
import Addresses from "@/pages/Addresses";
import OrderHistory from "@/pages/OrderHistory";
import About from "@/pages/About";
import AdminLogin from "@/pages/admin/AdminLogin";
import Dashboard from "@/pages/admin/Dashboard";
import ProductList from "@/pages/admin/products/ProductList";
import ProductForm from "@/pages/admin/products/ProductForm";
import OrderList from "@/pages/admin/orders/OrderList";
import OrderDetail from "@/pages/admin/orders/OrderDetail";
import CustomerList from "@/pages/admin/customers/CustomerList";
import CategoryManagement from "@/pages/admin/categories/CategoryManagement";
import SEOSettings from "@/pages/admin/SEOSettings";
import Settings from "@/pages/admin/Settings";
import BannerManagement from "@/pages/admin/banners/BannerManagement";

export default function App() {
  return (
    <SEOProvider>
      <Router>
        <FlowerAnimation />
        <MagicDustEffect />
        <SideCart />
        <BottomNavigation />
        <FloatingButtons />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout/success" element={<CheckoutSuccess />} />
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
    </SEOProvider>
  );
}
