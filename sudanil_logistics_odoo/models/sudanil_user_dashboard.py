# -*- coding: utf-8 -*-
# Part of Sudanil Logistics ERP Integration. See LICENSE file for full copyright and licensing details.

from odoo import models, fields, api, _
from datetime import datetime, timedelta
import logging

_logger = logging.getLogger(__name__)

class SudanilUserDashboard(models.Model):
    _name = 'sudanil.user.dashboard'
    _description = 'Sudanil User Portal Dashboard'
    _auto = False  # No database table

    @api.model
    def get_user_dashboard_data(self, user_id=None):
        """Get personalized dashboard data for a specific user"""
        if not user_id:
            user_id = self.env.user.id
        
        user = self.env['res.users'].browse(user_id)
        today = fields.Date.today()
        week_start = today - timedelta(days=today.weekday())
        month_start = today.replace(day=1)
        
        dashboard_data = {}
        
        # 1. User Information
        dashboard_data['user_name'] = user.name
        dashboard_data['user_email'] = user.email
        dashboard_data['user_company'] = user.company_id.name
        dashboard_data['user_department'] = user.department_id.name if hasattr(user, 'department_id') else 'N/A'
        
        # 2. For Sales Representatives
        if user.has_group('base.group_user'):
            # My Opportunities
            my_opportunities = self.env['sudanil.opportunity'].search([
                ('assigned_to', '=', user_id)
            ])
            dashboard_data['my_opportunities_count'] = len(my_opportunities)
            dashboard_data['my_open_opportunities'] = len(my_opportunities.filtered(lambda o: o.stage not in ['won', 'lost']))
            dashboard_data['my_opportunities_value'] = sum(o.expected_value for o in my_opportunities)
            dashboard_data['my_won_opportunities'] = len(my_opportunities.filtered(lambda o: o.stage == 'won'))
            dashboard_data['my_won_value'] = sum(o.expected_value for o in my_opportunities.filtered(lambda o: o.stage == 'won'))
            
            # Win rate
            total_closed = len(my_opportunities.filtered(lambda o: o.stage in ['won', 'lost']))
            won_count = len(my_opportunities.filtered(lambda o: o.stage == 'won'))
            dashboard_data['my_win_rate'] = (won_count / total_closed * 100) if total_closed > 0 else 0
            
            # Activities this week
            my_activities = self.env['sudanil.opportunity.activity'].search([
                ('assigned_to', '=', user_id),
                ('activity_date', '>=', week_start)
            ])
            dashboard_data['activities_this_week'] = len(my_activities)
            dashboard_data['activities_pending'] = len(my_activities.filtered(lambda a: a.status == 'pending'))
            dashboard_data['activities_completed'] = len(my_activities.filtered(lambda a: a.status == 'completed'))
            
            # Top 5 opportunities
            top_opps = sorted(
                my_opportunities.filtered(lambda o: o.stage != 'lost'),
                key=lambda o: o.expected_value,
                reverse=True
            )[:5]
            dashboard_data['top_opportunities'] = [{
                'name': opp.name,
                'customer': opp.customer_id.name,
                'value': opp.expected_value,
                'stage': opp.stage,
                'probability': opp.probability,
                'expected_close': opp.expected_close_date
            } for opp in top_opps]
        
        # 3. For All Users - My Shipments/Orders
        my_shipments = self.env['sudanil.shipment'].search([
            ('create_uid', '=', user_id)
        ])
        dashboard_data['my_shipments_total'] = len(my_shipments)
        dashboard_data['my_shipments_active'] = len(my_shipments.filtered(lambda s: s.state in ['draft', 'transit', 'port', 'customs']))
        dashboard_data['my_shipments_delivered'] = len(my_shipments.filtered(lambda s: s.state == 'delivered'))
        
        # 4. For Customers - Linked Customers
        customer_profiles = self.env['sudanil.customer'].search([
            ('partner_id.user_id', '=', user_id)
        ])
        dashboard_data['linked_customers'] = len(customer_profiles)
        
        if customer_profiles:
            dashboard_data['my_customer'] = customer_profiles[0].name
            dashboard_data['my_customer_shipments'] = customer_profiles[0].total_shipments
            dashboard_data['my_customer_active_shipments'] = customer_profiles[0].active_shipments
            dashboard_data['my_customer_rating'] = customer_profiles[0].customer_rating
        
        # 5. Recent Activities
        recent_shipments = self.env['sudanil.shipment'].search(
            [],
            order='create_date desc',
            limit=5
        )
        dashboard_data['recent_shipments'] = [{
            'name': s.name,
            'customer': s.customer_id.name if hasattr(s, 'customer_id') else s.partner_id.name,
            'status': s.state,
            'progress': s.transit_progress,
            'created': s.create_date
        } for s in recent_shipments]
        
        # 6. Quick Stats
        dashboard_data['total_revenue_month'] = self._get_user_revenue(user_id, month_start, today)
        dashboard_data['total_invoices_month'] = len(self.env['account.move'].search([
            ('create_uid', '=', user_id),
            ('move_type', '=', 'out_invoice'),
            ('invoice_date', '>=', month_start),
            ('state', '=', 'posted')
        ]))
        
        return dashboard_data
    
    @api.model
    def _get_user_revenue(self, user_id, start_date, end_date):
        """Calculate user's revenue for a period"""
        invoices = self.env['account.move'].search([
            ('create_uid', '=', user_id),
            ('move_type', '=', 'out_invoice'),
            ('invoice_date', '>=', start_date),
            ('invoice_date', '<=', end_date),
            ('state', '=', 'posted')
        ])
        return sum(invoices.mapped('amount_untaxed'))


