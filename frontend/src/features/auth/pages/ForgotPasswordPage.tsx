import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, ChevronRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { AuthApi } from '../authApi';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    try {
      await AuthApi.forgotPassword(email);
      setSubmitted(true);
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.response?.data?.message || 'Failed to send reset link.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-background">
      <div className="hidden md:flex md:w-1/2 lg:w-5/12 bg-zinc-950 p-10 lg:p-14 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-zinc-950 to-zinc-950 pointer-events-none" />
        <div className="relative z-10 flex flex-col h-full justify-between">
          <div>
            <div className="flex items-center gap-3 mb-16">
              <div className="bg-indigo-600 p-2 rounded-xl">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">Innonsh SprintOS</span>
            </div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-5xl font-bold text-white leading-[1.1]">
                  Account<br />Recovery
                </h1>
                <p className="text-zinc-400 text-lg leading-relaxed max-w-md">
                  Enter your email address to receive a secure password reset link.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="w-full md:w-1/2 lg:w-7/12 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-background">
        <div className="w-full max-w-[440px] space-y-8">
          <div className="text-center md:text-left space-y-2">
            <button onClick={() => navigate('/signin')} className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Sign In
            </button>
            <h2 className="text-3xl font-bold tracking-tight">Forgot Password</h2>
            <p className="text-muted-foreground">
              {submitted ? "Check your email for a link to reset your password." : "We'll send you an email with a link to reset your password."}
            </p>
          </div>

          {!submitted ? (
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Work Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@innonsh.com"
                  className="h-12 bg-muted/50 border-muted focus-visible:ring-indigo-500"
                  required
                />
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white shadow-soft transition-all text-base font-medium flex items-center justify-center gap-2">
                {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                {!isSubmitting && <ChevronRight className="w-4 h-4" />}
              </Button>
            </form>
          ) : (
            <div className="bg-indigo-500/10 border border-indigo-500/20 p-6 rounded-xl text-center">
              <p className="text-indigo-600 font-medium">A password reset link has been successfully sent to your email. Please check your inbox to proceed.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
