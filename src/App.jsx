import "./assets/tailwind.css";
import Loading from "./components/Loading";
import { Routes, Route } from "react-router-dom";
import React, { Suspense } from "react";

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
const OrderList = React.lazy(() => import("./components/OrderList"));
const UserList = React.lazy(() => import("./components/UserList"));
const PesananButik = React.lazy(() => import("./pages/PesananButik"));
const DetailPesananButik = React.lazy(() => import("./pages/DetailPesanan"));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Main Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<DashboardAdmin />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/pelanggan" element={<Pelanggan />} /> 
          <Route path="/pelanggan/:id" element={<DetailPelanggan />} />
          <Route path="/pesanan-butik" element={<PesananButik />} />
          <Route path="/pesanan-butik/:id" element={<DetailPesananButik />} />
          <Route path="/contact" element={<Error404 />} />
          <Route path="*" element={<Error404 />} />
        </Route>

        {/* Guest Routes */}
        <Route element={<GuestLayout />}>
          <Route path="/guest" element={<Dashboard />} />
        </Route>

        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<Forgot />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
