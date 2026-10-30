import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, X, Check, AlertTriangle, Clock, Calendar, Activity, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

export const NotificationCenter: React.FC = () => {
  const {
    role,
    roleNotifications,
    unreadNotificationCount,
    markNotificationRead,
    clearNotificationsForRole,
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'sos':
        return <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />;
      case 'medicine_escalation':
        return <Clock className="w-4 h-4 text-amber-600 shrink-0" />;
      case 'appointment':
        return <Calendar className="w-4 h-4 text-blue-600 shrink-0" />;
      case 'reading':
        return <Activity className="w-4 h-4 text-teal-600 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-slate-500 shrink-0" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-hidden focus:ring-2 focus:ring-teal-700"
        aria-label={`Notifications (${unreadNotificationCount} unread)`}
      >
        <Bell className="w-5 h-5" />
        {unreadNotificationCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 rounded-md bg-red-700 text-white text-[10px] font-bold flex items-center justify-center">
            {unreadNotificationCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-2xs"
            onClick={() => setIsOpen(false)}
          />

          <div
            aria-live="polite"
            className="absolute right-0 mt-2 w-[calc(100vw-2rem)] max-w-sm sm:w-96 bg-white rounded-xl border border-slate-300 shadow-xl z-50 overflow-hidden text-xs"
          >
            <div className="p-3 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-teal-400" />
                <span className="font-bold">Notifications ({role.toUpperCase()})</span>
              </div>
              <div className="flex items-center gap-2">
                {unreadNotificationCount > 0 && (
                  <button
                    onClick={clearNotificationsForRole}
                    className="min-h-[36px] px-2 text-[11px] text-teal-300 hover:text-white transition-colors"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="min-h-[36px] min-w-[36px] flex items-center justify-center text-slate-400 hover:text-white"
                  aria-label="Close notifications"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
              {roleNotifications.length === 0 ? (
                <div className="p-6 text-center text-slate-500">
                  No notifications for current role.
                </div>
              ) : (
                roleNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-3 transition-colors ${
                      notif.read ? 'bg-white' : 'bg-slate-50 border-l-2 border-teal-700'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 justify-between">
                      <div className="flex items-start gap-2 flex-1">
                        {getTypeIcon(notif.type)}
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-2">
                            <span>{notif.title}</span>
                            <span className="text-[10px] font-normal text-slate-400">
                              {formatTime(notif.timestamp)}
                            </span>
                          </div>
                          <p className="text-slate-600 mt-0.5 leading-relaxed">{notif.message}</p>

                          {notif.actionUrl && (
                            <Link
                              to={notif.actionUrl}
                              onClick={() => {
                                markNotificationRead(notif.id);
                                setIsOpen(false);
                              }}
                              className="inline-block mt-1.5 font-bold text-teal-700 hover:underline"
                            >
                              {notif.actionLabel || 'View details'}
                            </Link>
                          )}
                        </div>
                      </div>

                      {!notif.read && (
                        <button
                          onClick={() => markNotificationRead(notif.id)}
                          className="min-h-[36px] min-w-[36px] flex items-center justify-center text-slate-400 hover:text-slate-600 shrink-0"
                          title="Mark read"
                          aria-label="Mark as read"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
