#!/usr/bin/env node

/**
 * ============================================================
 * Sudanil Logistics Platform — Model Context Protocol (MCP) Server
 * Standard JSON-RPC 2.0 stdio interface for AI Agent Integration
 * ============================================================
 */

const readline = require('readline');

// Mock Logistics Database
const mockShipments = {
  "SNL-240522-001": {
    id: "SNL-240522-001",
    status: "في الطريق البري - سنكات (In Transit - Sinkat)",
    origin: "ميناء بورتسودان الجنوبي",
    destination: "المركز اللوجستي الرئيسي - الخرطوم سوبا",
    eta: "2024-05-24T16:00:00Z",
    carrier: "شاحنة التبريد SUDANIL-COLD #402",
    carrierType: "Reefer Truck",
    gpsLocation: { lat: 18.8350, lng: 36.8333, name: "سنكات - نقطة التفتيش الجمركي" },
    onTimeProbability: "99.4%",
    items: [
      { name: "أدوية ومستلزمات طبية مبردة (+4°C)", qty: "4 منصات نقالة", weightKg: 1200 },
      { name: "أجهزة قياس حرارة دقيقة IoT", qty: "8 وحدات", weightKg: 24 }
    ]
  },
  "SNL-240523-088": {
    id: "SNL-240523-088",
    status: "في البحر الأحمر - ممر الملاحة الدولي (In Transit - Red Sea)",
    origin: "ميناء جدة الإسلامي",
    destination: "ميناء بورتسودان - رصيف 14",
    eta: "2024-05-25T08:00:00Z",
    carrier: "سفينة الحاويات SUDANIL STAR V.042",
    carrierType: "Container Vessel",
    gpsLocation: { lat: 20.4000, lng: 38.2000, name: "البحر الأحمر - الممر الملاحي" },
    onTimeProbability: "98.7%",
    items: [
      { name: "معدات طاقة شمسية ومحولات كهروضوئية", qty: "480 وحدة", weightKg: 18400 }
    ]
  },
  "SNL-240524-104": {
    id: "SNL-240524-104",
    status: "شحن جوي سريع - في الأجواء (In Flight)",
    origin: "مطار آل مكتوم الدولي - دبي",
    destination: "مطار بورتسودان الدولي",
    eta: "2024-05-24T19:30:00Z",
    carrier: "طائرة الشحن Boeing 737F رحلة #901",
    carrierType: "Air Cargo",
    gpsLocation: { lat: 20.0000, lng: 42.0000, name: "المجال الجوي الإقليمي - البحر الأحمر" },
    onTimeProbability: "99.9%",
    items: [
      { name: "خوادم ومعدات اتصالات سحابية عاجلة", qty: "6 صناديق محصنة", weightKg: 480 }
    ]
  }
};

const mockWarehouses = {
  portsudan: {
    id: "portsudan",
    name: "مستودع ميناء بورتسودان الرئيسي (Bonded Freezone)",
    location: "الميناء الجنوبي - ساحة الحاويات 18",
    capacityMetricTons: 25000,
    occupancyRate: "92%",
    temperature: "+22°C (Dry Storage)",
    transitContainers: 184,
    customsStatus: "منطقة جمركية مقيدة معتمدة"
  },
  khartoum: {
    id: "khartoum",
    name: "مجمع سوبا اللوجستي المركزي",
    location: "المنطقة الصناعية سوبا - الخرطوم",
    capacityMetricTons: 40000,
    occupancyRate: "78%",
    temperature: "+24°C (Dry Storage)",
    transitContainers: 96,
    customsStatus: "مستودع توزيع داخلي"
  },
  coldchain: {
    id: "coldchain",
    name: "مستودع التبريد وحفظ الأدوية Pharma-Grade",
    location: "أم درمان الصناعية",
    capacityMetricTons: 10000,
    occupancyRate: "64%",
    temperature: "-18.5°C (Active Freezer)",
    transitContainers: 42,
    customsStatus: "سلسلة تبريد معتمدة صحياً"
  },
  atbara: {
    id: "atbara",
    name: "محطة الفرز والتوزيع الشمالية",
    location: "عطبرة - خط السكة الحديد المركزي",
    capacityMetricTons: 15000,
    occupancyRate: "51%",
    temperature: "+26°C (Dry Storage)",
    transitContainers: 38,
    customsStatus: "محطة ترانزيت سككي وبري"
  }
};

