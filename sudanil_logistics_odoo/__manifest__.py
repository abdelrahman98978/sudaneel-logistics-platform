# -*- coding: utf-8 -*-
{
    'name': 'Sudanil Logistics Sovereign ERP Integration',
    'version': '1.0',
    'summary': 'Sovereign digital bridge linking Odoo ERP with Sudanil Logistics real-time tracking portal.',
    'description': """
Sudanil Logistics ERP Integration
=================================
Establishes a bi-directional institutional bridge to synchronize and automate:
- **Custom Shipments Management**: Live tracking states, carrier details, customs transactions.
- **Stock & Warehouse Sync**: Automatic update of stock levels (Stock Quants) across Khartoum, Port Sudan, and Madani terminals.
- **Unified Ledgers**: Posting billing transactions, custom custom duties, and logistics invoices directly to Odoo general ledgers.
- **Bilingual QWeb Waybills**: Print beautiful, executive sovereign PDF waybills (Bill of Lading) in both Arabic and English.
    """,
    'category': 'Operations/Logistics',
    'author': 'Sudanil Sovereignty Group / Antigravity AI',
    'website': 'https://www.sudanil.com',
    'depends': ['base', 'stock', 'account', 'sale'],
    'data': [
        'security/ir.model.access.csv',
        'views/sudanil_shipment_views.xml',
        'views/sudanil_report_templates.xml',
    ],
    'installable': True,
    'application': True,
    'auto_install': False,
    'license': 'LGPL-3',
}
