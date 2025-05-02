"use client";

import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardNav() {
  const { orgId } = useAuth();
  const pathname = usePathname();

  const routes = [
    {
      name: "Dashboard",
      href: "/dashboard",
    },
    {
      name: "My Organizations",
      href: "/dashboard/organizations",
    },
    {
      name: "Create Organization",
      href: "/dashboard/create-organization",
    },
    {
      name: "Organization Profile",
      href: "/dashboard/organization",
      // Only show when a user has an active organization
      hidden: !orgId,
    },
    {
      name: "Auth Output",
      href: "/dashboard/auth-output",
    },
  ];

  return (
    <nav className="bg-white shadow-sm rounded-lg p-4 mb-6">
      <ul className="flex flex-wrap gap-4">
        {routes
          .filter((route) => !route.hidden)
          .map((route) => (
            <li key={route.href}>
              <Link
                href={route.href}
                className={`px-4 py-2 rounded-md ${
                  pathname === route.href
                    ? "bg-blue-100 text-blue-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {route.name}
              </Link>
            </li>
          ))}
      </ul>
    </nav>
  );
} 