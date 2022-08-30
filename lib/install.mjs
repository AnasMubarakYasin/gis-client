import { promises, constants } from "fs";

promises
  .access(".env", constants.W_OK)
  .then(() => {
    console.log(".env already exist");
  })
  .catch(() => {
    return promises.copyFile(".env.example", ".env")
  })
  .then(() => {
    console.log("success create .env");
  })
  .catch((error) => {
    console.error(new Error("failed create .env", { cause: error }));
  });
