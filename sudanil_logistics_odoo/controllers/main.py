# -*- coding: utf-8 -*-
import json
from odoo import http, fields
from odoo.http import request

class SudanilPortalAPI(http.Controller):

    @http.route('/sudanil/api/shipments', type='json', auth='public', methods=['POST'], csrf=False)
    def get_shipments(self, **kwargs):
        """
        Public API endpoint for fetching shipment data.
        In a production environment, this would require JWT or Session authentication.
        """
        shipments = request.env['sudanil.shipment'].sudo().search([])
        data = []
        for ship in shipments:
            data.append({
                'id': ship.name,
                'client': ship.partner_id.name,
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
                    'time': h.timestamp.isoformat(),
                    'state': h.state,
                    'location': h.location_id.name,
                    'msg': h.description
                } for h in ship.history_ids]
            })
        return {'status': 'success', 'data': data}

    @http.route('/sudanil/api/warehouses', type='json', auth='public', methods=['POST'], csrf=False)
    def get_warehouses(self, **kwargs):
        """
        API endpoint for fetching real-time terminal occupancy rates.
        """
        warehouses = request.env['stock.warehouse'].sudo().search([('sudanil_terminal_type', '!=', False)])
        data = []
        for wh in warehouses:
            data.append({
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
        return {
            'status': 'online',
            'version': '1.0.0',
            'protocol': 'Sovereign-Sync',
            'server_time': fields.Datetime.now().isoformat()
        }
