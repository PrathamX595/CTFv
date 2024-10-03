import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';

const VerifyEmail = () => {
  const [verificationStatus, setVerificationStatus] = useState('verifying');
  const { verifyEmail } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verify = async () => {
      const searchParams = new URLSearchParams(location.search);
      const token = searchParams.get('token');

      if (!token) {
        setVerificationStatus('error');
        return;
      }

      try {
        await verifyEmail(token);
        setVerificationStatus('success');
      } catch (error) {
        console.error('Email verification error:', error);
        setVerificationStatus('error');
      }
    };

    verify();
  }, [location, verifyEmail]);

  const handleContinue = () => {
    navigate('/');
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Email Verification</CardTitle>
      </CardHeader>
      <CardContent>
        {verificationStatus === 'verifying' && (
          <p className="text-center">Verifying your email...</p>
        )}
        {verificationStatus === 'success' && (
          <>
            <p className="text-center text-green-600 mb-4">Your email has been successfully verified!</p>
            <Button onClick={handleContinue} className="w-full">
              Continue to Dashboard
            </Button>
          </>
        )}
        {verificationStatus === 'error' && (
          <>
            <p className="text-center text-red-600 mb-4">
              There was an error verifying your email. The link may be invalid or expired.
            </p>
            <Button onClick={() => navigate('/login')} className="w-full">
              Back to Login
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default VerifyEmail;