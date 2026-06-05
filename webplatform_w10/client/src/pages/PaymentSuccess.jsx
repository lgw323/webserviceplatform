import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Crown, Loader2 } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import toast from 'react-hot-toast';
import Confetti from 'react-confetti';
import apiClient from '../api/apiClient';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { fetchUserData } = useAuthStore();
  const [status, setStatus] = useState('processing'); // 'processing', 'success', 'fail'

  useEffect(() => {
    const confirmPayment = async () => {
      const paymentKey = searchParams.get('paymentKey');
      const orderId = searchParams.get('orderId');
      const amount = searchParams.get('amount');

      if (!paymentKey || !orderId || !amount) {
        setStatus('fail');
        toast.error('잘못된 결제 승인 요청입니다.');
        setTimeout(() => navigate('/dashboard'), 3000);
        return;
      }

      try {
        // 서버에 결제 승인 요청
        await apiClient.post('/payments/confirm', {
          paymentKey,
          orderId,
          amount: Number(amount)
        });

        setStatus('success');
        toast.success('결제가 성공적으로 완료되었습니다! PRO 혜택을 누려보세요.');
        
        // 유저 정보 갱신 (premium 상태 반영)
        await fetchUserData();

        setTimeout(() => {
          navigate('/dashboard');
        }, 4000);
      } catch (err) {
        console.error('결제 승인 실패:', err);
        setStatus('fail');
        toast.error('결제 승인에 실패했습니다. 고객센터에 문의해주세요.');
      }
    };

    confirmPayment();
  }, [searchParams, navigate, fetchUserData]);

  return (
    <div className="flex flex-col items-center justify-center h-full pt-20">
      {status === 'processing' && (
        <>
          <Loader2 className="w-16 h-16 animate-spin text-yellow-500 mb-6" />
          <h2 className="text-3xl font-bold mb-4 text-white">결제 승인 중입니다...</h2>
          <p className="text-xl text-a11y-muted">창을 닫지 말고 잠시만 기다려주세요.</p>
        </>
      )}

      {status === 'success' && (
        <>
          <Confetti recycle={false} numberOfPieces={500} />
          <Crown className="w-24 h-24 text-yellow-500 mb-6 animate-bounce" />
          <h2 className="text-4xl font-bold mb-4 text-white">환영합니다, PRO 구독자님!</h2>
          <p className="text-xl text-a11y-muted mb-8">잠시 후 대시보드로 이동합니다...</p>
          <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
        </>
      )}

      {status === 'fail' && (
        <>
          <div className="w-24 h-24 text-red-500 mb-6 flex items-center justify-center text-6xl">❌</div>
          <h2 className="text-4xl font-bold mb-4 text-white">결제 승인 실패</h2>
          <p className="text-xl text-a11y-muted mb-8">오류가 발생했습니다. 잠시 후 이동합니다.</p>
        </>
      )}
    </div>
  );
}
