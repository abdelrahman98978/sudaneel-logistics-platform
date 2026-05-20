# -*- coding: utf-8 -*-
# Odoo API Decorators Dummy Stub to resolve local IDE/Linter import warnings

def model(method):
    """Dummy odoo api.model decorator"""
    return method

def depends(*args):
    """Dummy odoo api.depends decorator"""
    def decorator(method):
        return method
    return decorator

def constrains(*args):
    """Dummy odoo api.constrains decorator"""
    def decorator(method):
        return method
    return decorator

def onchange(*args):
    """Dummy odoo api.onchange decorator"""
    def decorator(method):
        return method
    return decorator
