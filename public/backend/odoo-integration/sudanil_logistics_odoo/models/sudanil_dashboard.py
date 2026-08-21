# -*- coding: utf-8 -*-
# Part of Sudanil Logistics ERP Integration. See LICENSE file for full copyright and licensing details.

from odoo import models, fields, api, _
from odoo.exceptions import ValidationError
from datetime import datetime, timedelta
import logging

_logger = logging.getLogger(__name__)

class SudanilDashboard(models.Model):
    _name = 'sudanil.dashboard'
    _description = 'Sudanil ERP Dashboard'
    _auto = False  # No database table

    # Executive Metrics
    total_active_shipments = fields.Integer(string='Active Shipments')
    total_customers = fields.Integer(string='Total Customers')
    total_opportunities = fields.Integer(string='Open Opportunities')
    
    revenue_this_month = fields.Monetary(string='Revenue This Month (SDG)', currency_field='company_currency_id')
    revenue_this_year = fields.Monetary(string='Revenue This Year (SDG)', currency_field='company_currency_id')
    
    pending_payments = fields.Monetary(string='Pending Payments (SDG)', currency_field='company_currency_id')
    overdue_payments = fields.Monetary(string='Overdue Payments (SDG)', currency_field='company_currency_id')
    
    warehouse_occupancy = fields.Float(string='Average Warehouse Occupancy (%)')
    customs_clearance_rate = fields.Float(string='Customs Clearance Rate (%)')
    
    # KPIs
    average_shipment_time = fields.Float(string='Avg Shipment Time (days)')
    on_time_delivery_rate = fields.Float(string='On-Time Delivery Rate (%)')
    customer_satisfaction = fields.Float(string='Customer Satisfaction Score (0-100)')
    
    # Top performing
    top_customer = fields.Many2one('sudanil.customer', string='Top Customer')
    top_customer_value = fields.Monetary(string='Top Customer Value (SDG)', currency_field='company_currency_id')
    
    top_sales_rep = fields.Many2one('res.users', string='Top Sales Rep')
    top_sales_rep_value = fields.Monetary(string='Top Sales Rep Value (SDG)', currency_field='company_currency_id')
    
    company_currency_id = fields.Many2one('res.currency', related='company_id.currency_id')
    company_id = fields.Many2one('res.company', string='Company', default=lambda self: self.env.company)
    
    @api.model
    def get_dashboard_data(self):
        """Get comprehensive dashboard data"""
        today = fields.Date.today()
        month_start = today.replace(day=1)
        year_start = today.replace(month=1, day=1)
        
        # Shipment metrics
        shipments = self.env['sudanil.shipment'].search([])
        active_shipments = shipments.filtered(lambda s: s.state in ['draft', 'transit', 'port', 'customs'])
        
        # Customer metrics
        customers = self.env['sudanil.customer'].search([])
        active_customers = customers.filtered(lambda c: c.status in ['active', 'loyal'])
        
        # Opportunity metrics
        opportunities = self.env['sudanil.opportunity'].search([])
        open_opportunities = opportunities.filtered(lambda o: o.stage not in ['won', 'lost'])
        
        # Revenue metrics
        invoices_month = self.env['account.move'].search([
            ('move_type', '=', 'out_invoice'),
            ('invoice_date', '>=', month_start),
            ('state', '=', 'posted')
        ])
        revenue_month = sum(invoices_month.mapped('amount_untaxed'))
        
        invoices_year = self.env['account.move'].search([
            ('move_type', '=', 'out_invoice'),
            ('invoice_date', '>=', year_start),
            ('state', '=', 'posted')
        ])
        revenue_year = sum(invoices_year.mapped('amount_untaxed'))
        
        # Payment metrics
        pending_invoices = self.env['account.move'].search([
            ('move_type', '=', 'out_invoice'),
            ('state', '=', 'posted'),
            ('payment_state', 'in', ['not_paid', 'partial'])
        ])
        pending_amount = sum(pending_invoices.mapped(lambda x: x.amount_residual))
        
        overdue_invoices = self.env['account.move'].search([
            ('move_type', '=', 'out_invoice'),
            ('state', '=', 'posted'),
            ('invoice_date_due', '<', today),
            ('payment_state', 'in', ['not_paid', 'partial'])
        ])
        overdue_amount = sum(overdue_invoices.mapped(lambda x: x.amount_residual))
        
        # Warehouse metrics
        warehouses = self.env['stock.warehouse'].search([('sudanil_terminal_type', '!=', False)])
        avg_occupancy = sum(w.sudanil_occupancy_rate for w in warehouses) / len(warehouses) if warehouses else 0
        
        # Customs metrics
        shipped = shipments.filtered(lambda s: s.customs_status != 'pending')
        cleared = shipped.filtered(lambda s: s.customs_status == 'released')
        customs_rate = (len(cleared) / len(shipped) * 100) if shipped else 0
        
        # Top customer
        customer_values = {}
        for cust in customers:
            customer_values[cust.id] = cust.lifetime_value
        
        top_cust_id = max(customer_values, key=customer_values.get) if customer_values else None
        top_customer = self.env['sudanil.customer'].browse(top_cust_id) if top_cust_id else None
        
        # Top sales rep
        rep_values = {}
        for opp in opportunities.filtered(lambda o: o.stage == 'won'):
            if opp.assigned_to.id not in rep_values:
                rep_values[opp.assigned_to.id] = 0
            rep_values[opp.assigned_to.id] += opp.expected_value
        
        top_rep_id = max(rep_values, key=rep_values.get) if rep_values else None
        top_sales_rep = self.env['res.users'].browse(top_rep_id) if top_rep_id else None
        
        return {
            'total_active_shipments': len(active_shipments),
            'total_customers': len(customers),
            'active_customers': len(active_customers),
            'total_opportunities': len(opportunities),
            'open_opportunities': len(open_opportunities),
            'revenue_this_month': revenue_month,
            'revenue_this_year': revenue_year,
            'pending_payments': pending_amount,
            'overdue_payments': overdue_amount,
            'warehouse_occupancy': avg_occupancy,
            'customs_clearance_rate': customs_rate,
            'top_customer': top_customer.name if top_customer else 'N/A',
            'top_customer_value': top_customer.lifetime_value if top_customer else 0,
            'top_sales_rep': top_sales_rep.name if top_sales_rep else 'N/A',
            'top_sales_rep_value': rep_values.get(top_rep_id, 0) if top_rep_id else 0,
        }


