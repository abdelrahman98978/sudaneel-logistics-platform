'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export function TeslaToastContainer() {
  const { toasts, dismissToast } = useApp();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 end-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none shopify-theme">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isWarning = toast.type === 'warning';
        const isError = toast.type === 'error';
        const isInfo = !isSuccess && !isWarning && !isError;

        return (
          <div
            key={toast.id}
            className="pointer-events-auto p-4 rounded-[12px] bg-[#ffffff] border border-[#e4e4e7] shadow-[0_8px_16px_rgba(0,0,0,0.06)] flex items-start justify-between gap-3 animate-in slide-in-from-bottom-5 duration-200 text-[#000000]"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex-shrink-0">
                {isSuccess && (
                  <div className="w-5 h-5 rounded-full bg-[#c1fbd4] flex items-center justify-center text-[#000000]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                )}
                {isWarning && (
                  <div className="w-5 h-5 rounded-full bg-[#d4d4d8] flex items-center justify-center text-[#000000]">
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </div>
                )}
                {isError && (
                  <div className="w-5 h-5 rounded-full bg-[#000000] flex items-center justify-center text-white">
                    <AlertCircle className="w-3.5 h-3.5" />
                  </div>
                )}
                {isInfo && (
                  <div className="w-5 h-5 rounded-full bg-[#d4f9e0] flex items-center justify-center text-[#000000]">
                    <Info className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>

              <div>
                <h4 className="font-[600] text-[13px] text-[#000000] leading-tight">{toast.title}</h4>
                {toast.message && (
                  <p className="text-[12px] text-[#71717a] mt-1 leading-snug font-[420]">{toast.message}</p>
                )}
              </div>
            </div>

            <button
              onClick={() => dismissToast(toast.id)}
              className="text-[#71717a] hover:text-[#000000] transition-colors cursor-pointer p-1 rounded-full hover:bg-[#fbfbf5] -mt-1 -mr-1"
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
