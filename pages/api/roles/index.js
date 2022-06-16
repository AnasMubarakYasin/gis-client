import db_roles from "@/data/roles";
import { nanoid } from "@reduxjs/toolkit";

export default async function handler(req, res) {
  if (req.method == "GET") {
    const roles = await db_roles.load();

    res.status(200).json({ status: "success", data: roles });
  } else if (req.method == "POST") {
    const payload = req.body;
    const roles = await db_roles.load();

    payload.id = nanoid();
    roles.push(payload);
    db_roles.save(roles);
    res.status(201).json({ status: "success", data: roles });
  } else if (req.method == "PUT") {
    const payload = req.body;
    const roles = await db_roles.load();

    roles.push(...payload);
    db_roles.save(roles);
    res.status(200).json({ status: "success" });
  } else if (req.method == "DELETE") {
    const indexs = [];
    const payload = req.body;
    const roles = await db_roles.load();
    for (const id of payload) {
      const index = roles.findIndex((item) => item.id == id);
      if (index != -1) {
        indexs.push(index);
      } else {
        res.status(400).json({
          status: "failed",
          message: `Data Offset ${index} Not Exists`,
        });
        return;
      }
    }
    const removed = [];
    let count = 0;
    for (const index of indexs) {
      const [role] = roles.splice(index - count++, 1);
      removed.push(role);
    }
    db_roles.save(roles);
    res.status(200).json({ status: "success", data: removed });
  } else {
    res.status(404).json({ status: "failed", message: "Not Found" });
  }
}
