import "./assets/tailwind.css";
import Loading from "./components/Loading";
import { Routes, Route, Navigate } from "react-router-dom";
import React, { Suspense } from "react";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import GuestLayout from "./layouts/GuestLayout";
import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";
import Pelanggan from './pages/Pelanggan';
import DetailPelanggan from './pages/DetailPelanggan';

// Lazy load pages
const DashboardAdmin = React.lazy(() => import("./pages/DashboardAdmin"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Products = React.lazy(() => import("./pages/Products"));
const ProductDetail = React.lazy(() => import("./pages/ProductDetail"));
const AboutUs = React.lazy(() => import("./components/AboutUs"));
const Login = React.lazy(() => import("./pages/auth/Login"));
const Register = React.lazy(() => import("./pages/auth/Register"));
const Forgot = React.lazy(() => import("./pages/auth/Forgot"));
const Error400 = React.lazy(() => import("./pages/Error400"));
const Error403 = React.lazy(() => import("./pages/Error403"));
const Error404 = React.lazy(() => import("./pages/Error404"));
const PesananButik = React.lazy(() => import("./pages/PesananButik"));
const DetailPesananButik = React.lazy(() => import("./pages/DetailPesanan"));
const LaporanPenjualan = React.lazy(() => import("./pages/LaporanPenjualan"));
const FaqAdmin = React.lazy(() => import("./pages/FaqAdmin"));
const NewsletterAdmin = React.lazy(() => import("./pages/NewsletterAdmin"));
const NewsletterCampaigns = React.lazy(() => import("./pages/NewsletterCampaigns"));
import { AddCampaignForm } from "./pages/NewsletterCampaigns";
import EditCampaignForm from './pages/EditCampaignForm';
const Membership = React.lazy(() => import("./pages/MemberShip"));

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* Auth Routes (Public) */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot" element={<Forgot />} />
          </Route>

          {/* Protected Admin Routes */}
          <Route element={
            <ProtectedRoute allowedRoles={['admin']}>
              <MainLayout />
            </ProtectedRoute>
          }>
            <Route path="/" element={<DashboardAdmin />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/pelanggan" element={<Pelanggan />} /> 
            <Route path="/pelanggan/:id" element={<DetailPelanggan />} />
            <Route path="/pesanan-butik" element={<PesananButik />} />
            <Route path="/pesanan-butik/:id" element={<DetailPesananButik />} />
            <Route path="/laporan-penjualan" element={<LaporanPenjualan />} />
            <Route path="/faq-admin" element={<FaqAdmin />} />
            <Route path="/newsletter-admin" element={<NewsletterAdmin />} />
            <Route path="/newsletter-campaigns" element={<NewsletterCampaigns />} />
            <Route path="/newsletter-campaigns/add" element={<AddCampaignForm />} />
            <Route path="/newsletter-campaigns/:id/edit" element={<EditCampaignForm />} />
            <Route path="/contact" element={<Error404 />} />
            <Route path="/membership" element={<Membership />} />
          </Route>

          {/* Protected User Routes */}
          <Route element={
            <ProtectedRoute allowedRoles={['user']}>
              <GuestLayout />
            </ProtectedRoute>
          }>
            <Route path="/guest" element={<Dashboard />} />
          </Route>

          {/* Catch all - redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
