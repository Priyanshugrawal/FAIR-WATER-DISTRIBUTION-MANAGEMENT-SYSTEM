import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import type { RegisterPayload } from '@/types';

const PASSWORD_REQUIREMENTS = [
  { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { label: 'At least 1 uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'At least 1 digit', test: (p: string) => /\d/.test(p) },
  {
    label: 'At least 1 special character',
    test: (p: string) => /[!@#$%^&*()_+\-=\[\]{};:'",.<>?/\\|`~]/.test(p),
  },
];

export function RegisterPage() {
  const navigate = useNavigate();
  const { register, loading, error: authError } = useAuth();

  const [form, setForm] = useState<RegisterPayload>({
    full_name: '',
    email: '',
    password: '',
    district: '',
    tehsil: '',
    block: '',
    house_no: '',
  });

  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  

  const passwordStrength = PASSWORD_REQUIREMENTS.map((req) => ({
    ...req,
    met: req.test(form.password),
  }));

  const allRequirementsMet = passwordStrength.every((r) => r.met);
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emailValid = EMAIL_RE.test(form.email);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    // Validation
    if (
      !form.full_name ||
      !form.email ||
      !form.password ||
      !confirmPassword ||
      !form.district ||
      !form.tehsil ||
      !form.block ||
      !form.house_no
    ) {
      setLocalError('Please fill in all fields');
      return;
    }

    if (!emailValid) {
      setLocalError('Please enter a valid email address');
      return;
    }

    if (!allRequirementsMet) {
      setLocalError('Password does not meet all requirements');
      return;
    }

    if (form.password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    try {
      await register(form);
      toast.success('Registration successful! Welcome!');
      navigate('/citizen-portal');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Registration failed';
      setLocalError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">💧</span>
            </div>
          </div>
          <CardTitle>Create Your Account</CardTitle>
          <CardDescription>Join our water distribution network and stay informed</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  placeholder="Amit Singh"
                  value={form.full_name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition dark:bg-slate-800 dark:border-slate-600 dark:text-white"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="amit@gmail.com"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition dark:bg-slate-800 dark:border-slate-600 dark:text-white"
                />
              </div>
              {!emailValid && form.email.length > 0 && (
                <p className="mt-2 text-xs text-red-600">Please enter a valid email address.</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition dark:bg-slate-800 dark:border-slate-600 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              {/* Password Requirements */}
              <div className="mt-2 space-y-1 text-xs">
                {passwordStrength.map((req) => (
                  <div
                    key={req.label}
                    className={`flex items-center gap-2 ${req.met ? 'text-green-600 dark:text-green-400' : 'text-slate-500 dark:text-slate-400'}`}
                  >
                    <input type="checkbox" checked={req.met} readOnly className="w-4 h-4" />
                    {req.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition dark:bg-slate-800 dark:border-slate-600 dark:text-white"
              />
            </div>

            {/* Location Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="district" className="block text-sm font-medium mb-1">
                  District
                </label>
                <input
                  id="district"
                  name="district"
                  type="text"
                  placeholder="Raipur"
                  value={form.district}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition dark:bg-slate-800 dark:border-slate-600 dark:text-white"
                />
              </div>
              <div>
                <label htmlFor="tehsil" className="block text-sm font-medium mb-1">
                  Tehsil
                </label>
                <input
                  id="tehsil"
                  name="tehsil"
                  type="text"
                  placeholder="Telibandha"
                  value={form.tehsil}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition dark:bg-slate-800 dark:border-slate-600 dark:text-white"
                />
              </div>
            </div>

            {/* Block and House Number */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="block" className="block text-sm font-medium mb-1">
                  Block / Ward
                </label>
                <input
                  id="block"
                  name="block"
                  type="text"
                  placeholder="Ward 15"
                  value={form.block}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition dark:bg-slate-800 dark:border-slate-600 dark:text-white"
                />
              </div>
              <div>
                <label htmlFor="house_no" className="block text-sm font-medium mb-1">
                  House Number
                </label>
                <input
                  id="house_no"
                  name="house_no"
                  type="text"
                  placeholder="D-22"
                  value={form.house_no}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition dark:bg-slate-800 dark:border-slate-600 dark:text-white"
                />
              </div>
            </div>

            {/* Error message */}
            {(localError || authError) && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300">
                {localError || authError}
              </div>
            )}

            {/* Submit */}
            <Button type="submit" className="w-full" disabled={loading || !allRequirementsMet || !emailValid}>
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>

            {/* Link to login */}
            <div className="text-sm text-center text-slate-600 dark:text-slate-400">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-blue-600 hover:underline dark:text-blue-400 font-medium"
              >
                Sign in
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
