import { Request, Response } from 'express';
import { IntelligenceService } from '../../services/intelligenceService';

export const getSystemIntelligence = async (req: Request, res: Response) => {
  try {
    const summary = await IntelligenceService.getPlatformSummary();
    res.status(200).json({
      status: 'success',
      data: summary
    });
  } catch (error) {
    console.error('[Intelligence Controller] Error fetching summary', error);
    res.status(500).json({ error: 'Failed to fetch platform intelligence summary' });
  }
};
