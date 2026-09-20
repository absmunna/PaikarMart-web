import { Request, Response } from "express";
import { LogisticsService } from "./logistics.service";

export class LogisticsController {
  static async registerVehicle(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const vehicle = await LogisticsService.registerVehicle(userId, req.body);
      res.json(vehicle);
    } catch (error) {
      res.status(500).json({ error: (error as any).message });
    }
  }

  static async updateStatus(req: Request, res: Response) {
    try {
      const { vehicleId, isOnline, location } = req.body;
      const status = await LogisticsService.updateAvailability(vehicleId, isOnline, location);
      res.json(status);
    } catch (error) {
      res.status(500).json({ error: (error as any).message });
    }
  }

  static async requestRide(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const ride = await LogisticsService.createRideRequest(userId, req.body);
      res.json(ride);
    } catch (error) {
      res.status(500).json({ error: (error as any).message });
    }
  }

  static async findNearby(req: Request, res: Response) {
    try {
      const { lat, lng, type } = req.query;
      const vehicles = await LogisticsService.getNearbyVehicles(
        Number(lat),
        Number(lng),
        type as string
      );
      res.json(vehicles);
    } catch (error) {
      res.status(500).json({ error: (error as any).message });
    }
  }

  static async trackShipment(req: Request, res: Response) {
    try {
      const trackingNo = req.params.trackingNo as string;
      const shipment = await LogisticsService.getShipmentByTracking(trackingNo);
      if (!shipment) return res.status(404).json({ error: "Shipment not found" });
      res.json(shipment);
    } catch (error) {
      res.status(500).json({ error: (error as any).message });
    }
  }
}
