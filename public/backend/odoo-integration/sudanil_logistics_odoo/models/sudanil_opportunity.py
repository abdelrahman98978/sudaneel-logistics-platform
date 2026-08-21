# -*- coding: utf-8 -*-
# Part of Sudanil Logistics ERP Integration. See LICENSE file for full copyright and licensing details.

from odoo import models, fields, api, _
from odoo.exceptions import ValidationError
import logging

_logger = logging.getLogger(__name__)

class SudanilOpportunity(models.Model):
    _name = 'sudanil.opportunity'
    _description = 'Sudanil Sales Opportunity (CRM)'
    _inherit = ['mail.thread', 'mail.activity.mixin']
    _order = 'expected_close_date asc, probability desc'

    name = fields.Char(
        string='Opportunity Name',
        required=True,
        tracking=True
    )
    
    opportunity_code = fields.Char(
        string='Opportunity Code',
        required=True,
        copy=False,
        readonly=True,
        default=lambda self: _('New'),
        tracking=True
    )
    
    customer_id = fields.Many2one(
        'sudanil.customer',
        string='Customer',
        required=True,
        tracking=True
    )
    
    opportunity_type = fields.Selection([
        ('new_shipment', 'New Shipment (شحنة جديدة)'),
        ('recurring', 'Recurring Contract (عقد متكرر)'),
        ('expansion', 'Account Expansion (توسع الحساب)'),
        ('upsell', 'Upsell (بيع إضافي)'),
        ('cross_sell', 'Cross-sell (بيع متقاطع)')
    ], string='Opportunity Type', default='new_shipment', required=True, tracking=True)
    
    stage = fields.Selection([
        ('prospect', 'Prospect (متوقع)'),
        ('qualification', 'Qualification (التأهيل)'),
        ('proposal', 'Proposal (عرض)'),
        ('negotiation', 'Negotiation (التفاوض)'),
        ('won', 'Won (مكتسب)'),
        ('lost', 'Lost (مفقود)')
    ], string='Stage', default='prospect', required=True, tracking=True)
    
    pipeline_status = fields.Selection([
        ('active', 'Active (نشط)'),
        ('stalled', 'Stalled (متوقف)'),
        ('archived', 'Archived (مؤرشف)')
    ], string='Pipeline Status', default='active', tracking=True)
    
    expected_value = fields.Monetary(
        string='Expected Value (SDG)',
        currency_field='company_currency_id',
        required=True,
        tracking=True
    )
    
    probability = fields.Integer(
        string='Win Probability (%)',
        default=10,
        tracking=True,
        help='Probability of closing this opportunity (0-100)'
    )
    
    weighted_value = fields.Monetary(
        string='Weighted Value (SDG)',
        currency_field='company_currency_id',
        compute='_compute_weighted_value',
        store=True
    )
    
    cargo_type = fields.Char(
        string='Cargo Type',
        help='e.g., Pharmaceuticals, Electronics, Foods'
    )
    
    cargo_weight_tons = fields.Float(
        string='Estimated Weight (Tons)',
        default=0.0
    )
    
    route_type = fields.Selection([
        ('land', 'Land Freight (البرية)'),
        ('sea', 'Sea Freight (البحرية)'),
        ('air', 'Air Freight (الجوية)'),
        ('multimodal', 'Multimodal (متعدد الطرق)')
    ], string='Route Type')
    
    origin_location = fields.Char(
        string='Origin Location',
        placeholder='e.g., Port Sudan, Khartoum'
    )
    
    destination_location = fields.Char(
        string='Destination Location',
        placeholder='e.g., Madani, Gedaref'
    )
    
    expected_close_date = fields.Date(
        string='Expected Close Date',
        required=True,
        tracking=True
    )
    
    actual_close_date = fields.Date(
        string='Actual Close Date',
        tracking=True
    )
    
    assigned_to = fields.Many2one(
        'res.users',
        string='Sales Representative',
        required=True,
        tracking=True
    )
    
    # Competition & Notes
    competitor_info = fields.Text(
        string='Competitor Information'
    )
    
    win_reason = fields.Text(
        string='Win Reason (if Won)'
    )
    
    loss_reason = fields.Selection([
        ('price', 'Price (السعر)'),
        ('timeline', 'Timeline (الجدول الزمني)'),
        ('service', 'Service Quality (جودة الخدمة)'),
        ('competitor', 'Lost to Competitor (خسر للمنافس)'),
        ('customer_budget', 'Customer Budget (ميزانية العميل)'),
        ('other', 'Other (أخرى)')
    ], string='Loss Reason (if Lost)')
    
    loss_details = fields.Text(
        string='Loss Details'
    )
    
    # Activity tracking
    next_activity_date = fields.Date(
        string='Next Activity Date',
        tracking=True
    )
    
    activity_ids = fields.One2many(
        'sudanil.opportunity.activity',
        'opportunity_id',
        string='Activities'
    )
    
    notes = fields.Text(string='Internal Notes')
    
    active = fields.Boolean(default=True)
    company_id = fields.Many2one('res.company', string='Company', default=lambda self: self.env.company)
    
    @api.model
    def create(self, vals):
        if vals.get('opportunity_code', _('New')) == _('New'):
            seq_code = 'OPP-' + str(self.env['ir.sequence'].next_by_code('sudanil.opportunity') or '5001')
            vals['opportunity_code'] = seq_code
        return super(SudanilOpportunity, self).create(vals)
    
    @api.depends('expected_value', 'probability')
    def _compute_weighted_value(self):
        for rec in self:
            rec.weighted_value = (rec.expected_value * rec.probability) / 100
    
    @api.onchange('stage')
    def _onchange_stage(self):
        if self.stage == 'won':
            self.write({'actual_close_date': fields.Date.today()})
        elif self.stage == 'lost':
            self.write({'actual_close_date': fields.Date.today()})
    
    def action_move_to_next_stage(self):
        stages = ['prospect', 'qualification', 'proposal', 'negotiation', 'won', 'lost']
        current_index = stages.index(self.stage)
        if current_index < len(stages) - 1:
            self.write({'stage': stages[current_index + 1]})
    
    def action_mark_as_won(self):
        self.write({
            'stage': 'won',
            'actual_close_date': fields.Date.today()
        })
    
    def action_mark_as_lost(self):
        self.write({
            'stage': 'lost',
            'actual_close_date': fields.Date.today()
        })
    
    def action_log_activity(self, activity_type, notes):
        self.env['sudanil.opportunity.activity'].create({
            'opportunity_id': self.id,
            'activity_type': activity_type,
            'notes': notes
        })


class SudanilOpportunityActivity(models.Model):
    _name = 'sudanil.opportunity.activity'
    _description = 'Opportunity Activity Log'
    _order = 'activity_date desc'

    opportunity_id = fields.Many2one('sudanil.opportunity', string='Opportunity', required=True, ondelete='cascade')
    activity_type = fields.Selection([
        ('call', 'Call (اتصال)'),
        ('email', 'Email (بريد)'),
        ('meeting', 'Meeting (اجتماع)'),
        ('proposal_sent', 'Proposal Sent (تم إرسال العرض)'),
        ('follow_up', 'Follow-up (متابعة)'),
        ('negotiation', 'Negotiation (تفاوض)'),
        ('note', 'Note (ملاحظة)')
    ], string='Activity Type', required=True)
    
    notes = fields.Text(string='Activity Notes', required=True)
    activity_date = fields.Datetime(string='Activity Date', default=fields.Datetime.now)
    
    assigned_to = fields.Many2one('res.users', string='Assigned To')
    status = fields.Selection([
        ('pending', 'Pending (قيد الانتظار)'),
        ('completed', 'Completed (مكتمل)'),
        ('cancelled', 'Cancelled (ملغي)')
    ], string='Status', default='pending')
