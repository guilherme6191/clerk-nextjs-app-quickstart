"use client";

import { OrganizationProfile, useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
export default function OrganizationProfilePage() {
  const auth = useAuth();
  console.log("orgId", auth.orgId);
  console.log("auth", auth);

  if (!auth.orgId) {
    // redirect to /organization-switcher
    redirect("/organization-switcher");
  }
  return <OrganizationProfile />;
}
