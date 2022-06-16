import { Provider } from "react-redux";

import store from "@/config/store";

export default function Store(props) {
  return <Provider store={store}>{props.children}</Provider>;
}
