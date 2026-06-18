import axios from 'axios';

/**
 * Sends a verification code via Resend Email API.
 * If RESEND_API_KEY is not configured, logs the code to the console for testing.
 * 
 * @param {string} email - Recipient's email address
 * @param {string} code - 6-digit verification code
 * @returns {Promise<{success: boolean, mock?: boolean, data?: any}>}
 */
export const sendVerificationEmail = async (email, code) => {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

  if (!apiKey) {
    console.log(`[Email Mock] ${email}로 인증 코드가 발송되었습니다: ${code}`);
    return { success: true, mock: true, code };
  }

  try {
    const response = await axios.post(
      'https://api.resend.com/emails',
      {
        from: `SYNCRIG <${fromEmail}>`,
        to: [email],
        subject: '[SYNCRIG] 이메일 인증 코드를 입력해주세요.',
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 500px; margin: 0 auto; padding: 30px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff; color: #1f2937;">
            <div style="text-align: center; margin-bottom: 24px;">
              <h2 style="color: #2563eb; font-weight: 800; font-size: 24px; margin: 0; text-transform: uppercase; letter-spacing: 1px;">SYNCRIG PLATFORM</h2>
              <p style="color: #6b7280; font-size: 14px; margin: 4px 0 0 0;">통합 하드웨어 최적화 플랫폼</p>
            </div>
            
            <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
            
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 16px;">안녕하세요.</p>
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 24px;">SYNCRIG 서비스 회원가입을 완료하기 위한 6자리 이메일 인증 코드를 다음과 같이 발송해 드립니다.</p>
            
            <div style="background-color: #f3f4f6; border-radius: 8px; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #1e3a8a; margin: 24px 0; border: 1px solid #d1d5db;">
              ${code}
            </div>
            
            <p style="font-size: 14px; line-height: 1.6; color: #4b5563; margin-bottom: 24px;">본 인증 코드는 발송된 시점부터 <strong>5분간 유효</strong>합니다. 5분이 지난 경우 새로운 코드를 재요청하셔야 합니다.</p>
            
            <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
            
            <p style="font-size: 12px; line-height: 1.5; color: #9ca3af; text-align: center; margin: 0;">
              본 메일은 발신 전용 메일이므로 회신이 불가합니다.<br />
              본인이 요청하지 않은 경우, 이 메일을 무시하고 삭제해 주세요.
            </p>
          </div>
        `
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return { success: true, data: response.data };
  } catch (error) {
    const errorDetails = error.response?.data || error.message;
    console.error('[Resend API Error]:', errorDetails);
    throw new Error(error.response?.data?.message || '이메일 인증 코드 발송에 실패했습니다. 관리자에게 문의하세요.');
  }
};
