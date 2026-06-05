import React, { useEffect, useRef, useState } from 'react';
import { loadPaymentWidget } from '@tosspayments/payment-widget-sdk';
import { useNavigate } from 'react-router-dom';

const TossCheckoutWidget = ({ amount = 4900, orderName = 'SYNCRIG 프리미엄 1개월 구독' }) => {
  const paymentWidgetRef = useRef(null);
  const paymentMethodsWidgetRef = useRef(null);
  const [price] = useState(amount);
  const navigate = useNavigate();

  // Toss 공식 테스트 키 (문서 제공)
  const clientKey = import.meta.env.VITE_TOSS_CLIENT_KEY || 'test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm';
  // 고객 키는 렌더링 시마다 바뀌지 않도록 초기화
  const [customerKey] = useState(() => 'user_' + Math.random().toString(36).substring(2, 10));

  useEffect(() => {
    (async () => {
      try {
        // 결제위젯 초기화
        const paymentWidget = await loadPaymentWidget(clientKey, customerKey);
        paymentWidgetRef.current = paymentWidget;

        // 결제위젯 렌더링
        const paymentMethodsWidget = paymentWidget.renderPaymentMethods(
          '#payment-widget',
          { value: price },
          { variantKey: 'DEFAULT' }
        );

        // 이용약관 렌더링
        paymentWidget.renderAgreement('#agreement', { variantKey: 'AGREEMENT' });

        paymentMethodsWidgetRef.current = paymentMethodsWidget;
      } catch (error) {
        console.error('Toss 결제 위젯 로드 실패:', error);
      }
    })();
  }, [clientKey, customerKey, price]);

  const handlePayment = async () => {
    const paymentWidget = paymentWidgetRef.current;
    
    if (!paymentWidget) {
      console.error('결제 위젯이 초기화되지 않았습니다.');
      return;
    }

    try {
      // 결제창 호출
      await paymentWidget.requestPayment({
        orderId: 'order_' + Math.random().toString(36).substring(2, 10),
        orderName: orderName,
        successUrl: `${window.location.origin}/payment-success`,
        failUrl: `${window.location.origin}/payment-fail`,
        customerEmail: 'customer@syncrig.test', // 예시
        customerName: 'SYNCRIG 유저',
      });
    } catch (err) {
      // 결제창 열기 실패 또는 사용자가 닫았을 때
      console.error('Toss 결제 요청 실패:', err);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-cyber-card p-6 rounded-xl border border-gray-700">
      <h2 className="text-xl font-bold text-gray-100 mb-4">결제 수단 선택</h2>
      {/* 결제위젯 렌더링 영역 */}
      <div id="payment-widget" className="mb-4 bg-white rounded-lg p-2" />
      {/* 이용약관 렌더링 영역 */}
      <div id="agreement" className="mb-6 bg-white rounded-lg p-2" />
      
      <button
        onClick={handlePayment}
        className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors"
      >
        {price.toLocaleString()}원 결제하기
      </button>
      <button
        onClick={() => navigate(-1)}
        className="w-full mt-3 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-colors"
      >
        취소
      </button>
    </div>
  );
};

export default TossCheckoutWidget;
