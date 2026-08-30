'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { Invoice } from '@/types';
import {
  CreditCard,
  Building2,
  CheckCircle2,
  QrCode,
  ShieldCheck,
  X,
  Smartphone,
  Zap,
} from 'lucide-react';

interface EbsPaymentModalProps {
  invoice?: Invoice | null;
  amount?: number;
  description?: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function EbsPaymentModal({
  invoice,
  amount,
  description,
  isOpen,
  onClose,
  onSuccess,
}: EbsPaymentModalProps) {
  const { payInvoice, topUpWallet, showToast, lang } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<'bankak' | 'fawry' | 'ocash' | 'ebs_card'>('bankak');
  const [accountNumber, setAccountNumber] = useState('');
  const [transactionRef, setTransactionRef] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'form' | 'qr_confirm' | 'success'>('form');

  if (!isOpen) return null;

  const payableAmount = invoice ? invoice.total : (amount || 150000);
  const invoiceId = invoice ? invoice.id : 'DIRECT_WALLET_TOPUP';

  const paymentProviders = [
    {
      id: 'bankak',
      name: 'بنك الخرطوم (Bankak - بنكك)',
      nameEn: 'Bank of Khartoum (Bankak)',
      account: '1987420 / سودانيل لخدمات النقل',
      fee: '0.00 SDG',
    },
    {
      id: 'fawry',
      name: 'بنك فيصل الإسلامي (Fawry - فوري)',
      nameEn: 'Faisal Islamic Bank (Fawry)',
      account: '8829104 / شركة سودانيل',
      fee: '0.00 SDG',
    },
    {
      id: 'ocash',
      name: 'بنك أمدرمان الوطني (O-Cash - أوكاش)',
      nameEn: 'Omdurman National Bank (O-Cash)',
      account: '5540192 / سودانيل القابضة',
      fee: '0.00 SDG',
    },
    {
      id: 'ebs_card',
      name: 'بطاقة الصراف الآلي القومية (EBS Gateway)',
      nameEn: 'EBS National Switch ATM Card',
      account: 'مفتاح التحويل القومي 1118',
      fee: '0.00 SDG',
    },
  ];

  const handleProceedToQr = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('qr_confirm');
  };

