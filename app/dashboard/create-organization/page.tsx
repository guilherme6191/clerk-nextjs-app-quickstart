import { CreateOrganization } from "@clerk/nextjs";

export default function CreateOrganizationPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create Organization</h1>
      <div className="bg-white rounded-lg shadow">
        <CreateOrganization afterCreateOrganizationUrl="/dashboard/organization" />
      </div>
    </div>
  );
} 