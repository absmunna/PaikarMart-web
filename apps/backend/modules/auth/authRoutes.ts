import { Router } from 'express';
import type { Request, Response } from 'express';
import { requireFirebaseAuth } from '../../middleware/requireFirebaseAuth.js';
import { supabaseAdmin } from '../../services/dbService.js';

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
  const phone = String(req.body?.phone || '').trim().slice(0, 32) || null;

  const existing = await supabaseAdmin!.from('profiles').select('id, role, active_roles').eq('auth_uid', uid).maybeSingle();
  if (existing.error) {
    res.status(500).json({ error: 'Unable to check the authenticated profile.' });
    return;
  }

  const payload: Record<string, unknown> = existing.data
    ? { name, handle, avatar_url: avatarUrl, location, phone, updated_at: new Date().toISOString() }
    : {
        auth_uid: uid,
        email: email || `firebase_${uid.slice(0, 12)}@paikarmart.local`,
        name,
        handle,
        avatar_url: avatarUrl,
        role: 'consumer',
        active_roles: ['consumer'],
        location,
        phone,
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

async function profileIdForUid(uid: string): Promise<string | null> {
  const result = await supabaseAdmin!.from('profiles').select('id').eq('auth_uid', uid).maybeSingle();
  return result.data?.id || null;
}

authRouter.get('/addresses', requireFirebaseAuth, async (_req: Request, res: Response) => {
  if (!requireAdminDatabase(res)) return;
  const profileId = await profileIdForUid(res.locals.auth.uid);
  if (!profileId) { res.status(404).json({ error: 'Profile not found.' }); return; }
  const result = await supabaseAdmin!.from('saved_addresses').select('*').eq('profile_id', profileId).order('is_default', { ascending: false }).order('created_at', { ascending: false });
  if (result.error) { res.status(500).json({ error: 'Unable to load saved addresses.' }); return; }
  res.json({ success: true, addresses: result.data || [] });
});

authRouter.post('/addresses', requireFirebaseAuth, async (req: Request, res: Response) => {
  if (!requireAdminDatabase(res)) return;
  const profileId = await profileIdForUid(res.locals.auth.uid);
  if (!profileId) { res.status(404).json({ error: 'Profile not found.' }); return; }
  const body = req.body || {};
  const payload = {
    profile_id: profileId,
    label: String(body.label || 'Home').slice(0, 80),
    recipient_name: String(body.recipientName || '').slice(0, 100),
    phone: String(body.phone || '').slice(0, 32),
    street_address: String(body.streetAddress || '').slice(0, 240),
    apartment: body.apartment ? String(body.apartment).slice(0, 100) : null,
    city: String(body.city || '').slice(0, 80),
    postal_code: body.postalCode ? String(body.postalCode).slice(0, 20) : null,
    tag: ['home', 'office', 'other'].includes(body.tag) ? body.tag : 'home',
    is_default: Boolean(body.isDefault),
    notes: body.notes ? String(body.notes).slice(0, 300) : null,
  };
  if (!payload.recipient_name || !payload.phone || !payload.street_address || !payload.city) {
    res.status(400).json({ error: 'Recipient, phone, street address, and city are required.' });
    return;
  }
  if (payload.is_default) await supabaseAdmin!.from('saved_addresses').update({ is_default: false }).eq('profile_id', profileId);
  const result = await supabaseAdmin!.from('saved_addresses').insert(payload).select().single();
  if (result.error) { res.status(500).json({ error: 'Unable to save address.' }); return; }
  res.status(201).json({ success: true, address: result.data });
});

authRouter.delete('/addresses/:id', requireFirebaseAuth, async (req: Request, res: Response) => {
  if (!requireAdminDatabase(res)) return;
  const profileId = await profileIdForUid(res.locals.auth.uid);
  if (!profileId) { res.status(404).json({ error: 'Profile not found.' }); return; }
  const result = await supabaseAdmin!.from('saved_addresses').delete().eq('id', req.params.id).eq('profile_id', profileId);
  if (result.error) { res.status(500).json({ error: 'Unable to delete address.' }); return; }
  res.json({ success: true });
});

authRouter.patch('/addresses/:id/default', requireFirebaseAuth, async (req: Request, res: Response) => {
  if (!requireAdminDatabase(res)) return;
  const profileId = await profileIdForUid(res.locals.auth.uid);
  if (!profileId) { res.status(404).json({ error: 'Profile not found.' }); return; }
  await supabaseAdmin!.from('saved_addresses').update({ is_default: false }).eq('profile_id', profileId);
  const result = await supabaseAdmin!.from('saved_addresses').update({ is_default: true }).eq('id', req.params.id).eq('profile_id', profileId).select().single();
  if (result.error) { res.status(500).json({ error: 'Unable to set the default address.' }); return; }
  res.json({ success: true, address: result.data });
});
