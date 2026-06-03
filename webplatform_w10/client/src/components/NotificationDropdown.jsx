import React, { useEffect, useRef } from 'react';
import { X, Check, Info, Lightbulb, ShieldCheck } from 'lucide-react';
import useNotificationStore from '../store/useNotificationStore';

const ICONS = {
  info: { icon: Info, color: 'text-cyber-accent', bg: 'bg-cyber-accent/10' },
  tip: { icon: Lightbulb, color: 'text-cyber-warning', bg: 'bg-cyber-warning/10' },
  update: { icon: ShieldCheck, color: 'text-cyber-success', bg: 'bg-cyber-success/10' },
};

function formatTimeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return '방금 전';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}분 전`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}시간 전`;
  return `${Math.floor(seconds / 86400)}일 전`;
}

export default function NotificationDropdown({ onClose }) {
  const { notifications, markAsRead, markAllRead, getUnreadCount } = useNotificationStore();
  const dropdownRef = useRef(null);

  // 외부 클릭 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose();
      }
    };
    // 약간의 딜레이를 두어 벨 버튼 클릭 이벤트와 충돌 방지
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // ESC 닫기
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const unreadCount = getUnreadCount();

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-80 bg-cyber-card border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden animation-fade-in"
      role="dialog"
      aria-label="알림 목록"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-gray-100">알림</h3>
          {unreadCount > 0 && (
            <span className="text-[10px] font-bold text-cyber-accent bg-cyber-accent/10 px-1.5 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-[11px] text-a11y-muted hover:text-cyber-accent transition-colors px-2 py-1 rounded"
              aria-label="모든 알림 읽음 처리"
            >
              <Check className="w-3.5 h-3.5 inline mr-0.5" aria-hidden="true" />
              모두 읽음
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 text-a11y-muted hover:text-white rounded transition-colors"
            aria-label="알림 패널 닫기"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Notification List */}
      <div className="max-h-72 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-a11y-muted">
            알림이 없습니다.
          </div>
        ) : (
          <ul role="list" aria-label="알림 목록">
            {notifications.map(notification => {
              const typeConfig = ICONS[notification.type] || ICONS.info;
              const Icon = typeConfig.icon;

              return (
                <li key={notification.id}>
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className={`w-full text-left px-4 py-3 flex gap-3 transition-colors hover:bg-cyber-dark/50 border-b border-gray-800/50 ${
                      notification.read ? 'opacity-60' : ''
                    }`}
                    aria-label={`${notification.read ? '읽음' : '읽지 않음'}: ${notification.title}`}
                  >
                    <div className={`flex-shrink-0 p-2 rounded-lg ${typeConfig.bg}`}>
                      <Icon className={`w-4 h-4 ${typeConfig.color}`} aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-semibold truncate ${notification.read ? 'text-a11y-muted' : 'text-gray-100'}`}>
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <span className="w-1.5 h-1.5 bg-cyber-accent rounded-full flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-a11y-muted mt-0.5 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-[10px] text-a11y-muted mt-1">
                        {formatTimeAgo(notification.timestamp)}
                      </p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
