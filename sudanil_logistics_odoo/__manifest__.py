# -*- coding: utf-8 -*-
{
    'name': 'Sudanil Logistics Sovereign ERP & CRM Integration',
    'version': '2.0',
    'summary': 'Complete ERP & CRM solution linking Odoo ERP with Sudanil Logistics real-time tracking portal with executive dashboard and user portal.',
    'description': """
Sudanil Logistics ERP & CRM Integration v2.0
==============================================
Establishes a bi-directional institutional bridge to synchronize and automate:

**Core Features:**
- **Complete CRM System**: Customer management, sales opportunities, activity tracking
- **Customer Profiles**: Detailed customer information, rating system, lifetime value tracking
- **Sales Pipeline**: Opportunity management with stage tracking and probability weighting
- **Executive Dashboard**: Real-time KPIs, revenue metrics, warehouse occupancy
- **User Portal**: Personalized dashboards for sales reps and customers
- **Activity Logging**: Track all user actions and system events
- **Notification System**: Smart alerts and reminders for users

**Logistics Features:**
- **Custom Shipments Management**: Live tracking states, carrier details, customs transactions
- **Stock & Warehouse Sync**: Automatic update of stock levels across terminals
- **Unified Ledgers**: Posting billing transactions and invoices to Odoo general ledgers
- **Bilingual QWeb Waybills**: Print executive PDF waybills in Arabic and English

**Analytics & Reporting:**
- **Shipment Analytics**: Detailed shipment tracking and statistics
- **Customer Analytics**: Customer segmentation and lifetime value analysis
- **Opportunity Analytics**: Sales pipeline analysis with win rate tracking
- **Revenue Analytics**: Income tracking and payment status monitoring

**API Endpoints:**
- /sudanil/api/customers - Customer management
- /sudanil/api/opportunities - Sales opportunities
- /sudanil/api/dashboard/executive - Executive dashboard data
- /sudanil/api/dashboard/user - User personalized dashboard
- /sudanil/api/notifications - User notifications
- /sudanil/api/analytics/* - Various analytics endpoints
    """,
    'category': 'Operations/Logistics',
    'author': 'Sudanil Sovereignty Group / Antigravity AI',
    'website': 'https://www.sudanil.com',
    'depends': ['base', 'stock', 'account', 'sale', 'crm', 'mail'],
    'data': [
        'security/ir.model.access.csv',
        'views/sudanil_shipment_views.xml',
        'views/sudanil_crm_views.xml',
        'views/sudanil_dashboard_views.xml',
        'views/sudanil_user_dashboard_views.xml',
        'views/sudanil_report_templates.xml',
    ],
    'installable': True,
    'application': True,
    'auto_install': False,
    'license': 'LGPL-3',
    'images': ['static/description/icon.png'],
    'post_init_hook': 'post_init_hook',
}
