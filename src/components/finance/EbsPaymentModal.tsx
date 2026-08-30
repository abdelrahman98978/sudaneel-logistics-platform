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
      name: 'بطاقة الصراف الآلي / محول القيود (EBS Switch)',
      nameEn: 'EBS National Switch Gateway',
      account: 'بوابة الدفع الإلكتروني القومية',
      fee: '0.00 SDG',
    },
  ];

  const handleProceedToQR = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountNumber) {
      showToast(
        lang === 'ar' ? 'الرجاء إدخال رقم الحساب' : 'Account Number Required',
        lang === 'ar' ? 'أدخل رقم الحساب أو الهاتف للتحقق' : 'Enter account number',
        'warning'
      );
      return;
    }
    setStep('qr_confirm');
  };

  const handleConfirmPayment = () => {
    if (!transactionRef.trim()) {
      showToast(
        lang === 'ar' ? 'رقم الإشعار مطلوب' : 'Transaction Ref Required',
        lang === 'ar' ? 'يرجى إدخال رقم إشعار التحويل البنكي (FT#)' : 'Please enter reference number',
        'warning'
      );
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      if (invoice) {
        payInvoice(invoice.id, paymentMethod, transactionRef);
      } else {
        topUpWallet(payableAmount, paymentMethod, transactionRef);
      }
      setStep('success');
      if (onSuccess) onSuccess();
    }, 800);
  };

  const handleFinish = () => {
    onClose();
    setStep('form');
    setAccountNumber('');
    setTransactionRef('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#000000]/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200 shopify-theme" dir="rtl">
      <div className="w-full max-w-lg bg-[#ffffff] border border-[#e4e4e7] rounded-[20px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] p-8 space-y-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#e4e4e7]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#c1fbd4] text-[#000000] flex items-center justify-center font-bold">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-[600] text-[16px] text-[#000000]">
                بوابة السداد والتسوية المباشرة (EBS / بنكك)
              </h3>
              <p className="text-[12px] text-[#71717a]">
                {invoice ? `سداد الفاتورة: ${invoice.invoiceNumber}` : (description || 'شحن رصيد المحفظة')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-[#fbfbf5] text-[#71717a]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount Badge Banner */}
        <div className="p-4 rounded-[12px] bg-[#c1fbd4] border border-[#a8f5c2] flex items-center justify-between">
          <div>
            <span className="text-[11.5px] text-[#000000]/70 font-[500] block">المبلغ المطلوب سداده</span>
            <span className="font-mono font-[800] text-[22px] text-[#000000]">
              {payableAmount.toLocaleString()} SDG
            </span>
          </div>
          <span className="shopify-tag-mint !bg-white/80 !text-[11px] font-[600]">
            تسوية فورية صفر عمولة
          </span>
        </div>

        {/* Step 1: Provider Selection & Account Form */}
        {step === 'form' && (
          <form onSubmit={handleProceedToQR} className="space-y-4 text-[13px]">
            <div className="space-y-2">
              <label className="text-[#71717a] block font-[500]">اختر وسيلة الدفع البنكية</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {paymentProviders.map((prov) => {
                  const isSelected = paymentMethod === prov.id;
                  return (
                    <div
                      key={prov.id}
                      onClick={() => setPaymentMethod(prov.id as any)}
                      className={`p-3.5 rounded-[12px] border cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? 'bg-[#fbfbf5] border-[#000000] ring-2 ring-[#c1fbd4]'
                          : 'bg-[#ffffff] border-[#e4e4e7] hover:border-[#a1a1aa]'
                      }`}
                    >
                      <div className="font-[600] text-[#000000] text-[13px]">{prov.name}</div>
                      <div className="text-[11px] text-[#71717a] mt-1 font-mono">{prov.account}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-[#71717a] block mb-1 font-[500]">رقم الحساب / رقم الهاتف للمحول</label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="مثال: 0912345678 أو رقم الحساب المصرفي"
                className="w-full bg-[#fbfbf5] border border-[#e4e4e7] text-[#000000] p-2.5 rounded-[8px] outline-none focus:border-[#000000]"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#e4e4e7]">
              <button type="button" onClick={onClose} className="btn-shopify-outline flex-1">
                إلغاء
              </button>
              <button type="submit" className="btn-shopify-pill flex-1 flex items-center justify-center gap-1.5">
                <span>متابعة للدفع والباركود</span>
                <QrCode className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* Step 2: QR Code & Reference Confirmation */}
        {step === 'qr_confirm' && (
          <div className="space-y-4 text-[13px]">
            <div className="p-5 rounded-[12px] bg-[#fbfbf5] border border-[#e4e4e7] text-center space-y-3">
              <span className="text-[12px] text-[#71717a] block">
                امسح رمز الاستجابة السريعة (QR) أو حول مباشرة للحساب:
              </span>

              {/* QR Mock Display */}
              <div className="w-36 h-36 mx-auto bg-white p-2.5 rounded-[12px] border border-[#e4e4e7] flex flex-col items-center justify-center shadow-sm">
                <QrCode className="w-28 h-28 text-[#000000]" />
              </div>

              <div className="font-mono text-[15px] font-[700] text-[#000000]">
                المبلغ: {payableAmount.toLocaleString()} SDG
              </div>
              <div className="text-[12px] text-[#71717a]">
                الحساب المستلم: <span className="font-mono font-[700] text-[#000000]">1987420 (سودانيل)</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[#71717a] block font-[500]">رقم العملية / الإشعار البنكي (Transaction Reference / FT#)</label>
              <input
                type="text"
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                placeholder="مثال: FT26243009812 أو رقم إشعار بنكك"
                className="w-full bg-[#fbfbf5] border border-[#e4e4e7] text-[#000000] font-mono p-2.5 rounded-[8px] outline-none focus:border-[#000000]"
                required
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#e4e4e7] gap-3">
              <button
                type="button"
                onClick={() => setStep('form')}
                className="btn-shopify-outline flex-1"
              >
                رجوع
              </button>

              <button
                type="button"
                onClick={handleConfirmPayment}
                disabled={isProcessing}
                className="btn-shopify-pill flex-1 flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <Zap className="w-4 h-4 text-[#c1fbd4]" />
                <span>{isProcessing ? 'جارٍ التحقق...' : 'تأكيد السداد والمطابقة'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Success Voucher */}
        {step === 'success' && (
          <div className="p-6 rounded-[12px] bg-[#fbfbf5] border border-[#e4e4e7] text-center space-y-4 animate-in fade-in">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#c1fbd4] flex items-center justify-center text-[#000000]">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <h4 className="text-[17px] font-[600] text-[#000000]">تم استلام الدفعة وتسوية الفاتورة</h4>
              <p className="text-[13px] text-[#71717a] mt-1">
                تم تسجيل المعاملة في دفتر القيود اللوجستية وتحديث الرصيد فورياً.
              </p>
            </div>

            <div className="p-4 bg-white rounded-[12px] border border-[#e4e4e7] text-start font-mono text-[12px] space-y-1">
              <div className="flex justify-between">
                <span className="text-[#71717a]">Transaction ID:</span>
                <span className="text-[#000000] font-[600]">{transactionRef || 'SDN-EBS-88912'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#71717a]">Settlement Amount:</span>
                <span className="text-[#000000] font-[700]">{payableAmount.toLocaleString()} SDG</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#71717a]">Status:</span>
                <span className="text-[#000000] font-[600]">SETTLED / COMPLETED</span>
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="btn-shopify-pill w-full !py-3 text-[13.5px]"
            >
              إغلاق ومتابعة العمليات
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