class SudanilUserNotification(models.Model):
    _name = 'sudanil.user.notification'
    _description = 'User Notifications & Alerts'
    _inherit = ['mail.thread']
    _order = 'create_date desc'

    user_id = fields.Many2one('res.users', string='User', required=True, ondelete='cascade')
    notification_type = fields.Selection([
        ('shipment_update', 'Shipment Update (تحديث الشحنة)'),
        ('opportunity_alert', 'Opportunity Alert (تنبيه الفرصة)'),
        ('payment_due', 'Payment Due (الدفع المستحق)'),
        ('activity_reminder', 'Activity Reminder (تذكير النشاط)'),
        ('system_alert', 'System Alert (تنبيه النظام)'),
        ('customer_inquiry', 'Customer Inquiry (استفسار العميل)'),
        ('other', 'Other (أخرى)')
    ], string='Notification Type', required=True)
    
    title = fields.Char(string='Notification Title', required=True)
    message = fields.Text(string='Message', required=True)
    
    related_model = fields.Char(string='Related Model', help='Model name (e.g., sudanil.shipment)')
    related_record_id = fields.Integer(string='Related Record ID')
    
    priority = fields.Selection([
        ('low', 'Low (منخفضة)'),
        ('normal', 'Normal (عادية)'),
        ('high', 'High (عالية)'),
        ('urgent', 'Urgent (عاجلة)')
    ], string='Priority', default='normal')
    
    is_read = fields.Boolean(string='Read', default=False)
    read_date = fields.Datetime(string='Read Date')
    
    active = fields.Boolean(default=True)
    
    @api.model
    def create_notification(self, user_id, notification_type, title, message, priority='normal', related_model=None, related_record_id=None):
        """Helper method to create a notification"""
        return self.create({
            'user_id': user_id,
            'notification_type': notification_type,
            'title': title,
            'message': message,
            'priority': priority,
            'related_model': related_model,
            'related_record_id': related_record_id
        })
    
    def action_mark_as_read(self):
        self.write({
            'is_read': True,
            'read_date': fields.Datetime.now()
        })
    
    def action_mark_as_unread(self):
        self.write({
            'is_read': False,
            'read_date': None
        })


class SudanilUserPreference(models.Model):
    _name = 'sudanil.user.preference'
    _description = 'User Preferences & Settings'
    _auto = False

    @api.model
    def get_user_preferences(self, user_id=None):
        """Get user preferences"""
        if not user_id:
            user = self.env.user
        else:
            user = self.env['res.users'].browse(user_id)
        
        res_user_preferences = self.env['res.users'].search([('id', '=', user.id)])
        
        return {
            'language': user.lang,
            'timezone': user.tz,
            'company': user.company_id.name,
            'email_notifications': True,  # Can be customized
            'dashboard_view': 'summary',  # 'summary' or 'detailed'
            'default_currency': user.company_id.currency_id.name
        }


class SudanilActivityLog(models.Model):
    _name = 'sudanil.activity.log'
    _description = 'User Activity Log'
    _order = 'create_date desc'

    user_id = fields.Many2one('res.users', string='User', required=True, ondelete='cascade')
    action_type = fields.Selection([
        ('create', 'Create (إنشاء)'),
        ('update', 'Update (تحديث)'),
        ('delete', 'Delete (حذف)'),
        ('view', 'View (عرض)'),
        ('export', 'Export (تصدير)'),
        ('login', 'Login (تسجيل الدخول)'),
        ('logout', 'Logout (تسجيل الخروج)'),
        ('other', 'Other (أخرى)')
    ], string='Action Type', required=True)
    
    model = fields.Char(string='Model', required=True)
    record_id = fields.Integer(string='Record ID')
    record_name = fields.Char(string='Record Name')
    
    description = fields.Text(string='Description')
    old_values = fields.Text(string='Old Values (JSON)')
    new_values = fields.Text(string='New Values (JSON)')
    
    ip_address = fields.Char(string='IP Address')
    
    @api.model
    def log_action(self, action_type, model, record_id, record_name, description='', old_values=None, new_values=None):
        """Helper method to log user actions"""
        return self.create({
            'user_id': self.env.user.id,
            'action_type': action_type,
            'model': model,
            'record_id': record_id,
            'record_name': record_name,
            'description': description,
            'old_values': old_values,
            'new_values': new_values
        })
