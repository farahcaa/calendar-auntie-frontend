import { createRoot } from "react-dom/client";

import "./index.css";
import App from "./App.tsx";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NotifierProvider } from "./components/ui/Notify.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <NotifierProvider>
      <App />
    </NotifierProvider>
  </QueryClientProvider>
);
