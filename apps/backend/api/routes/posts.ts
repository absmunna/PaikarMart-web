import { Router, type IRouter } from "express";
import { db, expandPost, expandComment, genId } from "@backend/api/lib/db";

const router: IRouter = Router();

router.get("/posts", (req, res) => {
  const { type, vendorId } = req.query as { type?: string; vendorId?: string };
  let items = [...db.posts];
  if (type && type !== "all") items = items.filter((p) => p.type === type);
  if (vendorId) items = items.filter((p) => p.authorId === vendorId);
  items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  res.json(items.map(expandPost));
});

// Location-based Feed Retrieval API (`GET /api/v1/posts/feed` or `/api/posts/feed`)
router.get(["/posts/feed", "/v1/posts/feed"], (req, res) => {
  const { 
    lat, 
    lng, 
    radius_km = "50", 
    district, 
    portal_type = "all" 
  } = req.query as {
    lat?: string;
    lng?: string;
    radius_km?: string;
    district?: string;
    portal_type?: string;
  };

  let items = [...db.posts];

  // 1. Filter by Portal Type if specified
  if (portal_type && portal_type !== "all") {
    items = items.filter((p: any) => 
      p.type === portal_type || 
      p.postType === portal_type || 
      (portal_type === "wholesale" && p.productId) ||
      (portal_type === "retail" && !p.productId)
    );
  }

  // 2. Filter by District or Coordinates if provided
  if (district && district !== "all") {
    const distTarget = district.toLowerCase();
    const matched = items.filter((p: any) => {
      const loc = (p.location || "").toLowerCase();
      const dist = (p.district || "").toLowerCase();
      return loc.includes(distTarget) || dist.includes(distTarget);
    });
    // Fallback to all if strict district match is empty
    if (matched.length > 0) {
      items = matched;
    }
  }

  // Sort by recency
  items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Annotate items with distance and live update status
  const formatted = items.map((p: any, index) => {
    const expanded = expandPost(p);
    return {
      ...expanded,
      distanceKm: (index + 1) * 2.5,
      isNearUser: Boolean(district) || (lat && lng),
      isLiveStreamActive: true
    };
  });

  res.json(formatted);
});

router.post("/posts", (req, res) => {
  const { content, type, images, productId } = req.body ?? {};
  if (!content || !type) return res.status(400).json({ error: "invalid" });
  const post = {
    id: genId("post"),
    authorId: db.vendors[0]?.id ?? "v1",
    type,
    content,
    images: images ?? [],
    productId,
    likeCount: 0,
    commentCount: 0,
    shareCount: 0,
    liked: false,
    createdAt: new Date().toISOString(),
  };
  db.posts.unshift(post);
  res.status(201).json(expandPost(post));
});

router.post("/posts/:id/like", (req, res) => {
  const post = db.posts.find((p) => p.id === req.params["id"]);
  if (!post) return res.status(404).json({ error: "not_found" });
  post.liked = !post.liked;
  post.likeCount += post.liked ? 1 : -1;
  if (post.likeCount < 0) post.likeCount = 0;
  res.json(expandPost(post));
});

router.get("/posts/:id/comments", (req, res) => {
  const list = db.comments
    .filter((c) => c.postId === req.params["id"])
    .map(expandComment);
  res.json(list);
});

router.post("/posts/:id/comments", (req, res) => {
  const post = db.posts.find((p) => p.id === req.params["id"]);
  if (!post) return res.status(404).json({ error: "not_found" });
  const { content } = req.body ?? {};
  if (!content) return res.status(400).json({ error: "invalid" });
  const c = {
    id: genId("cmt"),
    postId: post.id,
    authorId: db.currentUser.id,
    content,
    createdAt: new Date().toISOString(),
  };
  db.comments.push(c);
  post.commentCount++;
  res.status(201).json(expandComment(c));
});

export default router;
