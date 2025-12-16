import { BrowserRouter, Navigate, Route, Routes } from "react-router";

import { AnalyticsProvider } from "./components/analytics/AnalyticsProvider";
import MomPage from "./pages/MomPage/MomPage";
import ProtectedRoute from "./components/route/ProtectedRoute";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminProducts from "./pages/admin/products/AdminProducts";
import AdminProductsIndividual from "./pages/admin/products/AdminProductIndividual";
import AdminCustomers from "./pages/admin/customers/AdminCustomers";
import AdminOrders from "./pages/admin/AdminOrders";
import Layout from "./components/layout/Layout";

function App() {
  return (
    // Default font is Inter
    <div className="font-['Inter']">
      <BrowserRouter>
        <AnalyticsProvider>
          <Routes>
            <Route path="/" element={<MomPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/admin/products" element={<AdminProducts />} />
                <Route
                  path={"/admin/products/:productId"}
                  element={<AdminProductsIndividual />}
                />
                <Route path="/admin/customers" element={<AdminCustomers />} />
                <Route
                  path="/admin/customer/:customerId"
                  element={<AdminCustomers />}
                />
                <Route path="/admin/orders" element={<AdminOrders />} />
              </Route>
            </Route>
          </Routes>
        </AnalyticsProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
