import { Router, type IRouter } from "express";

const router: IRouter = Router();

// Mock logistics state for development
const mockLogisticsData = [
  { id: "1", trackingNumber: "LG123", status: "In Transit", location: "Dhaka" },
  { id: "2", trackingNumber: "LG456", status: "Delivered", location: "Chittagong" },
];

router.get("/api/v1/logistics", (_req, res) => {
  res.json({ data: mockLogisticsData });
});

router.post("/api/v1/logistics", (req, res) => {
  const newDelivery = req.body;
  mockLogisticsData.push(newDelivery);
  res.status(201).json({ data: newDelivery });
});

export default router;
