import { Router } from 'express';
import { getWallet, addMoney, sendMoney, rechargeMobile } from './wallet.controller';

const router = Router();

router.get('/', getWallet);
router.post('/add-money', addMoney);
router.post('/send-money', sendMoney);
router.post('/recharge', rechargeMobile);

export const walletRoutes = router;
