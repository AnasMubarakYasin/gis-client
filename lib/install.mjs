import { promises } from "fs";

promises
  .copyFile(".env.example", ".env")
  .then(() => {
    console.log("success create .env");
  })
  .catch((error) => {
    console.error(new Error("failed create .env", { cause: error }));
  });
