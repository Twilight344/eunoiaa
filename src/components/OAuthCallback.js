import { useEffect } from 'react';

const OAuthCallback = () => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');

    const targetOrigin =
      window.location.hostname === 'localhost'
        ? 'http://localhost:5173'
        : 'https://eunoiaa.vercel.app';

    if (error) {
      console.error('OAuth error:', error);
      window.opener.postMessage({
        type: 'OAUTH_ERROR',
        error: error
      }, targetOrigin);
      window.close();
      return;
    }

    if (code) {
      console.log('OAuth code received:', code);

      if (window.location.pathname.includes('/auth/callback')) {
        window.opener.postMessage({
          type: 'GOOGLE_AUTH_SUCCESS',
          code: code
        }, targetOrigin);
      }

      window.close();
    } else {
      console.error('No authorization code received');
      window.opener.postMessage({
        type: 'OAUTH_ERROR',
        error: 'No authorization code received'
      }, targetOrigin);
      window.close();
    }
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
        <p>Completing authentication...</p>
      </div>
    </div>
  );
};

export default OAuthCallback;
