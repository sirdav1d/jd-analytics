import "server-only";
import { revalidatePath, revalidateTag } from "next/cache";
import { revalidateSalesCaches } from "@/services/linx/sync-runtime";

export function revalidatePublishedDataSync() {
  revalidateSalesCaches();
  revalidateTag("marketing-goals-google-ads-current", { expire: 0 });
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/goals-marketing");
  revalidatePath("/dashboard/meta-investments");
  revalidatePath("/marketing-report/current");
}
