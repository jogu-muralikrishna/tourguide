import React from 'react';
import {
  Bell,
  X,
  AlertTriangle,
  Info,
  CheckCircle2,
  CloudRain,
  DollarSign,
  Shield,
  Trash2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TravelAlert } from '../types';
import { AlertService } from '../services/alertService';

interface TravelAlertsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: TravelAlert[];
  onAlertsUpdated: () => void;
  onSelectActionLink?: (link: string) => void;
}

export const TravelAlertsDrawer: React.FC<TravelAlertsDrawerProps> = ({
  isOpen,
  onClose,
  alerts,
  onAlertsUpdated,
  onSelectActionLink,
}) => {
  if (!isOpen) return null;

  const handleMarkAllRead = () => {
    AlertService.markAllAsRead();
    onAlertsUpdated();
  };

  const handleClear = () => {
    AlertService.clearAll();
    onAlertsUpdated();
  };

  const getIcon = (type: string, severity: string) => {
    if (severity === 'IMPORTANT') return <AlertTriangle className="w-4 h-4 text-red-400" />;
    if (type === 'WEATHER') return <CloudRain className="w-4 h-4 text-amber-400" />;
    if (type === 'BUDGET') return <DollarSign className="w-4 h-4 text-emerald-400" />;
    return <Info className="w-4 h-4 text-sky-400" />;
  };

  return (
    <div
      id="travel-alerts-drawer-backdrop"
      className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-md"
    >
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="w-full max-w-md bg-[#090912] border-l border-amber-500/30 h-full shadow-2xl flex flex-col text-left"
      >
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif-luxury font-bold text-sm text-zinc-100 uppercase tracking-wide">
                TRAVEL & PROACTIVE ALERTS
              </h3>
              <p className="text-[10px] text-zinc-400 font-mono-tactical">
                Weather Advisories, Schedule & Budget Monitoring
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action bar */}
        <div className="px-5 py-2.5 bg-black/40 border-b border-zinc-800 flex items-center justify-between text-[10px] font-mono-tactical">
          <button
            onClick={handleMarkAllRead}
            className="text-amber-400 hover:text-amber-300 cursor-pointer"
          >
            Mark all read
          </button>
          <button
            onClick={handleClear}
            className="text-zinc-500 hover:text-red-400 flex items-center gap-1 cursor-pointer"
          >
            <Trash2 className="w-3 h-3" /> Clear all
          </button>
        </div>

        {/* Alerts List */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 font-mono-tactical">
          {alerts.length === 0 ? (
            <div className="p-12 text-center text-zinc-500 text-xs">
              <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500/40" />
              All expedition conditions optimal. No active advisories.
            </div>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-xl border text-xs transition-all ${
                  alert.severity === 'IMPORTANT'
                    ? 'bg-red-950/30 border-red-500/40 text-red-200'
                    : alert.severity === 'WARNING'
                    ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-300'
                } ${!alert.read ? 'ring-1 ring-amber-400/40' : 'opacity-85'}`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 shrink-0">{getIcon(alert.type, alert.severity)}</div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-zinc-100 text-xs">{alert.title}</h4>
                      <span className="text-[9px] text-zinc-500">
                        {new Date(alert.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-zinc-300">{alert.message}</p>

                    {alert.actionLabel && alert.actionLink && (
                      <div className="pt-2">
                        <button
                          onClick={() => {
                            if (onSelectActionLink && alert.actionLink) {
                              onSelectActionLink(alert.actionLink);
                            }
                            onClose();
                          }}
                          className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-amber-300 font-medium text-[10px] cursor-pointer"
                        >
                          {alert.actionLabel} →
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};