// Define MCP Tools Catalog
const TOOLS = [
  {
    name: "track_shipment",
    description: "تتبع شحنة مباشرة في منصة سودانيل لوجيستك باستخدام رقم التتبع الموحد (Tracking ID). يعيد الإحداثيات المباشرة وحالة التخليص والوصول المتوقع.",
    inputSchema: {
      type: "object",
      properties: {
        trackingId: {
          type: "string",
          description: "رقم التتبع اللوجستي الموحد (مثال: SNL-240522-001, SNL-240523-088, SNL-240524-104)"
        }
      },
      required: ["trackingId"]
    }
  },
  {
    name: "get_warehouse_telemetry",
    description: "استعلام عن بيانات ومؤشرات المستودعات الإقليمية، نسب الإشغال، ودرجات حرارة سلاسل التبريد IoT.",
    inputSchema: {
      type: "object",
      properties: {
        hubId: {
          type: "string",
          enum: ["portsudan", "khartoum", "coldchain", "atbara"],
          description: "رمز المستودع المستهدف"
        }
      },
      required: ["hubId"]
    }
  },
  {
    name: "calculate_freight_quote",
    description: "حساب تكلفة الشحن التقديرية (بحري، جوي، بري) والرسوم الجمركية بناءً على بنود التعرفة (HS Codes) في السودان.",
    inputSchema: {
      type: "object",
      properties: {
        mode: {
          type: "string",
          enum: ["sea", "air", "land"],
          description: "وسيلة الشحن (sea: بحري, air: جوي, land: بري)"
        },
        origin: {
          type: "string",
          enum: ["jeddah", "dubai", "shanghai", "cairo", "istanbul"],
          description: "مدينة / ميناء المنشأ"
        },
        destination: {
          type: "string",
          enum: ["portsudan", "khartoum", "atbara", "kassala"],
          description: "الوجهة داخل السودان"
        },
        weightKg: { type: "number", description: "الوزن الإجمالي بالكيلوجرام" },
        cbm: { type: "number", description: "الحجم بالمتر المكعب CBM" },
        cargoValueUsd: { type: "number", description: "القيمة الإجمالية للبضاعة بالدولار" },
        hsDutyRate: { type: "number", description: "نسبة الرسوم الجمركية (0.00 إلى 0.25)" },
        isReefer: { type: "boolean", description: "هل تتطلب الشحنة حاوية مبردة؟" }
      },
      required: ["mode", "origin", "weightKg", "cbm", "cargoValueUsd"]
    }
  },
  {
    name: "verify_customs_document",
    description: "التحقق من صحة الفاتورة التجارية، بوليصة الشحن، أو الإفراج الجمركي برقم المستند.",
    inputSchema: {
      type: "object",
      properties: {
        docNumber: {
          type: "string",
          description: "رقم المستند الجمركي أو الفاتورة (مثال: SNL-INV-882041, SNL-BL-774920)"
        }
      },
      required: ["docNumber"]
    }
  }
];

