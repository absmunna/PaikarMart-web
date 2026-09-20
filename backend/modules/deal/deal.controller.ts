import { Request, Response } from "express";
import { DealService } from "./deal.service";

export class DealController {
  static async getExclusiveDeals(req: Request, res: Response) {
    try {
      const deals = await DealService.getActiveDeals();
      res.json(deals);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createDeal(req: Request, res: Response) {
    try {
      const sellerId = (req as any).user?.id;
      if (!sellerId) return res.status(401).json({ error: "Unauthorized" });
      
      const deal = await DealService.createDeal(req.body, sellerId);
      res.json(deal);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getMyDeals(req: Request, res: Response) {
    try {
      const sellerId = (req as any).user?.id;
      if (!sellerId) return res.status(401).json({ error: "Unauthorized" });
      
      const deals = await DealService.getSellerDeals(sellerId);
      res.json(deals);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getDealDetails(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const deal = await DealService.getDealById(id);
      if (!deal) return res.status(404).json({ error: "Deal not found" });
      res.json(deal);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
