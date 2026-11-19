import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface EmailOtpLoginFormProps {
  purpose?: string;
}

export const EmailOtpLoginForm: React.FC<EmailOtpLoginFormProps> = ({ purpose }) => {
  const [email, setEmail] = useState('');
  
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('OTP sent to your email!');
  };

  return (
    <form onSubmit={handleSendOtp} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input 
          id="email" 
          type="email" 
          placeholder="name@example.com" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="w-full">Send Reset Link</Button>
    </form>
  );
};
