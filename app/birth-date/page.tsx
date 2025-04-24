import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

async function updateBirthDate(formData: FormData) {
  "use server";

  const client = await clerkClient();
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Not authenticated");
  }

  const birthDate = formData.get("birthDate");
  if (!birthDate) {
    throw new Error("Birth date is required");
  }

  try {
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        birthDate,
      },
    });
  } catch (error) {
    console.error(error);
  }

  redirect("/birth-date");
}

export default async function BirthDatePage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="max-w-md w-full p-8 bg-gray-800 rounded-lg shadow-2xl border border-gray-700">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Set Your Birth Date
        </h1>
        <form action={updateBirthDate} className="space-y-6">
          <div>
            <label
              htmlFor="birthDate"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Birth Date
            </label>
            <input
              type="date"
              id="birthDate"
              name="birthDate"
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:ring-2 transition-all py-2 px-3"
              required
              defaultValue={user.publicMetadata.birthDate as string}
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 ease-in-out transform hover:scale-[1.02]"
          >
            Save Birth Date
          </button>
          <Link
            href="/"
            className="w-full flex justify-center py-3 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200 ease-in-out transform hover:scale-[1.02]"
          >
            Back to home
          </Link>
        </form>
      </div>
    </div>
  );
}
