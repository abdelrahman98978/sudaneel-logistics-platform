# -*- coding: utf-8 -*-
# Part of Sudanil Logistics ERP Integration. See LICENSE file for full copyright and licensing details.

from odoo import models, fields, api, _
from odoo.exceptions import ValidationError
import logging

_logger = logging.getLogger(__name__)

class SudanilCustomer(models.Model):
    _name = 'sudanil.customer'
    _description = 'Sudanil Customer Profile (CRM)'
    _inherit = ['mail.thread', 'mail.activity.mixin']
    _order = 'create_date desc'

    name = fields.Char(
        string='Customer Name',
        required=True,
        tracking=True
    )
    
    customer_code = fields.Char(
        string='Customer Code',
        required=True,
        copy=False,
        readonly=True,
        default=lambda self: _('New'),
        tracking=True
    )
    
    email = fields.Char(
        string='Email Address',
        required=True,
        tracking=True
    )
    
    phone = fields.Char(
        string='Phone Number',
        tracking=True
    )
    
    mobile = fields.Char(
        string='Mobile Number',
        tracking=True
    )
    
    customer_type = fields.Selection([
        ('individual', 'Individual (فرد)'),
        ('company', 'Company (شركة)'),
        ('government', 'Government Agency (وكالة حكومية)')
    ], string='Customer Type', default='company', required=True, tracking=True)
    
    company_name = fields.Char(
        string='Company Name',
        tracking=True
    )
    
    registration_number = fields.Char(
        string='Registration Number',
        tracking=True
    )
    
    industry = fields.Selection([
        ('pharma', 'Pharmaceuticals (الأدوية)'),
        ('food', 'Food & Beverages (الغذاء والمشروبات)'),
        ('manufacturing', 'Manufacturing (التصنيع)'),
        ('retail', 'Retail (البيع بالتجزئة)'),
        ('import_export', 'Import/Export (الاستيراد والتصدير)'),
        ('other', 'Other (أخرى)')
    ], string='Industry', tracking=True)
    
    country = fields.Char(
        string='Country',
        default='Sudan',
        tracking=True
    )
    
    state = fields.Char(
        string='State/Province',
        tracking=True
    )
    
    city = fields.Char(
        string='City',
        tracking=True
    )
    
    address = fields.Text(
        string='Street Address',
        tracking=True
    )
    
    postal_code = fields.Char(
        string='Postal Code',
        tracking=True
    )
    
    # Rating & Classification
    customer_rating = fields.Selection([
        ('platinum', 'Platinum (بلاتينيوم)'),
        ('gold', 'Gold (ذهب)'),
        ('silver', 'Silver (فضة)'),
        ('bronze', 'Bronze (برونز)'),
        ('standard', 'Standard (عادي)')
    ], string='Customer Rating', default='standard', tracking=True)
    
    lifetime_value = fields.Monetary(
        string='Lifetime Value (SDG)',
        currency_field='company_currency_id',
        default=0.00,
        tracking=True
    )
    
    total_shipments = fields.Integer(
        string='Total Shipments',
        default=0,
        compute='_compute_total_shipments',
        store=True
    )
    
    active_shipments = fields.Integer(
        string='Active Shipments',
        compute='_compute_active_shipments'
    )
    
    # Relations
    partner_id = fields.Many2one(
        'res.partner',
        string='Linked Partner',
        help='Link to Odoo res.partner for accounting integration'
    )
    
    shipment_ids = fields.One2many(
        'sudanil.shipment',
        'customer_id',
        string='Shipments'
    )
    
    opportunity_ids = fields.One2many(
        'sudanil.opportunity',
        'customer_id',
        string='Opportunities'
    )
    
    activity_ids = fields.One2many(
        'sudanil.customer.activity',
        'customer_id',
        string='Activities'
    )
    
    interaction_ids = fields.One2many(
        'sudanil.customer.interaction',
        'customer_id',
        string='Interactions'
    )
    
    invoice_ids = fields.One2many(
        'account.move',
        'partner_id',
        string='Invoices',
        domain=[('move_type', '=', 'out_invoice')]
    )
    
    # Status & Engagement
    status = fields.Selection([
        ('prospect', 'Prospect (متوقع)'),
        ('qualified', 'Qualified (مؤهل)'),
        ('active', 'Active (نشط)'),
        ('loyal', 'Loyal (مخلص)'),
        ('inactive', 'Inactive (غير نشط)'),
        ('lost', 'Lost (مفقود)')
    ], string='Customer Status', default='prospect', tracking=True)
    
    last_interaction_date = fields.Datetime(
        string='Last Interaction',
        tracking=True
    )
    
    days_since_last_contact = fields.Integer(
        string='Days Since Last Contact',
        compute='_compute_days_since_contact',
        store=False
    )
    
    risk_level = fields.Selection([
        ('high', 'High Risk (مخاطر عالية)'),
        ('medium', 'Medium Risk (مخاطر متوسطة)'),
        ('low', 'Low Risk (مخاطر منخفضة)'),
        ('none', 'No Risk (بدون مخاطر)')
    ], string='Risk Level', default='low', tracking=True)
    
    credit_limit = fields.Monetary(
        string='Credit Limit (SDG)',
        currency_field='company_currency_id',
        default=0.00,
        tracking=True
    )
    
    notes = fields.Text(string='Notes')
    
    active = fields.Boolean(default=True)
    company_id = fields.Many2one('res.company', string='Company', default=lambda self: self.env.company)
    
    @api.model
    def create(self, vals):
        if vals.get('customer_code', _('New')) == _('New'):
            seq_code = 'CUST-' + str(self.env['ir.sequence'].next_by_code('sudanil.customer') or '1001')
            vals['customer_code'] = seq_code
        
        res = super(SudanilCustomer, self).create(vals)
        
        # Create linked partner if not exists
        if not res.partner_id and res.customer_type == 'company':
            partner = self.env['res.partner'].create({
                'name': res.company_name or res.name,
                'email': res.email,
                'phone': res.phone,
                'country_id': self.env['res.country'].search([('name', '=', res.country)], limit=1).id,
            })
            res.partner_id = partner.id
        
        return res
    
    @api.depends('shipment_ids')
    def _compute_total_shipments(self):
        for rec in self:
            rec.total_shipments = len(rec.shipment_ids)
    
    def _compute_active_shipments(self):
        for rec in self:
            rec.active_shipments = len(rec.shipment_ids.filtered(lambda s: s.state in ['draft', 'transit', 'port', 'customs']))
    
    def _compute_days_since_contact(self):
        from datetime import datetime
        for rec in self:
            if rec.last_interaction_date:
                diff = datetime.now() - rec.last_interaction_date
                rec.days_since_last_contact = diff.days
            else:
                rec.days_since_last_contact = 0
    
    def action_mark_as_active(self):
        self.write({'status': 'active'})
    
    def action_mark_as_loyal(self):
        if self.total_shipments >= 10 and self.lifetime_value > 1000000:
            self.write({'status': 'loyal', 'customer_rating': 'platinum'})
        else:
            raise ValidationError(_("Customer must have at least 10 shipments and 1M SDG lifetime value"))
    
    def action_log_interaction(self, interaction_type, notes):
        self.env['sudanil.customer.interaction'].create({
            'customer_id': self.id,
            'interaction_type': interaction_type,
            'notes': notes
        })
        self.write({'last_interaction_date': fields.Datetime.now()})


