# -*- coding: utf-8 -*-
# Part of Sudanil Logistics ERP Integration. See LICENSE file for full copyright and licensing details.

from odoo import models, fields, api, _
from odoo.exceptions import UserError
import logging

_logger = logging.getLogger(__name__)

class SudanilShipment(models.Model):
    _name = 'sudanil.shipment'
    _description = 'Sudanil Logistics Sovereign Shipment'
    _inherit = ['mail.thread', 'mail.activity.mixin']
    _order = 'create_date desc'

    name = fields.Char(
        string='Waybill Reference',
        required=True,
        copy=False,
        readonly=True,
        default=lambda self: _('New'),
        tracking=True
    )
    partner_id = fields.Many2one(
        'res.partner',
        string='Sovereign Client',
        required=True,
        tracking=True
    )
    route_type = fields.Selection([
        ('land', 'Land Freight (البرية)'),
        ('sea', 'Sea Freight (البحرية)'),
        ('air', 'Air Freight (الجوية)')
    ], string='Freight Method', default='land', required=True, tracking=True)

    origin = fields.Char(string='Origin Terminal', required=True, default='Port Sudan Marine Terminal')
    destination = fields.Char(string='Destination Terminal', required=True, default='Khartoum Dry Port')

    cargo_weight = fields.Float(string='Cargo Weight (Tons)', digits=(16, 2), tracking=True)
    cargo_type = fields.Char(string='Cargo Description', required=True, placeholder='e.g., Medical Grade Pharmaceuticals')

    customs_status = fields.Selection([
        ('pending', 'Pending Declaration (قيد الانتظار)'),
        ('in_progress', 'Under Examination (تحت الفحص الجمركي)'),
        ('released', 'Cleared & Released (مفرج عنه)'),
        ('failed', 'Held/Rejected (مرفوض / معلق)')
    ], string='Customs Stage', default='pending', tracking=True)

    customs_declaration_no = fields.Char(string='Sovereign Custom Dec No.', tracking=True)

    state = fields.Selection([
        ('draft', 'Draft Waybill'),
        ('transit', 'In Active Transit'),
        ('port', 'At Port Terminal'),
        ('customs', 'Under Customs Clearing'),
        ('delivered', 'Delivered & Completed')
    ], string='Shipment Status', default='draft', required=True, tracking=True)

    active = fields.Boolean(default=True)
    company_id = fields.Many2one('res.company', string='Company', default=lambda self: self.env.company)

    @api.model
    def create(self, vals):
        if vals.get('name', _('New')) == _('New'):
            # Generate premium sovereign reference
            seq_code = 'SN-TRK-' + str(self.env['ir.sequence'].next_by_code('sudanil.shipment') or '908124')
            vals['name'] = seq_code
        return super(SudanilShipment, self).create(vals)

    def action_start_transit(self):
        self.ensure_one()
        self.write({'state': 'transit'})
        self.message_post(body=_("Shipment dispatched. Left origin terminal for active transit."))

    def action_reach_customs(self):
        self.ensure_one()
        self.write({
            'state': 'customs',
            'customs_status': 'in_progress'
        })
        self.message_post(body=_("Shipment arrived at customs border terminal. Undergoing inspection."))

    def action_release_customs(self):
        self.ensure_one()
        if not self.customs_declaration_no:
            self.customs_declaration_no = "DEC-" + str(fields.Date.today().year) + "-09817"
        self.write({
            'customs_status': 'released',
            'state': 'transit'
        })
        self.message_post(body=_("Sovereign customs cleared successfully! Dec No: %s. Proceeding to final terminal.") % self.customs_declaration_no)

    def action_deliver(self):
        self.ensure_one()
        if self.customs_status != 'released':
            raise UserError(_("Cannot mark shipment as delivered before customs declaration clearance!"))
        self.write({'state': 'delivered'})
        self.message_post(body=_("Shipment delivered and handed over to consignee terminal safely."))
