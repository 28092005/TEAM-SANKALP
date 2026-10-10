import React, { useState } from 'react';
import {
  BarChart3,
  Compass,
  Sparkles,
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowRight,
  User,
  Shield
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

export const AuthModal: React.FC = () => {
  const {
    setIsAuthenticated,
    setUserName,
    setUserRole,
    setUserEmail,
    addBlackboardLog,
    addNotification
  } = useApp();

  const [selectedRole, setSelectedRole] = useState<UserRole>('Admin');
  const [email, setEmail] = useState('aishwarya.admin@enterprise.ai');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'Admin') {
      setEmail('aishwarya.admin@enterprise.ai');
    } else {
      setEmail('rohan.mehta@techcorp.in');
    }
  };

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (selectedRole === 'Admin') {
      setUserName('Aishwarya');
      setUserRole('Admin');
      setUserEmail(email);
    } else {
      setUserName('Rohan Mehta');
      setUserRole('Customer');
      setUserEmail(email);
    }

    setIsAuthenticated(true);

    addBlackboardLog({
      tier: 'Tier 1: Intent & Orchestrator',
      event: 'USER_AUTHENTICATION',
      details: `User signed in with role [${selectedRole}] as ${selectedRole === 'Admin' ? 'Aishwarya (Admin)' : 'Rohan Mehta (Customer)'}`,
      status: 'success'
    });

    addNotification({
      title: 'Session Authenticated',
      message: `Signed in as ${selectedRole === 'Admin' ? 'Aishwarya (Enterprise Admin)' : 'Rohan Mehta (Verified Customer)'}.`,
      type: 'system'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-200">
        {/* Left Branding Panel matching Image 3 */}
        <div className="md:w-1/2 bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-950 p-8 text-white flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold tracking-tight text-white leading-tight">
                  Context-Aware
                </h2>
                <p className="text-xs text-blue-200 font-medium">Application Agent</p>
                <p className="text-[10px] text-blue-300">Enterprise BI & Customer Portal</p>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <h3 className="text-2xl font-extrabold tracking-tight text-white leading-tight">
                Ask. Navigate.<br />Analyze. Act.
              </h3>
              <p className="text-xs text-blue-100 leading-relaxed max-w-sm">
                Intelligent assistant connecting enterprise operators and customers with real-time analytics and self-service automation.
              </p>
            </div>

            {/* 3 Value Pillars */}
            <div className="space-y-3.5 pt-4">
              <div className="flex items-start space-x-3">
                <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-cyan-300 shrink-0 mt-0.5">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Natural Language Navigation</h4>
                  <p className="text-[11px] text-blue-200">Find any report, filter, or customer order instantly.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-amber-300 shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">AI-Powered Insights</h4>
                  <p className="text-[11px] text-blue-200">Period trends, revenue rankings, and live order tracking.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-emerald-300 shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Role-Based Access Control</h4>
                  <p className="text-[11px] text-blue-200">Secure separation between Executive Admin and Customer Portals.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 flex items-center justify-between text-[11px] text-blue-300">
            <span>Enterprise Edition 2026</span>
            <span className="flex items-center gap-1 text-emerald-300 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Agent Core Ready
            </span>
          </div>
        </div>

        {/* Right Sign-in Form */}
        <div className="md:w-1/2 p-8 md:p-10 flex flex-col justify-center bg-white">
          <div className="mb-5">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome Back</h3>
            <p className="text-xs text-slate-500 mt-1">Select your account role to sign in</p>
          </div>

          {/* Role Switcher Tabs */}
          <div className="grid grid-cols-2 gap-2 mb-5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => handleRoleSelect('Admin')}
              className={`py-2 px-3 rounded-lg font-semibold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                selectedRole === 'Admin'
                  ? 'bg-white text-blue-600 shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleSelect('Customer')}
              className={`py-2 px-3 rounded-lg font-semibold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                selectedRole === 'Customer'
                  ? 'bg-white text-blue-600 shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Customer Portal</span>
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Address */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                {selectedRole === 'Admin' ? 'Admin Email Address' : 'Customer Account Email'}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember me & Forgot */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center space-x-2 text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 accent-blue-600 w-3.5 h-3.5"
                />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                className="text-blue-600 font-medium hover:underline text-xs"
              >
                Forgot password?
              </button>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2.5 rounded-lg shadow-md shadow-blue-500/20 transition-all hover:scale-[1.01] flex items-center justify-center space-x-2 cursor-pointer mt-2"
            >
              <span>
                Sign In as {selectedRole === 'Admin' ? 'Aishwarya (Admin)' : 'Rohan Mehta (Customer)'}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-[11px] uppercase">
                <span className="bg-white px-2 text-slate-400">Or continue with</span>
              </div>
            </div>

            {/* Google Sign In */}
            <button
              type="button"
              onClick={handleLogin}
              className="w-full bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs py-2.5 rounded-lg border border-slate-300 shadow-2xs transition-colors flex items-center justify-center space-x-2 cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Sign in with Google</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
