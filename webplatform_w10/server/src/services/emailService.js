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
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 500px; margin: 0 auto; padding: 40px 30px; border-radius: 16px; background-color: #0b0f19; color: #e5e7eb; border: 1px solid #1e293b; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.3);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h2 style="color: #3b82f6; font-weight: 900; font-size: 26px; margin: 0; text-transform: uppercase; letter-spacing: 2px;">SYNCRIG</h2>
              <p style="color: #9ca3af; font-size: 13px; margin: 6px 0 0 0; letter-spacing: 1px;">Hardware Profile Optimization Platform</p>
            </div>
            
            <div style="height: 1px; background-color: #1e293b; margin: 24px 0;"></div>
            
            <div style="padding: 10px 0;">
              <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px 0; color: #ffffff;">안녕하세요, SYNCRIG입니다.</p>
              <p style="font-size: 15px; line-height: 1.6; margin: 0 0 28px 0; color: #d1d5db;">회원가입을 진행하고 계정을 보호하기 위해 아래의 6자리 인증 코드를 인증 창에 입력해 주세요.</p>
              
              <div style="background-color: #111827; border: 1px solid #3b82f6; border-radius: 12px; padding: 24px; text-align: center; font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #3b82f6; margin: 28px 0;">
                ${code}
              </div>
              
              <p style="font-size: 13px; line-height: 1.6; color: #9ca3af; margin: 28px 0 0 0; text-align: center;">본 인증 코드는 발송 후 <strong style="color: #ef4444;">5분 동안 유효</strong>합니다.</p>
            </div>
            
            <div style="height: 1px; background-color: #1e293b; margin: 28px 0;"></div>
            
            <p style="font-size: 11px; line-height: 1.6; color: #4b5563; text-align: center; margin: 0;">
              본 메일은 발신 전용 메일로 회신되지 않습니다.<br />
              본인이 요청하지 않은 가입 시도라면 이 메일을 즉시 무시하거나 삭제해 주시기 바랍니다.
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
