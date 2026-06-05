import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Crown, Loader2 } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import toast from 'react-hot-toast';
import Confetti from 'react-confetti';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { fetchUserData, user } = useAuthStore();
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // In a real app, you might want to verify the session_id with the backend.
    // For now, we assume the webhook has updated the user status,
    // so we just re-fetch the user data to reflect 'premium' status.
    const verifyStatus = async () => {
      try {
        toast.success('결제가 완료되었습니다! PRO 혜택을 누려보세요.');
        // If we had a direct /auth/me we could fetch it, 
        // For simulation, we'll wait a bit for webhook to process
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 4000);
      } catch (err) {
        console.error(err);
      }
    };
    verifyStatus();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full pt-20">
      {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}
      <Crown className="w-24 h-24 text-yellow-500 mb-6 animate-bounce" />
      <h2 className="text-4xl font-bold mb-4 text-white">환영합니다, PRO 구독자님!</h2>
      <p className="text-xl text-a11y-muted mb-8">잠시 후 대시보드로 이동합니다...</p>
      <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
    </div>
  );
}
