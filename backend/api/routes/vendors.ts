import { Router, type IRouter } from "express";
import { prisma } from "@backend/config/database";
import { db, expandProduct, expandPost } from "@backend/api/lib/db";

const router: IRouter = Router();

router.get("/vendors/nearby", async (req, res) => {
  const { area } = req.query as { area?: string };
  try {
    const shops = await prisma.user.findMany({
      where: { 
        role: "seller", 
        addressArea: area || undefined 
      },
      take: 10
    });
    res.json(shops);
  } catch (err) {
    res.status(500).json({ error: "failed_to_fetch_nearby_shops" });
  }
});

router.get("/vendors", (req, res) => {
  const { type, q } = req.query as { type?: string; q?: string };
  let items = [...db.vendors];
  if (type) items = items.filter((v) => v.type === type);
  if (q) {
    const needle = q.toLowerCase();
    items = items.filter((v) => v.name.toLowerCase().includes(needle));
  }
  res.json(items);
});

router.get("/vendors/suggested", (_req, res) => {
  res.json([...db.vendors].sort((a, b) => b.followers - a.followers).slice(0, 4));
});

router.get("/vendors/:id", (req, res) => {
  const v = db.vendors.find((x) => x.id === req.params["id"]);
  if (!v) return res.status(404).json({ error: "not_found" });
  const products = db.products
    .filter((p) => p.vendorId === v.id)
    .map(expandProduct);
  const recentPosts = db.posts
    .filter((p) => p.authorId === v.id)
    .map(expandPost);
  res.json({ ...v, products, recentPosts });
});

export default router;
