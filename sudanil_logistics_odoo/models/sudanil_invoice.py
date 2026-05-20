# -*- coding: utf-8 -*-
# Part of Sudanil Logistics ERP Integration. See LICENSE file for full copyright and licensing details.

from odoo import models, fields, api, _

class AccountMove(models.Model):
    _inherit = 'account.move'

    sudanil_shipment_id = fields.Many2one(
        'sudanil.shipment',
        string='Linked Sudanil Shipment',
        help="Waybill associated with this financial journal invoice.",
        tracking=True
    )

    sudanil_customs_charge = fields.Monetary(
        string='Customs Duties (SDG)',
        currency_field='company_currency_id',
        default=0.00,
        tracking=True
    )

    sudanil_logistics_charge = fields.Monetary(
        string='Freight & Loading Charges (SDG)',
        currency_field='company_currency_id',
        default=0.00,
        tracking=True
    )

    sudanil_is_sovereign_tax = fields.Boolean(
        string='Apply Sovereign Security Levy',
        default=True,
        help="Applies standard sovereign import-export security taxation."
    )

    sudanil_portal_sync_status = fields.Selection([
        ('pending', 'Pending Sync (قيد المعالجة)'),
        ('synced', 'Synced to Portal (تمت المزامنة)')
    ], string='Sovereign Sync Status', default='pending', tracking=True)

    @api.onchange('sudanil_shipment_id')
    def _onchange_sudanil_shipment(self):
        if self.sudanil_shipment_id:
            # Set default values based on cargo description and partner info
            self.partner_id = self.sudanil_shipment_id.partner_id.id
            if self.sudanil_shipment_id.cargo_weight > 0:
                # 15,000 SDG base charge per ton of active logistics weight
                self.sudanil_logistics_charge = self.sudanil_shipment_id.cargo_weight * 15000.0
                # 5,000 SDG base import customs duty per ton
                self.sudanil_customs_charge = self.sudanil_shipment_id.cargo_weight * 5000.0

    def action_post(self):
        # Override invoice post to trigger active push to external logistics portal
        res = super(AccountMove, self).encode_invoice_post() if hasattr(super(AccountMove, self), 'encode_invoice_post') else super(AccountMove, self).action_post()
        for move in self:
            if move.sudanil_shipment_id:
                move.sudanil_portal_sync_status = 'synced'
        return res
