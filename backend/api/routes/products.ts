import { Router, type IRouter } from "express";
import { db, expandProduct, genId } from "@backend/api/lib/db";

const router: IRouter = Router();

router.get("/products", (req, res) => {
  const { q, categoryId, vendorId, type, sort, limit } = req.query as Record<
    string,
    string
  >;
  let items = [...db.products];
  if (categoryId) {
    const cleanId = categoryId.replace(/^c/, "");
    items = items.filter((p) => {
      const pCleanId = p.categoryId?.replace(/^c/, "");
      return pCleanId === cleanId || p.categoryId === categoryId;
    });
  }
  if (vendorId) items = items.filter((p) => p.vendorId === vendorId);
  if (type) items = items.filter((p) => p.type === type);
  if (q) {
    const needle = q.toLowerCase();
    items = items.filter(
      (p) =>
        p.title.toLowerCase().includes(needle) ||
        p.description.toLowerCase().includes(needle) ||
        (p.tags ?? []).some((t) => t.toLowerCase().includes(needle)),
    );
  }
  switch (sort) {
    case "newest":
      items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      break;
    case "price_asc":
      items.sort((a, b) => a.price - b.price);
      break;
    case "price_desc":
      items.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      items.sort((a, b) => b.rating - a.rating);
      break;
    default:
      items.sort((a, b) => b.reviewCount - a.reviewCount);
  }
  if (limit) items = items.slice(0, Number(limit));
  res.json(items.map(expandProduct));
});

router.get("/products/trending", (_req, res) => {
  const items = [...db.products]
    .sort((a, b) => b.reviewCount - a.reviewCount)
    .slice(0, 6)
    .map(expandProduct);
  res.json(items);
});

router.get("/products/:id", (req, res) => {
  const p = db.products.find((x) => x.id === req.params["id"]);
  if (!p) return res.status(404).json({ error: "not_found" });
  res.json(expandProduct(p));
});

router.post("/products", (req, res) => {
  const { title, description, price, type, categoryId, images, stock, tags } =
    req.body ?? {};
  if (!title || !categoryId) return res.status(400).json({ error: "invalid" });
  const p = {
    id: genId("p"),
    title,
    description: description ?? "",
    price: Number(price) || 0,
    currency: "BDT",
    images: images ?? [],
    stock: Number(stock) || 0,
    vendorId: db.vendors[0]?.id ?? "v1",
    categoryId,
    rating: 0,
    reviewCount: 0,
    type: type ?? "retail",
    location: db.currentUser.location,
    tags: tags ?? [],
    createdAt: new Date().toISOString(),
  };
  db.products.unshift(p);
  const c = db.categories.find((x) => x.id === categoryId);
  if (c) c.productCount++;
  res.status(201).json(expandProduct(p));
});

export default router;
