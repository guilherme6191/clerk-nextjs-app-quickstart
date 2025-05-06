import AddTaskForm from "./AddTaskForm";
import { createServerSupabaseClient } from "./client";

export default async function Home() {
  // Use the custom Supabase client you created
  const client = createServerSupabaseClient();

  // Query the 'tasks' table to render the list of tasks
  const { data, error } = await client.from("tasks").select();
  if (error) {
    throw error;
  }
  const tasks = data;

  return (
    <div>
      <h1>Tasks</h1>

      <div>
        {tasks?.map((task: any) => (
          <p key={task.id}>{task.name}</p>
        ))}
      </div>

      <AddTaskForm />
    </div>
  );
}

/**
 Create a table to enable RLS on. Open Supabase's SQL editor and run the following queries. This example creates a tasks table with a user_id column that maps to a Clerk user ID.

-- Create a "tasks" table with a user_id column that maps to a Clerk user ID
create table tasks(
  id serial primary key,
  name text not null,
  user_id text not null default auth.jwt()->>'sub'
);

-- Enable RLS on the table
alter table "tasks" enable row level security;
Create two policies that restrict access to the tasks table based on the requesting user's Clerk ID. These policies allow users to create tasks for themselves and view their own tasks.

create policy "User can view their own tasks"
on "public"."tasks"
for select
to authenticated
using (
((select auth.jwt()->>'sub') = (user_id)::text)
);

create policy "Users must insert their own tasks"
on "public"."tasks"
as permissive
for insert
to authenticated
with check (
((select auth.jwt()->>'sub') = (user_id)::text)
);
 */
