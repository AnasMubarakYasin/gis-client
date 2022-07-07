import db_members from "@/data/members";

export default async function handler(req, res) {
  if (req.method == "PATCH") {
    const { id } = req.query;
    const payload = req.body;
    const members = await db_members.load();
    const member = members.find((item) => item.id == id);

    if (member) {
      const copy = Object.create(member);

      Object.assign(member, payload);

      db_members.save(members);

      res.status(200).json({ status: "success", data: copy });
    } else {
      res.status(404).json({ status: "failed", message: "Data Not Exists" });
    }
  } else if (req.method == "DELETE") {
    const { id } = req.query;
    const members = await db_members.load();
    const index = members.findIndex((item) => item.id == id);
    if (index == -1) {
      res.status(404).json({ status: "failed", message: "Data Not Exists" });
    }
    const removed = members.splice(index, 1);

    db_members.save(members);

    res.status(200).json({ status: "success", data: removed });
  } else {
    res.status(404).json({ status: "failed", message: "Not Found" });
  }
}
