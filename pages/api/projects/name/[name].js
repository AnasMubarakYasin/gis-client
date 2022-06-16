import db_projects from "@/data/projects";
import db_tasks from "@/data/tasks";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { name, with: qrWith } = req.query;
    const projects = await db_projects.load();
    const project = projects.find((item) => item.name == name);

    if (project && qrWith) {
      const tasks = await db_tasks.load();
      project.tasks = tasks.find((item) => item.id == project.id)?.value ?? [];
    }

    res.status(200).json({ status: "success", data: project });
  } else {
    res.status(404).json({ status: "failed", message: "Not Found" });
  }
}