  const handleConfirmPayment = () => {
    if (!transactionRef.trim()) {
      showToast(
        lang === 'ar' ? 'رقم الإشعار مطلوب' : 'Reference Required',
        lang === 'ar' ? 'يرجى إدخال رقم المعاملة البنكية أو رقم الإشعار للتأكيد.' : 'Please enter the transaction reference number.',
        'warning'
      );
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setStep('success');

      if (invoice) {
        payInvoice(invoice.id, paymentMethod, transactionRef);
      } else if (amount) {
        topUpWallet(amount, paymentMethod, transactionRef);
      }

      showToast(
        lang === 'ar' ? 'تمت التسوية البنكية بنجاح' : 'Payment Settled Successfully',
        lang === 'ar'
          ? `تم تأكيد سداد مبلغ ${payableAmount.toLocaleString()} SDG عبر ${paymentMethod.toUpperCase()}`
          : `Payment of ${payableAmount.toLocaleString()} SDG confirmed via ${paymentMethod.toUpperCase()}`,
        'success'
      );

      if (onSuccess) onSuccess();
    }, 1200);
  };

  const handleFinish = () => {
    setStep('form');
    setTransactionRef('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#171A20]/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#FFFFFF] border border-[#EEEEEE] rounded-[4px] p-6 space-y-4 animate-in fade-in text-[#171A20] font-sans">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#EEEEEE]">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#3E6AE1]" />
            <div>
              <h3 className="font-[500] text-[16px] text-[#171A20]">
                {lang === 'ar' ? 'بوابة الدفع والتسوية البنكية المباشرة (EBS Gateway)' : 'Sudanese Electronic Banking Settlement'}
              </h3>
              <p className="text-[12px] text-[#5C5E62]">
                {invoice ? `سداد الفاتورة رقم: ${invoice.invoiceNumber}` : (description || 'شحن الرصيد المالي')}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#8E8E8E] hover:text-[#171A20] p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step 1: Select Method & Account */}
        {step === 'form' && (
          <form onSubmit={handleProceedToQr} className="space-y-4 text-[13px]">
            <div className="p-4 rounded-[4px] bg-[#F4F4F4] border border-[#EEEEEE] flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[#8E8E8E] block">المبلغ المستحق للدفع</span>
                <span className="text-[20px] font-[500] font-mono text-[#171A20]">
                  {payableAmount.toLocaleString()} <span className="text-[13px] text-[#3E6AE1]">SDG</span>
                </span>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-mono text-[#171A20] bg-white px-2.5 py-1 rounded-[2px] border border-[#D0D1D2]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#3E6AE1]" />
                <span>EBS Verified</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[#5C5E62] block font-[500]">اختر وسيلة الدفع المصرفية</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {paymentProviders.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPaymentMethod(p.id as any)}
                    className={`p-3 rounded-[4px] text-start border transition-colors duration-330 cursor-pointer ${
                      paymentMethod === p.id
                        ? 'bg-[#F4F4F4] border-[#171A20]'
                        : 'bg-white border-[#EEEEEE] hover:bg-[#F4F4F4]'
                    }`}
                  >
                    <div className="font-[500] text-[13px] text-[#171A20]">{lang === 'ar' ? p.name : p.nameEn}</div>
                    <div className="text-[11px] text-[#5C5E62] mt-0.5 font-mono">{p.account}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[#5C5E62] block mb-1">رقم الحساب / رقم الهاتف للمحول</label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="مثال: 0912345678 أو رقم الحساب المصرفي"
                className="w-full bg-white border border-[#D0D1D2] text-[#171A20] p-2.5 rounded-[4px] outline-none"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#EEEEEE]">
              <button type="button" onClick={onClose} className="btn-tesla-secondary !min-h-[36px] !py-1 !px-4">
                إلغاء
              </button>
              <button type="submit" className="btn-tesla-primary !min-h-[36px] !py-1 !px-4 flex items-center gap-1.5">
                <span>متابعة للدفع والباركود</span>
                <QrCode className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* Step 2: QR Code & Reference Confirmation */}
        {step === 'qr_confirm' && (
          <div className="space-y-4 text-[13px]">
            <div className="p-4 rounded-[4px] bg-[#F4F4F4] border border-[#EEEEEE] text-center space-y-3">
              <span className="text-[12px] text-[#5C5E62] block">
                امسح رمز الاستجابة السريعة (QR) أو حول مباشرة للحساب:
              </span>

              {/* QR Mock Display */}
              <div className="w-36 h-36 mx-auto bg-white p-2.5 rounded-[4px] border border-[#D0D1D2] flex flex-col items-center justify-center">
                <QrCode className="w-28 h-28 text-[#171A20]" />
              </div>

              <div className="font-mono text-[14px] font-[500] text-[#171A20]">
                المبلغ: {payableAmount.toLocaleString()} SDG
              </div>
              <div className="text-[12px] text-[#5C5E62]">
                الحساب المستلم: <span className="font-mono font-[500] text-[#171A20]">1987420 (سودانيل)</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[#5C5E62] block font-[500]">رقم العملية / الإشعار البنكي (Transaction Reference / FT#)</label>
              <input
                type="text"
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                placeholder="مثال: FT26243009812 أو رقم إشعار بنكك"
                className="w-full bg-white border border-[#D0D1D2] text-[#171A20] font-mono p-2.5 rounded-[4px] outline-none"
                required
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#EEEEEE]">
              <button
                type="button"
                onClick={() => setStep('form')}
                className="btn-tesla-secondary !min-h-[36px] !py-1 !px-4"
              >
                رجوع
              </button>

              <button
                type="button"
                onClick={handleConfirmPayment}
                disabled={isProcessing}
                className="btn-tesla-primary !min-h-[36px] !py-1 !px-5 flex items-center gap-1.5 disabled:opacity-50"
              >
                <Zap className="w-4 h-4" />
                <span>{isProcessing ? 'جارٍ التحقق من المقاصة...' : 'تأكيد السداد والمطابقة'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Success Voucher */}
        {step === 'success' && (
          <div className="p-6 rounded-[4px] bg-[#F4F4F4] border border-[#EEEEEE] text-center space-y-4 animate-in fade-in">
            <div className="w-12 h-12 mx-auto rounded-[4px] bg-white border border-[#D0D1D2] flex items-center justify-center text-[#3E6AE1]">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <h4 className="text-[17px] font-[500] text-[#171A20]">تم استلام الدفعة وتسوية الفاتورة</h4>
              <p className="text-[13px] text-[#5C5E62] mt-1">
                تم تسجيل المعاملة في دفتر القيود اللوجستية وتحديث الرصيد فورياً.
              </p>
            </div>

            <div className="p-3 bg-white rounded-[4px] border border-[#EEEEEE] text-start font-mono text-[12px] space-y-1">
              <div className="flex justify-between">
                <span className="text-[#8E8E8E]">Transaction ID:</span>
                <span className="text-[#171A20] font-[500]">{transactionRef || 'SDN-EBS-88912'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E8E8E]">Settlement Amount:</span>
                <span className="text-[#3E6AE1] font-[500]">{payableAmount.toLocaleString()} SDG</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E8E8E]">Status:</span>
                <span className="text-[#171A20] font-[500]">SETTLED / COMPLETED</span>
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="btn-tesla-primary w-full !min-h-[38px] text-[13px]"
            >
              إغلاق ومتابعة العمليات
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
