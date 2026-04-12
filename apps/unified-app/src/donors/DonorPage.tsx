import type { DonorId } from "@/donors/config";
import { DonorSubappHost } from "@/donors/DonorSubappHost";

export function DonorPage({ donor }: { donor: DonorId }) {
  return <DonorSubappHost donor={donor} />;
}
