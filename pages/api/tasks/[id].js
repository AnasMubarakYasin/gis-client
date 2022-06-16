import tasks from "@/data/tasks";

export default async function handler(req, res) {
  if (req.method === "PATCH") {
    const { id } = req.query;
    const payload = req.body;
    const data = await tasks.load();
    const result = data.find((item) => item.id == id);

    if (result) {
      Object.assign(result, { value: payload });

      tasks.save(data);

      res.status(200).json({ status: "success", data: result });
    } else {
      res.status(404).json({ status: "failed", message: "Data Not Exists." });
    }
  } else {
    res.status(404).json({ status: "failed", message: "Not Found" });
  }
}
