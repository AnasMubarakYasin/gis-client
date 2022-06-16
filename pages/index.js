import Head from "next/head";
import Link from "next/link";

export default function Home(props) {
  return (
    <section>
      <h1>Home</h1>
      <nav>
        <Link href={"/admin"}>
          <a>Admin</a>
        </Link>
      </nav>
    </section>
  );
}
