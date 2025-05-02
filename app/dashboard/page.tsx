"use client";

import { useAuth } from "@clerk/nextjs";

export default function DashboardPage() {
  const { userId, orgId, orgRole } = useAuth();

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-medium mb-4">User Information</h2>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <p className="text-sm text-gray-500">User ID</p>
            <p className="font-medium">{userId}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Organization Status</p>
            {orgId ? (
              <div>
                <p className="font-medium">Active in organization: {orgId}</p>
                <p className="text-sm">Role: {orgRole}</p>
              </div>
            ) : (
              <p className="font-medium text-amber-600">
                No active organization selected
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 