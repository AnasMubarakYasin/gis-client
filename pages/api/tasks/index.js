import tasks from "@/data/tasks";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const data = await tasks.load();

    res.status(200).json({ status: "success", data });
  } else {
    res.status(404).json({ status: "failed", message: "Not Found" });
  }
}
