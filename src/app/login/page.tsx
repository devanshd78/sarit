'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { post } from '@/lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'login' | 'verify'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const validate = () => {
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError('Please enter a valid email.');
      return false;
    }
    if (!/^\d{10}$/.test(mobile)) {
      setError('Please enter a valid 10-digit mobile.');
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    setError(null);
    if (!validate()) return;
    setLoading(true);
    try {
      await post('/auth/login', { email, mobile: `+91${mobile}` });
      setStep('verify');
    } catch (e: any) {
      setError(e.response?.data?.error || 'Failed to send code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setError(null);
    if (!/^\d{6}$/.test(otp)) {
      setError('Enter the 6‑digit code.');
      return;
    }
    setLoading(true);
    try {
      const { token } = await post<{ token: string }>('/auth/verify-otp', {
        email,
        mobile: `+91${mobile}`,
        otp,
      });
      localStorage.setItem('token', token);
      router.push('/');
    } catch (e: any) {
      setError(e.response?.data?.error || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="py-6 text-center">
          <img src="/assets/sarit-logo-color.svg" alt="Logo" className="mx-auto mb-4" />
          <CardTitle className="text-2xl font-bold">
            {step === 'login' ? 'Welcome Back' : 'Verify Code'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          {error && <p className="text-center text-sm text-red-600">{error}</p>}

          {step === 'login' ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number
                </label>
                <Input
                  type="tel"
                  placeholder="10‑digit number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  maxLength={10}
                  disabled={loading}
                />
              </div>
              <Button onClick={handleLogin} disabled={loading} className="w-full">
                {loading ? 'Sending…' : 'Send Code'}
              </Button>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Verification Code
                </label>
                <Input
                  type="text"
                  placeholder="6‑digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  disabled={loading}
                />
              </div>
              <Button onClick={handleVerify} disabled={loading} className="w-full">
                {loading ? 'Verifying…' : 'Verify & Login'}
              </Button>
              <p
                className="mt-2 text-center text-sm text-blue-600 cursor-pointer"
                onClick={() => setStep('login')}
              >
                Resend Code
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
