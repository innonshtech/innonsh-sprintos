import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { AuthApi } from '../authApi';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { toast } = useToast();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast({ variant: 'destructive', title: 'Error', description: 'Invalid or missing token.' });
      return;
    }
    if (password !== confirmPassword) {
      toast({ variant: 'destructive', title: 'Error', description: 'Passwords do not match.' });
      return;
    }

    setIsSubmitting(true);
    try {
      await AuthApi.resetPassword(token, password);
      toast({
        title: 'Success',
        description: 'Password reset successfully. You can now log in.',
      });
      navigate('/signin');
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.response?.data?.message || 'Failed to reset password.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background p-8">
        <div className="text-center space-y-4 max-w-md">
          <h2 className="text-2xl font-bold">Invalid Link</h2>
          <p className="text-muted-foreground">This password reset link is invalid or missing the token. Please request a new one.</p>
          <Button onClick={() => navigate('/forgot-password')}>Request New Link</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-background">
      <div className="hidden md:flex md:w-1/2 lg:w-5/12 bg-zinc-950 p-10 lg:p-14 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-zinc-950 to-zinc-950 pointer-events-none" />
        <div className="relative z-10 flex flex-col h-full justify-between">
          <div>
            <div className="flex items-center gap-3 mb-16">
              <div className="bg-emerald-600 p-2 rounded-xl">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">Innonsh SprintOS</span>
            </div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-5xl font-bold text-white leading-[1.1]">
                  Set New<br />Password
                </h1>
                <p className="text-zinc-400 text-lg leading-relaxed max-w-md">
                  Please enter a strong, secure password for your account.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="w-full md:w-1/2 lg:w-7/12 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-background">
        <div className="w-full max-w-[440px] space-y-8">
          <div className="text-center md:text-left space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Reset Password</h2>
            <p className="text-muted-foreground">Enter your new password below.</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 bg-muted/50 border-muted focus-visible:ring-emerald-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-12 bg-muted/50 border-muted focus-visible:ring-emerald-500"
                  required
                />
              </div>
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white shadow-soft transition-all text-base font-medium flex items-center justify-center gap-2">
              {isSubmitting ? 'Resetting...' : 'Set Password'}
              {!isSubmitting && <ChevronRight className="w-4 h-4" />}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
