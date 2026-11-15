import { Router } from 'express';
import type { Request, Response } from 'express';
import { requireFirebaseAuth } from '../middleware/requireFirebaseAuth.js';
import { supabaseAdmin } from '../services/dbService.js';

export const authRouter = Router();

function requireAdminDatabase(res: Response): boolean {
  if (supabaseAdmin) return true;
  res.status(503).json({ error: 'Profile database synchronization is not configured.' });
  return false;
}

authRouter.get('/profile', requireFirebaseAuth, async (_req: Request, res: Response) => {
  if (!requireAdminDatabase(res)) return;
  const uid = res.locals.auth.uid;
  const { data, error } = await supabaseAdmin!
    .from('profiles')
    .select('*, vendor_memberships(*, stores(*))')
    .eq('auth_uid', uid)
    .maybeSingle();
  if (error) {
    res.status(500).json({ error: 'Unable to load the authenticated profile.' });
    return;
  }
  res.json({ success: true, profile: data || null });
});

authRouter.put('/profile', requireFirebaseAuth, async (req: Request, res: Response) => {
  if (!requireAdminDatabase(res)) return;
  const uid = res.locals.auth.uid;
  const email = String(res.locals.auth.email || req.body?.email || '').trim().slice(0, 160);
  const name = String(req.body?.name || 'PaikarMart User').trim().slice(0, 100);
  const handle = String(req.body?.handle || email.split('@')[0] || `user_${uid.slice(0, 8)}`)
    .toLowerCase().replace(/[^a-z0-9_]/g, '_').slice(0, 64);
  const avatarUrl = String(req.body?.avatar || '').trim().slice(0, 512) || null;
  const location = String(req.body?.location || 'Dhaka, Bangladesh').trim().slice(0, 120);

  const existing = await supabaseAdmin!.from('profiles').select('id, role, active_roles').eq('auth_uid', uid).maybeSingle();
  if (existing.error) {
    res.status(500).json({ error: 'Unable to check the authenticated profile.' });
    return;
  }

  const payload: Record<string, unknown> = existing.data
    ? { name, handle, avatar_url: avatarUrl, location, updated_at: new Date().toISOString() }
    : {
        auth_uid: uid,
        email: email || `firebase_${uid.slice(0, 12)}@paikarmart.local`,
        name,
        handle,
        avatar_url: avatarUrl,
        role: 'consumer',
        active_roles: ['consumer'],
        location,
        trust_level: 1,
        wallet_balance: 0,
        reward_points: 0,
        is_verified: Boolean(res.locals.auth.emailVerified),
      };

  const result = existing.data
    ? await supabaseAdmin!.from('profiles').update(payload).eq('auth_uid', uid).select().single()
    : await supabaseAdmin!.from('profiles').insert(payload).select().single();
  if (result.error) {
    res.status(result.error.code === '23505' ? 409 : 500).json({ error: 'Unable to save the authenticated profile.' });
    return;
  }
  res.json({ success: true, profile: result.data });
});
