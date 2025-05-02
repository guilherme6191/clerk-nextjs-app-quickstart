"use client";

import { useAuth, useClerk, useOrganizationList } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function useActiveOrg() {
  const { orgId } = useAuth();
  const { setActive } = useClerk();
  const { userMemberships, isLoaded } = useOrganizationList({
    userMemberships: true,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Skip if not loaded yet, or if user is already active in an organization
    if (!isLoaded || orgId) {
      setLoading(false);
      return;
    }

    // Check if the user has organization memberships but is not active in any
    if (userMemberships?.data.length) {
      const firstOrg = userMemberships.data[0].organization;

      // Set the user active in the first organization they're a member of
      console.log(`Setting user active in organization: ${firstOrg.name}`);
      setActive({ organization: firstOrg.id })
        .then(() => {
          console.log(`User is now active in organization: ${firstOrg.name}`);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Failed to set active organization:", error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [isLoaded, orgId, userMemberships, setActive]);

  return { loading, orgId };
}
