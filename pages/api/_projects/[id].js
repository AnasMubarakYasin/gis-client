import fs from "fs";
import path from "path";
import db_projects from "@/data/projects";

export default async function handler(req, res) {
  if (req.method === "PATCH") {
    const { id } = req.query;
    const payload = req.body;
    const projects = await db_projects.load();
    const project = projects.find((item) => item.id == id);

    Object.assign(project, payload);

    db_projects.save(projects);

    res.status(200).json({ status: "success" });
  } else if (req.method === "DELETE") {
    const { id } = req.query;
    const projects = await db_projects.load();
    const index = projects.findIndex((item) => item.id == id);
    const project = projects.splice(index, 1);
    const image = path.join(process.cwd(), "public", project[0].image);

    if (!project) {
      res.status(404).json({ status: "failed", message: "Data Not Exists" });
    }

    fs.stat(image, (err, stats) => {
      if (stats.isFile(image)) {
        fs.rm(image);
      }
    });

    db_projects.save(projects);

    res.status(200).json({ status: "success" });
  } else {
    res.status(404).json({ status: "failed", message: "Not Found" });
  }
}
