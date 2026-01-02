import { BrowserRouter, Navigate, Route, Routes } from "react-router";

import { AnalyticsProvider } from "./components/analytics/AnalyticsProvider";
import MomPage from "./pages/MomPage/MomPage";
import ProtectedRoute from "./components/route/ProtectedRoute";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminProducts from "./pages/admin/products/AdminProducts";
import AdminProductsIndividual from "./pages/admin/products/AdminProductIndividual";
import AdminCustomers from "./pages/admin/customers/AdminCustomers";
import AdminOrders from "./pages/admin/orders/AdminOrders";
import Layout from "./components/layout/Layout";
import Checkout from "./pages/checkout/Checkout";
import Details from "./pages/checkout/Details";
import PaymentPage from "./pages/checkout/PaymentPage";
import OrderSuccess from "./pages/OrderSuccess";
import OrderIndividual from "./pages/admin/orders/OrderIndividual";

function App() {
  return (
    // Default font is Inter
    <div className="font-['Inter']">
      <BrowserRouter>
        <AnalyticsProvider>
          <Routes>
            <Route path="/" element={<MomPage />} />
            <Route path="/success" element={<OrderSuccess />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/details" element={<Details />} />
            <Route path="/pay" element={<PaymentPage />} />
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
                <Route
                  path="/admin/orders/:orderId"
                  element={<OrderIndividual />}
                />
              </Route>
            </Route>
          </Routes>
        </AnalyticsProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
