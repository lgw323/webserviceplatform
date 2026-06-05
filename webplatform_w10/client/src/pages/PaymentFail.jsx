import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { XCircle, ArrowLeft } from 'lucide-react';

export default function PaymentFail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');
  const message = searchParams.get('message');

  return (
    <div className="flex flex-col items-center justify-center h-full pt-20">
      <XCircle className="w-20 h-20 text-red-500 mb-6" />
      <h2 className="text-3xl font-bold mb-4">결제가 실패했습니다</h2>
      <p className="text-a11y-muted mb-4">
        {message ? message : '결제 과정에서 오류가 발생했거나 사용자가 취소했습니다.'}
      </p>
      {code && (
        <p className="text-sm text-gray-500 mb-8">에러 코드: {code}</p>
      )}
      
      <button 
        onClick={() => navigate('/subscription')}
        className="flex items-center gap-2 px-6 py-3 bg-cyber-dark hover:bg-gray-800 border border-gray-700 rounded-lg text-white font-medium transition-colors"
      >
        <ArrowLeft className="w-5 h-5" /> 다시 시도하기
      </button>
    </div>
  );
}
