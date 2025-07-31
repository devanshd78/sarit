'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Mail,
  Phone,
  Shield,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff
} from 'lucide-react';
import { post } from '@/lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'login' | 'verify'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const validate = () => {
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (!/^\d{10}$/.test(mobile)) {
      setError('Please enter a valid 10-digit mobile number.');
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    setError(null);
    setSuccess(null);
    if (!validate()) return;

    setLoading(true);
    try {
      await post('/auth/login', { email, mobile: `+91${mobile}` });
      setSuccess('Verification code sent successfully!');
      setTimeout(() => {
        setStep('verify');
        setSuccess(null);
      }, 1000);
    } catch (e: any) {
      setError(e.response?.data?.error || 'Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setError(null);
    setSuccess(null);
    if (!/^\d{6}$/.test(otp)) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }

    setLoading(true);
    try {
      const { token, userId } = await post<{ token: string, userId: string }>('/auth/verify-otp', {
        email,
        mobile: `+91${mobile}`,
        otp,
      });
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => {
        router.push('/');
      }, 1000);
    } catch (e: any) {
      setError(e.response?.data?.error || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = () => {
    setStep('login');
    setError(null);
    setSuccess(null);
    setOtp('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div
        className="
    absolute inset-0
    bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22 viewBox=%220 0 40 40%22><circle cx=%2210%22 cy=%2210%22 r=%222%22 fill=%22%23d1d5db%22 fill-opacity=%220.2%22/></svg>')]
    bg-repeat
    bg-[length:40px_40px]
    opacity-50
  "
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-black to-gray-800 text-white py-8 px-8 text-center relative">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="mb-6"
              >
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-2xl font-bold text-black">S</span>
                </div>
                <h1 className="text-3xl font-bold tracking-wide">SARIT</h1>
                <p className="text-gray-200 text-sm mt-1">Premium Bags Collection</p>
              </motion.div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <CardTitle className="text-2xl font-semibold">
                    {step === 'login' ? 'Welcome Back' : 'Verify Your Identity'}
                  </CardTitle>
                  <p className="text-gray-300 text-sm mt-2">
                    {step === 'login'
                      ? 'Sign in to access your account'
                      : 'Enter the verification code sent to your mobile'
                    }
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </CardHeader>

          <CardContent className="p-8 space-y-6">
            {/* Status Messages */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-xl"
                >
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center space-x-2 p-4 bg-green-50 border border-green-200 rounded-xl"
                >
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <p className="text-sm text-green-700">{success}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {step === 'login' ? (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  {/* Email Field */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                        className="pl-11 h-12 border-2 border-gray-200 rounded-xl focus:border-black focus:ring-0 transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Mobile Field */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <div className="absolute left-11 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm font-medium">
                        +91
                      </div>
                      <Input
                        type="tel"
                        placeholder="Enter 10-digit mobile number"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                        maxLength={10}
                        disabled={loading}
                        className="pl-20 h-12 border-2 border-gray-200 rounded-xl focus:border-black focus:ring-0 transition-all duration-200"
                      />
                    </div>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <Button
                      onClick={handleLogin}
                      disabled={loading || !email || !mobile}
                      className="w-full h-12 bg-gradient-to-r from-black to-gray-800 hover:from-gray-800 hover:to-black text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <div className="flex items-center space-x-2">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Sending Code...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Shield className="w-5 h-5" />
                          <span>Send Verification Code</span>
                        </div>
                      )}
                    </Button>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="verify"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  {/* Back Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleResendCode}
                    className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors duration-200"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-sm font-medium">Back to login</span>
                  </motion.button>

                  {/* Contact Info Display */}
                  <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                    <p className="text-sm text-gray-600">Verification code sent to:</p>
                    <div className="space-y-1">
                      <Badge variant="secondary" className="bg-white border border-gray-200">
                        <Mail className="w-3 h-3 mr-1" />
                        {email}
                      </Badge>
                      <Badge variant="secondary" className="bg-white border border-gray-200">
                        <Phone className="w-3 h-3 mr-1" />
                        +91 {mobile}
                      </Badge>
                    </div>
                  </div>

                  {/* OTP Field */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Verification Code
                    </label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter 6-digit code"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        maxLength={6}
                        disabled={loading}
                        className="pl-11 pr-11 h-12 border-2 border-gray-200 rounded-xl focus:border-black focus:ring-0 transition-all duration-200 text-center text-lg font-mono tracking-widest"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <Button
                      onClick={handleVerify}
                      disabled={loading || otp.length !== 6}
                      className="w-full h-12 bg-gradient-to-r from-black to-gray-800 hover:from-gray-800 hover:to-black text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <div className="flex items-center space-x-2">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Verifying...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-5 h-5" />
                          <span>Verify & Login</span>
                        </div>
                      )}
                    </Button>
                  </motion.div>

                  {/* Resend Code */}
                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      Didn't receive the code?{' '}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleResendCode}
                        className="text-black font-semibold hover:underline transition-all duration-200"
                      >
                        Resend Code
                      </motion.button>
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="text-center mt-8"
        >
          <p className="text-sm text-gray-500">
            By continuing, you agree to our{' '}
            <a href="#" className="text-black hover:underline font-medium">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-black hover:underline font-medium">Privacy Policy</a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}