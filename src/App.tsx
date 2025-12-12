import { BrowserRouter, Navigate, Route, Routes } from "react-router";

import { AnalyticsProvider } from "./components/analytics/AnalyticsProvider";
import MomPage from "./pages/MomPage/MomPage";
import ProtectedRoute from "./components/route/ProtectedRoute";
import Admin from "./pages/admin/Admin";
import AdminLogin from "./pages/admin/AdminLogin";

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
              <Route path="/admin" element={<Admin />} />
            </Route>
          </Routes>
        </AnalyticsProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
