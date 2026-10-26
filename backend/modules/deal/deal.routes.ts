import { Router } from "express";
import { DealController } from "./deal.controller";

const router = Router();

router.get("/exclusive", DealController.getExclusiveDeals);
router.get("/my-deals", DealController.getMyDeals);
router.post("/exclusive", DealController.createDeal);
router.get("/exclusive/:id", DealController.getDealDetails);

export const dealRoutes = router;
