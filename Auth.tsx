import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Lock, ArrowRight, BookOpen, Mail, KeyRound, CheckCircle, AlertTriangle } from 'lucide-react';

type AuthView = 'login' | 'register' | 'forgot' | 'reset';

const Auth: React.FC = () => {
  const [view, setView] = useState<AuthView>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Fake token for reset flow
  const [resetToken, setResetToken] = useState('');

  const { login, register, forgotPassword, resetPassword } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Validate Gmail format
  const isValidGmail = (email: string) => {
    return /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);
  };

  const handleLoginRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    if (!email || !password) {
      setError('Vui lòng điền đầy đủ thông tin');
      setLoading(false);
      return;
    }

    if (!isValidGmail(email)) {
        setError('Hệ thống chỉ chấp nhận tài khoản @gmail.com');
        setLoading(false);
        return;
    }

    try {
      let success;
      if (view === 'login') {
        success = await login(email, password);
        if (!success) setError('Email hoặc mật khẩu không đúng');
      } else {
        success = await register(email, password);
        if (!success) setError('Email này đã được sử dụng');
      }

      if (success) {
        navigate('/');
      }
    } catch (err) {
      setError('Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      setSuccessMsg('');
      setLoading(true);

      if (!isValidGmail(email)) {
        setError('Vui lòng nhập địa chỉ Gmail hợp lệ (@gmail.com)');
        setLoading(false);
        return;
      }

      try {
          const result = await forgotPassword(email);
          if (result.success) {
              setSuccessMsg(result.message);
              // Simulation: Store token in state to allow user to proceed in this demo
              if (result.token) setResetToken(result.token);
          } else {
              setError(result.message);
          }
      } catch (err) {
          setError('Lỗi kết nối. Vui lòng thử lại.');
      } finally {
          setLoading(false);
      }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      setLoading(true);

      if (password !== confirmPassword) {
          setError('Mật khẩu xác nhận không khớp');
          setLoading(false);
          return;
      }

      try {
          const success = await resetPassword(resetToken, password);
          if (success) {
              setSuccessMsg('Đổi mật khẩu thành công! Bạn có thể đăng nhập ngay.');
              setTimeout(() => {
                  setView('login');
                  setSuccessMsg('');
                  setPassword('');
                  setConfirmPassword('');
              }, 2000);
          } else {
              setError('Link khôi phục không hợp lệ hoặc đã hết hạn.');
          }
      } catch (err) {
          setError('Lỗi hệ thống.');
      } finally {
          setLoading(false);
      }
  };

  // Render Form Headers
  const renderHeader = () => {
      switch(view) {
          case 'login': return 'Đăng nhập';
          case 'register': return 'Đăng ký';
          case 'forgot': return 'Quên mật khẩu';
          case 'reset': return 'Đặt lại mật khẩu';
      }
  };

  const renderSubtext = () => {
    switch(view) {
        case 'login': return 'Đăng nhập bằng Gmail để tiếp tục';
        case 'register': return 'Tạo tài khoản mới với Gmail của bạn';
        case 'forgot': return 'Nhập Gmail để nhận liên kết khôi phục';
        case 'reset': return 'Nhập mật khẩu mới cho tài khoản của bạn';
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md border border-gray-100 relative overflow-hidden">
        
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-indigo-50 rounded-full blur-xl opacity-50 pointer-events-none"></div>

        <div className="text-center relative z-10">
          <div className="mx-auto h-12 w-12 bg-indigo-600 rounded-lg flex items-center justify-center text-white mb-4 shadow-indigo-200 shadow-lg">
            {view === 'forgot' || view === 'reset' ? <KeyRound size={24} /> : <BookOpen size={24} />}
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            {renderHeader()}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {renderSubtext()}
          </p>
        </div>
        
        {/* SUCCESS MESSAGE (Used mostly for Forgot Password Demo) */}
        {successMsg && (
             <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-700 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <CheckCircle size={16} />
                    <span>{successMsg}</span>
                </div>
                {/* DEMO ONLY: Button to simulate clicking the email link */}
                {view === 'forgot' && resetToken && (
                    <button 
                        onClick={() => setView('reset')}
                        className="mt-2 text-xs bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 transition w-fit self-center"
                    >
                        (Demo) Click vào đây để mở link Reset
                    </button>
                )}
             </div>
        )}

        {/* ERROR MESSAGE */}
        {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-600 flex items-center gap-2">
               <AlertTriangle size={16} />
               {error}
            </div>
        )}

        {/* LOGIN / REGISTER FORM */}
        {(view === 'login' || view === 'register') && (
            <form className="mt-8 space-y-6" onSubmit={handleLoginRegister}>
            <div className="rounded-md space-y-4">
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ Gmail</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className="text-gray-400" />
                    </div>
                    <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="example@gmail.com"
                    />
                </div>
                </div>
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-gray-400" />
                    </div>
                    <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="••••••••"
                    />
                </div>
                </div>
            </div>

            {view === 'login' && (
                <div className="flex items-center justify-end">
                    <button 
                        type="button"
                        onClick={() => { setView('forgot'); setError(''); setSuccessMsg(''); }}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                        Quên mật khẩu?
                    </button>
                </div>
            )}

            <div>
                <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-lg shadow-indigo-200"
                >
                {loading ? 'Đang xử lý...' : (
                    <span className="flex items-center gap-2">
                        {view === 'login' ? 'Đăng nhập' : 'Đăng ký'}
                        <ArrowRight size={16} />
                    </span>
                )}
                </button>
            </div>
            </form>
        )}

        {/* FORGOT PASSWORD FORM */}
        {view === 'forgot' && (
             <form className="mt-8 space-y-6" onSubmit={handleForgotPassword}>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nhập Gmail đăng ký</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail size={18} className="text-gray-400" />
                        </div>
                        <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="example@gmail.com"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                >
                    {loading ? 'Đang gửi...' : 'Gửi link khôi phục'}
                </button>
                
                <div className="text-center">
                    <button 
                        type="button"
                        onClick={() => { setView('login'); setError(''); setSuccessMsg(''); }}
                        className="text-sm text-gray-500 hover:text-gray-900"
                    >
                        Quay lại đăng nhập
                    </button>
                </div>
             </form>
        )}

        {/* RESET PASSWORD FORM */}
        {view === 'reset' && (
             <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock size={18} className="text-gray-400" />
                            </div>
                            <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Mật khẩu mới"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock size={18} className="text-gray-400" />
                            </div>
                            <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Nhập lại mật khẩu"
                            />
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                >
                    {loading ? 'Đang cập nhật...' : 'Đổi mật khẩu'}
                </button>
             </form>
        )}
        
        {/* Toggle Login/Register */}
        {(view === 'login' || view === 'register') && (
            <div className="text-center mt-4 pt-4 border-t border-gray-100">
                <button 
                    onClick={() => { setView(view === 'login' ? 'register' : 'login'); setError(''); setSuccessMsg(''); }}
                    className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
                >
                    {view === 'login' ? 'Chưa có tài khoản? Đăng ký ngay' : 'Đã có tài khoản? Đăng nhập'}
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default Auth;