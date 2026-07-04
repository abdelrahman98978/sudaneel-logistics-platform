// Dynamic view sections injection and interactive operations for Sudanil Logistics
(function() {
  function injectNewSections() {
    const target = document.querySelector('#view-settings');
    if (!target) return;
    
    const html = `
    <!-- 6. Finance View -->
    <div id="view-finance" class="view-section transition-all duration-300 hidden">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h2 class="lang-text font-headline-lg text-headline-lg text-primary" data-ar="الإدارة المالية والمحاسبة" data-en="Financial Management">الإدارة المالية والمحاسبة</h2>
          <p class="lang-text font-body-md text-on-surface-variant font-medium" data-ar="إدارة الفواتير والإيرادات والمصروفات التشغيلية." data-en="Manage invoices, revenue, and operational expenses.">إدارة الفواتير والإيرادات والمصروفات التشغيلية.</p>
        </div>
        <button onclick="openNewInvoiceModal()" class="flex items-center gap-2 px-6 py-3 bg-secondary-container text-on-secondary-container rounded-lg font-bold hover:bg-secondary-fixed transition-all active:scale-95 shadow-sm">
          <span class="material-symbols-outlined">receipt_long</span>
          <span class="lang-text font-label-md" data-ar="إصدار فاتورة جديدة" data-en="Issue New Invoice">إصدار فاتورة جديدة</span>
        </button>
      </div>

      <!-- Finance KPIs Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-8" id="finance-kpi-grid">
        <!-- Will be populated dynamically -->
      </div>

      <!-- Filters & Invoices Table -->
      <section class="bg-surface-container-lowest rounded-xl border border-outline-variant industrial-shadow overflow-hidden">
        <div class="p-6 border-b border-outline-variant flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
          <h3 class="lang-text font-headline-md text-primary" data-ar="سجل الفواتير النشطة" data-en="Active Invoices Registry">سجل الفواتير النشطة</h3>
          <div class="flex flex-col sm:flex-row gap-3">
            <div class="relative">
              <span class="material-symbols-outlined absolute right-3 top-2.5 text-on-surface-variant text-sm">search</span>
              <input id="invoice-search-input" onkeyup="renderInvoices()" class="lang-text pr-10 pl-4 py-2 bg-surface-container border border-outline-variant rounded-lg text-xs w-full sm:w-56 focus:ring-2 focus:ring-secondary placeholder:text-on-surface-variant/70" placeholder="بحث باسم العميل..." data-ar="بحث باسم العميل..." data-en="Search by client..." type="text"/>
            </div>
            <!-- Filter Tabs -->
            <div class="flex bg-surface-container p-1 rounded-lg gap-1 text-xs overflow-x-auto whitespace-nowrap scrollbar-none w-full sm:w-auto">
              <button onclick="setInvoiceFilter('all')" id="inv-filter-all" class="lang-text px-2 md:px-3 py-1.5 rounded bg-secondary-container text-on-secondary-container font-bold transition-all" data-ar="الكل" data-en="All">الكل</button>
              <button onclick="setInvoiceFilter('Paid')" id="inv-filter-paid" class="lang-text px-2 md:px-3 py-1.5 rounded text-on-surface-variant hover:text-primary font-bold transition-all" data-ar="مدفوعة" data-en="Paid">مدفوعة</button>
              <button onclick="setInvoiceFilter('Pending')" id="inv-filter-pending" class="lang-text px-2 md:px-3 py-1.5 rounded text-on-surface-variant hover:text-primary font-bold transition-all" data-ar="معلقة" data-en="Pending">معلقة</button>
              <button onclick="setInvoiceFilter('Overdue')" id="inv-filter-overdue" class="lang-text px-2 md:px-3 py-1.5 rounded text-on-surface-variant hover:text-primary font-bold transition-all" data-ar="متأخرة" data-en="Overdue">متأخرة</button>
            </div>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-right border-collapse">
            <thead>
              <tr class="bg-surface-container-low text-on-surface font-bold font-label-md border-b border-outline">
                <th class="lang-text p-4" data-ar="رقم الفاتورة" data-en="Invoice #">رقم الفاتورة</th>
                <th class="lang-text p-4" data-ar="العميل" data-en="Client">العميل</th>
                <th class="lang-text p-4" data-ar="المبلغ" data-en="Amount">المبلغ</th>
                <th class="lang-text p-4" data-ar="تاريخ الاستحقاق" data-en="Due Date">تاريخ الاستحقاق</th>
                <th class="lang-text p-4" data-ar="الحالة" data-en="Status">الحالة</th>
                <th class="lang-text p-4" data-ar="الإجراءات" data-en="Actions">الإجراءات</th>
              </tr>
            </thead>
            <tbody id="invoices-table-body" class="divide-y divide-outline-variant">
              <!-- Will be populated dynamically -->
            </tbody>
          </table>
        </div>
      </section>
    </div>

    <!-- 7. Fleet View -->
    <div id="view-fleet" class="view-section transition-all duration-300 hidden">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h2 class="lang-text font-headline-lg text-headline-lg text-primary" data-ar="إدارة الأسطول والمركبات" data-en="Fleet & Vehicle Management">إدارة الأسطول والمركبات</h2>
          <p class="lang-text font-body-md text-on-surface-variant font-medium" data-ar="متابعة حالة المركبات والصيانة وكفاءة الأسطول اللوجستي." data-en="Track vehicle status, maintenance, and fleet efficiency.">متابعة حالة المركبات والصيانة وكفاءة الأسطول اللوجستي.</p>
        </div>
        <button onclick="openNewVehicleModal()" class="flex items-center gap-2 px-6 py-3 bg-secondary-container text-on-secondary-container rounded-lg font-bold hover:bg-secondary-fixed transition-all active:scale-95 shadow-sm">
          <span class="material-symbols-outlined">add_circle</span>
          <span class="lang-text font-label-md" data-ar="إضافة مركبة للأسطول" data-en="Add Vehicle">إضافة مركبة للأسطول</span>
        </button>
      </div>

      <!-- Fleet KPIs Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-8" id="fleet-kpi-grid">
        <!-- Will be populated dynamically -->
      </div>

      <!-- Fleet Registry Table -->
      <section class="bg-surface-container-lowest rounded-xl border border-outline-variant industrial-shadow overflow-hidden">
        <div class="p-6 border-b border-outline-variant flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
          <h3 class="lang-text font-headline-md text-primary" data-ar="سجل مركبات الأسطول" data-en="Fleet Vehicles Registry">سجل مركبات الأسطول</h3>
          <div class="flex bg-surface-container p-1 rounded-lg gap-1 text-xs overflow-x-auto whitespace-nowrap scrollbar-none w-full md:w-auto">
            <button onclick="setFleetFilter('all')" id="fleet-filter-all" class="lang-text px-2 md:px-3 py-1.5 rounded bg-secondary-container text-on-secondary-container font-bold transition-all" data-ar="الكل" data-en="All">الكل</button>
            <button onclick="setFleetFilter('Active')" id="fleet-filter-active" class="lang-text px-2 md:px-3 py-1.5 rounded text-on-surface-variant hover:text-primary font-bold transition-all" data-ar="نشط" data-en="Active">نشط</button>
            <button onclick="setFleetFilter('Maintenance')" id="fleet-filter-maintenance" class="lang-text px-2 md:px-3 py-1.5 rounded text-on-surface-variant hover:text-primary font-bold transition-all" data-ar="صيانة" data-en="Maintenance">صيانة</button>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-right border-collapse">
            <thead>
              <tr class="bg-surface-container-low text-on-surface font-bold font-label-md border-b border-outline">
                <th class="lang-text p-4" data-ar="رقم المركبة" data-en="Vehicle ID">رقم المركبة</th>
                <th class="lang-text p-4" data-ar="النوع" data-en="Type">النوع</th>
                <th class="lang-text p-4" data-ar="السائق" data-en="Driver">السائق</th>
                <th class="lang-text p-4" data-ar="آخر موقع موثق" data-en="Last Location">آخر موقع موثق</th>
                <th class="lang-text p-4" data-ar="الحالة" data-en="Status">الحالة</th>
                <th class="lang-text p-4" data-ar="الإجراءات" data-en="Actions">الإجراءات</th>
              </tr>
            </thead>
            <tbody id="fleet-table-body" class="divide-y divide-outline-variant">
              <!-- Will be populated dynamically -->
            </tbody>
          </table>
        </div>
      </section>
    </div>

    <!-- 8. Customers View -->
    <div id="view-customers" class="view-section transition-all duration-300 hidden">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h2 class="lang-text font-headline-lg text-headline-lg text-primary" data-ar="العملاء والشركاء الاستراتيجيين" data-en="Customers & Partners">العملاء والشركاء الاستراتيجيين</h2>
          <p class="lang-text font-body-md text-on-surface-variant font-medium" data-ar="إدارة وتتبع قائمة العملاء، فئات التصنيف ومؤشر رضا العملاء." data-en="Manage customer base, classification tiers, and customer satisfaction index.">إدارة وتتبع قائمة العملاء، فئات التصنيف ومؤشر رضا العملاء.</p>
        </div>
        <button onclick="openNewCustomerModal()" class="flex items-center gap-2 px-6 py-3 bg-secondary-container text-on-secondary-container rounded-lg font-bold hover:bg-secondary-fixed transition-all active:scale-95 shadow-sm">
          <span class="material-symbols-outlined">person_add</span>
          <span class="lang-text font-label-md" data-ar="إضافة شريك جديد" data-en="Add Customer">إضافة شريك جديد</span>
        </button>
      </div>

      <!-- Customers KPIs Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-8" id="customers-kpi-grid">
        <!-- Will be populated dynamically -->
      </div>

      <!-- Customers Registry Table -->
      <section class="bg-surface-container-lowest rounded-xl border border-outline-variant industrial-shadow overflow-hidden">
        <div class="p-6 border-b border-outline-variant">
          <h3 class="lang-text font-headline-md text-primary" data-ar="سجل العملاء والشركاء" data-en="Customer Registry">سجل العملاء والشركاء</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-right border-collapse">
            <thead>
              <tr class="bg-surface-container-low text-on-surface font-bold font-label-md border-b border-outline">
                <th class="lang-text p-4" data-ar="اسم العميل" data-en="Customer">اسم العميل</th>
                <th class="lang-text p-4" data-ar="الشركة" data-en="Company">الشركة</th>
                <th class="lang-text p-4" data-ar="إجمالي الشحنات" data-en="Shipments">إجمالي الشحنات</th>
                <th class="lang-text p-4" data-ar="قيمة التعاقد الكلية" data-en="Total Value">قيمة التعاقد الكلية</th>
                <th class="lang-text p-4" data-ar="التصنيف" data-en="Tier">التصنيف</th>
                <th class="lang-text p-4" data-ar="الإجراءات" data-en="Actions">الإجراءات</th>
              </tr>
            </thead>
            <tbody id="customers-table-body" class="divide-y divide-outline-variant">
              <!-- Will be populated dynamically -->
            </tbody>
          </table>
        </div>
      </section>
    </div>

    <!-- 9. HR View -->
    <div id="view-hr" class="view-section transition-all duration-300 hidden">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h2 class="lang-text font-headline-lg text-headline-lg text-primary" data-ar="الموارد البشرية والكادر التشغيلي" data-en="Human Resources">الموارد البشرية والكادر التشغيلي</h2>
          <p class="lang-text font-body-md text-on-surface-variant font-medium" data-ar="إدارة شؤون الموظفين، نسب الحضور اليومي وطلبات الإجازات." data-en="Manage employee directory, daily attendance, and leave requests.">إدارة شؤون الموظفين، نسب الحضور اليومي وطلبات الإجازات.</p>
        </div>
        <button onclick="openNewEmployeeModal()" class="flex items-center gap-2 px-6 py-3 bg-secondary-container text-on-secondary-container rounded-lg font-bold hover:bg-secondary-fixed transition-all active:scale-95 shadow-sm">
          <span class="material-symbols-outlined">person_add</span>
          <span class="lang-text font-label-md" data-ar="إضافة موظف جديد" data-en="Add Employee">إضافة موظف جديد</span>
        </button>
      </div>

      <!-- HR KPIs Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-8" id="hr-kpi-grid">
        <!-- Will be populated dynamically -->
      </div>

      <div class="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        <!-- Employee Registry Table -->
        <div class="md:col-span-8 bg-surface-container-lowest rounded-xl border border-outline-variant industrial-shadow overflow-hidden">
          <div class="p-6 border-b border-outline-variant">
            <h3 class="lang-text font-headline-md text-primary" data-ar="سجل الكادر الوظيفي" data-en="Employee Registry">سجل الكادر الوظيفي</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-right border-collapse">
              <thead>
                <tr class="bg-surface-container-low text-on-surface font-bold font-label-md border-b border-outline">
                  <th class="lang-text p-4" data-ar="الموظف" data-en="Employee">الموظف</th>
                  <th class="lang-text p-4" data-ar="القسم" data-en="Department">القسم</th>
                  <th class="lang-text p-4" data-ar="المنصب" data-en="Position">المنصب</th>
                  <th class="lang-text p-4" data-ar="معدل الحضور" data-en="Attendance">معدل الحضور</th>
                  <th class="lang-text p-4" data-ar="الحالة" data-en="Status">الحالة</th>
                </tr>
              </thead>
              <tbody id="hr-table-body" class="divide-y divide-outline-variant">
                <!-- Will be populated dynamically -->
              </tbody>
            </table>
          </div>
        </div>

        <!-- Leave Request Form -->
        <div class="md:col-span-4 bg-surface-container-lowest p-6 rounded-xl border border-outline-variant industrial-shadow flex flex-col">
          <h4 class="lang-text font-headline-md text-primary mb-6" data-ar="تقديم طلب إجازة" data-en="Request Leave">تقديم طلب إجازة</h4>
          <form class="space-y-4" onsubmit="submitLeaveRequest(event)">
            <div>
              <label class="lang-text block text-xs font-bold text-on-surface-variant mb-2" data-ar="اسم الموظف" data-en="Employee Name">اسم الموظف</label>
              <select id="leave-employee" class="w-full px-4 py-2.5 bg-surface-container border border-outline-variant rounded-lg text-sm text-primary focus:ring-2 focus:ring-secondary focus:outline-none">
                <option class="lang-text" data-ar="عادل محمد" data-en="Adel Mohammed">عادل محمد</option>
                <option class="lang-text" data-ar="فاطمة علي" data-en="Fatima Ali">فاطمة علي</option>
                <option class="lang-text" data-ar="يوسف حسين" data-en="Yousef Hussein">يوسف حسين</option>
              </select>
            </div>
            <div>
              <label class="lang-text block text-xs font-bold text-on-surface-variant mb-2" data-ar="نوع الإجازة" data-en="Leave Type">نوع الإجازة</label>
              <select id="leave-type" class="w-full px-4 py-2.5 bg-surface-container border border-outline-variant rounded-lg text-sm text-primary focus:ring-2 focus:ring-secondary focus:outline-none">
                <option class="lang-text" data-ar="إجازة سنوية" data-en="Annual Leave">إجازة سنوية</option>
                <option class="lang-text" data-ar="إجازة مرضية" data-en="Sick Leave">إجازة مرضية</option>
                <option class="lang-text" data-ar="إجازة طارئة" data-en="Emergency Leave">إجازة طارئة</option>
              </select>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="lang-text block text-xs font-bold text-on-surface-variant mb-2" data-ar="من تاريخ" data-en="From Date">من تاريخ</label>
                <input required id="leave-from" type="date" class="w-full px-4 py-2 bg-surface-container border border-outline-variant rounded-lg text-xs text-primary focus:ring-2 focus:ring-secondary focus:outline-none"/>
              </div>
              <div>
                <label class="lang-text block text-xs font-bold text-on-surface-variant mb-2" data-ar="إلى تاريخ" data-en="To Date">إلى تاريخ</label>
                <input required id="leave-to" type="date" class="w-full px-4 py-2 bg-surface-container border border-outline-variant rounded-lg text-xs text-primary focus:ring-2 focus:ring-secondary focus:outline-none"/>
              </div>
            </div>
            <button type="submit" class="lang-text w-full py-2.5 bg-secondary-container text-on-secondary-container rounded-lg font-bold hover:bg-secondary-fixed transition-colors mt-4" data-ar="إرسال طلب الإجازة" data-en="Submit Request">إرسال طلب الإجازة</button>
          </form>
        </div>
      </div>
    </div>

    <!-- Modals Section for Dynamic Inputs -->
    <!-- Invoice Modal -->
    <div id="new-invoice-modal" class="fixed inset-0 bg-primary-container/60 backdrop-blur-md z-50 flex justify-center items-center opacity-0 pointer-events-none transition-opacity duration-300">
      <div class="bg-surface-container-lowest rounded-xl border border-outline-variant w-[450px] max-w-[90%] overflow-hidden industrial-shadow transform translate-y-8 transition-transform duration-300">
        <div class="p-6 border-b border-outline-variant flex justify-between items-center">
          <h4 class="lang-text font-bold text-lg text-primary flex items-center gap-2" data-ar="إصدار فاتورة جديدة" data-en="Issue New Invoice">إصدار فاتورة جديدة</h4>
          <button onclick="closeNewInvoiceModal()" class="text-on-surface-variant hover:text-primary transition-colors">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        <form class="p-6 space-y-4" onsubmit="submitNewInvoice(event)">
          <div>
            <label class="lang-text block text-xs font-bold text-on-surface-variant mb-1" data-ar="العميل" data-en="Client">العميل</label>
            <input id="inv-form-client" required class="w-full px-4 py-2 bg-surface-container border border-outline-variant rounded-lg text-sm text-primary focus:ring-2 focus:ring-secondary" placeholder="اسم الشركة أو العميل"/>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="lang-text block text-xs font-bold text-on-surface-variant mb-1" data-ar="المبلغ ($)" data-en="Amount ($)">المبلغ ($)</label>
              <input id="inv-form-amount" type="number" required class="w-full px-4 py-2 bg-surface-container border border-outline-variant rounded-lg text-sm text-primary focus:ring-2 focus:ring-secondary" placeholder="1000"/>
            </div>
            <div>
              <label class="lang-text block text-xs font-bold text-on-surface-variant mb-1" data-ar="تاريخ الاستحقاق" data-en="Due Date">تاريخ الاستحقاق</label>
              <input id="inv-form-date" type="date" required class="w-full px-4 py-2 bg-surface-container border border-outline-variant rounded-lg text-sm text-primary focus:ring-2 focus:ring-secondary"/>
            </div>
          </div>
          <div class="flex gap-3 justify-end pt-4 border-t border-outline-variant">
            <button type="button" onclick="closeNewInvoiceModal()" class="lang-text px-5 py-2 border border-outline-variant text-on-surface-variant rounded-lg text-sm font-semibold hover:bg-surface-container-low" data-ar="إلغاء" data-en="Cancel">إلغاء</button>
            <button type="submit" class="lang-text px-6 py-2 bg-secondary-container text-on-secondary-container rounded-lg text-sm font-bold hover:bg-secondary-fixed" data-ar="إصدار الفاتورة" data-en="Issue">إصدار الفاتورة</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Vehicle Modal -->
    <div id="new-vehicle-modal" class="fixed inset-0 bg-primary-container/60 backdrop-blur-md z-50 flex justify-center items-center opacity-0 pointer-events-none transition-opacity duration-300">
      <div class="bg-surface-container-lowest rounded-xl border border-outline-variant w-[450px] max-w-[90%] overflow-hidden industrial-shadow transform translate-y-8 transition-transform duration-300">
        <div class="p-6 border-b border-outline-variant flex justify-between items-center">
          <h4 class="lang-text font-bold text-lg text-primary flex items-center gap-2" data-ar="إضافة مركبة للأسطول" data-en="Add Vehicle to Fleet">إضافة مركبة للأسطول</h4>
          <button onclick="closeNewVehicleModal()" class="text-on-surface-variant hover:text-primary transition-colors">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        <form class="p-6 space-y-4" onsubmit="submitNewVehicle(event)">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="lang-text block text-xs font-bold text-on-surface-variant mb-1" data-ar="رقم اللوحة / الرمز" data-en="Vehicle ID">رقم اللوحة / الرمز</label>
              <input id="veh-form-id" required class="w-full px-4 py-2 bg-surface-container border border-outline-variant rounded-lg text-sm text-primary focus:ring-2 focus:ring-secondary" placeholder="TRK-050"/>
            </div>
            <div>
              <label class="lang-text block text-xs font-bold text-on-surface-variant mb-1" data-ar="نوع المركبة" data-en="Vehicle Type">نوع المركبة</label>
              <input id="veh-form-type" required class="w-full px-4 py-2 bg-surface-container border border-outline-variant rounded-lg text-sm text-primary focus:ring-2 focus:ring-secondary" placeholder="شاحنة مبردة"/>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="lang-text block text-xs font-bold text-on-surface-variant mb-1" data-ar="السائق المعين" data-en="Driver Name">السائق المعين</label>
              <input id="veh-form-driver" required class="w-full px-4 py-2 bg-surface-container border border-outline-variant rounded-lg text-sm text-primary focus:ring-2 focus:ring-secondary" placeholder="أحمد علي"/>
            </div>
            <div>
              <label class="lang-text block text-xs font-bold text-on-surface-variant mb-1" data-ar="موقع العمل الحالي" data-en="Operational Location">موقع العمل الحالي</label>
              <input id="veh-form-loc" required class="w-full px-4 py-2 bg-surface-container border border-outline-variant rounded-lg text-sm text-primary focus:ring-2 focus:ring-secondary" placeholder="بورتسودان"/>
            </div>
          </div>
          <div class="flex gap-3 justify-end pt-4 border-t border-outline-variant">
            <button type="button" onclick="closeNewVehicleModal()" class="lang-text px-5 py-2 border border-outline-variant text-on-surface-variant rounded-lg text-sm font-semibold hover:bg-surface-container-low" data-ar="إلغاء" data-en="Cancel">إلغاء</button>
            <button type="submit" class="lang-text px-6 py-2 bg-secondary-container text-on-secondary-container rounded-lg text-sm font-bold hover:bg-secondary-fixed" data-ar="إضافة المركبة" data-en="Add">إضافة المركبة</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Customer Modal -->
    <div id="new-customer-modal" class="fixed inset-0 bg-primary-container/60 backdrop-blur-md z-50 flex justify-center items-center opacity-0 pointer-events-none transition-opacity duration-300">
      <div class="bg-surface-container-lowest rounded-xl border border-outline-variant w-[450px] max-w-[90%] overflow-hidden industrial-shadow transform translate-y-8 transition-transform duration-300">
        <div class="p-6 border-b border-outline-variant flex justify-between items-center">
          <h4 class="lang-text font-bold text-lg text-primary flex items-center gap-2" data-ar="إضافة عميل أو شريك جديد" data-en="Add New Customer">إضافة عميل أو شريك جديد</h4>
          <button onclick="closeNewCustomerModal()" class="text-on-surface-variant hover:text-primary transition-colors">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        <form class="p-6 space-y-4" onsubmit="submitNewCustomer(event)">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="lang-text block text-xs font-bold text-on-surface-variant mb-1" data-ar="اسم العميل" data-en="Customer Name">اسم العميل</label>
              <input id="cust-form-name" required class="w-full px-4 py-2 bg-surface-container border border-outline-variant rounded-lg text-sm text-primary focus:ring-2 focus:ring-secondary" placeholder="خالد حسن"/>
            </div>
            <div>
              <label class="lang-text block text-xs font-bold text-on-surface-variant mb-1" data-ar="اسم المؤسسة / الشركة" data-en="Organization">اسم المؤسسة / الشركة</label>
              <input id="cust-form-company" required class="w-full px-4 py-2 bg-surface-container border border-outline-variant rounded-lg text-sm text-primary focus:ring-2 focus:ring-secondary" placeholder="مجموعة النيل للتجارة"/>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="lang-text block text-xs font-bold text-on-surface-variant mb-1" data-ar="التصنيف" data-en="Tier">التصنيف</label>
              <select id="cust-form-tier" class="w-full px-4 py-2.5 bg-surface-container border border-outline-variant rounded-lg text-sm text-primary focus:ring-2 focus:ring-secondary">
                <option value="VIP">VIP</option>
                <option value="Standard">Standard / عادي</option>
              </select>
            </div>
            <div>
              <label class="lang-text block text-xs font-bold text-on-surface-variant mb-1" data-ar="البريد الإلكتروني" data-en="Email Address">البريد الإلكتروني</label>
              <input id="cust-form-email" type="email" required class="w-full px-4 py-2 bg-surface-container border border-outline-variant rounded-lg text-sm text-primary focus:ring-2 focus:ring-secondary" placeholder="customer@mail.com"/>
            </div>
          </div>
          <div class="flex gap-3 justify-end pt-4 border-t border-outline-variant">
            <button type="button" onclick="closeNewCustomerModal()" class="lang-text px-5 py-2 border border-outline-variant text-on-surface-variant rounded-lg text-sm font-semibold hover:bg-surface-container-low" data-ar="إلغاء" data-en="Cancel">إلغاء</button>
            <button type="submit" class="lang-text px-6 py-2 bg-secondary-container text-on-secondary-container rounded-lg text-sm font-bold hover:bg-secondary-fixed" data-ar="تسجيل العميل" data-en="Register">تسجيل العميل</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Employee Modal -->
    <div id="new-employee-modal" class="fixed inset-0 bg-primary-container/60 backdrop-blur-md z-50 flex justify-center items-center opacity-0 pointer-events-none transition-opacity duration-300">
      <div class="bg-surface-container-lowest rounded-xl border border-outline-variant w-[450px] max-w-[90%] overflow-hidden industrial-shadow transform translate-y-8 transition-transform duration-300">
        <div class="p-6 border-b border-outline-variant flex justify-between items-center">
          <h4 class="lang-text font-bold text-lg text-primary flex items-center gap-2" data-ar="تعيين موظف جديد" data-en="Hire New Employee">تعيين موظف جديد</h4>
          <button onclick="closeNewEmployeeModal()" class="text-on-surface-variant hover:text-primary transition-colors">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        <form class="p-6 space-y-4" onsubmit="submitNewEmployee(event)">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="lang-text block text-xs font-bold text-on-surface-variant mb-1" data-ar="الاسم الكامل" data-en="Full Name">الاسم الكامل</label>
              <input id="emp-form-name" required class="w-full px-4 py-2 bg-surface-container border border-outline-variant rounded-lg text-sm text-primary focus:ring-2 focus:ring-secondary" placeholder="أحمد عمر"/>
            </div>
            <div>
              <label class="lang-text block text-xs font-bold text-on-surface-variant mb-1" data-ar="المنصب الوظيفي" data-en="Job Title">المنصب الوظيفي</label>
              <input id="emp-form-pos" required class="w-full px-4 py-2 bg-surface-container border border-outline-variant rounded-lg text-sm text-primary focus:ring-2 focus:ring-secondary" placeholder="منسق حركة أسطول"/>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="lang-text block text-xs font-bold text-on-surface-variant mb-1" data-ar="القسم" data-en="Department">القسم</label>
              <input id="emp-form-dept" required class="w-full px-4 py-2 bg-surface-container border border-outline-variant rounded-lg text-sm text-primary focus:ring-2 focus:ring-secondary" placeholder="العمليات اللوجستية"/>
            </div>
            <div>
              <label class="lang-text block text-xs font-bold text-on-surface-variant mb-1" data-ar="تاريخ التعيين" data-en="Hiring Date">تاريخ التعيين</label>
              <input id="emp-form-date" type="date" required class="w-full px-4 py-2 bg-surface-container border border-outline-variant rounded-lg text-sm text-primary focus:ring-2 focus:ring-secondary"/>
            </div>
          </div>
          <div class="flex gap-3 justify-end pt-4 border-t border-outline-variant">
            <button type="button" onclick="closeNewEmployeeModal()" class="lang-text px-5 py-2 border border-outline-variant text-on-surface-variant rounded-lg text-sm font-semibold hover:bg-surface-container-low" data-ar="إلغاء" data-en="Cancel">إلغاء</button>
            <button type="submit" class="lang-text px-6 py-2 bg-secondary-container text-on-secondary-container rounded-lg text-sm font-bold hover:bg-secondary-fixed" data-ar="إتمام التعيين" data-en="Complete Hired">إتمام التعيين</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Details View Modals (Read-Only Detail Popups) -->
    <!-- Vehicle Detail Modal -->
    <div id="vehicle-detail-modal" class="fixed inset-0 bg-primary-container/60 backdrop-blur-md z-50 flex justify-center items-center opacity-0 pointer-events-none transition-opacity duration-300">
      <div class="bg-surface-container-lowest rounded-xl border border-outline-variant w-[450px] max-w-[90%] overflow-hidden industrial-shadow transform translate-y-8 transition-transform duration-300">
        <div class="p-6 border-b border-outline-variant flex justify-between items-center bg-slate-900/30">
          <div class="flex flex-col">
            <h4 class="lang-text font-bold text-lg text-primary" data-ar="تفاصيل المركبة السيادية" data-en="Sovereign Vehicle Details">تفاصيل المركبة السيادية</h4>
            <span id="detail-veh-id" class="text-secondary font-mono text-xs font-bold">---</span>
          </div>
          <button onclick="closeVehicleDetailModal()" class="text-on-surface-variant hover:text-primary transition-colors">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        <div class="p-6 space-y-4">
          <div class="grid grid-cols-2 gap-4 text-xs">
            <div class="p-3 bg-surface-container/30 rounded border border-outline-variant/40">
              <span class="lang-text text-on-surface-variant font-bold block mb-1" data-ar="النوع" data-en="Type">النوع</span>
              <span id="detail-veh-type" class="text-primary font-black">---</span>
            </div>
            <div class="p-3 bg-surface-container/30 rounded border border-outline-variant/40">
              <span class="lang-text text-on-surface-variant font-bold block mb-1" data-ar="السائق" data-en="Driver">السائق</span>
              <span id="detail-veh-driver" class="text-primary font-black">---</span>
            </div>
            <div class="p-3 bg-surface-container/30 rounded border border-outline-variant/40">
              <span class="lang-text text-on-surface-variant font-bold block mb-1" data-ar="الموقع الموثق" data-en="Verified Location">الموقع الموثق</span>
              <span id="detail-veh-loc" class="text-primary font-black">---</span>
            </div>
            <div class="p-3 bg-surface-container/30 rounded border border-outline-variant/40">
              <span class="lang-text text-on-surface-variant font-bold block mb-1" data-ar="كفاءة الوقود" data-en="Fuel Efficiency">كفاءة الوقود</span>
              <span id="detail-veh-fuel" class="text-primary font-black">---</span>
            </div>
            <div class="p-3 bg-surface-container/30 rounded border border-outline-variant/40">
              <span class="lang-text text-on-surface-variant font-bold block mb-1" data-ar="سعة خزان الوقود" data-en="Fuel Capacity">سعة خزان الوقود</span>
              <span id="detail-veh-capacity" class="text-primary font-black">---</span>
            </div>
            <div class="p-3 bg-surface-container/30 rounded border border-outline-variant/40">
              <span class="lang-text text-on-surface-variant font-bold block mb-1" data-ar="تاريخ الصيانة الأخيرة" data-en="Last Service Date">تاريخ الصيانة الأخيرة</span>
              <span id="detail-veh-service" class="text-primary font-black">---</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Customer Detail Modal -->
    <div id="customer-detail-modal" class="fixed inset-0 bg-primary-container/60 backdrop-blur-md z-50 flex justify-center items-center opacity-0 pointer-events-none transition-opacity duration-300">
      <div class="bg-surface-container-lowest rounded-xl border border-outline-variant w-[450px] max-w-[90%] overflow-hidden industrial-shadow transform translate-y-8 transition-transform duration-300">
        <div class="p-6 border-b border-outline-variant flex justify-between items-center bg-slate-900/30">
          <div class="flex flex-col">
            <h4 class="lang-text font-bold text-lg text-primary" data-ar="بطاقة الشريك المعتمدة" data-en="Certified Partner Card">بطاقة الشريك المعتمدة</h4>
            <span id="detail-cust-name" class="text-secondary font-bold text-xs">---</span>
          </div>
          <button onclick="closeCustomerDetailModal()" class="text-on-surface-variant hover:text-primary transition-colors">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        <div class="p-6 space-y-4">
          <div class="grid grid-cols-2 gap-4 text-xs">
            <div class="p-3 bg-surface-container/30 rounded border border-outline-variant/40">
              <span class="lang-text text-on-surface-variant font-bold block mb-1" data-ar="المؤسسة / الشركة" data-en="Company">المؤسسة / الشركة</span>
              <span id="detail-cust-company" class="text-primary font-black">---</span>
            </div>
            <div class="p-3 bg-surface-container/30 rounded border border-outline-variant/40">
              <span class="lang-text text-on-surface-variant font-bold block mb-1" data-ar="البريد الإلكتروني" data-en="Email">البريد الإلكتروني</span>
              <span id="detail-cust-email" class="text-primary font-black font-mono">---</span>
            </div>
            <div class="p-3 bg-surface-container/30 rounded border border-outline-variant/40">
              <span class="lang-text text-on-surface-variant font-bold block mb-1" data-ar="عدد الشحنات الكلي" data-en="Total Shipments">عدد الشحنات الكلي</span>
              <span id="detail-cust-ships" class="text-primary font-black">---</span>
            </div>
            <div class="p-3 bg-surface-container/30 rounded border border-outline-variant/40">
              <span class="lang-text text-on-surface-variant font-bold block mb-1" data-ar="إجمالي المدفوعات" data-en="Total Payments">إجمالي المدفوعات</span>
              <span id="detail-cust-payments" class="text-primary font-black">---</span>
            </div>
            <div class="p-3 bg-surface-container/30 rounded border border-outline-variant/40">
              <span class="lang-text text-on-surface-variant font-bold block mb-1" data-ar="التصنيف اللوجستي" data-en="Logistics Tier">التصنيف اللوجستي</span>
              <span id="detail-cust-tier" class="text-primary font-black">---</span>
            </div>
            <div class="p-3 bg-surface-container/30 rounded border border-outline-variant/40">
              <span class="lang-text text-on-surface-variant font-bold block mb-1" data-ar="مؤشر رضا العميل" data-en="Satisfaction Score">مؤشر رضا العميل</span>
              <span id="detail-cust-satisfaction" class="text-primary font-black">---</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    `;
    
    target.insertAdjacentHTML('afterend', html);
    
    // Bind global controllers
    bindGlobalControllers();
    
    // Initial Render
    renderInvoices();
    renderFleetRegistry();
    renderCustomerRegistry();
    renderEmployeeRegistry();
  }

  // Bind all functions to window for onclick handlers
  function bindGlobalControllers() {
    let invoiceFilter = 'all';
    let fleetFilter = 'all';

    window.setInvoiceFilter = function(filter) {
      invoiceFilter = filter;
      const filters = ['all', 'paid', 'pending', 'overdue'];
      filters.forEach(f => {
        const btn = document.getElementById(`inv-filter-${f}`);
        if (btn) {
          if (f === filter.toLowerCase()) {
            btn.classList.add('bg-secondary-container', 'text-on-secondary-container');
            btn.classList.remove('text-on-surface-variant');
          } else {
            btn.classList.remove('bg-secondary-container', 'text-on-secondary-container');
            btn.classList.add('text-on-surface-variant');
          }
        }
      });
      renderInvoices();
    };

    window.setFleetFilter = function(filter) {
      fleetFilter = filter;
      const filters = ['all', 'active', 'maintenance'];
      filters.forEach(f => {
        const btn = document.getElementById(`fleet-filter-${f}`);
        if (btn) {
          if (f === filter.toLowerCase()) {
            btn.classList.add('bg-secondary-container', 'text-on-secondary-container');
            btn.classList.remove('text-on-surface-variant');
          } else {
            btn.classList.remove('bg-secondary-container', 'text-on-secondary-container');
            btn.classList.add('text-on-surface-variant');
          }
        }
      });
      renderFleetRegistry();
    };

    window.renderInvoices = function() {
      if (!window.LogisticsData) return;
      const invoices = window.LogisticsData.getInvoices();
      const tbody = document.getElementById('invoices-table-body');
      const lang = document.documentElement.getAttribute('lang') || 'ar';
      const searchVal = document.getElementById('invoice-search-input').value.toLowerCase();

      if (!tbody) return;
      tbody.innerHTML = '';

      // Populate KPIs
      const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.status_ar === 'مدفوعة' ? inv.amount : 0), 0);
      const operatingExpenses = 85600; // Mock static
      const netProfit = totalRevenue - operatingExpenses;

      const kpiGrid = document.getElementById('finance-kpi-grid');
      if (kpiGrid) {
        kpiGrid.innerHTML = `
          <div class="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant industrial-shadow"><h3 class="lang-text font-label-md text-on-surface-variant" data-ar="إجمالي الإيرادات المجمعة" data-en="Total Revenues">إجمالي الإيرادات المجمعة</h3><p class="font-headline-xl text-headline-xl text-primary mt-1">$${totalRevenue.toLocaleString()}</p></div>
          <div class="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant industrial-shadow"><h3 class="lang-text font-label-md text-on-surface-variant" data-ar="المصروفات التشغيلية" data-en="Operating Expenses">المصروفات التشغيلية</h3><p class="font-headline-xl text-headline-xl text-primary mt-1">$${operatingExpenses.toLocaleString()}</p></div>
          <div class="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant industrial-shadow"><h3 class="lang-text font-label-md text-on-surface-variant" data-ar="صافي الأرباح المحصلة" data-en="Net Profit">صافي الأرباح المحصلة</h3><p class="font-headline-xl text-headline-xl ${netProfit >= 0 ? 'text-green-500' : 'text-red-500'} mt-1">$${netProfit.toLocaleString()}</p></div>
        `;
      }

      // Filter logic
      const filtered = invoices.filter(inv => {
        const client = (lang === 'ar' ? inv.client_ar : inv.client_en).toLowerCase();
        const matchesSearch = client.includes(searchVal) || inv.id.toLowerCase().includes(searchVal);
        const matchesFilter = (invoiceFilter === 'all') || (inv.status_en === invoiceFilter);
        return matchesSearch && matchesFilter;
      });

      filtered.forEach(inv => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-surface-container-low transition-colors text-on-surface';
        tr.innerHTML = `
          <td class="p-4 font-bold text-primary font-mono">${inv.id}</td>
          <td class="p-4 font-medium">${lang === 'ar' ? inv.client_ar : inv.client_en}</td>
          <td class="p-4 font-bold">$${inv.amount.toLocaleString()}</td>
          <td class="p-4">${inv.date}</td>
          <td class="p-4"><span class="px-3 py-1 text-xs rounded-full font-bold border ${inv.class}">${lang === 'ar' ? inv.status_ar : inv.status_en}</span></td>
          <td class="p-4">
            <button onclick="triggerToastAlert('تم تحميل الفاتورة ${inv.id}','Downloaded invoice ${inv.id}')" class="text-secondary hover:text-primary transition-colors p-1"><span class="material-symbols-outlined text-sm">download</span></button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    };

    window.renderFleetRegistry = function() {
      if (!window.LogisticsData) return;
      const fleet = window.LogisticsData.getFleet();
      const tbody = document.getElementById('fleet-table-body');
      const lang = document.documentElement.getAttribute('lang') || 'ar';
      if (!tbody) return;
      tbody.innerHTML = '';

      // Populate KPIs
      const activeVehicles = fleet.filter(v => v.status_en === 'Active').length;
      const underMaintenance = fleet.filter(v => v.status_en === 'Maintenance').length;
      const efficiency = 8.2;

      const kpiGrid = document.getElementById('fleet-kpi-grid');
      if (kpiGrid) {
        kpiGrid.innerHTML = `
          <div class="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant industrial-shadow"><h3 class="lang-text font-label-md text-on-surface-variant" data-ar="المركبات النشطة بالخدمة" data-en="Active Vehicles">المركبات النشطة بالخدمة</h3><p class="font-headline-xl text-headline-xl text-primary mt-1">${activeVehicles}</p></div>
          <div class="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant industrial-shadow"><h3 class="lang-text font-label-md text-on-surface-variant" data-ar="قيد الصيانة حالياً" data-en="Under Maintenance">قيد الصيانة حالياً</h3><p class="font-headline-xl text-headline-xl text-primary mt-1">${underMaintenance}</p></div>
          <div class="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant industrial-shadow"><h3 class="lang-text font-label-md text-on-surface-variant" data-ar="معدل كفاءة الوقود" data-en="Fuel Efficiency">معدل كفاءة الوقود</h3><p class="font-headline-xl text-headline-xl text-primary mt-1">${efficiency} <span class="lang-text text-xl font-normal" data-ar="كم/لتر" data-en="km/L">كم/لتر</span></p></div>
        `;
      }

      const filtered = fleet.filter(v => {
        return (fleetFilter === 'all') || (v.status_en === fleetFilter);
      });

      filtered.forEach(v => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-surface-container-low transition-colors text-on-surface';
        tr.innerHTML = `
          <td class="p-4 font-bold text-primary font-mono">${v.id}</td>
          <td class="p-4 font-medium">${lang === 'ar' ? v.type_ar : v.type_en}</td>
          <td class="p-4 font-medium">${lang === 'ar' ? v.driver_ar : v.driver_en}</td>
          <td class="p-4">${lang === 'ar' ? v.loc_ar : v.loc_en}</td>
          <td class="p-4"><span class="px-3 py-1 text-xs rounded-full font-bold ${v.class}">${lang === 'ar' ? v.status_ar : v.status_en}</span></td>
          <td class="p-4">
            <button onclick="openVehicleDetailModal('${v.id}')" class="text-secondary hover:text-primary transition-colors p-1" title="تفاصيل المركبة"><span class="material-symbols-outlined text-sm">visibility</span></button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    };

    window.renderCustomerRegistry = function() {
      if (!window.LogisticsData) return;
      const customers = window.LogisticsData.getCustomers();
      const tbody = document.getElementById('customers-table-body');
      const lang = document.documentElement.getAttribute('lang') || 'ar';
      if (!tbody) return;
      tbody.innerHTML = '';

      // Populate KPIs
      const activeCount = customers.length;
      const totalPartners = 34; // Static
      const satisfaction = 96.4;

      const kpiGrid = document.getElementById('customers-kpi-grid');
      if (kpiGrid) {
        kpiGrid.innerHTML = `
          <div class="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant industrial-shadow"><h3 class="lang-text font-label-md text-on-surface-variant" data-ar="العملاء النشطون بالقائمة" data-en="Active Customers">العملاء النشطون بالقائمة</h3><p class="font-headline-xl text-headline-xl text-primary mt-1">${activeCount}</p></div>
          <div class="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant industrial-shadow"><h3 class="lang-text font-label-md text-on-surface-variant" data-ar="شركاء الشحن والملاحة" data-en="Shipping Partners">شركاء الشحن والملاحة</h3><p class="font-headline-xl text-headline-xl text-primary mt-1">${totalPartners}</p></div>
          <div class="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant industrial-shadow"><h3 class="lang-text font-label-md text-on-surface-variant" data-ar="مؤشر رضا العملاء الكلي" data-en="Customer Satisfaction">مؤشر رضا العملاء الكلي</h3><p class="font-headline-xl text-headline-xl text-primary mt-1">${satisfaction}%</p></div>
        `;
      }

      customers.forEach(c => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-surface-container-low transition-colors text-on-surface';
        tr.innerHTML = `
          <td class="p-4 font-bold text-primary">${lang === 'ar' ? c.name_ar : c.name_en}</td>
          <td class="p-4 font-medium">${lang === 'ar' ? c.company_ar : c.company_en}</td>
          <td class="p-4 font-bold">${c.shipments}</td>
          <td class="p-4 font-bold">$${c.total_payments.toLocaleString()}</td>
          <td class="p-4"><span class="px-3 py-1 bg-secondary-container text-on-secondary-container text-xs rounded-full font-bold border border-secondary/20">${c.tier}</span></td>
          <td class="p-4">
            <button onclick="openCustomerDetailModal('${c.name_ar}')" class="text-secondary hover:text-primary transition-colors p-1" title="عرض التفاصيل"><span class="material-symbols-outlined text-sm">visibility</span></button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    };

    window.renderEmployeeRegistry = function() {
      if (!window.LogisticsData) return;
      const hrList = window.LogisticsData.getHR();
      const tbody = document.getElementById('hr-table-body');
      const lang = document.documentElement.getAttribute('lang') || 'ar';
      if (!tbody) return;
      tbody.innerHTML = '';

      // Populate KPIs
      const empCount = hrList.length;
      const dailyAttendance = 92;
      const pendingLeaves = 8;

      const kpiGrid = document.getElementById('hr-kpi-grid');
      if (kpiGrid) {
        kpiGrid.innerHTML = `
          <div class="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant industrial-shadow"><h3 class="lang-text font-label-md text-on-surface-variant" data-ar="إجمالي الموظفين المسجلين" data-en="Total Employees">إجمالي الموظفين المسجلين</h3><p class="font-headline-xl text-headline-xl text-primary mt-1">${empCount}</p></div>
          <div class="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant industrial-shadow"><h3 class="lang-text font-label-md text-on-surface-variant" data-ar="معدل الحضور اليومي" data-en="Daily Attendance">معدل الحضور اليومي</h3><p class="font-headline-xl text-headline-xl text-primary mt-1">${dailyAttendance}%</p></div>
          <div class="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant industrial-shadow"><h3 class="lang-text font-label-md text-on-surface-variant" data-ar="طلبات الإجازات المعلقة" data-en="Pending Leaves">طلبات الإجازات المعلقة</h3><p class="font-headline-xl text-headline-xl text-primary mt-1">${pendingLeaves}</p></div>
        `;
      }

      hrList.forEach(e => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-surface-container-low transition-colors text-on-surface';
        tr.innerHTML = `
          <td class="p-4 font-bold text-primary">${lang === 'ar' ? e.name_ar : e.name_en}</td>
          <td class="p-4 font-medium">${lang === 'ar' ? e.dept_ar : e.dept_en}</td>
          <td class="p-4 font-medium">${lang === 'ar' ? e.pos_ar : e.pos_en}</td>
          <td class="p-4 font-bold text-secondary">${e.attendance}%</td>
          <td class="p-4"><span class="px-3 py-1 text-xs rounded-full font-bold ${e.badge_class}">${lang === 'ar' ? e.status_ar : e.status_en}</span></td>
        `;
        tbody.appendChild(tr);
      });
    };

    // Modal Control Handlers
    window.openNewInvoiceModal = () => toggleModal('new-invoice-modal', true);
    window.closeNewInvoiceModal = () => toggleModal('new-invoice-modal', false);
    
    window.openNewVehicleModal = () => toggleModal('new-vehicle-modal', true);
    window.closeNewVehicleModal = () => toggleModal('new-vehicle-modal', false);

    window.openNewCustomerModal = () => toggleModal('new-customer-modal', true);
    window.closeNewCustomerModal = () => toggleModal('new-customer-modal', false);

    window.openNewEmployeeModal = () => toggleModal('new-employee-modal', true);
    window.closeNewEmployeeModal = () => toggleModal('new-employee-modal', false);

    window.openVehicleDetailModal = (id) => {
      const v = window.LogisticsData.getFleet().find(veh => veh.id === id);
      if (!v) return;
      const lang = document.documentElement.getAttribute('lang') || 'ar';
      document.getElementById('detail-veh-id').textContent = v.id;
      document.getElementById('detail-veh-type').textContent = lang === 'ar' ? v.type_ar : v.type_en;
      document.getElementById('detail-veh-driver').textContent = lang === 'ar' ? v.driver_ar : v.driver_en;
      document.getElementById('detail-veh-loc').textContent = lang === 'ar' ? v.loc_ar : v.loc_en;
      document.getElementById('detail-veh-fuel').textContent = `${v.fuel} كم/لتر`;
      document.getElementById('detail-veh-capacity').textContent = `${v.fuel_capacity} لتر`;
      document.getElementById('detail-veh-service').textContent = v.last_service;
      toggleModal('vehicle-detail-modal', true);
    };
    window.closeVehicleDetailModal = () => toggleModal('vehicle-detail-modal', false);

    window.openCustomerDetailModal = (name_ar) => {
      const c = window.LogisticsData.getCustomers().find(cust => cust.name_ar === name_ar);
      if (!c) return;
      const lang = document.documentElement.getAttribute('lang') || 'ar';
      document.getElementById('detail-cust-name').textContent = lang === 'ar' ? c.name_ar : c.name_en;
      document.getElementById('detail-cust-company').textContent = lang === 'ar' ? c.company_ar : c.company_en;
      document.getElementById('detail-cust-email').textContent = c.email;
      document.getElementById('detail-cust-ships').textContent = c.shipments;
      document.getElementById('detail-cust-payments').textContent = `$${c.total_payments.toLocaleString()}`;
      document.getElementById('detail-cust-tier').textContent = c.tier;
      document.getElementById('detail-cust-satisfaction').textContent = `${c.satisfaction}%`;
      toggleModal('customer-detail-modal', true);
    };
    window.closeCustomerDetailModal = () => toggleModal('customer-detail-modal', false);

    // Form Submission Actions
    window.submitNewInvoice = (e) => {
      e.preventDefault();
      const client = document.getElementById('inv-form-client').value;
      const amount = parseFloat(document.getElementById('inv-form-amount').value);
      const date = document.getElementById('inv-form-date').value;

      const newInv = {
        id: `#INV-${Math.floor(Math.random() * 9000) + 1000}`,
        client_ar: client,
        client_en: client,
        amount: amount,
        date: date,
        status_ar: 'معلقة',
        status_en: 'Pending',
        class: 'bg-amber-100 text-amber-900 border-amber-200'
      };

      window.LogisticsData.addInvoice(newInv);
      renderInvoices();
      e.target.reset();
      toggleModal('new-invoice-modal', false);
      triggerToastAlert('تم إصدار الفاتورة المحددة بنجاح!', 'Invoice issued successfully!');
    };

    window.submitNewVehicle = (e) => {
      e.preventDefault();
      const id = document.getElementById('veh-form-id').value;
      const type = document.getElementById('veh-form-type').value;
      const driver = document.getElementById('veh-form-driver').value;
      const loc = document.getElementById('veh-form-loc').value;

      const newVeh = {
        id: id,
        type_ar: type,
        type_en: type,
        driver_ar: driver,
        driver_en: driver,
        loc_ar: loc,
        loc_en: loc,
        status_ar: 'نشط',
        status_en: 'Active',
        fuel: 8.5,
        fuel_capacity: 400,
        last_service: new Date().toISOString().split('T')[0],
        class: 'bg-green-100 text-green-900'
      };

      window.LogisticsData.addVehicle(newVeh);
      renderFleetRegistry();
      e.target.reset();
      toggleModal('new-vehicle-modal', false);
      triggerToastAlert('تم إضافة الشاحنة للأسطول الملاحي!', 'Vehicle added to active fleet successfully!');
    };

    window.submitNewCustomer = (e) => {
      e.preventDefault();
      const name = document.getElementById('cust-form-name').value;
      const company = document.getElementById('cust-form-company').value;
      const tier = document.getElementById('cust-form-tier').value;
      const email = document.getElementById('cust-form-email').value;

      const newCust = {
        name_ar: name,
        name_en: name,
        company_ar: company,
        company_en: company,
        shipments: 1,
        total_payments: 2500,
        tier: tier,
        rating: 'Standard',
        status_ar: 'نشط',
        status_en: 'Active',
        satisfaction: 100,
        email: email
      };

      window.LogisticsData.addCustomer(newCust);
      renderCustomerRegistry();
      e.target.reset();
      toggleModal('new-customer-modal', false);
      triggerToastAlert('تم تسجيل الشريك والعميل الجديد بنجاح!', 'Customer registered successfully!');
    };

    window.submitNewEmployee = (e) => {
      e.preventDefault();
      const name = document.getElementById('emp-form-name').value;
      const pos = document.getElementById('emp-form-pos').value;
      const dept = document.getElementById('emp-form-dept').value;
      const date = document.getElementById('emp-form-date').value;

      const newEmp = {
        name_ar: name,
        name_en: name,
        dept_ar: dept,
        dept_en: dept,
        pos_ar: pos,
        pos_en: pos,
        date: date,
        status_ar: 'نشط',
        status_en: 'Active',
        badge_class: 'bg-green-100 text-green-900',
        attendance: 100
      };

      window.LogisticsData.addEmployee(newEmp);
      renderEmployeeRegistry();
      e.target.reset();
      toggleModal('new-employee-modal', false);
      triggerToastAlert('تم إتمام تعيين الموظف بنجاح!', 'Employee hired successfully!');
    };

    window.submitLeaveRequest = (e) => {
      e.preventDefault();
      const emp = document.getElementById('leave-employee').value;
      const type = document.getElementById('leave-type').value;
      const from = document.getElementById('leave-from').value;
      const to = document.getElementById('leave-to').value;

      triggerToastAlert(
        `تم تقديم طلب الإجازة لـ (${emp}) بنجاح للمراجعة!`,
        `Leave request submitted for (${emp}) successfully!`
      );
      e.target.reset();
    };
  }

  function toggleModal(id, open) {
    const modal = document.getElementById(id);
    if (!modal) return;
    if (open) {
      modal.classList.remove('pointer-events-none');
      modal.classList.add('opacity-100');
      modal.firstElementChild.style.transform = 'translateY(0)';
    } else {
      modal.classList.add('pointer-events-none');
      modal.classList.remove('opacity-100');
      modal.firstElementChild.style.transform = 'translateY(32px)';
    }
  }

  // Trigger injection
  document.addEventListener('DOMContentLoaded', injectNewSections);
})();
