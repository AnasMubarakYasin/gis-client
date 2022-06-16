import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method == "POST") {
    if (!req.headers["content-type"]?.startsWith("image")) {
      return res.status(400).json({ status: "failed", message: "Bad Type" });
    }
    const filename = `${Date.now()}.${req.headers["content-type"].substring(
      6
    )}`;
    const file_dir = path.join(process.cwd(), "public/images", filename);
    const stream = fs.createWriteStream(file_dir);

    req.pipe(stream);

    return new Promise((resolve, reject) => {
      stream.once("error", (error) => {
        res.status(500).json({ status: "failed", message: error.message });
        reject(error);
      });
      stream.once("finish", () => {
        res
          .status(201)
          .json({ status: "success", data: path.join("/images", filename) })
          .end();
        resolve();
      });
    });
  } else {
    res.status(404).json({ status: "failed", message: "Not Found" });
  }
}
