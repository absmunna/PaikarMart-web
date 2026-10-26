import React, { useState } from 'react';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authService.register({ name, email, password, role: 'buyer' });
      navigate('/login');
    } catch (error) {
      console.error('Registration failed', error);
    }
  };

  return (
    <div className="p-4 flex flex-col items-center justify-center min-h-[80vh]">
      <h2 className="text-2xl font-bold mb-6">Create an Account</h2>
      <form onSubmit={handleRegister} className="w-full max-w-sm space-y-4">
        <input type="text" placeholder="Full Name" onChange={(e) => setName(e.target.value)} className="w-full p-3 rounded-xl border border-[var(--pm-border)] bg-[var(--pm-surface)]" />
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} className="w-full p-3 rounded-xl border border-[var(--pm-border)] bg-[var(--pm-surface)]" />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} className="w-full p-3 rounded-xl border border-[var(--pm-border)] bg-[var(--pm-surface)]" />
        <button className="w-full py-3 bg-[var(--pm-accent)] text-white rounded-xl font-bold">Register</button>
      </form>
    </div>
  );
};

export default Register;
