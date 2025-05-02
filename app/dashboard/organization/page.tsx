import { OrganizationProfile } from "@clerk/nextjs";

export default function OrganizationProfilePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Organization Profile</h1>
      <div className="bg-white rounded-lg shadow">
        <OrganizationProfile />
      </div>
    </div>
  );
} 