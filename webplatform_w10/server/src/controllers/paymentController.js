import axios from 'axios';
import { db } from '../config/db.js';

export const confirmPayment = async (req, res, next) => {
  const { paymentKey, orderId, amount } = req.body;
  const userId = req.user.id;

  if (!paymentKey || !orderId || !amount) {
    return res.status(400).json({ success: false, message: '결제 필수 파라미터가 누락되었습니다.' });
  }

  const widgetSecretKey = process.env.TOSS_SECRET_KEY || 'test_sk_mock_key';

  try {
    // Basic Auth 용 시크릿 키 인코딩 (뒤에 콜론(:) 추가)
    const encryptedSecretKey = Buffer.from(`${widgetSecretKey}:`).toString('base64');
    
    let isSuccess = false;
    
    // 만약 테스트 환경이거나 mock key가 들어간 경우 서버 단의 승인 통신을 모킹함
    if (widgetSecretKey === 'test_sk_mock_key' || widgetSecretKey.includes('test_sk_your_secret_key')) {
      console.log(`[Mock Toss Payment] 결제 승인 우회 - PaymentKey: ${paymentKey}`);
      isSuccess = true;
    } else {
      // 실제 토스페이먼츠 승인 API 호출
      const response = await axios.post(
        'https://api.tosspayments.com/v1/payments/confirm',
        { paymentKey, orderId, amount },
        {
          headers: {
            Authorization: `Basic ${encryptedSecretKey}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.status === 200) {
        isSuccess = true;
      }
    }

    if (isSuccess) {
      // DB 상태 업데이트
      if (db.isPgActive()) {
        await db.query(
          "UPDATE users SET subscription_status = 'premium', toss_payment_key = $1 WHERE id = $2",
          [paymentKey, userId]
        );
      } else {
        // Mock DB 사용 중일 때
        await db.query(`update users set subscription_status = 'premium' where id = '${userId}'`, [paymentKey, userId]);
      }
      return res.status(200).json({ success: true, message: '결제가 성공적으로 승인되었습니다.' });
    }
  } catch (err) {
    console.error('Toss Payments 승인 실패:', err.response?.data || err.message);
    res.status(400).json({ 
      success: false, 
      message: '결제 검증에 실패했습니다.', 
      error: err.response?.data || err.message 
    });
  }
};
