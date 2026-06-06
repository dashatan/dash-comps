import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "@/app/App";
import { AppProviders } from "@/app/providers";
import { resolveInitialLanguage } from "@/lib/language/detect";
import { getDocumentDirection } from "@/lib/language/utils";
import "@/styles/app.css";
import "leaflet/dist/leaflet.css";

const initialLanguage = resolveInitialLanguage();
document.documentElement.lang = initialLanguage;
document.documentElement.dir = getDocumentDirection(initialLanguage);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AppProviders>
        <App />
      </AppProviders>
    </BrowserRouter>
  </StrictMode>,
);