class SudanilCustomerActivity(models.Model):
    _name = 'sudanil.customer.activity'
    _description = 'Customer Activity Log'
    _order = 'create_date desc'

    customer_id = fields.Many2one('sudanil.customer', string='Customer', required=True, ondelete='cascade')
    activity_type = fields.Selection([
        ('call', 'Phone Call (اتصال هاتفي)'),
        ('email', 'Email (بريد إلكتروني)'),
        ('meeting', 'Meeting (اجتماع)'),
        ('shipment', 'Shipment Activity (نشاط الشحنة)'),
        ('follow_up', 'Follow-up (المتابعة)'),
        ('note', 'Note (ملاحظة)')
    ], string='Activity Type', required=True)
    
    title = fields.Char(string='Activity Title', required=True)
    description = fields.Text(string='Description')
    activity_date = fields.Datetime(string='Activity Date', default=fields.Datetime.now)
    
    assigned_to = fields.Many2one('res.users', string='Assigned To')
    status = fields.Selection([
        ('scheduled', 'Scheduled (مجدول)'),
        ('completed', 'Completed (مكتمل)'),
        ('cancelled', 'Cancelled (ملغي)')
    ], string='Status', default='scheduled')


class SudanilCustomerInteraction(models.Model):
    _name = 'sudanil.customer.interaction'
    _description = 'Customer Interaction History'
    _order = 'create_date desc'

    customer_id = fields.Many2one('sudanil.customer', string='Customer', required=True, ondelete='cascade')
    interaction_type = fields.Selection([
        ('inquiry', 'Inquiry (استفسار)'),
        ('complaint', 'Complaint (شكوى)'),
        ('feedback', 'Feedback (ملاحظات)'),
        ('support', 'Support Request (طلب دعم)'),
        ('other', 'Other (أخرى)')
    ], string='Interaction Type', required=True)
    
    notes = fields.Text(string='Notes', required=True)
    interaction_date = fields.Datetime(string='Interaction Date', default=fields.Datetime.now)
    resolved = fields.Boolean(string='Resolved', default=False)
    resolution_notes = fields.Text(string='Resolution Notes')