class SudanilAnalytics(models.Model):
    _name = 'sudanil.analytics'
    _description = 'Sudanil Analytics & Reports'
    _auto = False  # No database table

    @api.model
    def get_shipment_analytics(self, start_date=None, end_date=None):
        """Get shipment analytics for a date range"""
        if not start_date:
            start_date = (datetime.now() - timedelta(days=30)).date()
        if not end_date:
            end_date = fields.Date.today()
        
        shipments = self.env['sudanil.shipment'].search([
            ('create_date', '>=', start_date),
            ('create_date', '<=', end_date)
        ])
        
        total_weight = sum(s.cargo_weight for s in shipments)
        total_count = len(shipments)
        
        by_status = {}
        for shipment in shipments:
            if shipment.state not in by_status:
                by_status[shipment.state] = 0
            by_status[shipment.state] += 1
        
        by_route = {}
        for shipment in shipments:
            if shipment.route_type not in by_route:
                by_route[shipment.route_type] = 0
            by_route[shipment.route_type] += 1
        
        by_customs = {}
        for shipment in shipments:
            if shipment.customs_status not in by_customs:
                by_customs[shipment.customs_status] = 0
            by_customs[shipment.customs_status] += 1
        
        return {
            'total_shipments': total_count,
            'total_weight_tons': total_weight,
            'avg_weight_per_shipment': total_weight / total_count if total_count > 0 else 0,
            'by_status': by_status,
            'by_route': by_route,
            'by_customs_status': by_customs,
            'period': {
                'start_date': start_date,
                'end_date': end_date
            }
        }
    
    @api.model
    def get_customer_analytics(self):
        """Get comprehensive customer analytics"""
        customers = self.env['sudanil.customer'].search([])
        
        by_status = {}
        by_rating = {}
        by_industry = {}
        
        for customer in customers:
            # By status
            if customer.status not in by_status:
                by_status[customer.status] = 0
            by_status[customer.status] += 1
            
            # By rating
            if customer.customer_rating not in by_rating:
                by_rating[customer.customer_rating] = 0
            by_rating[customer.customer_rating] += 1
            
            # By industry
            if customer.industry not in by_industry:
                by_industry[customer.industry] = 0
            by_industry[customer.industry] += 1
        
        total_lifetime_value = sum(c.lifetime_value for c in customers)
        avg_lifetime_value = total_lifetime_value / len(customers) if customers else 0
        
        return {
            'total_customers': len(customers),
            'by_status': by_status,
            'by_rating': by_rating,
            'by_industry': by_industry,
            'total_lifetime_value': total_lifetime_value,
            'avg_lifetime_value': avg_lifetime_value,
        }
    
    @api.model
    def get_opportunity_analytics(self):
        """Get sales opportunity analytics"""
        opportunities = self.env['sudanil.opportunity'].search([])
        
        by_stage = {}
        by_type = {}
        
        total_expected_value = 0
        total_weighted_value = 0
        won_count = 0
        lost_count = 0
        
        for opp in opportunities:
            # By stage
            if opp.stage not in by_stage:
                by_stage[opp.stage] = {'count': 0, 'value': 0}
            by_stage[opp.stage]['count'] += 1
            by_stage[opp.stage]['value'] += opp.expected_value
            
            # By type
            if opp.opportunity_type not in by_type:
                by_type[opp.opportunity_type] = {'count': 0, 'value': 0}
            by_type[opp.opportunity_type]['count'] += 1
            by_type[opp.opportunity_type]['value'] += opp.expected_value
            
            # Totals
            total_expected_value += opp.expected_value
            total_weighted_value += opp.weighted_value
            
            if opp.stage == 'won':
                won_count += 1
            elif opp.stage == 'lost':
                lost_count += 1
        
        win_rate = (won_count / (won_count + lost_count) * 100) if (won_count + lost_count) > 0 else 0
        
        return {
            'total_opportunities': len(opportunities),
            'total_expected_value': total_expected_value,
            'total_weighted_value': total_weighted_value,
            'by_stage': by_stage,
            'by_type': by_type,
            'won_count': won_count,
            'lost_count': lost_count,
            'win_rate': win_rate,
        }
    
    @api.model
    def get_revenue_analytics(self, start_date=None, end_date=None):
        """Get revenue analytics"""
        if not start_date:
            start_date = (datetime.now() - timedelta(days=90)).date()
        if not end_date:
            end_date = fields.Date.today()
        
        invoices = self.env['account.move'].search([
            ('move_type', '=', 'out_invoice'),
            ('invoice_date', '>=', start_date),
            ('invoice_date', '<=', end_date),
            ('state', '=', 'posted')
        ])
        
        total_revenue = sum(invoices.mapped('amount_untaxed'))
        total_taxes = sum(invoices.mapped('amount_tax'))
        paid_amount = sum(invoices.filtered(lambda x: x.payment_state == 'paid').mapped('amount_total'))
        unpaid_amount = sum(invoices.filtered(lambda x: x.payment_state in ['not_paid', 'partial']).mapped('amount_residual'))
        
        by_customer = {}
        for invoice in invoices:
            if invoice.partner_id.id not in by_customer:
                by_customer[invoice.partner_id.id] = {'name': invoice.partner_id.name, 'amount': 0}
            by_customer[invoice.partner_id.id]['amount'] += invoice.amount_untaxed
        
        return {
            'total_invoices': len(invoices),
            'total_revenue': total_revenue,
            'total_taxes': total_taxes,
            'paid_amount': paid_amount,
            'unpaid_amount': unpaid_amount,
            'by_customer': by_customer,
            'period': {
                'start_date': start_date,
                'end_date': end_date
            }
        }
