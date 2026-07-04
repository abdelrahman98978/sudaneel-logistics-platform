// Dynamic system view sections (Reports, Notifications, Profile, Support) for Sudanil Logistics
(function() {
  function injectSystemSections() {
    const hr = document.querySelector('#view-hr');
    if (!hr) return;
    
    const h = `
    <!-- 10. Reports View -->
    <div id="view-reports" class="view-section transition-all duration-300 hidden">
      <div class="mb-10">
        <h2 class="lang-text font-headline-lg text-headline-lg text-primary" data-ar="التقارير والمستندات التحليلية" data-en="Reports & Analytics">التقارير والمستندات التحليلية</h2>
        <p class="lang-text font-body-md text-on-surface-variant font-medium" data-ar="توليد تقارير شاملة ومعاينتها وتصديرها بصيغ PDF أو Excel." data-en="Generate comprehensive reports, preview them, and export to PDF or Excel.">توليد تقارير شاملة ومعاينتها وتصديرها بصيغ PDF أو Excel.</p>
      </div>

      <!-- Date Filters & Generation Controls -->
      <div class="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant industrial-shadow mb-8 flex flex-col md:flex-row justify-between items-end gap-4">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full md:w-auto">
          <div>
            <label class="lang-text block text-xs font-bold text-on-surface-variant mb-2" data-ar="نوع التقرير" data-en="Report Type">نوع التقرير</label>
            <select id="report-form-type" class="w-full px-4 py-2 bg-surface-container border border-outline-variant rounded-lg text-xs text-primary focus:ring-2 focus:ring-secondary">
              <option class="lang-text" data-ar="تقرير حركة الشحنات الكلي" data-en="Total Shipments Report" value="shipments">تقرير حركة الشحنات الكلي</option>
              <option class="lang-text" data-ar="تقرير تقييم جرد المستودعات" data-en="Warehouse Inventory Report" value="inventory">تقرير تقييم جرد المستودعات</option>
              <option class="lang-text" data-ar="التقرير المالي والحسابات" data-en="Financial Ledger Report" value="financial">التقرير المالي والحسابات</option>
            </select>
          </div>
          <div>
            <label class="lang-text block text-xs font-bold text-on-surface-variant mb-2" data-ar="تاريخ البدء" data-en="Start Date">تاريخ البدء</label>
            <input id="report-form-start" type="date" class="w-full px-4 py-1.5 bg-surface-container border border-outline-variant rounded-lg text-xs text-primary focus:ring-2 focus:ring-secondary" value="2026-06-01"/>
          </div>
          <div>
            <label class="lang-text block text-xs font-bold text-on-surface-variant mb-2" data-ar="تاريخ الانتهاء" data-en="End Date">تاريخ الانتهاء</label>
            <input id="report-form-end" type="date" class="w-full px-4 py-1.5 bg-surface-container border border-outline-variant rounded-lg text-xs text-primary focus:ring-2 focus:ring-secondary" value="2026-07-01"/>
          </div>
        </div>
        <div class="flex gap-3 w-full md:w-auto">
          <button onclick="previewGeneratedReport()" class="lang-text flex-grow sm:flex-grow-0 px-6 py-2.5 bg-surface-container border border-outline-variant text-primary rounded-lg text-xs font-bold hover:bg-surface-container-low transition-all active:scale-95" data-ar="معاينة التقرير" data-en="Preview Report">معاينة التقرير</button>
          <button onclick="generateReport('PDF')" class="lang-text flex-grow sm:flex-grow-0 px-6 py-2.5 bg-secondary-container text-on-secondary-container rounded-lg text-xs font-bold hover:bg-secondary-fixed transition-all active:scale-95 flex items-center justify-center gap-1.5" data-ar="<span class='material-symbols-outlined text-sm'>analytics</span> توليد PDF" data-en="<span class='material-symbols-outlined text-sm'>analytics</span> Generate PDF">
            <span class="material-symbols-outlined text-sm">analytics</span>
            <span>توليد PDF</span>
          </button>
        </div>
      </div>

      <!-- Report Preview Area (Hidden by default, shown upon preview) -->
      <div id="report-preview-box" class="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant industrial-shadow mb-8 hidden transition-all">
        <div class="flex justify-between items-center pb-4 border-b border-outline-variant mb-6">
          <div>
            <h4 id="preview-report-title" class="text-lg font-black text-primary">تقرير حركة الشحنات الكلي</h4>
            <p id="preview-report-dates" class="text-xs text-on-surface-variant mt-1 font-mono">2026-06-01 to 2026-07-01</p>
          </div>
          <span class="px-3 py-1 bg-green-100 text-green-900 border border-green-200 text-xs rounded-full font-bold">معاينة مسودة</span>
        </div>
        <div class="space-y-4 text-xs" id="preview-report-content">
          <!-- Populated by preview -->
        </div>
      </div>

      <!-- Reports List Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        <div class="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant industrial-shadow hover:border-secondary transition-all cursor-pointer">
          <span class="material-symbols-outlined text-3xl text-secondary mb-3">local_shipping</span>
          <h4 class="lang-text font-bold text-primary mb-1" data-ar="تقرير الشحنات الربع سنوي" data-en="Quarterly Shipments Report">تقرير الشحنات الربع سنوي</h4>
          <p class="lang-text text-[10px] text-on-surface-variant" data-ar="آخر تحديث: اليوم" data-en="Last update: Today">آخر تحديث: اليوم</p>
          <div class="flex gap-2 mt-4">
            <button onclick="triggerToastAlert('جاري تحميل ملف PDF...','Downloading PDF...')" class="px-3 py-1.5 bg-secondary-container text-on-secondary-container text-xs rounded-lg font-bold">PDF</button>
            <button onclick="triggerToastAlert('جاري تحميل ملف Excel...','Downloading Excel...')" class="px-3 py-1.5 bg-surface-container text-primary text-xs rounded-lg font-bold border border-outline-variant">Excel</button>
          </div>
        </div>
        <div class="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant industrial-shadow hover:border-secondary transition-all cursor-pointer">
          <span class="material-symbols-outlined text-3xl text-secondary mb-3">inventory_2</span>
          <h4 class="lang-text font-bold text-primary mb-1" data-ar="تقرير تقييم المخزونات والمساحات" data-en="Inventory Assessment Report">تقرير تقييم المخزونات والمساحات</h4>
          <p class="lang-text text-[10px] text-on-surface-variant" data-ar="آخر تحديث: أمس" data-en="Last update: Yesterday">آخر تحديث: أمس</p>
          <div class="flex gap-2 mt-4">
            <button onclick="triggerToastAlert('جاري تحميل ملف PDF...','Downloading PDF...')" class="px-3 py-1.5 bg-secondary-container text-on-secondary-container text-xs rounded-lg font-bold">PDF</button>
            <button onclick="triggerToastAlert('جاري تحميل ملف Excel...','Downloading Excel...')" class="px-3 py-1.5 bg-surface-container text-primary text-xs rounded-lg font-bold border border-outline-variant">Excel</button>
          </div>
        </div>
        <div class="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant industrial-shadow hover:border-secondary transition-all cursor-pointer">
          <span class="material-symbols-outlined text-3xl text-secondary mb-3">account_balance</span>
          <h4 class="lang-text font-bold text-primary mb-1" data-ar="التقرير المالي ودفاتر الحسابات" data-en="Financial Ledger Report">التقرير المالي ودفاتر الحسابات</h4>
          <p class="lang-text text-[10px] text-on-surface-variant" data-ar="آخر تحديث: اليوم" data-en="Last update: Today">آخر تحديث: اليوم</p>
          <div class="flex gap-2 mt-4">
            <button onclick="triggerToastAlert('جاري تحميل ملف PDF...','Downloading PDF...')" class="px-3 py-1.5 bg-secondary-container text-on-secondary-container text-xs rounded-lg font-bold">PDF</button>
            <button onclick="triggerToastAlert('جاري تحميل ملف Excel...','Downloading Excel...')" class="px-3 py-1.5 bg-surface-container text-primary text-xs rounded-lg font-bold border border-outline-variant">Excel</button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 11. Notifications View -->
    <div id="view-notifications" class="view-section transition-all duration-300 hidden">
      <div class="flex justify-between items-center mb-10">
        <div>
          <h2 class="lang-text font-headline-lg text-headline-lg text-primary" data-ar="مركز الإشعارات الموحد" data-en="Notifications Center">مركز الإشعارات الموحد</h2>
        </div>
        <button onclick="markAllNotificationsRead()" class="lang-text px-4 py-2 bg-surface-container text-primary rounded-lg text-xs font-bold border border-outline-variant" data-ar="تعليم الكل كمقروء" data-en="Mark all read">تعليم الكل كمقروء</button>
      </div>
      <div class="space-y-3" id="notifications-list-container">
        <!-- Will be populated dynamically -->
      </div>
    </div>
    
    <!-- 12. Profile View -->
    <div id="view-profile" class="view-section transition-all duration-300 hidden">
      <div class="mb-10">
        <h2 class="lang-text font-headline-lg text-headline-lg text-primary" data-ar="الملف الشخصي للمدير" data-en="User Profile">الملف الشخصي للمدير</h2>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        <div class="md:col-span-4 bg-surface-container-lowest p-8 rounded-xl border border-outline-variant industrial-shadow text-center">
          <div class="w-24 h-24 rounded-full border-4 border-secondary mx-auto mb-4 overflow-hidden">
            <img class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBC1dqINOSMk1gUNU0yIVNSrO_mu9Lk4VCAmLB4IG9Hz6HqNoM0afQ6IcIISyoOVK3IEwvDkgBVuT3-b-yFNWp8SISrV5xNDVcLhyYZwYr4bzsjNhn9NKHpKTzSLsnoBwKvh_KPd4lEDWGysJHDAxkWjFc8RFX2QosIDhhAM_kuyYqkPTCDdGDY-l0TGy-RfAhVrO89c6Xr1LySllkaIdytj1wYGE-huYdmaUKgdFcK9d6NGLFUl1AG29l7l5KY6qkZWsbvSWCkGqc"/>
          </div>
          <h3 id="profile-card-name" class="font-bold text-lg text-primary">المدير التنفيذي</h3>
          <p id="profile-card-email" class="text-on-surface-variant text-sm">admin@sudanil.com</p>
          <span id="profile-card-role" class="lang-text inline-block mt-3 px-3 py-1 bg-secondary-container text-on-secondary-container text-xs rounded-full font-bold" data-ar="حساب متكامل معتمد" data-en="Certified Integrated Account">حساب متكامل معتمد</span>
          
          <div class="mt-6 pt-4 border-t border-outline-variant/60 text-right">
            <label class="lang-text block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2" data-ar="تبديل واجهة العرض" data-en="Switch Portal View">تبديل واجهة العرض</label>
            <select id="profile-role-switcher" onchange="switchUserRole(this.value)" class="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded-lg text-xs text-primary focus:outline-none focus:ring-1 focus:ring-secondary">
              <option class="lang-text" data-ar="المدير التنفيذي (كامل المعاينة)" data-en="Executive Director (Full Access)" value="executive">المدير التنفيذي (كامل المعاينة)</option>
              <option class="lang-text" data-ar="بوابة العميل (شركة النيل العالمية)" data-en="Customer Portal (Nile Global Co.)" value="customer">بوابة العميل (شركة النيل العالمية)</option>
            </select>
          </div>
        </div>
        <div class="md:col-span-8 bg-surface-container-lowest p-6 rounded-xl border border-outline-variant industrial-shadow">
          <h4 class="lang-text font-headline-md text-primary mb-6" data-ar="تعديل البيانات الشخصية" data-en="Edit Personal Data">تعديل البيانات الشخصية</h4>
          <form class="space-y-4" onsubmit="saveProfileChanges(event)">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="lang-text block text-xs font-bold text-on-surface-variant mb-2" data-ar="الاسم الكامل" data-en="Full Name">الاسم الكامل</label>
                <input required id="profile-form-name" class="w-full px-4 py-2.5 bg-surface-container border border-outline-variant rounded-lg text-sm text-primary focus:ring-2 focus:ring-secondary focus:outline-none"/>
              </div>
              <div>
                <label class="lang-text block text-xs font-bold text-on-surface-variant mb-2" data-ar="البريد الإلكتروني" data-en="Email">البريد الإلكتروني</label>
                <input required id="profile-form-email" type="email" class="w-full px-4 py-2.5 bg-surface-container border border-outline-variant rounded-lg text-sm text-primary focus:ring-2 focus:ring-secondary focus:outline-none"/>
              </div>
            </div>
            <div>
              <label class="lang-text block text-xs font-bold text-on-surface-variant mb-2" data-ar="الهاتف" data-en="Phone">الهاتف</label>
              <input required id="profile-form-phone" class="w-full px-4 py-2.5 bg-surface-container border border-outline-variant rounded-lg text-sm text-primary focus:ring-2 focus:ring-secondary focus:outline-none"/>
            </div>
            <h4 class="lang-text font-bold text-primary pt-4 border-t border-outline-variant" data-ar="تغيير كلمة المرور" data-en="Change Password">تغيير كلمة المرور</h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="lang-text block text-xs font-bold text-on-surface-variant mb-2" data-ar="الحالية" data-en="Current">الحالية</label>
                <input type="password" class="w-full px-4 py-2.5 bg-surface-container border border-outline-variant rounded-lg text-sm text-primary focus:ring-2 focus:ring-secondary focus:outline-none" placeholder="••••••"/>
              </div>
              <div>
                <label class="lang-text block text-xs font-bold text-on-surface-variant mb-2" data-ar="الجديدة" data-en="New">الجديدة</label>
                <input type="password" class="w-full px-4 py-2.5 bg-surface-container border border-outline-variant rounded-lg text-sm text-primary focus:ring-2 focus:ring-secondary focus:outline-none" placeholder="••••••"/>
              </div>
              <div>
                <label class="lang-text block text-xs font-bold text-on-surface-variant mb-2" data-ar="تأكيد" data-en="Confirm">تأكيد</label>
                <input type="password" class="w-full px-4 py-2.5 bg-surface-container border border-outline-variant rounded-lg text-sm text-primary focus:ring-2 focus:ring-secondary focus:outline-none" placeholder="••••••"/>
              </div>
            </div>
            <div class="flex justify-end pt-4">
              <button type="submit" class="lang-text px-6 py-2.5 bg-primary-container text-white rounded-lg font-bold hover:bg-black transition-colors" data-ar="حفظ التغييرات" data-en="Save Changes">حفظ التغييرات</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    
    <!-- 13. Support View -->
    <div id="view-support" class="view-section transition-all duration-300 hidden">
      <div class="mb-10">
        <h2 class="lang-text font-headline-lg text-headline-lg text-primary" data-ar="الدعم الفني والاتصال" data-en="Technical Support">الدعم الفني والاتصال</h2>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        <div class="md:col-span-8 bg-surface-container-lowest p-6 rounded-xl border border-outline-variant industrial-shadow">
          <h4 class="lang-text font-headline-md text-primary mb-6" data-ar="إنشاء تذكرة دعم" data-en="Create Support Ticket">إنشاء تذكرة دعم</h4>
          <form class="space-y-4" onsubmit="submitSupportTicket(event)">
            <div>
              <label class="lang-text block text-xs font-bold text-on-surface-variant mb-2" data-ar="العنوان" data-en="Subject">العنوان</label>
              <input required id="ticket-subject" class="lang-text w-full px-4 py-2.5 bg-surface-container border border-outline-variant rounded-lg text-sm text-primary focus:ring-2 focus:ring-secondary focus:outline-none" placeholder="وصف المشكلة..." data-ar="وصف المشكلة..." data-en="Describe the issue..."/>
            </div>
            <div>
              <label class="lang-text block text-xs font-bold text-on-surface-variant mb-2" data-ar="التفاصيل" data-en="Details">التفاصيل</label>
              <textarea required id="ticket-details" class="w-full px-4 py-2.5 bg-surface-container border border-outline-variant rounded-lg text-sm text-primary focus:ring-2 focus:ring-secondary focus:outline-none h-28 resize-none" placeholder="..."></textarea>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="lang-text block text-xs font-bold text-on-surface-variant mb-2" data-ar="الأولوية" data-en="Priority">الأولوية</label>
                <select id="ticket-priority" class="w-full px-4 py-2.5 bg-surface-container border border-outline-variant rounded-lg text-sm text-primary focus:ring-2 focus:ring-secondary focus:outline-none">
                  <option class="lang-text" data-ar="عادي" data-en="Normal">عادي</option>
                  <option class="lang-text" data-ar="متوسط" data-en="Medium">متوسط</option>
                  <option class="lang-text" data-ar="عاجل" data-en="Urgent">عاجل</option>
                </select>
              </div>
              <div>
                <label class="lang-text block text-xs font-bold text-on-surface-variant mb-2" data-ar="النوع" data-en="Type">النوع</label>
                <select id="ticket-type" class="w-full px-4 py-2.5 bg-surface-container border border-outline-variant rounded-lg text-sm text-primary focus:ring-2 focus:ring-secondary focus:outline-none">
                  <option class="lang-text" data-ar="تقني" data-en="Technical">تقني</option>
                  <option class="lang-text" data-ar="مالي" data-en="Financial">مالي</option>
                  <option class="lang-text" data-ar="شحن" data-en="Shipping">شحن</option>
                </select>
              </div>
            </div>
            <div class="flex justify-end">
              <button type="submit" class="lang-text px-6 py-2.5 bg-secondary-container text-on-secondary-container rounded-lg font-bold hover:bg-secondary-fixed transition-colors" data-ar="إرسال التذكرة" data-en="Submit Ticket">إرسال التذكرة</button>
            </div>
          </form>
        </div>
        <div class="md:col-span-4 bg-surface-container-lowest p-6 rounded-xl border border-outline-variant industrial-shadow">
          <h4 class="lang-text font-headline-md text-primary mb-6" data-ar="معلومات الاتصال" data-en="Contact Info">معلومات الاتصال</h4>
          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-secondary">mail</span>
              <div>
                <p class="text-xs text-on-surface-variant font-bold">Email</p>
                <p class="text-sm text-primary font-medium">support@sudanil.com</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-secondary">call</span>
              <div>
                <p class="text-xs text-on-surface-variant font-bold">Phone</p>
                <p class="text-sm text-primary font-medium">+249 183 123 456</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-secondary">schedule</span>
              <div>
                <p class="lang-text text-xs text-on-surface-variant font-bold" data-ar="ساعات العمل" data-en="Working Hours">ساعات العمل</p>
                <p class="lang-text text-sm text-primary font-medium" data-ar="الأحد - الخميس: 8ص - 5م" data-en="Sun - Thu: 8AM - 5PM">الأحد - الخميس: 8ص - 5م</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    `;
    
    hr.insertAdjacentHTML('afterend', h);
    
    // Bind global controllers
    bindSystemControllers();
    
    // Initial Render
    renderNotifications();
    renderProfileDetails();
  }

  function bindSystemControllers() {
    window.renderNotifications = function() {
      if (!window.LogisticsData) return;
      const notifs = window.LogisticsData.getNotifications();
      const container = document.getElementById('notifications-list-container');
      const lang = document.documentElement.getAttribute('lang') || 'ar';
      
      if (!container) return;
      container.innerHTML = '';

      notifs.forEach(n => {
        const div = document.createElement('div');
        div.className = `bg-surface-container-lowest p-5 rounded-xl border border-outline-variant industrial-shadow flex items-start gap-4 transition-all duration-300 ${n.unread ? 'border-l-4 border-l-secondary' : ''}`;
        
        let icon = 'info';
        let colorClass = 'text-blue-600 bg-blue-100/50';
        if (n.type === 'shipment') {
          icon = 'local_shipping';
          colorClass = 'text-secondary bg-secondary-fixed';
        } else if (n.type === 'capacity') {
          icon = 'warning';
          colorClass = 'text-red-600 bg-red-100';
        } else if (n.type === 'invoice') {
          icon = 'payments';
          colorClass = 'text-green-600 bg-green-100';
        } else if (n.type === 'fleet') {
          icon = 'build';
          colorClass = 'text-amber-600 bg-amber-100';
        }

        div.innerHTML = `
          <div class="p-2 rounded-lg flex-shrink-0 ${colorClass}">
            <span class="material-symbols-outlined">${icon}</span>
          </div>
          <div class="flex-grow">
            <h4 class="font-bold text-primary text-sm">${lang === 'ar' ? n.title_ar : n.title_en}</h4>
            <p class="text-xs text-on-surface-variant mt-1">${lang === 'ar' ? n.desc_ar : n.desc_en}</p>
            <p class="text-[10px] text-on-surface-variant font-bold mt-2">${lang === 'ar' ? n.time_ar : n.time_en}</p>
          </div>
          ${n.unread ? `<button onclick="markSingleNotifRead(${n.id})" class="text-xs text-secondary hover:underline lang-text" data-ar="مقروء" data-en="Read">مقروء</button>` : ''}
        `;
        container.appendChild(div);
      });
    };

    window.markSingleNotifRead = function(id) {
      if (!window.LogisticsData) return;
      const notifs = window.LogisticsData.getNotifications();
      const n = notifs.find(not => not.id === id);
      if (n) {
        n.unread = false;
        renderNotifications();
        
        // Update badge count
        const unreadCount = notifs.filter(not => not.unread).length;
        const badge = document.getElementById('notif-badge');
        if (badge) badge.textContent = unreadCount;
      }
    };

    window.markAllNotificationsRead = function() {
      if (!window.LogisticsData) return;
      const notifs = window.LogisticsData.getNotifications();
      notifs.forEach(n => n.unread = false);
      renderNotifications();
      
      const badge = document.getElementById('notif-badge');
      if (badge) badge.textContent = '0';
      triggerToastAlert('تم تعليم جميع الإشعارات كمقروءة', 'All notifications marked as read');
    };

    window.renderProfileDetails = function() {
      if (!window.LogisticsData) return;
      const p = window.LogisticsData.getProfile();
      const lang = document.documentElement.getAttribute('lang') || 'ar';
      
      const cardName = document.getElementById('profile-card-name');
      const cardEmail = document.getElementById('profile-card-email');
      const cardRole = document.getElementById('profile-card-role');

      if (cardName) cardName.textContent = lang === 'ar' ? p.name : p.name_en;
      if (cardEmail) cardEmail.textContent = p.email;
      if (cardRole) {
        cardRole.textContent = lang === 'ar' ? p.role_ar : p.role_en;
        cardRole.setAttribute('data-ar', p.role_ar);
        cardRole.setAttribute('data-en', p.role_en);
      }

      // Pre-fill form
      const nameInput = document.getElementById('profile-form-name');
      const emailInput = document.getElementById('profile-form-email');
      const phoneInput = document.getElementById('profile-form-phone');

      if (nameInput) nameInput.value = lang === 'ar' ? p.name : p.name_en;
      if (emailInput) emailInput.value = p.email;
      if (phoneInput) phoneInput.value = p.phone;
    };

    window.saveProfileChanges = function(e) {
      e.preventDefault();
      if (!window.LogisticsData) return;
      const p = window.LogisticsData.getProfile();
      const lang = document.documentElement.getAttribute('lang') || 'ar';

      const name = document.getElementById('profile-form-name').value;
      const email = document.getElementById('profile-form-email').value;
      const phone = document.getElementById('profile-form-phone').value;

      if (lang === 'ar') {
        p.name = name;
      } else {
        p.name_en = name;
      }
      p.email = email;
      p.phone = phone;

      // Log activity
      window.LogisticsData.logActivity("المدير التنفيذي", "Executive Director", "قام بتحديث بياناته الشخصية", "updated his personal profile details");

      renderProfileDetails();
      triggerToastAlert('تم حفظ التغييرات بنجاح!', 'Profile updated successfully!');
    };

    window.submitSupportTicket = function(e) {
      e.preventDefault();
      const subj = document.getElementById('ticket-subject').value;
      const details = document.getElementById('ticket-details').value;
      const priority = document.getElementById('ticket-priority').value;

      // Log activity
      if (window.LogisticsData) {
        window.LogisticsData.logActivity("المدير التنفيذي", "Executive Director", `أنشأ تذكرة دعم: ${subj}`, `created support ticket: ${subj}`);
      }

      e.target.reset();
      triggerToastAlert('تم إرسال تذكرة الدعم بنجاح للفريق المختص!', 'Support ticket submitted successfully!');
    };

    window.previewGeneratedReport = function() {
      const type = document.getElementById('report-form-type').value;
      const start = document.getElementById('report-form-start').value;
      const end = document.getElementById('report-form-end').value;
      const isArabic = document.documentElement.getAttribute('lang') !== 'en';

      const previewBox = document.getElementById('report-preview-box');
      const titleEl = document.getElementById('preview-report-title');
      const dateEl = document.getElementById('preview-report-dates');
      const contentEl = document.getElementById('preview-report-content');

      if (!previewBox || !titleEl || !dateEl || !contentEl) return;

      const titles = {
        shipments: isArabic ? "تقرير حركة الشحنات الموحد" : "Consolidated Shipments Transit Report",
        inventory: isArabic ? "تقرير تقييم المخزونات والسلع النشطة" : "Active Stock & Warehouse Valuation Report",
        financial: isArabic ? "التقرير المالي العام والأستاذ المساعد" : "General Financial Statement Ledger"
      };

      titleEl.textContent = titles[type];
      dateEl.textContent = `${isArabic ? 'الفترة:' : 'Period:'} ${start} ${isArabic ? 'إلى' : 'to'} ${end}`;

      let reportContentHTML = '';
      if (type === 'shipments') {
        const ships = window.LogisticsData ? window.LogisticsData.getShipments() : [];
        reportContentHTML = `
          <p class="font-bold mb-2">${isArabic ? 'ملخص إحصائيات الشحنات:' : 'Shipments Summary Statistics:'}</p>
          <ul class="list-disc pl-5 space-y-1">
            <li>${isArabic ? 'إجمالي الشحنات المسجلة:' : 'Total recorded shipments:'} <strong>${1280 + ships.length}</strong></li>
            <li>${isArabic ? 'قيد التوصيل (ترانزيت):' : 'In Transit:'} <strong>${ships.filter(s => s.status === 'transit').length}</strong></li>
            <li>${isArabic ? 'مخزنة بالمستودعات:' : 'Stored in warehouses:'} <strong>${ships.filter(s => s.status === 'warehouse').length}</strong></li>
            <li>${isArabic ? 'تم تسليمها للعميل:' : 'Delivered to clients:'} <strong>${ships.filter(s => s.status === 'delivered').length}</strong></li>
          </ul>
        `;
      } else if (type === 'inventory') {
        const catalog = window.LogisticsData ? window.LogisticsData.getInventoryCatalog() : [];
        const whs = window.LogisticsData ? window.LogisticsData.getWarehouses() : [];
        reportContentHTML = `
          <p class="font-bold mb-2">${isArabic ? 'إشغال المستودعات والتقييم الجاري:' : 'Warehouse Occupancy & Live Valuation:'}</p>
          <ul class="list-disc pl-5 space-y-1">
            ${whs.map(w => `<li>${isArabic ? w.name_ar : w.name_en}: <strong>${w.occupancy}%</strong> (${w.current}/${w.total} ${isArabic ? 'وحدة' : 'units'})</li>`).join('')}
          </ul>
          <p class="font-bold mt-4 mb-2">${isArabic ? 'جرد السلع الأساسية:' : 'Basic Inventory Stock Taking:'}</p>
          <ul class="list-disc pl-5 space-y-1">
            ${catalog.map(item => `<li>${isArabic ? item.name_ar : item.name_en}: <strong>${item.qty}</strong> (${isArabic ? item.wh_ar : item.wh_en})</li>`).join('')}
          </ul>
        `;
      } else {
        const invoices = window.LogisticsData ? window.LogisticsData.getInvoices() : [];
        const total = invoices.reduce((s, i) => s + i.amount, 0);
        const paid = invoices.reduce((s, i) => s + (i.status_ar === 'مدفوعة' ? i.amount : 0), 0);
        const pending = invoices.reduce((s, i) => s + (i.status_ar === 'معلقة' ? i.amount : 0), 0);
        const overdue = invoices.reduce((s, i) => s + (i.status_ar === 'متأخرة' ? i.amount : 0), 0);
        reportContentHTML = `
          <p class="font-bold mb-2">${isArabic ? 'الملخص المالي العام للفواتير:' : 'General Financial Statement of Invoices:'}</p>
          <ul class="list-disc pl-5 space-y-1">
            <li>${isArabic ? 'إجمالي المبالغ المفوترة:' : 'Total billed amount:'} <strong>$${total.toLocaleString()}</strong></li>
            <li>${isArabic ? 'المحصلة والمدفوعة:' : 'Collected & Paid:'} <strong class="text-green-500">$${paid.toLocaleString()}</strong></li>
            <li>${isArabic ? 'معلقة قيد الانتظار:' : 'Pending payments:'} <strong class="text-amber-500">$${pending.toLocaleString()}</strong></li>
            <li>${isArabic ? 'متأخرة السداد:' : 'Overdue invoices:'} <strong class="text-red-500">$${overdue.toLocaleString()}</strong></li>
          </ul>
        `;
      }

      contentEl.innerHTML = reportContentHTML;
      previewBox.classList.remove('hidden');
      triggerToastAlert(
        isArabic ? 'تم توليد مسودة التقرير بنجاح!' : 'Report draft generated successfully!'
      );
    };

    window.generateReport = function(format) {
      const type = document.getElementById('report-form-type').value;
      const isArabic = document.documentElement.getAttribute('lang') !== 'en';
      
      triggerToastAlert(
        isArabic ? `جاري معالجة وتوليد ملف ${format} للتقرير...` : `Processing and generating ${format} report...`,
        isArabic ? `سيتم تحميل الملف تلقائياً فور اكتماله.` : `The file will download automatically once completed.`
      );
    };

    window.switchUserRole = function(role) {
      const lang = document.documentElement.getAttribute('lang') || 'ar';
      const isArabic = lang === 'ar';
      
      const adminLinks = ['nav-finance', 'nav-fleet', 'nav-customers', 'nav-hr', 'nav-reports'];
      const welcomeHeader = document.querySelector('#view-dashboard h2');
      const profileRoleText = document.getElementById('profile-card-role');
      const profileCardName = document.getElementById('profile-card-name');
      const sidebarName = document.querySelector('aside h2');
      
      if (role === 'customer') {
        // Hide Admin links
        adminLinks.forEach(id => {
          const el = document.getElementById(id);
          if (el) el.classList.add('hidden');
        });
        
        // Change Welcome text
        if (welcomeHeader) {
          welcomeHeader.textContent = isArabic ? "أهلاً بك، شركة النيل العالمية" : "Welcome, Nile Global Company";
          welcomeHeader.setAttribute('data-ar', "أهلاً بك، شركة النيل العالمية");
          welcomeHeader.setAttribute('data-en', "Welcome, Nile Global Company");
        }
        
        // Change Sidebar Name
        if (sidebarName) {
          sidebarName.textContent = isArabic ? "شركة النيل العالمية" : "Nile Global Co.";
          sidebarName.setAttribute('data-ar', "شركة النيل العالمية");
          sidebarName.setAttribute('data-en', "Nile Global Co.");
        }
        
        // Change Profile names
        if (profileCardName) profileCardName.textContent = isArabic ? "شركة النيل العالمية" : "Nile Global Co.";
        if (profileRoleText) {
          profileRoleText.textContent = isArabic ? "بوابة العملاء" : "Customer Portal";
          profileRoleText.setAttribute('data-ar', "بوابة العملاء");
          profileRoleText.setAttribute('data-en', "Customer Portal");
        }
        
        // Switch to dashboard
        if (typeof switchView === 'function') switchView('dashboard');
        
        triggerToastAlert('تم تبديل واجهة العرض إلى بوابة العميل!', 'Portal view switched to Customer Portal!');
      } else {
        // Show Admin links
        adminLinks.forEach(id => {
          const el = document.getElementById(id);
          if (el) el.classList.remove('hidden');
        });
        
        // Restore Welcome text
        if (welcomeHeader) {
          welcomeHeader.textContent = isArabic ? "بوابة المدير التنفيذي الموحدة" : "Executive Director Unified Portal";
          welcomeHeader.setAttribute('data-ar', "بوابة المدير التنفيذي الموحدة");
          welcomeHeader.setAttribute('data-en', "Executive Director Unified Portal");
        }
        
        // Restore Sidebar Name
        if (sidebarName) {
          sidebarName.textContent = isArabic ? "المدير التنفيذي" : "Executive Director";
          sidebarName.setAttribute('data-ar', "المدير التنفيذي");
          sidebarName.setAttribute('data-en', "Executive Director");
        }
        
        // Restore Profile names
        if (profileCardName) profileCardName.textContent = isArabic ? "المدير التنفيذي" : "Executive Director";
        if (profileRoleText) {
          profileRoleText.textContent = isArabic ? "حساب متكامل معتمد" : "Certified Integrated Account";
          profileRoleText.setAttribute('data-ar', "حساب متكامل معتمد");
          profileRoleText.setAttribute('data-en', "Certified Integrated Account");
        }
        
        triggerToastAlert('تمت استعادة واجهة المدير التنفيذي بالكامل!', 'Executive Director interface restored!');
      }
    };
  }

  // Trigger injection
  document.addEventListener('DOMContentLoaded', injectSystemSections);
})();
