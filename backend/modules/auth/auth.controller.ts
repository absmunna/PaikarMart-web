import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '@backend/config/database';
import { AppRole, RoleGroup, getRoleGroup, getPermissionsForRole, ROLE_GROUP_META } from '@/config/roles.config';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_12345';

interface InMemUser {
  id: string;
  email: string;
  phone: string;
  name: string;
  role: AppRole;
  roles?: AppRole[];
  roleGroup?: RoleGroup;
  permissions?: string[];
  password?: string;
  verification?: { status: string };
  createdAt: string;
}

const inMemoryUsers = new Map<string, InMemUser>();

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name, role, phone, shopName, type, address, tradeLicenseNo, nidOrTradeLicense } = req.body;
    const finalRole: AppRole = (email === 'nirjonmunna5@gmail.com' ? 'super_admin' : (role === 'CUSTOMER' ? 'buyer' : (role || 'buyer'))) as AppRole;
    const userPhone = phone || (email && email.includes('@') ? '' : email) || `017${Math.floor(10000000 + Math.random() * 90000000)}`;
    const userEmail = (email && email.includes('@')) ? email : `${userPhone}@paikarmart.com`;
    const userId = `usr_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
    const roleGroup = getRoleGroup(finalRole);
    const roles: AppRole[] = [finalRole];
    const isVerified = Boolean(tradeLicenseNo || nidOrTradeLicense);
    const permissions = getPermissionsForRole(finalRole, isVerified);

    // Fallback if DB is not connected yet so UI doesn't crash permanently during test
    if (!process.env.DATABASE_URL) {
      const token = jwt.sign({ 
        id: userId, 
        email: userEmail, 
        phone: userPhone, 
        role: finalRole, 
        roles,
        roleGroup,
        permissions,
        name: name || shopName || 'Paikar User' 
      }, JWT_SECRET, { expiresIn: '7d' });

      const inMemRecord: InMemUser = {
        id: userId,
        email: userEmail,
        phone: userPhone,
        name: name || shopName || 'Paikar User',
        role: finalRole,
        roles,
        roleGroup,
        permissions,
        password: password || 'demo123456',
        verification: { status: isVerified ? 'pending' : 'unverified' },
        createdAt: new Date().toISOString()
      };
      inMemoryUsers.set(userEmail, inMemRecord);
      inMemoryUsers.set(userPhone, inMemRecord);

      return res.status(201).json({ 
        message: 'Dev mode: User registered successfully',
        token,
        accessToken: token,
        refreshToken: token,
        user: { 
          id: userId, 
          email: userEmail, 
          phone: userPhone,
          name: inMemRecord.name, 
          role: finalRole,
          roles,
          roleGroup,
          permissions,
          verification: inMemRecord.verification
        }
      });
    }

    const existingUser = await prisma.user.findUnique({ where: { email: userEmail } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: userEmail,
        phone: userPhone,
        passwordHash: hashedPassword,
        fullName: name || shopName || 'Paikar User',
        role: finalRole
      }
    });

    const token = jwt.sign({ 
      id: user.id, 
      email: user.email, 
      phone: user.phone, 
      role: finalRole, 
      roles,
      roleGroup,
      permissions,
      name: user.fullName 
    }, JWT_SECRET, { expiresIn: '7d' });
    
    res.status(201).json({ 
      message: 'User registered successfully',
      token,
      accessToken: token,
      refreshToken: token,
      user: { 
        id: user.id, 
        email: user.email, 
        phone: user.phone, 
        name: user.fullName, 
        role: finalRole,
        roles,
        roleGroup,
        permissions
      }
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ error: 'Failed to register. Please try again.' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const identifier = (email || '').trim();

    const mockAccounts: Record<string, { name: string; role: AppRole }> = {
      '01711111111': { name: 'Demo Admin', role: 'admin' },
      '01722222222': { name: 'Demo Retail Seller', role: 'retail_seller' },
      '01733333333': { name: 'Demo Wholesale Dealer', role: 'wholesale_seller' },
      '01744444444': { name: 'Demo Factory Owner', role: 'factory_seller' },
      '01755555555': { name: 'Demo Rider', role: 'rider' },
      '01766666666': { name: 'Demo Service Provider', role: 'service_provider' },
      '01777777777': { name: 'Demo Buyer', role: 'buyer' },
      '01788888888': { name: 'Demo Rural Merchant', role: 'rural_seller' },
      'nirjonmunna5@gmail.com': { name: 'Nirjon Munna', role: 'super_admin' },
    };

    const isMock = mockAccounts[identifier];
    const registeredInMem = inMemoryUsers.get(identifier);

    if (!process.env.DATABASE_URL) {
      // Dev mode fallback
      const mockUser = registeredInMem || isMock || { 
        id: `usr_${Date.now().toString(36)}`, 
        name: identifier.startsWith('01') ? `User ${identifier.slice(-4)}` : 'Demo User', 
        role: (identifier === 'nirjonmunna5@gmail.com' ? 'super_admin' : 'buyer') as AppRole,
        email: identifier.includes('@') ? identifier : `${identifier}@paikarmart.com`,
        phone: identifier.startsWith('01') ? identifier : '',
        verification: { status: 'verified' }
      };

      const userRole: AppRole = mockUser.role as AppRole;
      const userName = mockUser.name;
      const userEmail = (mockUser as any).email || (identifier.includes('@') ? identifier : `${identifier}@paikarmart.com`);
      const userPhone = (mockUser as any).phone || (identifier.startsWith('01') ? identifier : '');
      const userId = (mockUser as any).id || `usr-${userRole}`;
      const roleGroup = getRoleGroup(userRole);
      const roles: AppRole[] = [userRole];
      const isVerified = (mockUser as any).verification?.status === 'verified';
      const permissions = getPermissionsForRole(userRole, isVerified);

      const token = jwt.sign({ 
        id: userId, 
        email: userEmail, 
        phone: userPhone, 
        role: userRole, 
        roles,
        roleGroup,
        permissions,
        name: userName 
      }, JWT_SECRET, { expiresIn: '7d' });

      return res.json({
        token: token,
        accessToken: token,
        refreshToken: token,
        user: { 
          id: userId, 
          email: userEmail, 
          phone: userPhone,
          name: userName, 
          role: userRole,
          roles,
          roleGroup,
          permissions,
          verification: (mockUser as any).verification || { status: 'verified' }
        }
      });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { phone: identifier }
        ]
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const userRole = (user.role || 'buyer') as AppRole;
    const roleGroup = getRoleGroup(userRole);
    const roles: AppRole[] = [userRole];
    const isVerified = (user as any).isVerified ?? false;
    const permissions = getPermissionsForRole(userRole, isVerified);

    const token = jwt.sign({ 
      id: user.id, 
      email: user.email, 
      phone: user.phone, 
      role: userRole, 
      roles,
      roleGroup,
      permissions,
      name: user.fullName 
    }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      accessToken: token,
      refreshToken: token,
      user: { 
        id: user.id, 
        email: user.email, 
        phone: user.phone, 
        name: user.fullName, 
        role: userRole,
        roles,
        roleGroup,
        permissions,
        verification: { status: isVerified ? 'verified' : 'unverified' }
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Login verification failed.' });
  }
};

export const logout = async (_req: Request, res: Response) => {
  res.json({ success: true, message: 'Logged out successfully' });
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token provided' });
    
    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const role: AppRole = (decoded.role || 'buyer') as AppRole;
    const roleGroup = decoded.roleGroup || getRoleGroup(role);
    const roles: AppRole[] = decoded.roles || [role];
    const permissions = decoded.permissions || getPermissionsForRole(role, true);

    if (!process.env.DATABASE_URL) {
      return res.json({
        user: { 
          id: decoded.id, 
          email: decoded.email, 
          fullName: decoded.name || 'Demo', 
          role,
          roles,
          roleGroup,
          permissions,
          isVerified: true 
        }
      });
    }

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const dbRole = (user.role || 'buyer') as AppRole;

    res.json({ 
      user: {
        ...user,
        role: dbRole,
        roles: [dbRole],
        roleGroup: getRoleGroup(dbRole),
        permissions: getPermissionsForRole(dbRole, (user as any).isVerified)
      } 
    });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

/**
 * 📊 Get Detailed RBAC Profile & Capabilities
 */
export const getRbacProfile = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token provided' });
    
    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const role: AppRole = (decoded.role || 'buyer') as AppRole;
    const roleGroup = getRoleGroup(role);
    const permissions = getPermissionsForRole(role, true);
    const meta = ROLE_GROUP_META[roleGroup];

    res.json({
      role,
      roleGroup,
      persona: roleGroup,
      meta,
      permissions,
      isCustomer: roleGroup === 'customer',
      isVendor: roleGroup === 'vendor',
      isAdmin: roleGroup === 'admin',
      isSuperAdmin: role === 'super_admin'
    });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });
    
    if (process.env.DATABASE_URL) {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
         // Return success anyway for security reasons
         return res.json({ message: 'If that email exists, a reset link was sent.' });
      }
    }

    // Usually we would dispatch an email here using Resend or NodeMailer.
    res.json({ message: 'If that email exists, a reset link was sent.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process request.' });
  }
};

const otpStore = new Map<string, { code: string; expiresAt: number; purpose?: string }>();

export const sendEmailOtp = async (req: Request, res: Response) => {
  try {
    const { email, purpose = 'login' } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email address is required' });
    }
    const cleanEmail = email.trim().toLowerCase();
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000;

    otpStore.set(cleanEmail, { code, expiresAt, purpose });

    console.log(`[Email OTP] Sent OTP ${code} to ${cleanEmail} (Purpose: ${purpose})`);

    return res.json({
      success: true,
      message: 'OTP verification code sent to email',
      email: cleanEmail,
      expiresInSeconds: 300,
      demoCode: code
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to send OTP email' });
  }
};

export const verifyEmailOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }
    const cleanEmail = email.trim().toLowerCase();
    const record = otpStore.get(cleanEmail);

    if (!record) {
      return res.status(400).json({ error: 'OTP code not requested or expired.' });
    }

    if (Date.now() > record.expiresAt) {
      otpStore.delete(cleanEmail);
      return res.status(400).json({ error: 'OTP code has expired.' });
    }

    if (record.code !== otp.trim()) {
      return res.status(400).json({ error: 'Invalid OTP code' });
    }

    otpStore.delete(cleanEmail);

    let existingUser = inMemoryUsers.get(cleanEmail);
    if (!existingUser) {
      const userId = `usr_otp_${Date.now().toString(36)}`;
      const role: AppRole = 'buyer';
      existingUser = {
        id: userId,
        email: cleanEmail,
        phone: '',
        name: cleanEmail.split('@')[0],
        role,
        roles: ['buyer'],
        roleGroup: 'customer',
        permissions: getPermissionsForRole(role, false),
        verification: { status: 'unverified' },
        createdAt: new Date().toISOString()
      };
      inMemoryUsers.set(cleanEmail, existingUser);
    }

    const token = jwt.sign({
      id: existingUser.id,
      email: existingUser.email,
      phone: existingUser.phone,
      role: existingUser.role,
      roleGroup: existingUser.roleGroup,
      name: existingUser.name
    }, JWT_SECRET, { expiresIn: '7d' });

    return res.json({
      success: true,
      verified: true,
      message: 'Email OTP verified successfully',
      token,
      user: existingUser
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to verify OTP' });
  }
};
