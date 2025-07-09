import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Google OAuth
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const GOOGLE_REDIRECT_URI = process.env.REACT_APP_GOOGLE_REDIRECT_URI;

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleLogin = async () => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } else {
      alert(data.error || "Login failed");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}&response_type=code&scope=openid%20email%20profile`;
      const popup = window.open(googleAuthUrl, 'googleAuth', 'width=500,height=600');
      let loginHandled = false;

      const messageHandler = async (event) => {


      const expectedOrigin = window.location.hostname === 'localhost'
    ? 'http://localhost:5173'
    : 'https://eunoiaa.vercel.app';

      if (event.origin !== expectedOrigin) return;


        
        // if (event.origin !== window.location.origin) return;
        if (loginHandled) return;
        // Only handle Google OAuth success messages
        if (event.data.type === 'GOOGLE_AUTH_SUCCESS' && event.data.code) {
          loginHandled = true;
          window.removeEventListener('message', messageHandler);
          const { code } = event.data;
          const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/google`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code })
          });
          const data = await res.json();
          if (data.token) {
            localStorage.setItem("token", data.token);
            navigate("/dashboard");
          } else {
            alert(data.error || "Google login failed");
          }
          popup.close();
        }
      };

      window.addEventListener('message', messageHandler);

      // Detect popup close and show error if login not handled
      const popupCheck = setInterval(() => {
        if (popup.closed) {
          clearInterval(popupCheck);
          window.removeEventListener('message', messageHandler);
          if (!loginHandled) {
            alert('Google authentication failed');
          }
        }
      }, 500);
    } catch (error) {
      console.error('Google login error:', error);
      alert('Google login failed');
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* AMOLED Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-black"></div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.015]">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(90deg, #fff 1px, transparent 1px),
              linear-gradient(0deg, #fff 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        
        {/* Subtle geometric elements */}
        <div className="absolute top-20 left-10 w-32 h-32 border border-white/5 rotate-45"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 border border-white/5 rounded-full"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo and Header */}
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-20 h-20 mb-4 bg-white/10 rounded-2xl border border-white/20">
              <svg viewBox="0 0 64 64" fill="none" className="w-12 h-12 mx-auto" xmlns="http://www.w3.org/2000/svg">
                <path d="M32 4C32 4 24 20 32 36C40 20 32 4 32 4Z" fill="#A78BFA"/>
                <path d="M32 36C32 36 18 28 4 36C18 44 32 36 32 36Z" fill="#F472B6"/>
                <path d="M32 36C32 36 46 28 60 36C46 44 32 36 32 36Z" fill="#60A5FA"/>
                <circle cx="32" cy="36" r="6" fill="#FDE68A"/>
              </svg>
            </div>
            <h1 className="text-4xl font-black text-white mb-4 tracking-tight">
              EUNOIA
            </h1>
            <p className="text-white/60 text-lg font-light">
              Your sanctuary for mindful living
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-black/50 backdrop-blur-xl rounded-2xl p-4 border border-white/10 shadow-2xl">
            <div className="space-y-6">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-3">
                  Username
                </label>
                <input 
                  className="w-full p-4 rounded-xl bg-white/5 text-white placeholder-white/40 border border-white/10 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/10 transition-all duration-200" 
                  placeholder="Enter your username" 
                  onChange={(e) => setUsername(e.target.value)} 
                />
              </div>
              
              <div>
                <label className="block text-white/80 text-sm font-medium mb-3">
                  Password
                </label>
                <input 
                  className="w-full p-4 rounded-xl bg-white/5 text-white placeholder-white/40 border border-white/10 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/10 transition-all duration-200" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Enter your password" 
                  onChange={(e) => setPassword(e.target.value)} 
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-black hover:text-black text-sm"
                  onClick={() => setShowPassword((prev) => !prev)}
                  style={{ marginTop: '-40px', marginRight: '10px' }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    // Eye-off icon
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="22" height="22">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7s4-7 9-7c1.13 0 2.21.19 3.225.54M19.07 4.93A9.953 9.953 0 0121 12c0 1.657-.672 3.157-1.77 4.29M15 12a3 3 0 11-6 0 3 3 0 016 0zM3 3l18 18" />
                    </svg>
                  ) : (
                    // Eye icon
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="22" height="22">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm7 0c0 3-4 7-9 7s-9-4-9-7 4-7 9-7 9 4 9 7z" />
                    </svg>
                  )}
                </button>
              </div>
              
              <button 
                className="w-full p-4 rounded-xl bg-white text-black font-bold hover:bg-white/90 transform hover:scale-105 transition-all duration-200 shadow-lg" 
                onClick={handleLogin}
              >
                Sign In
              </button>
            </div>
            
            {/* OAuth Buttons */}
            <div className="mt-6 space-y-3">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-black/50 text-white/60">Or continue with</span>
                </div>
              </div>
              
              <button 
                onClick={handleGoogleLogin}
                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all duration-200 flex items-center justify-center space-x-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-white/60 text-sm">
                Don't have an account?{' '}
                <button 
                  onClick={() => navigate('/signup')}
                  className="text-white hover:text-white/80 font-medium transition-colors duration-200"
                >
                  Sign up
                </button>
              </p>
            </div>
          </div>
          
          <div className="text-center mt-2">
            <p className="text-xs text-white/40">
              Your mental health matters. Take a moment for yourself today.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
