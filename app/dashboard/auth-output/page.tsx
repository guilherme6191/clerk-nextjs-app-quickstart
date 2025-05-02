"use client";

import { useAuth } from "@clerk/nextjs";

import { useOrganizationList } from "@clerk/nextjs";

export default function AuthOutputPage() {
  const auth = useAuth();
  const { userMemberships, isLoaded } = useOrganizationList({
    userMemberships: true,
  });

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Auth Output</h1>

      <div className="grid grid-cols-1 gap-6">
        <div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-4">Client-side useAuth()</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm max-h-96">
              {JSON.stringify(auth, null, 2)}
            </pre>

            <h3 className="text-md font-medium mt-6 mb-2">
              Organization Memberships
            </h3>
            <div className="bg-gray-100 p-4 rounded overflow-auto text-sm">
              {isLoaded ? (
                userMemberships?.data?.length ? (
                  <div>
                    <p className="mb-2">
                      Member of {userMemberships.data.length} organization(s):
                    </p>
                    <ul className="list-disc pl-5">
                      {userMemberships.data.map((membership) => (
                        <li key={membership.organization.id}>
                          {membership.organization.name} (Role:{" "}
                          {membership.role})
                        </li>
                      ))}
                    </ul>
                    <p className="mt-4 text-gray-600">
                      Note: Having a membership doesn't automatically set an
                      organization as active. The user must select it with{" "}
                      <code>OrganizationSwitcher</code> or via code using{" "}
                      <code>setActive</code>.
                    </p>
                  </div>
                ) : (
                  <p>Not a member of any organizations.</p>
                )
              ) : (
                <p>Loading organization memberships...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
