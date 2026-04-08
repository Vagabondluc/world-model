import { Navigate, Route, Routes, useParams } from "react-router-dom";
import { DonorComparePage } from "@/donors/DonorComparePage";
import { DonorPage } from "@/donors/DonorPage";
import { UnifiedLandingPage } from "@/product/UnifiedLandingPage";
import { isDonorId, type DonorId } from "@/donors/config";
import { AppShell } from "@/shell/AppShell";
import { TaxonomyComparePage } from "@/taxonomy/TaxonomyComparePage";
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

function DonorRoute() {
  const { donor } = useParams();
  if (!donor || !isDonorId(donor)) {
    return <Navigate replace to="/compare/donors" />;
  }
  return <DonorPage donor={donor as DonorId} />;
}

export function AppRoutes() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<UnifiedLandingPage />} />
        <Route path="/compare/donors" element={<DonorComparePage />} />
        <Route path="/compare" element={<TaxonomyComparePage />} />
        <Route path="/donor/:donor" element={<DonorRoute />} />
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
