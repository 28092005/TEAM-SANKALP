import React, { useState } from 'react';
import {
  BarChart3,
  Shield,
  User,
  Cpu,
  Building2,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Key,
  CreditCard,
  Layers,
  Code,
  Zap,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Fingerprint,
  Activity,
  Terminal,
  HelpCircle,
  Database,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PersonaType, UserRole } from '../types';

export const LoginPage: React.FC = () => {
  const {
    isAuthenticated,
    setIsAuthenticated,
    setCurrentPage,
    setUserName,
    setUserRole,
    setUserEmail,
    addBlackboardLog,
    addNotification
  } = useApp();

  const [activePersona, setActivePersona] = useState<PersonaType>('platform-admin');
  const [authMethod, setAuthMethod] = useState<'password' | 'otp' | 'sso'>('password');
  // CRITICAL: Inputs start empty by default so passwords are not exposed
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [ssoDomain, setSsoDomain] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Quick switch credentials based on persona
  const handleSelectPersona = (persona: PersonaType) => {
    setActivePersona(persona);
    setLoginError(null);
  };

  const handleQuickSignIn = (persona: PersonaType) => {
    let resolvedName = 'Enterprise User';
    let resolvedRole: UserRole = 'Executive Viewer';
    let resolvedEmail = 'user@enterprise.ai';

    switch (persona) {
      case 'platform-admin':
        resolvedName = 'Aishwarya (Platform Admin)';
        resolvedRole = 'Platform Admin';
        resolvedEmail = 'admin@enterprise.ai';
        break;
      case 'sales-manager':
        resolvedName = 'Vikram Joshi (Sales Manager)';
        resolvedRole = 'Regional Sales Manager';
        resolvedEmail = 'vikram.manager@enterprise.ai';
        break;
      case 'ops-analyst':
        resolvedName = 'Neha Sharma (Operations Analyst)';
        resolvedRole = 'Operations Analyst';
        resolvedEmail = 'neha.ops@enterprise.ai';
        break;
      case 'executive-viewer':
      case 'user-persona':
      default:
        resolvedName = 'Rohan Mehta (Executive Viewer)';
        resolvedRole = 'Executive Viewer';
        resolvedEmail = 'rohan.viewer@enterprise.ai';
        break;
    }

    setUserName(resolvedName);
    setUserRole(resolvedRole);
    setUserEmail(resolvedEmail);
    setIsAuthenticated(true);
    setCurrentPage('executive-dashboard');

    addBlackboardLog({
      tier: 'Tier 1: Intent & Orchestrator',
      event: 'USER_AUTHENTICATION_FLOW',
      details: `Signed in as [${resolvedName}]. Assigned RBAC permissions: [${resolvedRole}]`,
      status: 'success'
    });

    addNotification({
      title: 'Authentication Successful',
      message: `Signed in as ${resolvedName} with role "${resolvedRole}".`,
      type: 'system',
      linkPage: 'executive-dashboard'
    });
  };

  const handleFillCredentials = (persona: PersonaType) => {
    setActivePersona(persona);
    switch (persona) {
      case 'platform-admin':
        setEmail('admin@enterprise.ai');
        setPassword('••••••••••••');
        break;
      case 'sales-manager':
        setEmail('vikram.manager@enterprise.ai');
        setPassword('••••••••••••');
        break;
      case 'ops-analyst':
        setEmail('neha.ops@enterprise.ai');
        setPassword('••••••••••••');
        break;
      case 'executive-viewer':
      default:
        setEmail('rohan.viewer@enterprise.ai');
        setPassword('••••••••••••');
        break;
    }
  };

  const handleGoogleSignIn = () => {
    setUserName('Aishwarya (Enterprise Google ID)');
    setUserRole('Platform Admin');
    setUserEmail('aishwarya.admin@enterprise.ai');
    setIsAuthenticated(true);
    setCurrentPage('executive-dashboard');
    addBlackboardLog({
      tier: 'Tier 1: Intent & Orchestrator',
      event: 'GOOGLE_WORKSPACE_AUTH',
      details: 'Authenticated via Google Workspace SSO (Platform Admin privileges)',
      status: 'success'
    });
    addNotification({
      title: 'Google SSO Authentication',
      message: 'Logged in securely via Google Workspace SSO with Platform Admin privileges.',
      type: 'system',
      linkPage: 'executive-dashboard'
    });
  };

  const handleLoginSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!email.trim() && authMethod !== 'sso') {
      setLoginError('Please enter your work email or click one of the quick sign-in accounts below.');
      return;
    }
    if (authMethod === 'password' && !password.trim()) {
      setLoginError('Please enter your password to authenticate.');
      return;
    }

    setLoginError(null);
    let resolvedName = email.split('@')[0] ? email.split('@')[0].replace('.', ' ') : 'Enterprise User';
    resolvedName = resolvedName.charAt(0).toUpperCase() + resolvedName.slice(1);
    let resolvedRole: UserRole = 'Executive Viewer';

    if (activePersona === 'platform-admin' || email.includes('admin')) {
      resolvedName = 'Aishwarya (Platform Admin)';
      resolvedRole = 'Platform Admin';
    } else if (activePersona === 'sales-manager' || email.includes('manager') || email.includes('sales')) {
      resolvedName = 'Vikram Joshi (Sales Manager)';
      resolvedRole = 'Regional Sales Manager';
    } else if (activePersona === 'ops-analyst' || email.includes('ops') || email.includes('analyst')) {
      resolvedName = 'Neha Sharma (Operations Analyst)';
      resolvedRole = 'Operations Analyst';
    } else if (email.includes('rohan') || email.includes('viewer')) {
      resolvedName = 'Rohan Mehta (Executive Viewer)';
      resolvedRole = 'Executive Viewer';
    } else {
      resolvedRole = 'Executive Viewer';
    }

    setUserName(resolvedName);
    setUserRole(resolvedRole);
    setUserEmail(email || 'user@enterprise.ai');
    setIsAuthenticated(true);
    setCurrentPage('executive-dashboard');

    addBlackboardLog({
      tier: 'Tier 1: Intent & Orchestrator',
      event: 'USER_AUTHENTICATION_FLOW',
      details: `Signed in as [${resolvedName}]. Assigned RBAC permissions: [${resolvedRole}]`,
      status: 'success'
    });

    addNotification({
      title: 'Authentication Successful',
      message: `Signed in as ${resolvedName} with role "${resolvedRole}".`,
      type: 'system',
      linkPage: 'executive-dashboard'
    });
  };

  return (
    <div className="min-h-screen w-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none overflow-x-hidden">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block font-mono">
              PERSONA USER FLOWS
            </span>
            <h1 className="text-sm font-extrabold text-white tracking-tight">
              One Unified Commerce & BI Platform
            </h1>
          </div>
        </div>

        {/* 4 Persona Tabs matching Image 1 */}
        <div className="hidden lg:flex items-center space-x-2 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => handleSelectPersona('onboarding')}
            className={`px-3 py-1.5 rounded-lg font-mono text-[11px] font-semibold transition-all cursor-pointer flex items-center space-x-1.5 ${
              activePersona === 'onboarding'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            <span>#01 ONBOARDING</span>
          </button>

          <button
            onClick={() => handleSelectPersona('platform-admin')}
            className={`px-3 py-1.5 rounded-lg font-mono text-[11px] font-semibold transition-all cursor-pointer flex items-center space-x-1.5 ${
              activePersona === 'platform-admin'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            <span>#02 PLATFORM ADMIN</span>
          </button>

          <button
            onClick={() => handleSelectPersona('enterprise-admin')}
            className={`px-3 py-1.5 rounded-lg font-mono text-[11px] font-semibold transition-all cursor-pointer flex items-center space-x-1.5 ${
              activePersona === 'enterprise-admin'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>#03 ENTERPRISE ADMIN</span>
          </button>

          <button
            onClick={() => handleSelectPersona('user-persona')}
            className={`px-3 py-1.5 rounded-lg font-mono text-[11px] font-semibold transition-all cursor-pointer flex items-center space-x-1.5 ${
              activePersona === 'user-persona'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>#04 USER PERSONA</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          {isAuthenticated ? (
            <button
              onClick={() => setCurrentPage('executive-dashboard')}
              className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer shadow-xs flex items-center space-x-1.5"
            >
              <span>← Back to Dashboard</span>
            </button>
          ) : (
            <div className="flex items-center space-x-1.5 bg-slate-900 border border-slate-800 text-slate-400 text-xs px-3 py-1.5 rounded-lg font-mono">
              <Lock className="w-3.5 h-3.5 text-blue-400" />
              <span>Login Required</span>
            </div>
          )}
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Side: Journey Timeline visualizer matching Image 1 & Image 2 */}
        <div className="lg:w-7/12 p-6 md:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800/80 bg-slate-900/40 overflow-y-auto">
          <div className="space-y-6">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-semibold block mb-1">
                {activePersona === 'user-persona'
                  ? 'USER PERSONA · SHOWCASE JOURNEY'
                  : 'PERSONA USER FLOWS'}
              </span>
              <h2 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
                {activePersona === 'user-persona'
                  ? 'The user journey.'
                  : 'Different personas.'}
              </h2>
              <p className="text-lg text-slate-400 font-normal mt-1">
                {activePersona === 'user-persona'
                  ? 'From first sign-in to metered inference, step by step'
                  : 'One Unified commerce platform for All AI and Token factories'}
              </p>
            </div>

            {/* Mobile persona selector */}
            <div className="grid grid-cols-2 gap-1.5 lg:hidden">
              <button
                onClick={() => handleSelectPersona('onboarding')}
                className={`p-2 rounded text-[11px] font-mono font-bold ${activePersona === 'onboarding' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}
              >
                #01 ONBOARDING
              </button>
              <button
                onClick={() => handleSelectPersona('platform-admin')}
                className={`p-2 rounded text-[11px] font-mono font-bold ${activePersona === 'platform-admin' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400'}`}
              >
                #02 PLATFORM ADMIN
              </button>
              <button
                onClick={() => handleSelectPersona('enterprise-admin')}
                className={`p-2 rounded text-[11px] font-mono font-bold ${activePersona === 'enterprise-admin' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400'}`}
              >
                #03 ENTERPRISE ADMIN
              </button>
              <button
                onClick={() => handleSelectPersona('user-persona')}
                className={`p-2 rounded text-[11px] font-mono font-bold ${activePersona === 'user-persona' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}
              >
                #04 USER PERSONA
              </button>
            </div>

            {/* Render Persona specific flowchart matching Image 1 & 2 */}
            {activePersona === 'onboarding' && (
              <div className="space-y-4 pt-4 animate-in fade-in duration-200">
                <div className="flex items-center space-x-3 text-blue-400">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                    <Fingerprint className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-mono font-bold text-blue-400 block">
                      IDENTITY & TENANCY
                    </span>
                    <h3 className="text-sm font-bold text-white">All Personas</h3>
                  </div>
                </div>

                {/* Timeline Stepper for Onboarding */}
                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-blue-600/40">
                  <div className="relative flex items-start space-x-3">
                    <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-blue-500 ring-4 ring-slate-900" />
                    <div>
                      <h4 className="text-xs font-bold text-white">1. Sign up</h4>
                      <p className="text-[11px] text-slate-400">Enter work email or SSO identifier.</p>
                    </div>
                  </div>

                  <div className="relative flex items-start space-x-3">
                    <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-blue-500 ring-4 ring-slate-900" />
                    <div>
                      <h4 className="text-xs font-bold text-white">2. Choose Individual or Organization</h4>
                      <p className="text-[11px] text-slate-400">Select self-serve developer tier or enterprise multi-tenant domain.</p>
                    </div>
                  </div>

                  <div className="relative flex items-start space-x-3">
                    <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-blue-500 ring-4 ring-slate-900" />
                    <div>
                      <h4 className="text-xs font-bold text-white">3. Sign in: OTP, Google or SSO</h4>
                      <p className="text-[11px] text-slate-400">Multi-factor security verification with hardware token or SAML.</p>
                    </div>
                  </div>

                  <div className="relative flex items-start space-x-3">
                    <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-blue-500 ring-4 ring-slate-900" />
                    <div>
                      <h4 className="text-xs font-bold text-white">4. Tenant & workspace provisioned</h4>
                      <p className="text-[11px] text-slate-400">Allocates isolated Postgres database & token credit wallet.</p>
                    </div>
                  </div>

                  <div className="relative flex items-start space-x-3">
                    <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-blue-500 ring-4 ring-slate-900" />
                    <div>
                      <h4 className="text-xs font-bold text-white">5. Role & scopes assigned</h4>
                      <p className="text-[11px] text-slate-400">Directly routes to Executive Dashboard or Developer Playground.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activePersona === 'platform-admin' && (
              <div className="space-y-4 pt-4 animate-in fade-in duration-200">
                <div className="flex items-center space-x-3 text-purple-400">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-mono font-bold text-purple-400 block">
                      MODEL FACTORY
                    </span>
                    <h3 className="text-sm font-bold text-white">Platform Admin</h3>
                  </div>
                </div>

                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-purple-600/40">
                  <div className="relative flex items-start space-x-3">
                    <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-purple-500 ring-4 ring-slate-900" />
                    <div>
                      <h4 className="text-xs font-bold text-white">1. Import model</h4>
                      <p className="text-[11px] text-slate-400">Register Gemini Flash, Pro, or custom OSS checkpoints.</p>
                    </div>
                  </div>

                  <div className="relative flex items-start space-x-3">
                    <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-purple-500 ring-4 ring-slate-900" />
                    <div>
                      <h4 className="text-xs font-bold text-white">2. Optimise & benchmark</h4>
                      <p className="text-[11px] text-slate-400">Run 125 benchmark evaluation tests across accuracy and latency.</p>
                    </div>
                  </div>

                  <div className="relative flex items-start space-x-3">
                    <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-purple-500 ring-4 ring-slate-900" />
                    <div>
                      <h4 className="text-xs font-bold text-white">3. Deploy endpoint</h4>
                      <p className="text-[11px] text-slate-400">Provision serverless autoscaling inference endpoints.</p>
                    </div>
                  </div>

                  <div className="relative flex items-start space-x-3">
                    <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-purple-500 ring-4 ring-slate-900" />
                    <div>
                      <h4 className="text-xs font-bold text-white">4. Price & publish SKU</h4>
                      <p className="text-[11px] text-slate-400">Set token pricing tiers and publish to enterprise catalog.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3 rounded-lg border border-purple-800/60 bg-purple-950/30">
                      <p className="text-xs font-bold text-purple-300">Monitor GPU capacity</p>
                      <p className="text-[10px] text-slate-400">Cluster thermal & memory quotas</p>
                    </div>
                    <div className="p-3 rounded-lg border border-purple-800/60 bg-purple-950/30">
                      <p className="text-xs font-bold text-purple-300">Revenue-share ledger</p>
                      <p className="text-[10px] text-slate-400">Automated gross split settlement</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activePersona === 'enterprise-admin' && (
              <div className="space-y-4 pt-4 animate-in fade-in duration-200">
                <div className="flex items-center space-x-3 text-amber-400">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-mono font-bold text-amber-400 block">
                      TENANT GOVERNANCE
                    </span>
                    <h3 className="text-sm font-bold text-white">Enterprise Admin</h3>
                  </div>
                </div>

                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-amber-600/40">
                  <div className="relative flex items-start space-x-3">
                    <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-amber-500 ring-4 ring-slate-900" />
                    <div>
                      <h4 className="text-xs font-bold text-white">1. Set up billing account</h4>
                      <p className="text-[11px] text-slate-400">Corporate invoice line with ₹ INR & multi-currency escrow.</p>
                    </div>
                  </div>

                  <div className="relative flex items-start space-x-3">
                    <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-amber-500 ring-4 ring-slate-900" />
                    <div>
                      <h4 className="text-xs font-bold text-white">2. Select models & endpoints</h4>
                      <p className="text-[11px] text-slate-400">Whitelist approved models compliant with company data policies.</p>
                    </div>
                  </div>

                  <div className="relative flex items-start space-x-3">
                    <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-amber-500 ring-4 ring-slate-900" />
                    <div>
                      <h4 className="text-xs font-bold text-white">3. Onboard teams & RBAC</h4>
                      <p className="text-[11px] text-slate-400">Assign role boundaries across departments and regional clusters.</p>
                    </div>
                  </div>

                  <div className="relative flex items-start space-x-3">
                    <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-amber-500 ring-4 ring-slate-900" />
                    <div>
                      <h4 className="text-xs font-bold text-white">4. Set budgets, limits & guardrails</h4>
                      <p className="text-[11px] text-slate-400">Enforce strict token expenditure limits and anti-hallucination checks.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3 rounded-lg border border-amber-800/60 bg-amber-950/30">
                      <p className="text-xs font-bold text-amber-300">Issue API keys to users</p>
                      <p className="text-[10px] text-slate-400">Scoped per project & service</p>
                    </div>
                    <div className="p-3 rounded-lg border border-amber-800/60 bg-amber-950/30">
                      <p className="text-xs font-bold text-amber-300">Audit log & SIEM export</p>
                      <p className="text-[10px] text-slate-400">Real-time Blackboard telemetry</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activePersona === 'user-persona' && (
              /* User Persona 11-step journey matching Image 2 */
              <div className="space-y-5 pt-3 animate-in fade-in duration-200">
                <div className="flex items-center space-x-3 text-emerald-400">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-mono font-bold text-emerald-400 block">
                      ENTERPRISE & SELF-SERVE
                    </span>
                    <h3 className="text-sm font-bold text-white">User Persona Journey</h3>
                  </div>
                </div>

                {/* 4 Phase Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[10px] font-bold font-mono">
                  <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-300">
                    GET ACCESS
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-300">
                    EXPLORE & DEPLOY
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-300">
                    BUILD
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-300">
                    RUN & TRACK
                  </div>
                </div>

                {/* 11 Steps List matching Image 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs max-h-72 overflow-y-auto pr-1">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="font-mono text-emerald-400 font-bold text-[10px]">01</span>
                    <h5 className="font-bold text-white mt-0.5">Join the platform</h5>
                    <p className="text-[11px] text-slate-400">Sign up as Individual or accept Org invite</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="font-mono text-emerald-400 font-bold text-[10px]">02</span>
                    <h5 className="font-bold text-white mt-0.5">Manage access</h5>
                    <p className="text-[11px] text-slate-400">Add card / starter credits, or team budget</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="font-mono text-emerald-400 font-bold text-[10px]">03</span>
                    <h5 className="font-bold text-white mt-0.5">Compare models</h5>
                    <p className="text-[11px] text-slate-400">Price, latency and quality across models</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="font-mono text-emerald-400 font-bold text-[10px]">04</span>
                    <h5 className="font-bold text-white mt-0.5">Deploy model</h5>
                    <p className="text-[11px] text-slate-400">Serverless endpoint or dedicated GPU</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="font-mono text-emerald-400 font-bold text-[10px]">05</span>
                    <h5 className="font-bold text-white mt-0.5">Chat in Playground</h5>
                    <p className="text-[11px] text-slate-400">Test prompts on the deployed model</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="font-mono text-emerald-400 font-bold text-[10px]">06</span>
                    <h5 className="font-bold text-white mt-0.5">Generate API key</h5>
                    <p className="text-[11px] text-slate-400">Scoped to team or personal project</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="font-mono text-emerald-400 font-bold text-[10px]">07</span>
                    <h5 className="font-bold text-white mt-0.5">Install SDK</h5>
                    <p className="text-[11px] text-slate-400">Python, Node, Go · OpenAI-compatible</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="font-mono text-emerald-400 font-bold text-[10px]">08</span>
                    <h5 className="font-bold text-white mt-0.5">Call the API</h5>
                    <p className="text-[11px] text-slate-400">POST /v1/chat/completions</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="font-mono text-emerald-400 font-bold text-[10px]">09</span>
                    <h5 className="font-bold text-white mt-0.5">Inference request</h5>
                    <p className="text-[11px] text-slate-400">API key + tenant + model + prompt</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="font-mono text-emerald-400 font-bold text-[10px]">10</span>
                    <h5 className="font-bold text-white mt-0.5">Pay per token</h5>
                    <p className="text-[11px] text-slate-400">Credit burn-down or team budget accrual</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 md:col-span-2">
                    <span className="font-mono text-emerald-400 font-bold text-[10px]">11</span>
                    <h5 className="font-bold text-white mt-0.5">Track usage & spend</h5>
                    <p className="text-[11px] text-slate-400">Live usage vs budget or credit balance in real time</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-blue-400" />
              <span>SOC2 Type II & ISO 27001 Certified Security</span>
            </span>
            <span className="font-mono text-slate-400">v2.5.0-prod</span>
          </div>
        </div>

        {/* Right Side: Sign-In Authentication Console */}
        <div className="lg:w-5/12 p-6 md:p-10 bg-slate-950 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto space-y-6">
            <div>
              <span className="text-[10px] uppercase font-mono font-bold text-blue-400 tracking-wider">
                SECURE AUTHENTICATION CONSOLE
              </span>
              <h3 className="text-2xl font-bold text-white tracking-tight mt-1">
                Sign In to Platform
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Choose persona credentials or enter custom workspace credentials.
              </p>
            </div>

            {/* 4 Enterprise Roles with RBAC levels */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">
                  Select User Account & Role:
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">
                  RBAC Enforced
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {/* 1. Platform Admin */}
                <div
                  className={`p-2.5 rounded-xl border transition-all ${
                    activePersona === 'platform-admin'
                      ? 'bg-purple-950/70 border-purple-500 ring-1 ring-purple-500/50 shadow-md'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold text-[11px] flex items-center gap-1.5 text-purple-300">
                        <Shield className="w-3.5 h-3.5 text-purple-400" />
                        <span>Platform Admin</span>
                      </p>
                      <p className="text-[10px] font-semibold text-white mt-0.5">Aishwarya</p>
                      <p className="text-[9px] text-slate-400 font-mono">admin@enterprise.ai</p>
                    </div>
                    <span className="bg-purple-500/20 text-purple-300 text-[9px] font-bold px-1.5 py-0.5 rounded border border-purple-500/30">
                      FULL ACCESS
                    </span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleQuickSignIn('platform-admin')}
                      className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-[10px] py-1 px-2 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>Sign In</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFillCredentials('platform-admin')}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] py-1 px-2 rounded-lg border border-slate-700 cursor-pointer"
                    >
                      Fill
                    </button>
                  </div>
                </div>

                {/* 2. Regional Sales Manager */}
                <div
                  className={`p-2.5 rounded-xl border transition-all ${
                    activePersona === 'sales-manager'
                      ? 'bg-blue-950/70 border-blue-500 ring-1 ring-blue-500/50 shadow-md'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold text-[11px] flex items-center gap-1.5 text-blue-300">
                        <Building2 className="w-3.5 h-3.5 text-blue-400" />
                        <span>Sales Manager</span>
                      </p>
                      <p className="text-[10px] font-semibold text-white mt-0.5">Vikram Joshi</p>
                      <p className="text-[9px] text-slate-400 font-mono">vikram.manager@enterprise.ai</p>
                    </div>
                    <span className="bg-amber-500/20 text-amber-300 text-[9px] font-bold px-1.5 py-0.5 rounded border border-amber-500/30">
                      APPROVAL REQ.
                    </span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleQuickSignIn('sales-manager')}
                      className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-[10px] py-1 px-2 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>Sign In</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFillCredentials('sales-manager')}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] py-1 px-2 rounded-lg border border-slate-700 cursor-pointer"
                    >
                      Fill
                    </button>
                  </div>
                </div>

                {/* 3. Operations Analyst */}
                <div
                  className={`p-2.5 rounded-xl border transition-all ${
                    activePersona === 'ops-analyst'
                      ? 'bg-cyan-950/70 border-cyan-500 ring-1 ring-cyan-500/50 shadow-md'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold text-[11px] flex items-center gap-1.5 text-cyan-300">
                        <Activity className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Operations Analyst</span>
                      </p>
                      <p className="text-[10px] font-semibold text-white mt-0.5">Neha Sharma</p>
                      <p className="text-[9px] text-slate-400 font-mono">neha.ops@enterprise.ai</p>
                    </div>
                    <span className="bg-amber-500/20 text-amber-300 text-[9px] font-bold px-1.5 py-0.5 rounded border border-amber-500/30">
                      APPROVAL REQ.
                    </span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleQuickSignIn('ops-analyst')}
                      className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-[10px] py-1 px-2 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>Sign In</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFillCredentials('ops-analyst')}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] py-1 px-2 rounded-lg border border-slate-700 cursor-pointer"
                    >
                      Fill
                    </button>
                  </div>
                </div>

                {/* 4. Executive Viewer */}
                <div
                  className={`p-2.5 rounded-xl border transition-all ${
                    activePersona === 'executive-viewer' || activePersona === 'user-persona'
                      ? 'bg-emerald-950/70 border-emerald-500 ring-1 ring-emerald-500/50 shadow-md'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold text-[11px] flex items-center gap-1.5 text-emerald-300">
                        <User className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Executive Viewer</span>
                      </p>
                      <p className="text-[10px] font-semibold text-white mt-0.5">Rohan Mehta</p>
                      <p className="text-[9px] text-slate-400 font-mono">rohan.viewer@enterprise.ai</p>
                    </div>
                    <span className="bg-slate-700/60 text-slate-300 text-[9px] font-bold px-1.5 py-0.5 rounded border border-slate-600/50">
                      READ ONLY
                    </span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleQuickSignIn('executive-viewer')}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[10px] py-1 px-2 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>Sign In</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFillCredentials('executive-viewer')}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] py-1 px-2 rounded-lg border border-slate-700 cursor-pointer"
                    >
                      Fill
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Auth Method Tabs: Password vs OTP vs SSO */}
            <div className="flex items-center space-x-1 p-1 bg-slate-900 rounded-lg border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setAuthMethod('password')}
                className={`flex-1 py-1.5 rounded-md font-medium text-[11px] transition-colors cursor-pointer ${
                  authMethod === 'password'
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Password
              </button>
              <button
                type="button"
                onClick={() => setAuthMethod('otp')}
                className={`flex-1 py-1.5 rounded-md font-medium text-[11px] transition-colors cursor-pointer ${
                  authMethod === 'otp'
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                OTP Code
              </button>
              <button
                type="button"
                onClick={() => setAuthMethod('sso')}
                className={`flex-1 py-1.5 rounded-md font-medium text-[11px] transition-colors cursor-pointer ${
                  authMethod === 'sso'
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Enterprise SSO
              </button>
            </div>

            {/* Error Message */}
            {loginError && (
              <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-500/50 text-rose-300 text-[11px] flex items-center space-x-2 animate-in fade-in duration-150">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-3.5 text-xs">
              {authMethod === 'sso' ? (
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Corporate Domain (Okta / Azure AD)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={ssoDomain}
                      onChange={(e) => setSsoDomain(e.target.value)}
                      placeholder="e.g. enterprise.ai or company.okta.com"
                      className="w-full pl-3 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    You will be redirected to your company identity provider.
                  </p>
                </div>
              ) : (
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Work Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full pl-3 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              {authMethod === 'password' && (
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full pl-3 pr-9 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              )}

              {authMethod === 'otp' && (
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    One-Time Passcode (6 digits)
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="Enter 6-digit code"
                    className="w-full text-center font-mono tracking-widest text-sm py-2 bg-slate-900 border border-slate-800 rounded-lg text-emerald-400 focus:outline-none focus:border-emerald-500"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Enter 6-digit verification code from your authenticator app.</p>
                </div>
              )}

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center space-x-2 text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500 accent-blue-600 w-3.5 h-3.5"
                  />
                  <span className="text-[11px]">Remember workstation</span>
                </label>
                <button
                  type="button"
                  className="text-blue-400 hover:underline text-[11px] cursor-pointer"
                >
                  Forgot credentials?
                </button>
              </div>

              {/* Main Submit Button */}
              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center space-x-2 cursor-pointer mt-2"
              >
                <span>Launch Persona Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-mono">
                <span className="bg-slate-950 px-2 text-slate-500">Or continue with federated ID</span>
              </div>
            </div>

            {/* Google Sign In */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-850 text-slate-300 font-medium text-xs rounded-lg border border-slate-800 transition-colors flex items-center justify-center space-x-2.5 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
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
              <span>Sign in with Google Workspace</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
