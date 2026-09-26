import { Router, type IRouter } from "express";
import { prisma } from "../../config/database";
import { db, expandProduct, expandPost } from "../lib/db";

const router: IRouter = Router();

router.get("/vendors/nearby", async (req, res) => {
  const { area } = req.query as { area?: string };
  try {
    if (!process.env.DATABASE_URL) {
      let filtered = [...db.vendors];
      if (area) {
        filtered = filtered.filter(v => v.location.toLowerCase().includes(area.toLowerCase()));
      }
      return res.json(filtered.slice(0, 10));
    }
    const shops = await prisma.user.findMany({
      where: { 
        role: "seller"
      },
      take: 10
    });
    res.json(shops.map(s => ({
      id: s.id,
      name: s.name,
      fullName: s.name,
      email: s.email,
      role: s.role,
      location: area || "ঢাকা",
      verified: true
    })));
  } catch (err) {
    let filtered = [...db.vendors];
    if (area) {
      filtered = filtered.filter(v => v.location.toLowerCase().includes(area.toLowerCase()));
    }
    res.json(filtered.slice(0, 10));
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
