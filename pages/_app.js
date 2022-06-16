import "@/styles/globals.css";
import Theme from "@/layout/Theme";
import Store from "@/layout/Store";

export default function App({ Component, pageProps }) {
  return (
    <Theme>
      <Store>
        <Component {...pageProps}></Component>
      </Store>
    </Theme>
  );
}
