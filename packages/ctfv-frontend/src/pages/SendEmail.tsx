import React, { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Alert, AlertDescription } from '../components/ui/alert';

const SendEmail = () => {
  const [resendStatus, setResendStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.emailVerified) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleResendEmail = async () => {
    setResendStatus('sending');
    try {
      const response = await fetch('http://localhost:8787/api/users/auth/send-verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });
      
      if (response.ok) {
        setResendStatus('sent');
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Failed to resend verification email');
      }
    } catch (error) {
      console.error('Error resending verification email:', error);
      setResendStatus('error');
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Verify Your Email</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center mb-4">
          We've sent a verification email to <strong>{user.email}</strong>. 
          Please check your inbox and click the verification link to complete your registration.
        </p>
        {resendStatus === 'sent' && (
          <Alert className="mb-4">
            <AlertDescription>
              Verification email has been resent. Please check your inbox.
            </AlertDescription>
          </Alert>
        )}
        {resendStatus === 'error' && (
          <Alert className="mb-4" variant="destructive">
            <AlertDescription>
              Failed to resend verification email. Please try again later.
            </AlertDescription>
          </Alert>
        )}
        <Button 
          onClick={handleResendEmail} 
          disabled={resendStatus === 'sending' || resendStatus === 'sent'}
          className="w-full"
        >
          {resendStatus === 'sending' ? 'Sending...' : 'Resend Verification Email'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SendEmail;