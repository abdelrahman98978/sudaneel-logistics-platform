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

    origin_id = fields.Many2one('stock.warehouse', string='Origin Terminal', required=True)
    destination_id = fields.Many2one('stock.warehouse', string='Destination Terminal', required=True)
    current_location_id = fields.Many2one('stock.warehouse', string='Current Terminal', tracking=True)

    cargo_weight = fields.Float(string='Cargo Weight (Tons)', digits=(16, 2), tracking=True)
    cargo_type = fields.Char(string='Cargo Description', required=True, placeholder='e.g., Medical Grade Pharmaceuticals')

    customs_status = fields.Selection([
        ('pending', 'Pending Declaration (قيد الانتظار)'),
        ('in_progress', 'Under Examination (تحت الفحص الجمركي)'),
        ('released', 'Cleared & Released (مفرج عنه)'),
        ('failed', 'Held/Rejected (مرفوض / معلق)')
    ], string='Customs Stage', default='pending', tracking=True)

    customs_declaration_no = fields.Char(string='Sovereign Custom Dec No.', tracking=True)
    transit_progress = fields.Integer(string='Transit Progress (%)', default=0, tracking=True)

    state = fields.Selection([
        ('draft', 'Draft Waybill'),
        ('transit', 'In Active Transit'),
        ('port', 'At Port Terminal'),
        ('customs', 'Under Customs Clearing'),
        ('delivered', 'Delivered & Completed')
    ], string='Shipment Status', default='draft', required=True, tracking=True)

    history_ids = fields.One2many('sudanil.shipment.history', 'shipment_id', string='Milestone History')
    active = fields.Boolean(default=True)
    company_id = fields.Many2one('res.company', string='Company', default=lambda self: self.env.company)

    @api.model
    def create(self, vals):
        if vals.get('name', _('New')) == _('New'):
            seq_code = 'SN-TRK-' + str(self.env['ir.sequence'].next_by_code('sudanil.shipment') or '908124')
            vals['name'] = seq_code
        res = super(SudanilShipment, self).create(vals)
        res._log_history('draft', 'Waybill created and registered in Sovereign Ledger.')
        return res

    def _log_history(self, state, message):
        self.env['sudanil.shipment.history'].create({
            'shipment_id': self.id,
            'state': state,
            'location_id': self.current_location_id.id or self.origin_id.id,
            'description': message
        })

    def action_start_transit(self):
        self.ensure_one()
        self.write({
            'state': 'transit',
            'transit_progress': 10,
            'current_location_id': self.origin_id.id
        })
        self._log_history('transit', _("Shipment dispatched from %s.") % self.origin_id.name)

    def action_reach_port(self):
        self.ensure_one()
        self.write({
            'state': 'port',
            'transit_progress': 50
        })
        self._log_history('port', _("Shipment arrived at port terminal/customs border."))

    def action_reach_customs(self):
        self.ensure_one()
        self.write({
            'state': 'customs',
            'customs_status': 'in_progress',
            'transit_progress': 75
        })
        self._log_history('customs', _("Shipment undergoing sovereign customs examination."))

    def action_release_customs(self):
        self.ensure_one()
        if not self.customs_declaration_no:
            self.customs_declaration_no = "DEC-" + str(fields.Date.today().year) + "-09817"
        self.write({
            'customs_status': 'released',
            'state': 'transit',
            'transit_progress': 90
        })
        self._log_history('transit', _("Customs cleared (Dec No: %s). Final leg of transit initiated.") % self.customs_declaration_no)

    def action_deliver(self):
        self.ensure_one()
        if self.customs_status != 'released' and self.route_type != 'land': # Example logic
             raise UserError(_("Cannot deliver until customs are cleared!"))
        self.write({
            'state': 'delivered',
            'transit_progress': 100,
            'current_location_id': self.destination_id.id
        })
        self._log_history('delivered', _("Shipment successfully delivered to %s.") % self.destination_id.name)

class SudanilShipmentHistory(models.Model):
    _name = 'sudanil.shipment.history'
    _description = 'Shipment Milestone History'
    _order = 'timestamp desc'

    shipment_id = fields.Many2one('sudanil.shipment', string='Shipment', ondelete='cascade')
    timestamp = fields.Datetime(string='Timestamp', default=fields.Datetime.now)
    location_id = fields.Many2one('stock.warehouse', string='Location')
    state = fields.Selection([
        ('draft', 'Draft'),
        ('transit', 'In Transit'),
        ('port', 'At Port'),
        ('customs', 'In Customs'),
        ('delivered', 'Delivered')
    ], string='Status')
    description = fields.Text(string='Milestone Details')

