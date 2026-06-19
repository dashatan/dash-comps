import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { AppProviders } from "@/app/providers";
import { routeTree } from "@/routeTree.gen";
import { resolveInitialLanguage } from "@/lib/language/detect";
import { getDocumentDirection } from "@/lib/language/utils";
import "@/styles/app.css";
import "leaflet/dist/leaflet.css";

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const initialLanguage = resolveInitialLanguage();
document.documentElement.lang = initialLanguage;
document.documentElement.dir = getDocumentDirection(initialLanguage);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  </StrictMode>,
);
