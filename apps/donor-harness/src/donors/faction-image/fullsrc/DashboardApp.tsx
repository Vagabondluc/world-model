import { DashboardHeader } from "@/dashboard/DashboardHeader";
import { DashboardSidebarRail } from "@/dashboard/DashboardSidebarRail";
import { DashboardWorkspace } from "@/dashboard/DashboardWorkspace";

const DashboardApp = () => (
  <div id="dashboard-root" className="min-h-screen flex flex-col bg-background">
    <DashboardHeader />
    <div className="flex flex-1 min-h-0">
      <DashboardSidebarRail />
      <DashboardWorkspace />
    </div>
  </div>
);

export default DashboardApp;
