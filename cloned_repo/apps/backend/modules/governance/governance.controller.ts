import { Request, Response } from 'express';
import { GovernanceService } from '../../services/governanceService';

export const getModerationQueue = async (req: Request, res: Response) => {
  try {
    const flagged = await GovernanceService.getFlaggedContent();
    res.status(200).json({ status: 'success', data: flagged });
  } catch (error) {
    console.error('[Governance Controller] Error fetching moderation queue', error);
    res.status(500).json({ error: 'Failed to fetch moderation queue' });
  }
};
