import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { base44 } from '../../services/base44Engine';
import { Clock, ShieldCheck, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';

export default function VerifyOtp() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [otp, setOtp] = useState('');
  const [pendingReg, setPendingReg] = useState(null);
  const [error, setError] = useState(null);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('chronobite_pending_reg');
      if (raw) {
        setPendingReg(JSON.parse(raw));
      } else {
        // Fallback demo pending data
        setPendingReg({
          email: 'newuser@chronobite.com',
          full_name: 'New ChronoBite Explorer',
          app_role: 'customer'
        });
      }
    } catch {
      // fallback
    }
  }, []);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError(null);
    setVerifying(true);

    try {
      // Validate OTP
      base44.auth.verifyOtp(otp || '123456');

      // Create user
      const user = register(pendingReg);

      // Execute role-specific setup
      const role = pendingReg.app_role || 'customer';
      if (role === 'customer') {
        base44.auth.updateMe({ app_role: 'customer' });
        navigate('/app');
      } else if (role === 'restaurant') {
        base44.auth.updateMe({ app_role: 'restaurant', restaurant_id: pendingReg.restaurant_id || 'rest_1' });
        navigate('/restaurant');
      } else if (role === 'delivery_partner') {
        await base44.functions.LinkDeliveryPartner({
          user_id: user.id,
          restaurant_id: pendingReg.restaurant_id || 'rest_1',
          name: user.full_name,
          email: user.email,
          phone: pendingReg.phone,
          vehicle: pendingReg.vehicle
        });
        base44.auth.updateMe({ app_role: 'delivery_partner', restaurant_id: pendingReg.restaurant_id || 'rest_1' });
        navigate('/delivery');
      } else {
        navigate('/app');
      }
      sessionStorage.removeItem('chronobite_pending_reg');
    } catch (err) {
      setError(err.message);
      setVerifying(false);
    }
  };

  const handleUseDemoOtp = () => {
    setOtp('123456');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-swiggy-deepOrange flex items-center justify-center text-white shadow-glow mx-auto mb-2">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-black text-white">Verify One-Time Password (OTP)</h2>
        <p className="text-xs text-muted-foreground mt-1">
          A 6-digit verification code was sent to <strong className="text-white">{pendingReg?.email}</strong>
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 relative z-10">
        <div className="bg-card rounded-2xl p-6 border border-white/10 shadow-card">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Demo Helper */}
          <div className="mb-4 p-3 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-between text-xs">
            <span className="text-white font-medium flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>Demo OTP: <strong>123456</strong></span>
            </span>
            <button
              type="button"
              onClick={handleUseDemoOtp}
              className="text-primary font-bold hover:underline"
            >
              Auto-fill
            </button>
          </div>

          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">
                Enter 6-digit Code
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                className="w-full bg-swiggy-surface border border-white/10 rounded-xl p-3 text-center text-xl font-mono tracking-widest text-white focus:outline-none focus:border-primary"
              />
            </div>

            <button
              type="submit"
              disabled={verifying}
              className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-50 text-white font-extrabold text-xs uppercase tracking-wider shadow-glow transition-all flex items-center justify-center gap-2"
            >
              {verifying ? (
                <span>Configuring Role Space...</span>
              ) : (
                <>
                  <span>Verify & Proceed to Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Wrong email address?{' '}
            <Link to="/register" className="text-primary font-bold hover:underline">
              Change Details
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
