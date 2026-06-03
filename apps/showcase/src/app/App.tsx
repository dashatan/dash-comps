import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AppShell } from "@/shared/layout/shell";
import { HomePage } from "@/features/home/home-page";
import { CatalogIndexPage } from "@/features/catalog/index-page";
import { catalogRoutes } from "@/features/catalog/routes";

export default function App() {
  const location = useLocation();

  return (
    <AppShell>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/components" element={<CatalogIndexPage />} />
          {catalogRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Routes>
      </AnimatePresence>
    </AppShell>
  );
}
