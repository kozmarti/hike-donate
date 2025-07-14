import { redirect } from "next/navigation";
import { getSession, login, logout } from "@/lib/auth";
import "/styles/loginformstyle.css";

export default async function Page() {
  const session = await getSession();
  return (
    <section className="form-container-login" style={{ margin: "50px", border: "1px solid #ccc", padding: "20px", borderRadius: "8px" }}>
      {!session && (
        <>
      <h1 style={{ margin: "10px"}}> Please sign in </h1>
      <form
      className="form-container-login"
        action={async (formData) => {
          "use server";
          await login(formData);
          redirect("/activities");
        }}
      >
        <input type="text" name ="name" placeholder="name" />
        <input type="password" name ="password" placeholder="password" />

        <br />
        <button type="submit">Login</button>
      </form>
      </>)
}


      <form
        action={async () => {
          "use server";
          await logout();
          redirect("/login");
        }}
      >
        {session && 
        <>
        <h1 style={{ margin: "10px"}}> You are logged in </h1>
        <button type="submit">Logout</button>
        </>}
      </form>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </section>
  );
}