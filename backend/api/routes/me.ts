import { Router, type IRouter } from "express";
import { db } from "../lib/db";

const router: IRouter = Router();

router.get("/me", (_req, res) => {
  res.json(db.currentUser);
});

export default router;
