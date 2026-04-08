import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "@/shell/AppShell";
import { ArchitectMode } from "@/modes/architect/ArchitectMode";
import { GuidedMode } from "@/modes/guided/GuidedMode";
import { StudioMode } from "@/modes/studio/StudioMode";

export function AppRoutes() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Navigate replace to="/guided" />} />
        <Route path="/guided" element={<GuidedMode />} />
        <Route path="/studio" element={<StudioMode />} />
        <Route path="/architect" element={<ArchitectMode />} />
        <Route path="*" element={<Navigate replace to="/guided" />} />
      </Routes>
    </AppShell>
  );
}
