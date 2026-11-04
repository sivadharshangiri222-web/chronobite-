import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Mail, ArrowRight, CheckCircle, KeyRound } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <Link to="/login" className="inline-flex items-center gap-2 mb-2 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-swiggy-deepOrange flex items-center justify-center text-white shadow-glow group-hover:scale-105 transition-transform">
            <KeyRound className="w-6 h-6" />
          </div>
          <span className="text-3xl font-black tracking-tight text-white">Chrono<span className="text-primary">Bite</span></span>
        </Link>
        <h2 className="text-xl font-black text-white mt-1">Reset your password</h2>
        <p className="text-xs text-muted-foreground">Enter your email and we'll send a password recovery token</p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 relative z-10">
        <div className="bg-card rounded-2xl p-6 border border-white/10 shadow-card">
          {submitted ? (
            <div className="text-center py-4 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-white">Reset Link Dispatched</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                If an account exists for <strong className="text-white">{email}</strong>, you will receive instructions to reset your password shortly.
              </p>
              <Link
                to="/login"
                className="mt-4 inline-block px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-glow"
              >
                Back to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Email address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. customer@chronobite.com"
                    className="w-full bg-swiggy-surface border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-extrabold text-xs uppercase tracking-wider shadow-glow transition-all flex items-center justify-center gap-2"
              >
                <span>Send Reset Link</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="text-center pt-2">
                <Link to="/login" className="text-xs text-muted-foreground hover:text-white font-semibold">
                  Remember password? Sign in
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
