import { Navigate, Route, Routes, useParams } from "react-router-dom";
import { AppShell } from "@/shell/AppShell";
import { TaxonomyPage } from "@/taxonomy/TaxonomyPage";
import {
  defaultRouteForFamily,
  getTaxonomyDefinition,
  isTaxonomyFamily,
  LEGACY_ROUTE_MAP,
  type TaxonomyFamily
} from "@/taxonomy/config";

function PublicRoute() {
  const { tab } = useParams();
  return <TaxonomyPage family="role" tab={tab ?? getTaxonomyDefinition("role").defaultTab} />;
}

function PrototypeRoute() {
  const { family, tab } = useParams();
  if (!family || !isTaxonomyFamily(family)) {
    return <Navigate replace to={defaultRouteForFamily("role")} />;
  }
  return <TaxonomyPage family={family as TaxonomyFamily} tab={tab ?? getTaxonomyDefinition(family as TaxonomyFamily).defaultTab} />;
}

function LegacyRedirect({ legacy }: { legacy: keyof typeof LEGACY_ROUTE_MAP }) {
  return <Navigate replace to={LEGACY_ROUTE_MAP[legacy]} />;
}

export function AppRoutes() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Navigate replace to="/world" />} />
        <Route path="/guided" element={<LegacyRedirect legacy="guided" />} />
        <Route path="/studio" element={<LegacyRedirect legacy="studio" />} />
        <Route path="/architect" element={<LegacyRedirect legacy="architect" />} />
        <Route path="/prototype/:family/:tab?" element={<PrototypeRoute />} />
        <Route path="/:tab" element={<PublicRoute />} />
        <Route path="*" element={<Navigate replace to="/world" />} />
      </Routes>
    </AppShell>
  );
}
