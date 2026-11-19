import { Router } from "express";
import { LogisticsController } from "./logistics.controller";
import { requireAuth } from "../../middleware/auth";

const router = Router();

router.post("/vehicles", requireAuth, LogisticsController.registerVehicle);
router.post("/status", requireAuth, LogisticsController.updateStatus);
router.post("/rides", requireAuth, LogisticsController.requestRide);
router.get("/nearby", LogisticsController.findNearby);
router.get("/track/:trackingNo", LogisticsController.trackShipment);

export default router;
