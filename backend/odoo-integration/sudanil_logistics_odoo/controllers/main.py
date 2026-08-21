# -*- coding: utf-8 -*-
import json
from odoo import http, fields
from odoo.http import request
import logging

_logger = logging.getLogger(__name__)

class SudanilPortalAPI(http.Controller):

    # ======================= CUSTOMER ENDPOINTS =======================
    
    @http.route('/sudanil/api/customers', type='json', auth='user', methods=['GET'])
    def get_customers(self, **kwargs):
        """Get all customers with filtering"""
        customers = request.env['sudanil.customer'].search([])
        data = []
        for cust in customers:
            data.append({
                'id': cust.id,
                'code': cust.customer_code,
                'name': cust.name,
                'email': cust.email,
                'phone': cust.phone,
                'type': cust.customer_type,
                'rating': cust.customer_rating,
                'status': cust.status,
                'lifetime_value': cust.lifetime_value,
                'total_shipments': cust.total_shipments,
                'active_shipments': cust.active_shipments,
                'risk_level': cust.risk_level,
                'industry': cust.industry
            })
        return {'status': 'success', 'data': data, 'count': len(data)}
    
    @http.route('/sudanil/api/customers/<int:customer_id>', type='json', auth='user', methods=['GET'])
    def get_customer_detail(self, customer_id, **kwargs):
        """Get detailed customer information"""
        customer = request.env['sudanil.customer'].browse(customer_id)
        if not customer.exists():
            return {'status': 'error', 'message': 'Customer not found'}
        
        return {
            'status': 'success',
            'data': {
                'id': customer.id,
                'code': customer.customer_code,
                'name': customer.name,
                'email': customer.email,
                'phone': customer.phone,
                'mobile': customer.mobile,
                'type': customer.customer_type,
                'company_name': customer.company_name,
                'registration_number': customer.registration_number,
                'industry': customer.industry,
                'country': customer.country,
                'state': customer.state,
                'city': customer.city,
                'address': customer.address,
                'postal_code': customer.postal_code,
                'rating': customer.customer_rating,
                'status': customer.status,
                'lifetime_value': customer.lifetime_value,
                'total_shipments': customer.total_shipments,
                'active_shipments': customer.active_shipments,
                'risk_level': customer.risk_level,
                'credit_limit': customer.credit_limit,
                'last_interaction': customer.last_interaction_date.isoformat() if customer.last_interaction_date else None,
                'shipments': [{
                    'id': s.id,
                    'name': s.name,
                    'status': s.state,
                    'cargo_type': s.cargo_type,
                    'weight': s.cargo_weight
                } for s in customer.shipment_ids[:10]]
            }
        }
    
    @http.route('/sudanil/api/customers', type='json', auth='user', methods=['POST'])
    def create_customer(self, **kwargs):
        """Create a new customer"""
        data = request.jsonrpc.get('params', {})
        try:
            customer = request.env['sudanil.customer'].create({
                'name': data.get('name'),
                'email': data.get('email'),
                'phone': data.get('phone'),
                'customer_type': data.get('customer_type', 'company'),
                'company_name': data.get('company_name'),
                'industry': data.get('industry'),
                'country': data.get('country', 'Sudan'),
                'city': data.get('city'),
                'address': data.get('address'),
                'status': 'prospect'
            })
            return {'status': 'success', 'message': 'Customer created', 'customer_id': customer.id}
        except Exception as e:
            return {'status': 'error', 'message': str(e)}

    # ======================= OPPORTUNITY ENDPOINTS =======================
    
    @http.route('/sudanil/api/opportunities', type='json', auth='user', methods=['GET'])
    def get_opportunities(self, **kwargs):
        """Get all opportunities"""
        opportunities = request.env['sudanil.opportunity'].search([])
        data = []
        for opp in opportunities:
            data.append({
                'id': opp.id,
                'code': opp.opportunity_code,
                'name': opp.name,
                'customer': opp.customer_id.name,
                'type': opp.opportunity_type,
                'stage': opp.stage,
                'value': opp.expected_value,
                'probability': opp.probability,
                'weighted_value': opp.weighted_value,
                'assigned_to': opp.assigned_to.name,
                'close_date': opp.expected_close_date.isoformat() if opp.expected_close_date else None
            })
        return {'status': 'success', 'data': data, 'count': len(data)}
    
    @http.route('/sudanil/api/opportunities/my', type='json', auth='user', methods=['GET'])
    def get_my_opportunities(self, **kwargs):
        """Get user's opportunities"""
        opportunities = request.env['sudanil.opportunity'].search([
            ('assigned_to', '=', request.env.user.id)
        ])
        
        stats = {
            'total': len(opportunities),
            'open': len(opportunities.filtered(lambda o: o.stage not in ['won', 'lost'])),
            'won': len(opportunities.filtered(lambda o: o.stage == 'won')),
            'lost': len(opportunities.filtered(lambda o: o.stage == 'lost')),
            'total_value': sum(o.expected_value for o in opportunities),
            'weighted_value': sum(o.weighted_value for o in opportunities)
        }
        
        data = [{
            'id': o.id,
            'code': o.opportunity_code,
            'name': o.name,
            'customer': o.customer_id.name,
            'stage': o.stage,
            'value': o.expected_value,
            'probability': o.probability,
            'close_date': o.expected_close_date.isoformat() if o.expected_close_date else None
        } for o in opportunities]
        
        return {'status': 'success', 'stats': stats, 'data': data}
    
    @http.route('/sudanil/api/opportunities/<int:opp_id>', type='json', auth='user', methods=['GET'])
    def get_opportunity_detail(self, opp_id, **kwargs):
        """Get detailed opportunity information"""
        opp = request.env['sudanil.opportunity'].browse(opp_id)
        if not opp.exists():
            return {'status': 'error', 'message': 'Opportunity not found'}
        
        return {
            'status': 'success',
            'data': {
                'id': opp.id,
                'code': opp.opportunity_code,
                'name': opp.name,
                'customer_id': opp.customer_id.id,
                'customer': opp.customer_id.name,
                'type': opp.opportunity_type,
                'stage': opp.stage,
                'pipeline_status': opp.pipeline_status,
                'value': opp.expected_value,
                'probability': opp.probability,
                'weighted_value': opp.weighted_value,
                'cargo_type': opp.cargo_type,
                'cargo_weight': opp.cargo_weight_tons,
                'route_type': opp.route_type,
                'origin': opp.origin_location,
                'destination': opp.destination_location,
                'expected_close': opp.expected_close_date.isoformat() if opp.expected_close_date else None,
                'actual_close': opp.actual_close_date.isoformat() if opp.actual_close_date else None,
                'assigned_to': opp.assigned_to.name,
                'notes': opp.notes
            }
        }

    # ======================= DASHBOARD ENDPOINTS =======================
    
    @http.route('/sudanil/api/dashboard/executive', type='json', auth='user', methods=['GET'])
    def get_executive_dashboard(self, **kwargs):
        """Get executive dashboard data"""
        dashboard = request.env['sudanil.dashboard'].get_dashboard_data()
        return {'status': 'success', 'data': dashboard}
    
    @http.route('/sudanil/api/dashboard/user', type='json', auth='user', methods=['GET'])
    def get_user_dashboard(self, **kwargs):
        """Get personalized user dashboard"""
        user_dashboard = request.env['sudanil.user.dashboard'].get_user_dashboard_data(request.env.user.id)
        return {'status': 'success', 'data': user_dashboard}
    
    @http.route('/sudanil/api/analytics/shipments', type='json', auth='user', methods=['GET'])
    def get_shipment_analytics(self, **kwargs):
        """Get shipment analytics"""
        start_date = kwargs.get('start_date')
        end_date = kwargs.get('end_date')
        analytics = request.env['sudanil.analytics'].get_shipment_analytics(start_date, end_date)
        return {'status': 'success', 'data': analytics}
    
    @http.route('/sudanil/api/analytics/customers', type='json', auth='user', methods=['GET'])
    def get_customer_analytics(self, **kwargs):
        """Get customer analytics"""
        analytics = request.env['sudanil.analytics'].get_customer_analytics()
        return {'status': 'success', 'data': analytics}
    
    @http.route('/sudanil/api/analytics/opportunities', type='json', auth='user', methods=['GET'])
    def get_opportunity_analytics(self, **kwargs):
        """Get opportunity analytics"""
        analytics = request.env['sudanil.analytics'].get_opportunity_analytics()
        return {'status': 'success', 'data': analytics}
    
    @http.route('/sudanil/api/analytics/revenue', type='json', auth='user', methods=['GET'])
    def get_revenue_analytics(self, **kwargs):
        """Get revenue analytics"""
        start_date = kwargs.get('start_date')
        end_date = kwargs.get('end_date')
        analytics = request.env['sudanil.analytics'].get_revenue_analytics(start_date, end_date)
        return {'status': 'success', 'data': analytics}

    # ======================= NOTIFICATION ENDPOINTS =======================
    
    @http.route('/sudanil/api/notifications', type='json', auth='user', methods=['GET'])
    def get_notifications(self, **kwargs):
        """Get user notifications"""
        limit = kwargs.get('limit', 20)
        unread_only = kwargs.get('unread_only', False)
        
        domain = [('user_id', '=', request.env.user.id)]
        if unread_only:
            domain.append(('is_read', '=', False))
        
        notifications = request.env['sudanil.user.notification'].search(domain, order='create_date desc', limit=limit)
        
        data = [{
            'id': n.id,
            'type': n.notification_type,
            'title': n.title,
            'message': n.message,
            'priority': n.priority,
            'is_read': n.is_read,
            'created': n.create_date.isoformat() if n.create_date else None
        } for n in notifications]
        
        return {
            'status': 'success',
            'data': data,
            'unread_count': len(notifications.filtered(lambda n: not n.is_read))
        }
    
    @http.route('/sudanil/api/notifications/<int:notification_id>/read', type='json', auth='user', methods=['POST'])
    def mark_notification_read(self, notification_id, **kwargs):
        """Mark notification as read"""
        notification = request.env['sudanil.user.notification'].browse(notification_id)
        if not notification.exists():
            return {'status': 'error', 'message': 'Notification not found'}
        
        notification.action_mark_as_read()
        return {'status': 'success', 'message': 'Notification marked as read'}

    # ======================= SHIPMENT ENDPOINTS =======================
    
    @http.route('/sudanil/api/shipments', type='json', auth='public', methods=['POST'], csrf=False)
    def get_shipments(self, **kwargs):
        """Get shipments with advanced filtering"""
        shipments = request.env['sudanil.shipment'].sudo().search([])
        data = []
        for ship in shipments:
            data.append({
                'id': ship.id,
                'name': ship.name,
                'client': ship.partner_id.name if hasattr(ship, 'partner_id') else 'N/A',
                'cargo': ship.cargo_type,
                'weight': ship.cargo_weight,
                'route': ship.route_type,
                'origin': ship.origin_id.name,
                'destination': ship.destination_id.name,
                'current_location': ship.current_location_id.name or ship.origin_id.name,
                'progress': ship.transit_progress,
                'status': ship.state,
                'customs_status': ship.customs_status,
                'customs_dec': ship.customs_declaration_no,
                'history': [{
                    'time': h.timestamp.isoformat() if h.timestamp else None,
                    'state': h.state,
                    'location': h.location_id.name,
                    'msg': h.description
                } for h in ship.history_ids]
            })
        return {'status': 'success', 'data': data}

    @http.route('/sudanil/api/warehouses', type='json', auth='public', methods=['POST'], csrf=False)
    def get_warehouses(self, **kwargs):
        """Get terminal/warehouse data"""
        warehouses = request.env['stock.warehouse'].sudo().search([('sudanil_terminal_type', '!=', False)])
        data = []
        for wh in warehouses:
            data.append({
                'id': wh.id,
                'name': wh.name,
                'type': wh.sudanil_terminal_type,
                'max_capacity': wh.sudanil_capacity_max,
                'current_weight': wh.sudanil_capacity_current,
                'occupancy': wh.sudanil_occupancy_rate,
                'needs_rebalance': wh.sudanil_needs_rebalance
            })
        return {'status': 'success', 'data': data}

    @http.route('/sudanil/api/sync_test', type='json', auth='public', methods=['POST'], csrf=False)
    def sync_test(self, **kwargs):
        """API health check"""
        return {
            'status': 'online',
            'version': '2.0.0',
            'protocol': 'Sovereign-Sync-ERP-CRM',
            'server_time': fields.Datetime.now().isoformat(),
            'features': ['CRM', 'ERP', 'Analytics', 'Dashboard', 'User Portal']
        }
