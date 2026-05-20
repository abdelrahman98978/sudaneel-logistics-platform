# -*- coding: utf-8 -*-
# Part of Sudanil Logistics ERP Integration. See LICENSE file for full copyright and licensing details.

from odoo import models, fields, api, _
from odoo.exceptions import ValidationError

class StockWarehouse(models.Model):
    _inherit = 'stock.warehouse'

    sudanil_terminal_type = fields.Selection([
        ('marine', 'Marine Seaport Terminal (ميناء بحري)'),
        ('dry', 'Dry Inland Port (ميناء جاف)'),
        ('distribution', 'Inland Logistics Terminal (مستودع إمداد داخلي)')
    ], string='Sudanil Terminal Type', default='dry', tracking=True)

    sudanil_capacity_max = fields.Float(
        string='Max Storage Capacity (Tons)',
        default=10000.00,
        help="Maximum cargo storage capacity before reaching warning state."
    )

    sudanil_capacity_current = fields.Float(
        string='Current Stock Weight (Tons)',
        default=0.00,
        help="Live aggregated weight of all physical goods currently inside locations."
    )

    sudanil_occupancy_rate = fields.Float(
        string='Occupancy Rate (%)',
        compute='_compute_sudanil_occupancy_rate',
        store=True,
        help="Percentage showing visual utilization of terminal storage."
    )

    sudanil_needs_rebalance = fields.Boolean(
        string='Needs Congestion Rebalance',
        compute='_compute_sudanil_rebalance',
        store=True
    )

    @api.depends('sudanil_capacity_max', 'sudanil_capacity_current')
    def _compute_sudanil_occupancy_rate(self):
        for rec in self:
            if rec.sudanil_capacity_max > 0:
                rec.sudanil_occupancy_rate = (rec.sudanil_capacity_current / rec.sudanil_capacity_max) * 100
            else:
                rec.sudanil_occupancy_rate = 0.0

    @api.depends('sudanil_occupancy_rate')
    def _compute_sudanil_rebalance(self):
        for rec in self:
            # Over 90% utilization triggers critical rebalance warning
            rec.sudanil_needs_rebalance = rec.sudanil_occupancy_rate >= 90.0

    @api.constrains('sudanil_capacity_current', 'sudanil_capacity_max')
    def _check_capacity_limits(self):
        for rec in self:
            if rec.sudanil_capacity_current > rec.sudanil_capacity_max:
                raise ValidationError(_("Emergency Capacity Limit Blown! Current weight of (%s tons) exceeds structural capacity of (%s tons) for warehouse %s.") % (
                    rec.sudanil_capacity_current,
                    rec.sudanil_capacity_max,
                    rec.name
                ))
