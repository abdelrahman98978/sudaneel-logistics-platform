// ============================================================
// Sudanil Logistics Platform — Supabase API Layer
// Production-grade data access layer with real-time support
// ============================================================

(function(global) {
  'use strict';

  // ── Supabase Configuration ──────────────────────────────────
  // IMPORTANT: Replace these with your actual Supabase project credentials
  const SUPABASE_URL = 'https://burseblwjftyktxrmteh.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1cnNlYmx3amZ0eWt0eHJtdGVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMxMDc5MjksImV4cCI6MjA5ODY4MzkyOX0.MDUdE5SORr_2n1HBiwITxKJ2Jitd0Mz6xNOzcA0wVjw';

  let supabaseClient = null;
  let currentUser = null;
  let realtimeSubscriptions = [];

  // ── Initialize Supabase Client ──────────────────────────────
  function initSupabase() {
    if (!global.supabase) {
      console.error('[SudanilAPI] Supabase JS library not loaded. Add the script tag first.');
      return null;
    }
    if (!supabaseClient) {
      supabaseClient = global.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
    return supabaseClient;
  }

  // ── Generic Error Handler ───────────────────────────────────
  function handleError(error, context) {
    console.error(`[SudanilAPI][${context}]`, error);
    if (typeof triggerToastAlert === 'function') {
      const isArabic = document.documentElement.getAttribute('lang') !== 'en';
      triggerToastAlert(
        isArabic ? `حدث خطأ في ${context}` : `Error in ${context}`,
        error.message || 'Unknown error'
      );
    }
    return null;
  }

  // ── Generic CRUD Factory ────────────────────────────────────
  function createCRUD(tableName) {
    return {
      async list(filters = {}, options = {}) {
        const sb = initSupabase();
        if (!sb) return [];

        let query = sb.from(tableName).select(options.select || '*');

        // Apply filters
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            if (typeof value === 'object' && value.op) {
              // Advanced filter: { op: 'gte', value: 10 }
              query = query[value.op](key, value.value);
            } else {
              query = query.eq(key, value);
            }
          }
        });

        // Apply ordering
        if (options.orderBy) {
          query = query.order(options.orderBy, { ascending: options.ascending ?? false });
        } else {
          query = query.order('created_at', { ascending: false });
        }

        // Apply pagination
        if (options.limit) {
          query = query.limit(options.limit);
        }
        if (options.offset) {
          query = query.range(options.offset, options.offset + (options.limit || 20) - 1);
        }

        const { data, error, count } = await query;
        if (error) return handleError(error, `${tableName}.list`) || [];
        return data || [];
      },

      async getById(id) {
        const sb = initSupabase();
        if (!sb) return null;
        const { data, error } = await sb.from(tableName).select('*').eq('id', id).single();
        if (error) return handleError(error, `${tableName}.getById`);
        return data;
      },

      async create(record) {
        const sb = initSupabase();
        if (!sb) return null;
        const { data, error } = await sb.from(tableName).insert(record).select().single();
        if (error) return handleError(error, `${tableName}.create`);
        return data;
      },

      async update(id, changes) {
        const sb = initSupabase();
        if (!sb) return null;
        const { data, error } = await sb.from(tableName).update(changes).eq('id', id).select().single();
        if (error) return handleError(error, `${tableName}.update`);
        return data;
      },

      async delete(id) {
        const sb = initSupabase();
        if (!sb) return false;
        const { error } = await sb.from(tableName).delete().eq('id', id);
        if (error) { handleError(error, `${tableName}.delete`); return false; }
        return true;
      },

      async count(filters = {}) {
        const sb = initSupabase();
        if (!sb) return 0;
        let query = sb.from(tableName).select('id', { count: 'exact', head: true });
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            query = query.eq(key, value);
          }
        });
        const { count, error } = await query;
        if (error) { handleError(error, `${tableName}.count`); return 0; }
        return count || 0;
      }
    };
  }

  // ── Auth Module ─────────────────────────────────────────────
  const Auth = {
    async login(email, password) {
      const sb = initSupabase();
      if (!sb) return { error: 'Supabase not initialized' };

      const { data, error } = await sb.auth.signInWithPassword({ email, password });
      if (error) return { error: error.message };

      currentUser = data.user;
      localStorage.setItem('sessionToken', data.session.access_token);

      // Fetch profile
      const profile = await API.profiles.getById(data.user.id);
      if (profile) {
        currentUser.profile = profile;
      }

      return { user: currentUser, session: data.session };
    },

    async logout() {
      const sb = initSupabase();
      if (sb) {
        await sb.auth.signOut();
      }
      currentUser = null;
      localStorage.removeItem('sessionToken');
      // Clean up subscriptions
      realtimeSubscriptions.forEach(sub => sub.unsubscribe());
      realtimeSubscriptions = [];
    },

    async getUser() {
      const sb = initSupabase();
      if (!sb) return null;

      if (currentUser && currentUser.profile) return currentUser;

      const { data: { user }, error } = await sb.auth.getUser();
      if (error || !user) return null;

      currentUser = user;
      const profile = await API.profiles.getById(user.id);
      if (profile) {
        currentUser.profile = profile;
      }
      return currentUser;
    },

    async getSession() {
      const sb = initSupabase();
      if (!sb) return null;
      const { data: { session } } = await sb.auth.getSession();
      return session;
    },

    isLoggedIn() {
      return !!localStorage.getItem('sessionToken');
    },

    onAuthStateChange(callback) {
      const sb = initSupabase();
      if (!sb) return;
      sb.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_OUT') {
          currentUser = null;
          localStorage.removeItem('sessionToken');
        }
        callback(event, session);
      });
    }
  };

  // ── Shipments Extended Methods ──────────────────────────────
  const ShipmentsExt = {
    ...createCRUD('shipments'),

    async listWithHistory(filters = {}) {
      const sb = initSupabase();
      if (!sb) return [];
      let query = sb.from('shipments').select('*, shipment_history(*), customers(name_ar, name_en, company_ar, company_en)');
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          query = query.eq(key, value);
        }
      });
      query = query.order('created_at', { ascending: false });
      const { data, error } = await query;
      if (error) return handleError(error, 'shipments.listWithHistory') || [];
      return data || [];
    },

    async addHistoryEntry(shipmentId, entry) {
      const sb = initSupabase();
      if (!sb) return null;
      const { data, error } = await sb.from('shipment_history').insert({
        shipment_id: shipmentId,
        ...entry
      }).select().single();
      if (error) return handleError(error, 'shipmentHistory.create');
      return data;
    },

    async deliveryRate() {
      const sb = initSupabase();
      if (!sb) return 0;
      const total = await this.count({ is_active: true });
      const delivered = await this.count({ status: 'delivered', is_active: true });
      return total > 0 ? Math.round((delivered / total) * 100 * 10) / 10 : 0;
    }
  };

  // ── Invoices Extended Methods ───────────────────────────────
  const InvoicesExt = {
    ...createCRUD('invoices'),

    async monthlyTotal(status) {
      const sb = initSupabase();
      if (!sb) return 0;
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      let query = sb.from('invoices').select('amount');
      query = query.gte('invoice_date', startOfMonth.toISOString().split('T')[0]);
      if (status) query = query.eq('status', status);

      const { data, error } = await query;
      if (error) { handleError(error, 'invoices.monthlyTotal'); return 0; }
      return (data || []).reduce((sum, inv) => sum + (inv.amount || 0), 0);
    },

    async financialSummary() {
      const sb = initSupabase();
      if (!sb) return { total: 0, paid: 0, pending: 0, overdue: 0 };

      const { data, error } = await sb.from('invoices').select('amount, status').eq('is_active', true);
      if (error) { handleError(error, 'invoices.financialSummary'); return { total: 0, paid: 0, pending: 0, overdue: 0 }; }

      const invoices = data || [];
      return {
        total: invoices.reduce((s, i) => s + i.amount, 0),
        paid: invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0),
        pending: invoices.filter(i => i.status === 'pending').reduce((s, i) => s + i.amount, 0),
        overdue: invoices.filter(i => i.status === 'overdue').reduce((s, i) => s + i.amount, 0)
      };
    }
  };

  // ── Warehouses Extended Methods ─────────────────────────────
  const WarehousesExt = {
    ...createCRUD('warehouses'),

    async totalCapacity() {
      const sb = initSupabase();
      if (!sb) return { current: 0, total: 0, pct: 0 };
      const { data, error } = await sb.from('warehouses').select('capacity_total, capacity_current').eq('is_active', true);
      if (error) { handleError(error, 'warehouses.totalCapacity'); return { current: 0, total: 0, pct: 0 }; }
      const whs = data || [];
      const total = whs.reduce((s, w) => s + w.capacity_total, 0);
      const current = whs.reduce((s, w) => s + w.capacity_current, 0);
      return { current, total, pct: total > 0 ? Math.round((current / total) * 100) : 0 };
    }
  };

  // ── Notifications Extended Methods ──────────────────────────
  const NotificationsExt = {
    ...createCRUD('notifications'),

    async listForUser(limit = 20) {
      const user = await Auth.getUser();
      if (!user) return [];
      const sb = initSupabase();
      if (!sb) return [];

      const { data, error } = await sb.from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) return handleError(error, 'notifications.listForUser') || [];
      return data || [];
    },

    async unreadCount() {
      const user = await Auth.getUser();
      if (!user) return 0;
      return this.count({ user_id: user.id, is_read: false });
    },

    async markAsRead(notificationId) {
      return this.update(notificationId, { is_read: true });
    },

    async markAllAsRead() {
      const user = await Auth.getUser();
      if (!user) return;
      const sb = initSupabase();
      if (!sb) return;
      await sb.from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);
    },

    subscribe(callback) {
      const sb = initSupabase();
      if (!sb) return;

      Auth.getUser().then(user => {
        if (!user) return;
        const channel = sb.channel('notifications-realtime')
          .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`
          }, (payload) => {
            callback(payload.new);
          })
          .subscribe();

        realtimeSubscriptions.push(channel);
      });
    }
  };

  // ── Activity Log ────────────────────────────────────────────
  const ActivityLogExt = {
    ...createCRUD('activity_log'),

    async log(action_ar, action_en, entityType, entityId) {
      const user = await Auth.getUser();
      const record = {
        user_id: user ? user.id : null,
        user_name_ar: user && user.profile ? user.profile.full_name : 'النظام',
        user_name_en: user && user.profile ? user.profile.full_name_en : 'System',
        action_ar,
        action_en,
        entity_type: entityType || '',
        entity_id: entityId || ''
      };
      return this.create(record);
    },

    async recent(limit = 10) {
      return this.list({}, { limit, orderBy: 'created_at', ascending: false });
    }
  };

  // ── Dashboard Aggregation ───────────────────────────────────
  const Dashboard = {
    async getKPIs() {
      const [
        activeShipments,
        warehouseCapacity,
        financialSummary,
        deliveryRate,
        activeCustomers,
        totalShipments
      ] = await Promise.all([
        ShipmentsExt.count({ status: 'transit', is_active: true }),
        WarehousesExt.totalCapacity(),
        InvoicesExt.financialSummary(),
        ShipmentsExt.deliveryRate(),
        createCRUD('customers').count({ status: 'active', is_active: true }),
        ShipmentsExt.count({ is_active: true })
      ]);

      return {
        activeShipments,
        totalShipments,
        warehouseCapacity,
        monthlySpend: financialSummary.pending + financialSummary.overdue,
        monthlyRevenue: financialSummary.paid,
        totalRevenue: financialSummary.total,
        deliveryRate,
        activeCustomers,
        paid: financialSummary.paid,
        pending: financialSummary.pending,
        overdue: financialSummary.overdue
      };
    }
  };

  // ── Assemble Public API ─────────────────────────────────────
  const API = {
    init: initSupabase,
    auth: Auth,
    profiles: createCRUD('profiles'),
    shipments: ShipmentsExt,
    warehouses: WarehousesExt,
    inventory: createCRUD('inventory'),
    invoices: InvoicesExt,
    fleet: createCRUD('fleet'),
    customers: createCRUD('customers'),
    employees: createCRUD('employees'),
    notifications: NotificationsExt,
    activityLog: ActivityLogExt,
    dashboard: Dashboard,

    // Utility: Send notification to a user
    async notify(userId, type, title_ar, title_en, desc_ar, desc_en, priority) {
      return NotificationsExt.create({
        user_id: userId,
        type: type || 'system',
        title_ar,
        title_en,
        desc_ar: desc_ar || '',
        desc_en: desc_en || '',
        priority: priority || 'normal'
      });
    }
  };

  // ── Export ───────────────────────────────────────────────────
  global.LogisticsAPI = API;

  // ── Backward Compatibility with LogisticsData ───────────────
  // Provides synchronous-looking wrappers so existing code doesn't break
  // during migration. These use cached data where possible.
  let _cache = {
    shipments: [], warehouses: [], inventory: [], invoices: [],
    fleet: [], customers: [], hr: [], notifications: [], activities: [],
    profile: { name: '', name_en: '', email: '', phone: '', role_ar: '', role_en: '' }
  };

  const LegacyCompat = {
    getProfile: () => _cache.profile,
    getShipments: () => _cache.shipments,
    getWarehouses: () => _cache.warehouses,
    getInventoryCatalog: () => _cache.inventory,
    getInvoices: () => _cache.invoices,
    getFleet: () => _cache.fleet,
    getCustomers: () => _cache.customers,
    getHR: () => _cache.hr,
    getNotifications: () => _cache.notifications,
    getActivities: () => _cache.activities,

    // Legacy mutation methods — fire-and-forget async calls
    addShipment: (s) => { _cache.shipments.unshift(s); API.shipments.create(s); },
    addInvoice: (i) => { _cache.invoices.unshift(i); API.invoices.create(i); },
    addVehicle: (v) => { _cache.fleet.unshift(v); API.fleet.create(v); },
    addCustomer: (c) => { _cache.customers.unshift(c); API.customers.create(c); },
    addEmployee: (e) => { _cache.hr.unshift(e); API.employees.create(e); },
    addWarehouse: (w) => { _cache.warehouses.unshift(w); API.warehouses.create(w); },
    addInventoryItem: (i) => { _cache.inventory.unshift(i); API.inventory.create(i); },
    addNotification: (type, title_ar, title_en, desc_ar, desc_en) => {
      const n = { id: Date.now(), type, title_ar, title_en, desc_ar, desc_en, time_ar: 'الآن', time_en: 'Just now', unread: true };
      _cache.notifications.unshift(n);
      const badge = document.getElementById('notif-badge');
      if (badge) badge.textContent = _cache.notifications.filter(x => x.unread).length;
    },
    logActivity: (user_ar, user_en, action_ar, action_en) => {
      _cache.activities.unshift({ user_ar, user_en, action_ar, action_en, time_ar: 'الآن', time_en: 'Just now' });
      if (_cache.activities.length > 20) _cache.activities.pop();
      API.activityLog.log(action_ar, action_en);
    },
    loadData: (dataSet) => {
      Object.keys(dataSet).forEach(key => {
        if (_cache.hasOwnProperty(key)) _cache[key] = dataSet[key];
      });
    },

    // Refresh cache from Supabase
    async refreshAll() {
      try {
        const [shipments, warehouses, inventory, invoices, fleet, customers, hr, notifications, activities] = await Promise.all([
          API.shipments.list(),
          API.warehouses.list(),
          API.inventory.list(),
          API.invoices.list(),
          API.fleet.list(),
          API.customers.list(),
          API.employees.list(),
          API.notifications.listForUser(),
          API.activityLog.recent(20)
        ]);

        _cache.shipments = (shipments || []).map(s => ({
          ...s,
          id: s.code || s.id,
          dest_ar: s.dest_ar,
          dest_en: s.dest_en,
          cargo_ar: s.cargo_ar,
          cargo_en: s.cargo_en,
          progress: s.progress,
          status: s.status,
          history: s.shipment_history || []
        }));
        _cache.warehouses = (warehouses || []).map(w => ({
          ...w,
          id: w.code || w.id,
          name_ar: w.name_ar,
          name_en: w.name_en,
          occupancy: w.occupancy_pct || Math.round((w.capacity_current / w.capacity_total) * 100),
          current: w.capacity_current,
          total: w.capacity_total,
          status_ar: w.status === 'critical' ? 'سعة حرجة' : 'مستقر',
          status_en: w.status === 'critical' ? 'Critical Capacity' : 'Stable',
          badge_class: w.status === 'critical' ? 'bg-red-100 text-red-950 border-red-200' : 'bg-green-100 text-green-950 border-green-200'
        }));
        _cache.inventory = (inventory || []).map(i => ({
          ...i,
          id: i.code || i.id,
          name_ar: i.name_ar,
          name_en: i.name_en,
          category_ar: i.category_ar,
          category_en: i.category_en,
          qty: i.qty,
          status_ar: i.status === 'low' ? 'مخزون منخفض' : i.status === 'critical' ? 'شبه مكتمل' : 'طبيعي',
          status_en: i.status === 'low' ? 'Low Stock' : i.status === 'critical' ? 'Nearly Full' : 'Normal'
        }));
        _cache.invoices = (invoices || []).map(inv => ({
          ...inv,
          id: inv.code || inv.id,
          client_ar: inv.customers?.name_ar || '',
          client_en: inv.customers?.name_en || '',
          amount: inv.amount,
          date: inv.invoice_date,
          status_ar: inv.status === 'paid' ? 'مدفوعة' : inv.status === 'pending' ? 'معلقة' : 'متأخرة',
          status_en: inv.status === 'paid' ? 'Paid' : inv.status === 'pending' ? 'Pending' : 'Overdue',
          class: inv.status === 'paid' ? 'bg-green-100 text-green-900 border-green-200' :
                 inv.status === 'pending' ? 'bg-amber-100 text-amber-900 border-amber-200' :
                 'bg-red-100 text-red-900 border-red-200'
        }));
        _cache.fleet = fleet || [];
        _cache.customers = (customers || []).map(c => ({
          ...c,
          name_ar: c.name_ar,
          name_en: c.name_en,
          company_ar: c.company_ar,
          company_en: c.company_en,
          shipments: c.total_shipments,
          total_payments: c.total_payments,
          tier: c.tier,
          rating: c.rating,
          satisfaction: c.satisfaction,
          email: c.email
        }));
        _cache.hr = employees || [];
        _cache.notifications = (notifications || []).map(n => ({
          ...n,
          title_ar: n.title_ar,
          title_en: n.title_en,
          desc_ar: n.desc_ar,
          desc_en: n.desc_en,
          time_ar: _relativeTime(n.created_at, 'ar'),
          time_en: _relativeTime(n.created_at, 'en'),
          unread: !n.is_read
        }));
        _cache.activities = (activities || []).map(a => ({
          user_ar: a.user_name_ar,
          user_en: a.user_name_en,
          action_ar: a.action_ar,
          action_en: a.action_en,
          time_ar: _relativeTime(a.created_at, 'ar'),
          time_en: _relativeTime(a.created_at, 'en')
        }));

        // Profile
        const user = await Auth.getUser();
        if (user && user.profile) {
          _cache.profile = {
            name: user.profile.full_name,
            name_en: user.profile.full_name_en || user.profile.full_name,
            email: user.profile.email,
            phone: user.profile.phone || '',
            role_ar: _roleLabel(user.profile.role, 'ar'),
            role_en: _roleLabel(user.profile.role, 'en')
          };
        }

        // Update notification badge
        const badge = document.getElementById('notif-badge');
        if (badge) badge.textContent = _cache.notifications.filter(n => n.unread).length;

      } catch (err) {
        console.error('[SudanilAPI] refreshAll failed:', err);
      }
    }
  };

  // ── Helpers ─────────────────────────────────────────────────
  function _relativeTime(isoStr, lang) {
    if (!isoStr) return lang === 'ar' ? 'الآن' : 'Just now';
    const diff = Date.now() - new Date(isoStr).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (lang === 'ar') {
      if (mins < 1) return 'الآن';
      if (mins < 60) return `منذ ${mins} دقيقة`;
      if (hours < 24) return `منذ ${hours} ساعة`;
      return `منذ ${days} يوم`;
    } else {
      if (mins < 1) return 'Just now';
      if (mins < 60) return `${mins} mins ago`;
      if (hours < 24) return `${hours} hours ago`;
      return `${days} days ago`;
    }
  }

  function _roleLabel(role, lang) {
    const roles = {
      admin: { ar: 'المدير التنفيذي', en: 'Executive Director' },
      manager: { ar: 'مدير العمليات', en: 'Operations Manager' },
      accountant: { ar: 'محاسب', en: 'Accountant' },
      logistics: { ar: 'منسق لوجستي', en: 'Logistics Coordinator' },
      customer: { ar: 'عميل', en: 'Customer' }
    };
    return roles[role] ? roles[role][lang] : role;
  }

  // ── Export Legacy Compatible Layer ──────────────────────────
  global.LogisticsData = LegacyCompat;

})(window);