// Handle Tool Executions
function handleToolCall(name, args) {
  switch (name) {
    case "track_shipment": {
      const id = (args.trackingId || "").toUpperCase().trim();
      const found = mockShipments[id];
      if (found) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ success: true, shipment: found }, null, 2)
            }
          ]
        };
      }
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: true,
              shipment: {
                id,
                status: "قيد المعالجة في مستودعات سودانيل",
                origin: "بورتسودان",
                destination: "الخرطوم",
                eta: "خلال 48 ساعة",
                carrier: "شاحنة نقل عامة #102",
                gpsLocation: { lat: 19.6158, lng: 37.2164, name: "ميناء بورتسودان" }
              }
            }, null, 2)
          }
        ]
      };
    }

    case "get_warehouse_telemetry": {
      const hub = mockWarehouses[args.hubId];
      if (hub) {
        return {
          content: [{ type: "text", text: JSON.stringify({ success: true, warehouse: hub }, null, 2) }]
        };
      }
      return {
        content: [{ type: "text", text: JSON.stringify({ success: false, error: "المستودع غير موجود", availableHubs: Object.keys(mockWarehouses) }, null, 2) }]
      };
    }

    case "calculate_freight_quote": {
      const baseRates = {
        sea: { jeddah: 450, dubai: 650, shanghai: 1200, cairo: 500, istanbul: 850 },
        air: { jeddah: 1200, dubai: 1800, shanghai: 3500, cairo: 1400, istanbul: 2200 },
        land: { jeddah: 950, dubai: 1400, shanghai: 2800, cairo: 750, istanbul: 1900 }
      };

      let base = (baseRates[args.mode] && baseRates[args.mode][args.origin]) || 600;
      let chargeableUnit = Math.max(args.cbm, args.weightKg / 1000);
      if (args.mode === "air") {
        const volumetric = args.cbm * 167;
        base = (base * 0.4) + (Math.max(args.weightKg, volumetric) * 4.2);
      } else {
        base = base * Math.max(1, chargeableUnit * 0.85);
      }

      if (args.isReefer) base += 350;

      const dutyRate = typeof args.hsDutyRate === "number" ? args.hsDutyRate : 0.05;
      const customs = args.cargoValueUsd * dutyRate;
      const handling = args.mode === "air" ? 85 : 120;
      const insurance = Math.max(30, args.cargoValueUsd * 0.01);
      const totalUsd = base + customs + handling + insurance;
      const totalSdg = totalUsd * 2500;

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: true,
              breakdownUsd: {
                baseFreight: Number(base.toFixed(2)),
                customsDuty: Number(customs.toFixed(2)),
                handlingFee: handling,
                cargoInsurance: Number(insurance.toFixed(2)),
                totalUsd: Number(totalUsd.toFixed(2)),
                approxSdg: Math.round(totalSdg)
              }
            }, null, 2)
          }
        ]
      };
    }

    case "verify_customs_document": {
      const docId = (args.docNumber || "").toUpperCase().trim();
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: true,
              document: {
                documentNumber: docId,
                status: "معتمد رسمياً - Digital Verified",
                verificationHash: "8F2A-99B1-0C4D",
                issuer: "شركة سودانيل للخدمات اللوجستية والتخليص الجمركي",
                portAuthorityApproval: "جمارك ميناء بورتسودان الجنوبي",
                issuedAt: new Date().toISOString()
              }
            }, null, 2)
          }
        ]
      };
    }

    default:
      throw new Error(`Tool not found: ${name}`);
  }
}

// JSON-RPC 2.0 over Stdio loop
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on('line', (line) => {
  if (!line.trim()) return;
  try {
    const request = JSON.parse(line);
    const { id, method, params } = request;

    if (method === "initialize") {
      const response = {
        jsonrpc: "2.0",
        id,
        result: {
          protocolVersion: "2024-11-05",
          capabilities: {
            tools: {}
          },
          serverInfo: {
            name: "sudanil-logistics-mcp",
            version: "1.0.0"
          }
        }
      };
      process.stdout.write(JSON.stringify(response) + "\n");
    } else if (method === "tools/list") {
      const response = {
        jsonrpc: "2.0",
        id,
        result: { tools: TOOLS }
      };
      process.stdout.write(JSON.stringify(response) + "\n");
    } else if (method === "tools/call") {
      try {
        const result = handleToolCall(params.name, params.arguments || {});
        process.stdout.write(JSON.stringify({ jsonrpc: "2.0", id, result }) + "\n");
      } catch (err) {
        process.stdout.write(JSON.stringify({
          jsonrpc: "2.0",
          id,
          error: { code: -32603, message: err.message }
        }) + "\n");
      }
    } else {
      process.stdout.write(JSON.stringify({
        jsonrpc: "2.0",
        id,
        error: { code: -32601, message: `Method not found: ${method}` }
      }) + "\n");
    }
  } catch (err) {
    process.stdout.write(JSON.stringify({
      jsonrpc: "2.0",
      id: null,
      error: { code: -32700, message: "Parse error" }
    }) + "\n");
  }
});

console.error("[Sudanil Logistics MCP Server] Started and listening on stdio.");
