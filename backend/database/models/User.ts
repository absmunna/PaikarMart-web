// backend/database/models/User.ts
export interface UserInterface {
  id: string;
  email: string;
  name: string;
  role: 'buyer' | 'seller' | 'admin';
}
