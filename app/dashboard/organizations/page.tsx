"use client";

import { OrganizationList } from "@clerk/nextjs";

export default function OrganizationListPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Organizations</h1>
      <div className="bg-white rounded-lg shadow">
        <OrganizationList 
          afterCreateOrganizationUrl="/dashboard/organization"
          afterSelectOrganizationUrl="/dashboard"
          afterSelectPersonalUrl="/dashboard"
        />
      </div>
    </div>
  );
} 