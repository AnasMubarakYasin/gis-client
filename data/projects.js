import path from "path";
import DataMD from "@/lib/data";

const data_md = new DataMD({
  path: path.join(process.cwd(), "data/projects.json"),
  data: [],
});

async function load() {
  await data_md.parselize();
  return data_md.data;
}

async function save(data) {
  data_md.data = data;
  await data_md.serialize();
}

export default {
  load,
  save,
};
