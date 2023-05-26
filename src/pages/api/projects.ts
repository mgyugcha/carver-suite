// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getDatabase } from "@/assets/database";
import { Project } from "@/types/Projects";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const db = await getDatabase();
  if (req.method === "POST") {
    const sql = "INSERT INTO recover(titulo) VALUES(?)";
    await new Promise<void>((resolve, reject) => {
      const { titulo } = req.body;
      db.run(sql, [titulo], function (error) {
        if (error) return reject(error);
        res.status(200).json({ id: this.lastID });
        resolve();
      });
    });
  } else if (req.method === "GET") {
    const sql = "SELECT id, titulo FROM recover";
    await new Promise<void>((resolve, reject) => {
      db.all<Project>(sql, (error, rows) => {
        if (error) return reject(error);
        res.status(200).json(rows || []);
        resolve();
      });
    });
  } else if (req.method === "DELETE") {
    const sql = "DELETE FROM recover WHERE id=?";
    await new Promise<void>((resolve, reject) => {
      db.run(sql, [req.query.id], (error) => {
        if (error) return reject(error);
        res.send("success");
        resolve();
      });
    });
  } else {
    res.status(200).json({ name: "John Doe" });
  }
}
