---
name: sudanil-mcp
description: Query live shipment tracking, regional warehouse telemetrics, freight quotes, and customs documents via the Sudanil Logistics MCP Server.
---

# Sudanil Logistics MCP Server

This skill enables AI agents to query and execute logistics workflows directly via the Sudanil Logistics Model Context Protocol (MCP) server.

## Available MCP Tools

### 1. `track_shipment`
- **Parameters**: `trackingId` (e.g. `SNL-240522-001`, `SNL-240523-088`, `SNL-240524-104`).
- **Returns**: Live GPS coordinates, current milestone, carrier details, ETA, and AI on-time probability.

### 2. `get_warehouse_telemetry`
- **Parameters**: `hubId` (`portsudan`, `khartoum`, `coldchain`, `atbara`).
- **Returns**: Capacity, occupancy percentage, IoT temperature gauge, and transit container counts.

### 3. `calculate_freight_quote`
- **Parameters**: `mode` (sea/air/land), `origin`, `destination`, `weightKg`, `cbm`, `cargoValueUsd`, `hsDutyRate`, `isReefer`.
- **Returns**: Itemized freight rate, customs duties, port handling fees, and insurance in USD and SDG.

### 4. `verify_customs_document`
- **Parameters**: `docNumber` (e.g. `SNL-INV-882041`, `SNL-BL-774920`).
- **Returns**: Official verification hash, customs clearance approval status, and release metadata.

### 5. `vercel_get_project_status`
- **Parameters**: `projectSlug` (defaults to `sudaneel-logistics-platform`).
- **Returns**: Production Vercel domain, GitHub repository link, build commands, and live feature routes.

### 6. `vercel_check_env_requirements`
- **Parameters**: None.
- **Returns**: List of all required environment variables and Vercel dashboard security checklist.
