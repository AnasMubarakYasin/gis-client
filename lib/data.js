const fs = require("fs");

export default class DataMD {
  #raw;
  path = "";
  get data() {
    return this.#raw;
  }
  set data(v) {
    this.#raw = v;
  }
  constructor({ path, data }) {
    this.path = path;
    this.#raw = data;
  }
  serialize() {
    return new Promise((resolve, reject) => {
      if (this.path && this.#raw) {
        const content = JSON.stringify(this.#raw, null, "\t");
        const stream = fs.createWriteStream(this.path);
        stream.once("finish", () => {
          resolve();
        });
        stream.once("error", (err) => {
          reject(err);
        });
        stream.end(content);
      } else {
        reject(new Error("path or data not exist"));
      }
    });
  }
  parselize() {
    return new Promise((resolve, reject) => {
      if (this.path) {
        const stream = fs.createReadStream(this.path);
        const chunks = [];
        stream.on("readable", () => {
          let chunk;
          while (null != (chunk = stream.read())) {
            chunks.push(chunk);
          }
        });
        stream.once("end", () => {
          const content = chunks.join("");
          this.#raw = JSON.parse(content);
          resolve();
        });
        stream.once("error", (err) => {
          reject(err);
        });
      } else {
        reject(new Error("path or data not exist"));
      }
    });
  }
}
