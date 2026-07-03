// Centralized Data Store for Sudanil Logistics Platform
(function(global) {
  // 1. Initial Core Datasets — Empty (No Demo Data)
  const store = {
    // Profile Data
    profile: {
      name: "",
      name_en: "",
      email: "",
      phone: "",
      role_ar: "",
      role_en: ""
    },

    // Shipments List
    shipments: [],

    // Warehouses Data
    warehouses: [],

    // Inventory Catalog Items
    inventoryCatalog: [],

    // Invoices / Finance Data
    invoices: [],

    // Fleet Data
    fleet: [],

    // Customers Data
    customers: [],

    // Human Resources Data
    hr: [],

    // Notifications Feed
    notifications: [],

    // Activities Feed
    activities: []
  };

  // 2. Centralized APIs and Queries
  const Database = {
    // Getters
    getProfile: () => store.profile,
    getShipments: () => store.shipments,
    getWarehouses: () => store.warehouses,
    getInventoryCatalog: () => store.inventoryCatalog,
    getInvoices: () => store.invoices,
    getFleet: () => store.fleet,
    getCustomers: () => store.customers,
    getHR: () => store.hr,
    getNotifications: () => store.notifications,
    getActivities: () => store.activities,

    // Mutation Methods
    addShipment: (shipment) => {
      store.shipments.unshift(shipment);
      Database.logActivity("المدير التنفيذي", "Executive Director", `أنشأ شحنة جديدة رقم ${shipment.id}`, `created new shipment ID ${shipment.id}`);
      Database.addNotification('shipment', `شحنة جديدة ${shipment.id} مسجلة`, `New shipment ${shipment.id} registered`, `وجهة التسليم: ${shipment.dest_ar}`, `Delivery destination: ${shipment.dest_en}`);
    },

    cancelShipment: (id) => {
      const idx = store.shipments.findIndex(s => s.id === id);
      if (idx !== -1) {
        const ship = store.shipments[idx];
        store.shipments.splice(idx, 1);
        Database.logActivity("المدير التنفيذي", "Executive Director", `قام بإلغاء الشحنة رقم ${id}`, `canceled shipment ID ${id}`);
        Database.addNotification('system', `تم إلغاء الشحنة ${id}`, `Shipment ${id} was canceled`, `تم إزالة الشحنة من قاعدة بيانات الملاحة`, `Removed shipment from active transit database`);
        return true;
      }
      return false;
    },

    addInvoice: (invoice) => {
      store.invoices.unshift(invoice);
      Database.logActivity("المدير التنفيذي", "Executive Director", `أصدر فاتورة جديدة رقم ${invoice.id}`, `issued new invoice ID ${invoice.id}`);
      Database.addNotification('invoice', `تم إصدار الفاتورة ${invoice.id}`, `Invoice ${invoice.id} was issued`, `الفاتورة مستحقة بقيمة $${invoice.amount}`, `Invoice due with value $${invoice.amount}`);
    },

    addVehicle: (vehicle) => {
      store.fleet.unshift(vehicle);
      Database.logActivity("المدير التنفيذي", "Executive Director", `أضاف مركبة جديدة للأسطول رقم ${vehicle.id}`, `added new vehicle to fleet ID ${vehicle.id}`);
      Database.addNotification('fleet', `تم إضافة المركبة ${vehicle.id}`, `Vehicle ${vehicle.id} added`, `تم تعيين السائق ${vehicle.driver_ar}`, `Driver ${vehicle.driver_en} assigned`);
    },

    addCustomer: (customer) => {
      store.customers.unshift(customer);
      Database.logActivity("المدير التنفيذي", "Executive Director", `أضاف العميل الجديد ${customer.name_ar}`, `added new customer ${customer.name_en}`);
      Database.addNotification('system', `تم تسجيل عميل جديد`, `New customer registered`, `العميل: ${customer.name_ar} - شركة ${customer.company_ar}`, `Customer: ${customer.name_en} - ${customer.company_en}`);
    },

    addEmployee: (employee) => {
      store.hr.unshift(employee);
      Database.logActivity("المدير التنفيذي", "Executive Director", `قام بتعيين الموظف الجديد ${employee.name_ar}`, `hired new employee ${employee.name_en}`);
    },

    addWarehouse: (warehouse) => {
      store.warehouses.unshift(warehouse);
      Database.logActivity("المدير التنفيذي", "Executive Director", `أضاف مستودع جديد ${warehouse.name_ar}`, `added new warehouse ${warehouse.name_en}`);
    },

    addInventoryItem: (item) => {
      store.inventoryCatalog.unshift(item);
      Database.logActivity("المدير التنفيذي", "Executive Director", `أضاف منتج مخزون جديد ${item.name_ar}`, `added new inventory item ${item.name_en}`);
    },

    addNotification: (type, title_ar, title_en, desc_ar, desc_en) => {
      const newNotif = {
        id: Date.now(),
        type: type,
        title_ar: title_ar,
        title_en: title_en,
        desc_ar: desc_ar,
        desc_en: desc_en,
        time_ar: 'الآن',
        time_en: 'Just now',
        unread: true
      };
      store.notifications.unshift(newNotif);
      
      // Update Notif badge count in UI
      const badge = document.getElementById('notif-badge');
      if (badge) {
        const unreadCount = store.notifications.filter(n => n.unread).length;
        badge.textContent = unreadCount;
      }
    },

    logActivity: (user_ar, user_en, action_ar, action_en) => {
      store.activities.unshift({
        user_ar: user_ar,
        user_en: user_en,
        action_ar: action_ar,
        action_en: action_en,
        time_ar: 'الآن',
        time_en: 'Just now'
      });
      // Limit size
      if (store.activities.length > 20) store.activities.pop();
    },

    // Bulk load data from external source (e.g. Odoo API)
    loadData: (dataSet) => {
      if (dataSet.profile) Object.assign(store.profile, dataSet.profile);
      if (dataSet.shipments) store.shipments = dataSet.shipments;
      if (dataSet.warehouses) store.warehouses = dataSet.warehouses;
      if (dataSet.inventoryCatalog) store.inventoryCatalog = dataSet.inventoryCatalog;
      if (dataSet.invoices) store.invoices = dataSet.invoices;
      if (dataSet.fleet) store.fleet = dataSet.fleet;
      if (dataSet.customers) store.customers = dataSet.customers;
      if (dataSet.hr) store.hr = dataSet.hr;
      if (dataSet.notifications) store.notifications = dataSet.notifications;
      if (dataSet.activities) store.activities = dataSet.activities;
    }
  };

  // Bind to global window
  global.LogisticsData = Database;
})(window);
