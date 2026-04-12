import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import { AppProviders } from "@/app/AppProviders";
import DashboardApp from "./DashboardApp";
import "./index.css";

window.__APP_ENTRY__ = "dashboard";
document.body.classList.add("dashboard-entry");

createRoot(document.getElementById("root")!).render(
  <AppProviders>
    <MemoryRouter>
      <DashboardApp />
    </MemoryRouter>
  </AppProviders>,
);
