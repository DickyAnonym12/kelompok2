import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer"; 
import Dashboard from "../pages/Dashboard";

export default function GuestLayout() {
  return (
    <>
      <Header />
      <main>
        <Dashboard />
      </main>
      <Footer />
    </>
  );
}
