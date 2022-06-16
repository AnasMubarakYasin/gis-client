import db_members from "@/data/members";
import { nanoid } from "@reduxjs/toolkit";

export default async function handler(req, res) {
  if (req.method == "GET") {
    const members = await db_members.load();

    res.status(200).json({ status: "success", data: members });
  } else if (req.method == "POST") {
    const payload = req.body;
    const members = await db_members.load();

    payload.id = nanoid();
    members.push(payload);
    db_members.save(members);
    res.status(201).json({ status: "success", data: members });
  } else if (req.method == "PUT") {
    const payload = req.body;
    const members = await db_members.load();

    members.push(...payload);
    db_members.save(members);
    res.status(200).json({ status: "success" });
  } else if (req.method == "DELETE") {
    const indexs = [];
    const payload = req.body;
    const members = await db_members.load();
    for (const id of payload) {
      const index = members.findIndex((item) => item.id == id);
      if (index != -1) {
        indexs.push(index);
      } else {
        res.status(400).json({
          status: "failed",
          message: `Data Index ${index} Not Exists`,
        });
        return;
      }
    }
    const removed = [];
    let count = 0;
    for (const index of indexs) {
      const [member] = members.splice(index - count++, 1);
      removed.push(member);
    }
    db_members.save(members);
    res.status(200).json({ status: "success", data: removed });
  } else {
    res.status(404).json({ status: "failed", message: "Not Found" });
  }
}
