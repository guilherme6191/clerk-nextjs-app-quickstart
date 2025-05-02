"use client";

import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import React from "react";
import useActiveOrg from "../components/hooks/useActiveOrg";
import DashboardNav from "../components/DashboardNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading, orgId } = useActiveOrg();

  console.log("active orgId", orgId);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex justify-between items-center p-4 bg-white border-b border-gray-200 shadow-sm">
        <h1 className="text-xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-4">
          {/* Auto-activate the user in their first organization if needed */}

          <OrganizationSwitcher />
          <UserButton />
        </div>
      </header>
      <main className="flex-1 p-6">
        <DashboardNav />
        {children}
      </main>
    </div>
  );
}
