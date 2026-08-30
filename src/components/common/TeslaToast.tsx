'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export function TeslaToastContainer() {
  const { toasts, dismissToast } = useApp();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 end-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isWarning = toast.type === 'warning';
        const isError = toast.type === 'error';
        const isInfo = !isSuccess && !isWarning && !isError;

        return (
          <div
            key={toast.id}
            className="pointer-events-auto p-4 rounded-[4px] bg-[#FFFFFF] border border-[#171A20] flex items-start justify-between gap-3 animate-in slide-in-from-bottom-5 duration-330 text-[#171A20]"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex-shrink-0">
                {isSuccess && <CheckCircle2 className="w-4 h-4 text-[#3E6AE1]" />}
                {isWarning && <AlertTriangle className="w-4 h-4 text-[#171A20]" />}
                {isError && <AlertCircle className="w-4 h-4 text-[#171A20]" />}
                {isInfo && <Info className="w-4 h-4 text-[#3E6AE1]" />}
              </div>

              <div>
                <h4 className="font-[500] text-[13px] text-[#171A20] leading-tight">{toast.title}</h4>
                {toast.message && (
                  <p className="text-[12px] text-[#5C5E62] mt-1 leading-snug">{toast.message}</p>
                )}
              </div>
            </div>

            <button
              onClick={() => dismissToast(toast.id)}
              className="text-[#8E8E8E] hover:text-[#171A20] transition-colors cursor-pointer p-0.5 -mt-1 -mr-1"
              aria-label="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
