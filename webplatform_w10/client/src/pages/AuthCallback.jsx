import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import * as api from '../api/apiClient';

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { fetchUserData } = useAuthStore();

  useEffect(() => {
    const processCallback = async () => {
      // 1. URL 쿼리 파라미터에서 토큰 추출
      const params = new URLSearchParams(location.search);
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');
      const error = params.get('error');

      if (error) {
        console.error('인증 실패:', error);
        navigate('/', { state: { error: '소셜 로그인 인증에 실패했습니다.' } });
        return;
      }

      if (accessToken) {
        // 2. 토큰을 스토리지에 저장
        api.setToken(accessToken);
        if (refreshToken) {
          api.setRefreshToken(refreshToken);
        }

        // 3. Zustand 스토어 초기화 및 정보 갱신
        try {
          await useAuthStore.getState().initialize();
          navigate('/');
        } catch (err) {
          console.error('유저 정보 갱신 실패', err);
          navigate('/');
        }
      } else {
        navigate('/');
      }
    };

    processCallback();
  }, [location, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-cyber-darker">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-cyber-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-cyber-accent font-medium">인증 정보를 처리하는 중입니다...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
