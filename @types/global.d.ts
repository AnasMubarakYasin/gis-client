import {} from "next";

declare global {
  namespace Client {
    namespace Store {
      interface User {
        storage: "session" | "local";
        token?: string;
        isFresh: boolean;
        isUninit: boolean;
        isLoggedIn: boolean;
        isLoggedOut: boolean;
        account?: Data.User;
      }
    }
    namespace Data {
      interface User {}
    }
  }
}
