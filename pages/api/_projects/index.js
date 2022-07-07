import db_projects from "@/data/projects";
import db_tasks from "@/data/tasks";
import { nanoid } from "@reduxjs/toolkit";

export default async function handler(req, res) {
  switch (req.method) {
    case "GET": {
      const projects = await db_projects.load();

      res.status(200).json({ status: "success", data: projects });
      break;
    }

    case "POST": {
      const payload = req.body;
      const projects = await db_projects.load();
      const tasks = await db_tasks.load();

      payload.id = nanoid();
      tasks.push({ id: payload.id, value: [] });
      projects.push(payload);
      db_projects.save(projects);
      db_tasks.save(tasks);

      res.status(201).json({ status: "success" });
      break;
    }

    default: {
      res.status(404).json({ status: "failed", message: "Not Found" });

      break;
    }
  }
}
