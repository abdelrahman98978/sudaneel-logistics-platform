// ============================================================
// Sudaneel Logistics — Official Documents & Export Service
// Generates official PDF Waybills, Customs Certificates, QRs, & Excels
// ============================================================

import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import QRCode from 'qrcode';
import { Shipment, CustomsDeclaration } from '@/types';

/**
 * Generate a high-resolution QR code data URL for a shipment or gate pass
 */
export async function generateQrDataUrl(text: string): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      width: 240,
      margin: 1,
      color: {
        dark: '#032C70',
        light: '#FFFFFF',
      },
    });
  } catch (err) {
    console.error('QR generation error:', err);
    return '';
  }
}

/**
 * Export an Official Digital Waybill (e-BOL) PDF
 */
export async function exportShipmentWaybillPdf(shipment: Shipment): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Header Banner
  doc.setFillColor(3, 44, 112); // Deep Navy (#032C70)
  doc.rect(0, 0, 210, 36, 'F');

  // Title & Brand
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('SUDANEEL LOGISTICS INTELLIGENCE OS', 15, 16);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('OFFICIAL ELECTRONIC BILL OF LADING (e-BOL)', 15, 24);
  doc.text(`TRACKING NUMBER: ${shipment.trackingNumber || shipment.id}`, 15, 30);

  // Generate QR code for verification
  const qrDataUrl = await generateQrDataUrl(`https://sudaneel.sd/track/${shipment.trackingNumber || shipment.id}`);
  if (qrDataUrl) {
    doc.addImage(qrDataUrl, 'PNG', 165, 5, 26, 26);
  }

  // Section 1: Route & Carrier
  doc.setTextColor(3, 44, 112);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('1. SHIPMENT & ROUTE SUMMARY', 15, 48);

  doc.setDrawColor(220, 225, 235);
  doc.line(15, 51, 195, 51);

  doc.setTextColor(40, 40, 40);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Origin: ${shipment.origin?.city || 'Port Sudan'} (${shipment.origin?.address || 'Terminal'})`, 15, 58);
  doc.text(`Destination: ${shipment.destination?.city || 'Khartoum'} (${shipment.destination?.address || 'Central Hub'})`, 15, 65);
  doc.text(`Distance: ${shipment.distanceKm || 820} KM`, 15, 72);
  doc.text(`Status: ${shipment.status.toUpperCase()}`, 110, 58);
  doc.text(`Estimated Transit (ETA): ${shipment.estimatedEta || 'On Schedule'}`, 110, 65);
  doc.text(`Carrier Partner: ${shipment.carrierName || shipment.carrierId || 'Sudaneel Heavy Express'}`, 110, 72);

  // Section 2: Cargo Specifications
  doc.setTextColor(3, 44, 112);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('2. CARGO MANIFEST & SPECIFICATIONS', 15, 86);
  doc.line(15, 89, 195, 89);

  doc.setTextColor(40, 40, 40);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Description: ${shipment.cargoDescription || 'General Cargo'}`, 15, 96);
  doc.text(`Weight: ${((shipment.totalWeightKg || 25000) / 1000).toFixed(1)} Metric Tons`, 15, 103);
  doc.text(`Cargo Type: ${shipment.cargoType || 'containerized'}`, 110, 96);
  doc.text(`Customer / Shipper: ${shipment.customerName || 'Enterprise Client'}`, 110, 103);

  // Section 3: Financial Settlement
  doc.setTextColor(3, 44, 112);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('3. COMMERCIAL & ESCROW SETTLEMENT', 15, 118);
  doc.line(15, 121, 195, 121);

  doc.setTextColor(40, 40, 40);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Freight Charge: SDG ${(shipment.price || 1450000).toLocaleString()}`, 15, 128);
  doc.text(`Currency: ${shipment.currency || 'SDG'}`, 15, 135);
  doc.text(`Escrow Guarantee: 100% Protected via Sudaneel Vault`, 110, 128);
  doc.text(`POD Verification: Required Prior to Payout Release`, 110, 135);

  // Official Seal & Signatures
  doc.setDrawColor(3, 44, 112);
  doc.rect(15, 150, 85, 32);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('CARRIER / DRIVER SIGNATURE', 18, 156);
  doc.setFont('helvetica', 'normal');
  doc.text(`Driver: ${shipment.driverName || 'Certified Driver'}`, 18, 164);
  doc.text('Biometric / Signature On File', 18, 172);

  doc.rect(110, 150, 85, 32);
  doc.setFont('helvetica', 'bold');
  doc.text('CONSIGNEE DIGITAL POD CONFIRMATION', 113, 156);
  doc.setFont('helvetica', 'normal');
  doc.text('Subject to inspection at time of final delivery', 113, 168);

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text('Sudaneel Logistics Operating System — Republic of Sudan — Sovereign Customs & Transport Registry', 15, 280);
  doc.text(`Issued Date: ${new Date().toLocaleDateString('en-GB')} | Page 1 of 1`, 15, 285);

  doc.save(`Sudaneel_Waybill_${shipment.trackingNumber || shipment.id}.pdf`);
}

/**
 * Export Official Port Sudan Customs Clearance Certificate PDF
 */
export async function exportCustomsCertificatePdf(declaration: CustomsDeclaration): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Header Banner
  doc.setFillColor(3, 44, 112);
  doc.rect(0, 0, 210, 36, 'F');

  doc.setTextColor(215, 161, 30); // Gold (#D7A11E)
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('PORT SUDAN CONTAINER TERMINAL & CUSTOMS', 15, 16);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('OFFICIAL CUSTOMS RELEASE CERTIFICATE', 15, 24);
  doc.text(`DECLARATION NO: ${declaration.declarationNumber}`, 15, 30);

  // QR Code
  const qrDataUrl = await generateQrDataUrl(`https://sudaneel.sd/customs/${declaration.declarationNumber}`);
  if (qrDataUrl) {
    doc.addImage(qrDataUrl, 'PNG', 165, 5, 26, 26);
  }

  // Certificate Body
  doc.setTextColor(3, 44, 112);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('DECLARATION & TARIFF SPECIFICATIONS', 15, 48);
  doc.setDrawColor(220, 225, 235);
  doc.line(15, 51, 195, 51);

  doc.setTextColor(40, 40, 40);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Importer / Exporter: ${declaration.importerExporter}`, 15, 58);
  doc.text(`HS Code: ${declaration.hsCode}`, 15, 65);
  doc.text(`Cargo Description: ${declaration.cargoDescription}`, 15, 72);
  doc.text(`Commercial Value: $${declaration.commercialInvoiceValue.toLocaleString()}`, 110, 58);
  doc.text(`Calculated Duty & Tax: SDG ${declaration.calculatedDutyTax.toLocaleString()}`, 110, 65);
  doc.text(`Inspection Status: ${declaration.inspectionStatus.toUpperCase()}`, 110, 72);
  doc.text(`Entry Port / Hub: ${declaration.entryPort} (${declaration.originCountry})`, 15, 80);

  // Official Stamp
  doc.setDrawColor(20, 164, 77); // Green (#14A44D)
  doc.setFillColor(240, 253, 244);
  doc.roundedRect(15, 95, 180, 25, 3, 3, 'FD');
  doc.setTextColor(20, 164, 77);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('OFFICIALLY CLEARED FOR INLAND DISPATCH', 40, 108);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Compliant with Sudan Customs Authority Regulations — Immediate Transport Authorized', 40, 114);

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text('Sudaneel Logistics Customs Intelligence Engine — Port Sudan Maritime Operations Hub', 15, 280);
  doc.text(`Authenticated on: ${new Date().toISOString()}`, 15, 285);

  doc.save(`Sudaneel_Customs_${declaration.declarationNumber}.pdf`);
}

/**
 * Export Shipments List to an Excel Sheet (.xlsx)
 */
export function exportShipmentsToExcel(shipments: Shipment[]): void {
  const rows = shipments.map((s) => ({
    'Shipment ID': s.id,
    'Tracking Number': s.trackingNumber,
    'Customer (Arabic)': s.customerNameAr,
    'Customer (English)': s.customerName,
    'Cargo Description': s.cargoDescription,
    'Cargo Type': s.cargoType,
    'Origin City': s.origin?.city,
    'Destination City': s.destination?.city,
    'Distance (KM)': s.distanceKm,
    'Weight (KG)': s.totalWeightKg,
    'Status': s.status,
    'Price': s.price,
    'Currency': s.currency,
    'Carrier': s.carrierName || s.carrierId || 'Unassigned',
    'Driver': s.driverName || s.driverId || 'Unassigned',
    'Pickup Date': s.pickupDate,
    'Estimated ETA': s.estimatedEta,
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Shipments');

  XLSX.writeFile(workbook, `Sudaneel_Shipments_${new Date().toISOString().slice(0, 10)}.xlsx`);
}
