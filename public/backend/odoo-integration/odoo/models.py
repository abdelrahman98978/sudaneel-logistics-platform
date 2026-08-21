# -*- coding: utf-8 -*-
# Odoo Models Dummy Stub to resolve local IDE/Linter import warnings

class Model(object):
    """Dummy Odoo Model base class"""
    _name = 'dummy.model'
    _description = 'Dummy Odoo Model'
    _inherit = []
    _order = 'id desc'

    id = 0
    create_date = None
    write_date = None

    def __init__(self, *args, **kwargs):
        pass

    def write(self, vals):
        return True

    def create(self, vals):
        return self

    def ensure_one(self):
        pass

    def message_post(self, **kwargs):
        pass

class TransientModel(Model):
    """Dummy Odoo TransientModel"""
    pass

class AbstractModel(Model):
    """Dummy Odoo AbstractModel"""
    pass
