import React from 'react';
import HardwareProfileForm from '../components/HardwareProfileForm';
import useAuthStore from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import useSEO from '../hooks/useSEO';

export default function HardwarePage() {
  useSEO('hardware');
  const { setUserSpec } = useAuthStore();
  const navigate = useNavigate();

  const handleHardwareUpdate = (newSpec) => {
    setUserSpec(newSpec);
    navigate('/recommend');
  };

  return (
    <section className="animation-fade-in" aria-labelledby="heading-hardware">
      <h1 id="heading-hardware" className="sr-only">하드웨어 프로필 관리</h1>
      <HardwareProfileForm onSave={handleHardwareUpdate} />
    </section>
  );
}
