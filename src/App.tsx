import { BrowserRouter, Navigate, Route, Routes } from "react-router";

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
import Config from "./pages/admin/config/Config";
import Blog from "./pages/admin/blog/Blog";
import CreateCategory from "./pages/admin/blog/CreateCategory";
import BlogPost from "./pages/admin/blog/BlogPost";
import CreateBlogPost from "./pages/admin/blog/CreateBlogPost";
import BlogList from "./pages/admin/blog/BlogList";
import BlogCategories from "./pages/MomPage/BlogCategories";
import BlogPosts from "./pages/MomPage/BlogPosts";
import BlogPage from "./pages/MomPage/BlogPage";

function App() {
  return (
    // Default font is Inter
    <div className="font-['Inter']">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MomPage />} />
          <Route path="/success" element={<OrderSuccess />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/details" element={<Details />} />
          <Route path="/pay" element={<PaymentPage />} />
          <Route path="/blog" element={<BlogCategories />} />
          <Route path="/blog/:categoryId" element={<BlogPosts />} />
          <Route path="/blog/:categoryId/:postId" element={<BlogPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/admin/blog" element={<Blog />} />
              <Route
                path="/admin/blog-create-category"
                element={<CreateCategory />}
              />
              <Route
                path="/admin/blog-create-post/:categoryId"
                element={<CreateBlogPost />}
              />
              <Route path="/admin/blog/:CategoryId" element={<BlogList />} />
              <Route path="/admin/blog/post/:id" element={<BlogPost />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route
                path={"/admin/products/:productId"}
                element={<AdminProductsIndividual />}
              />
              <Route path="/admin/config" element={<Config />} />
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
      </BrowserRouter>
    </div>
  );
}

export default App;
