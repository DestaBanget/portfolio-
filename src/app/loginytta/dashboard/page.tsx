import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { DashboardClient } from "@/components/admin/DashboardClient";

export default function DashboardPage() {
  if (!isAdminAuthenticated()) {
    redirect("/loginytta");
  }

  return <DashboardClient />;
}
