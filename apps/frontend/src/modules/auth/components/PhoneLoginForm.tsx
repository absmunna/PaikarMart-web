import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { firebaseAuthService } from '../services/firebaseAuthService';
import { Loader2 } from 'lucide-react';

export const PhoneLoginForm = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize reCAPTCHA on mount
    firebaseAuthService.setupRecaptcha('recaptcha-container');
  }, []);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const appVerifier = (window as any).recaptchaVerifier;
      const result = await firebaseAuthService.sendOtp(phone, appVerifier);
      setConfirmationResult(result);
      setStep('otp');
      toast.success('OTP sent to your phone!');
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await firebaseAuthService.verifyOtp(confirmationResult, otp);
      toast.success('Login successful!');
      navigate('/');
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Invalid OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {step === 'phone' ? (
        <form onSubmit={handleSendOtp} className="space-y-4">
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
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Get OTP
          </Button>
          <div id="recaptcha-container"></div>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp">Verification Code</Label>
            <Input 
              id="otp" 
              type="text" 
              placeholder="Enter 6-digit code" 
              value={otp} 
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Verify & Login
          </Button>
          <Button 
            type="button" 
            variant="ghost" 
            onClick={() => setStep('phone')} 
            className="w-full text-xs"
          >
            Change Phone Number
          </Button>
        </form>
      )}
    </div>
  );
};
