import { Router } from 'express';
import { 
  getWallet, 
  addMoney, 
  sendMoney, 
  rechargeMobile, 
  withdrawMoney,
  getTransactions,
  getEscrow
} from './wallet.controller';
import { requireAuth } from '../../middleware/auth';

const router = Router();

// 🔒 Mandate verified authentication on ALL wallet endpoints
router.use(requireAuth);

router.get('/', getWallet);
router.get('/balance', getWallet);
router.get('/transactions', getTransactions);
router.get('/escrow', getEscrow);
router.post('/add-money', addMoney);
router.post('/send-money', sendMoney);
router.post('/recharge', rechargeMobile);
router.post('/withdraw', withdrawMoney);

export const walletRoutes = router;
