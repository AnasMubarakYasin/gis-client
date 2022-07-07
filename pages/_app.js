import "@/styles/globals.css";
import Theme from "@/layout/Theme";
import Store from "@/layout/Store";

export default function App({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page);
  return (
    <Theme>
      <Store>{getLayout(<Component {...pageProps}></Component>)}</Store>
    </Theme>
  );
}
