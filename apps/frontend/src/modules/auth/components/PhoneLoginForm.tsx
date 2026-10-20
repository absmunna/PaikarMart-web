import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export const PhoneLoginForm = () => {
  const [phone, setPhone] = useState('');
  const { loginWithPhone } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginWithPhone(phone, '123456');
      navigate('/');
    } catch (error) {
      toast.error('Login failed.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input 
          id="phone" 
          type="tel" 
          placeholder="+880 1XXX-XXXXXX" 
          value={phone} 
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="w-full">Get OTP</Button>
    </form>
  );
};
