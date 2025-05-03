import { redirect } from "next/navigation";
import { getSession, login, logout } from "@/lib/auth";
import "/styles/formstyle.css";

export default async function Page() {
  const session = await getSession();
  return (
    <section>
      <form
        action={async (formData) => {
          "use server";
          await login(formData);
          redirect("/activity");
        }}
      >
        <input type="text" name ="name" placeholder="name" />
        <input type="password" name ="password" />

        <br />
        <button type="submit">Login</button>
      </form>


      <form
        action={async () => {
          "use server";
          await logout();
          redirect("/login");
        }}
      >
        <button type="submit">Logout</button>
      </form>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </section>
  );
}