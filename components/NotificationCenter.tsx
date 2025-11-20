import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Notification } from '../types';
import { BellIcon, GiftIcon } from './icons';

interface NotificationCenterProps {
  notifications: Notification[];
  onClear: (id: string) => void;
  onClearAll: () => void;
}

const formatTimeAgo = (timestamp: number) => {
  const now = Date.now();
  const seconds = Math.floor((now - timestamp) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
};

const NotificationCenter: React.FC<NotificationCenterProps> = ({ notifications, onClear, onClearAll }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute top-full right-0 mt-2 w-80 bg-[var(--background-secondary)] rounded-[var(--border-radius)] shadow-2xl border border-[var(--border-color)] z-50"
    >
      <div className="p-3 flex justify-between items-center border-b border-[var(--border-color)]">
        <h3 className="font-bold text-[var(--text-primary)]">Notifications</h3>
        {notifications.length > 0 && (
          <button onClick={onClearAll} className="text-xs text-[var(--primary-accent)] hover:underline">Clear all</button>
        )}
      </div>
      {notifications.length > 0 ? (
        <div className="max-h-80 overflow-y-auto no-scrollbar">
          {notifications.map(notif => (
            <div key={notif.id} className="p-3 border-b border-[var(--border-color)] flex gap-3 hover:bg-[var(--background-tertiary)]">
              <div className="w-8 h-8 rounded-full bg-[var(--background-tertiary)] flex items-center justify-center flex-shrink-0 mt-1">
                {notif.type === 'promo' && <GiftIcon className="w-5 h-5 text-purple-400" />}
                {notif.type !== 'promo' && <BellIcon className="w-5 h-5 text-[var(--primary-accent)]" />}
              </div>
              <div>
                <p className="font-semibold text-sm text-[var(--text-primary)]">{notif.title}</p>
                <p className="text-xs text-[var(--text-secondary)]">{notif.message}</p>
                <p className="text-xs text-[var(--text-tertiary)] mt-1">{formatTimeAgo(notif.timestamp)}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="p-8 text-center text-sm text-[var(--text-secondary)]">You have no new notifications.</p>
      )}
    </motion.div>
  );
};

export default NotificationCenter;