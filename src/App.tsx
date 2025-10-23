import { BrowserRouter, Navigate, Route, Routes } from "react-router";

import { AnalyticsProvider } from "./components/analytics/AnalyticsProvider";
import MomPage from "./pages/MomPage/MomPage";

function App() {
  return (
    // Default font is Inter
    <div className="font-['Inter']">
      <BrowserRouter>
        <AnalyticsProvider>
          <Routes>
            <Route path="/" element={<MomPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnalyticsProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
