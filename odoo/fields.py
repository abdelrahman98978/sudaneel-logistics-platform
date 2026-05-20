# -*- coding: utf-8 -*-
# Odoo Fields Dummy Stub to resolve local IDE/Linter import warnings

class Field(object):
    """Base dummy Odoo field class"""
    def __init__(self, string=None, **kwargs):
        self.string = string

class Char(Field): pass
class Integer(Field): pass
class Float(Field): pass
class Boolean(Field): pass
class Selection(Field): pass
class Many2one(Field): pass
class One2many(Field): pass
class Many2many(Field): pass
class Date(Field): pass
class Datetime(Field): pass
class Monetary(Field): pass
