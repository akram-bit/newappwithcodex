const state = {
  lang: localStorage.getItem("lang") || "ar",
  theme: localStorage.getItem("theme") || "light",
  authenticated: false,
  currentView: "dashboard",
  authView: "login",
  pharmacy: {
    name: "صيدلية الحياة",
    owner: "د. أحمد خالد",
    email: "contact@alhayat-pharma.com",
    logo: "",
    address: "دمشق - المزة",
    branches: [
      {
        pharmacyName: "صيدلية الحياة",
        branchName: "الفرع الرئيسي",
        address: "دمشق - المزة",
        city: "دمشق",
        email: "main@alhayat-pharma.com"
      }
    ]
  },
  employees: [],
  roles: ["مالك", "مدير فرع", "صيدلي"],
  permissions: {
    "إدارة الحساب": true,
    "إدارة الفروع": true,
    "إدارة الموظفين": true,
    "إدارة الأدوار والصلاحيات": true,
    "عرض فقط": false
  },
  inventorySearch: "",
  invoiceSearch: "",
  invoiceCart: [],
  salesHistory: [
    { id: "INV-1001", date: "2026-03-24", amount: 33.2, items: 3, profit: 9.9 },
    { id: "INV-1002", date: "2026-03-25", amount: 14.5, items: 2, profit: 4.4 },
    { id: "INV-1003", date: "2026-03-26", amount: 56.0, items: 5, profit: 15.8 },
    { id: "INV-1004", date: "2026-03-27", amount: 22.25, items: 2, profit: 6.1 }
  ],
  medicines: [
    { id: 1, name: "باراسيتامول 500", barcode: "625100100001", category: "مسكن", price: 2.75, cost: 1.7, quantity: 42 },
    { id: 2, name: "أموكسيسيلين 500", barcode: "625100100002", category: "مضاد حيوي", price: 5.5, cost: 3.9, quantity: 28 },
    { id: 3, name: "أوميبرازول 20", barcode: "625100100003", category: "معدة", price: 4.1, cost: 2.85, quantity: 35 },
    { id: 4, name: "فيتامين C", barcode: "625100100004", category: "فيتامين", price: 3.2, cost: 2.0, quantity: 60 },
    { id: 5, name: "كونجستال", barcode: "625100100005", category: "رشح", price: 3.8, cost: 2.5, quantity: 24 }
  ]
};

const translations = {
  ar: {
    appTag: "إدارة الصيدليات",
    login: "تسجيل الدخول",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    forgot: "نسيت كلمة المرور؟",
    noAccount: "ليس لديك حساب؟",
    createAccount: "إنشاء حساب",
    haveAccount: "لديك حساب؟",
    dashboard: "الرئيسية",
    inventory: "المستودع",
    invoice: "الفاتورة",
    reports: "التقارير",
    logout: "تسجيل الخروج"
  },
  en: {
    appTag: "Pharmacy Management",
    login: "Login",
    email: "Email",
    password: "Password",
    forgot: "Forgot password?",
    noAccount: "No account?",
    createAccount: "Create account",
    haveAccount: "Already have an account?",
    dashboard: "Dashboard",
    inventory: "Inventory",
    invoice: "Invoice",
    reports: "Reports",
    logout: "Logout"
  }
};

const authShell = document.getElementById("auth-shell");
const dashboardShell = document.getElementById("dashboard-shell");
const content = document.getElementById("content");
const sidebar = document.getElementById("sidebar");
const app = document.getElementById("app");
const themeBtn = document.getElementById("theme-btn");
const langBtn = document.getElementById("lang-btn");
const menuBtn = document.getElementById("menu-btn");
const viewTitle = document.getElementById("view-title");
const sidebarBackdrop = document.getElementById("sidebar-backdrop");

themeBtn.addEventListener("click", () => {
  state.theme = state.theme === "light" ? "dark" : "light";
  localStorage.setItem("theme", state.theme);
  render();
});

langBtn.addEventListener("click", () => {
  state.lang = state.lang === "ar" ? "en" : "ar";
  localStorage.setItem("lang", state.lang);
  render();
});

menuBtn.addEventListener("click", () => {
  sidebar.classList.toggle("closed");
  sidebarBackdrop.classList.toggle("hidden");
});

sidebarBackdrop.addEventListener("click", () => {
  sidebar.classList.add("closed");
  sidebarBackdrop.classList.add("hidden");
});

document.getElementById("logout-btn").addEventListener("click", () => {
  state.authenticated = false;
  state.authView = "login";
  render();
});

sidebar.querySelectorAll(".nav-item[data-view]").forEach((btn) => {
  btn.addEventListener("click", () => {
    state.currentView = btn.dataset.view;
    sidebar.classList.add("closed");
    sidebarBackdrop.classList.add("hidden");
    render();
  });
});

function t(key) {
  return translations[state.lang][key] || key;
}

function setDirection() {
  document.documentElement.lang = state.lang;
  document.documentElement.dir = state.lang === "ar" ? "rtl" : "ltr";
  langBtn.textContent = state.lang.toUpperCase();
}

function currency(value) {
  return new Intl.NumberFormat(state.lang === "ar" ? "ar" : "en", {
    style: "currency",
    currency: "USD"
  }).format(value);
}

function renderAuth() {
  const shared = `
    <div class="auth-card card">
      <h2>${state.authView === "login" ? "تسجيل الدخول" : state.authView === "register" ? "إنشاء حساب" : state.authView === "forgot" ? "نسيت كلمة المرور" : "تأكيد الحساب"}</h2>
      <p>${state.authView === "login" ? "مرحبًا بك في A.AI" : ""}</p>
  `;

  if (state.authView === "login") {
    authShell.innerHTML = `${shared}
      <div class="form-group"><label>${t("email")}</label><input id="login-email" type="email" /></div>
      <div class="form-group"><label>${t("password")}</label><input id="login-pass" type="password" /></div>
      <button class="link-btn" id="goto-forgot">${t("forgot")}</button>
      <button class="primary-btn" id="do-login">${t("login")}</button>
      <p>${t("noAccount")} <button class="link-btn" id="goto-register">${t("createAccount")}</button></p>
    </div>`;
  }

  if (state.authView === "register") {
    const branchFields = state.pharmacy.branches
      .map(
        (b, i) => `
      <div class="branch-card">
        <h4>الفرع ${i + 1}</h4>
        <div class="form-group"><label>اسم الصيدلية التابعة</label><input data-b="${i}" data-k="pharmacyName" value="${b.pharmacyName}" /></div>
        <div class="form-group"><label>اسم الفرع</label><input data-b="${i}" data-k="branchName" value="${b.branchName}" /></div>
        <div class="form-group"><label>عنوان الفرع</label><input data-b="${i}" data-k="address" value="${b.address}" /></div>
        <div class="form-group"><label>المدينة</label><input data-b="${i}" data-k="city" value="${b.city}" /></div>
        <div class="form-group"><label>بريد الفرع</label><input type="email" data-b="${i}" data-k="email" value="${b.email}" /></div>
        ${state.pharmacy.branches.length > 1 ? `<button class="secondary-btn" data-remove-branch="${i}">حذف الفرع</button>` : ""}
      </div>`
      )
      .join("");

    authShell.innerHTML = `${shared}
      <div class="form-group"><label>اسم الصيدلية</label><input id="pharmacy-name" value="${state.pharmacy.name}"/></div>
      <div class="form-group"><label>اسم المالك</label><input id="owner" value="${state.pharmacy.owner}"/></div>
      <div class="form-group"><label>البريد</label><input id="pharmacy-email" type="email" value="${state.pharmacy.email}"/></div>
      <div class="form-group"><label>عنوان الصيدلية</label><input id="pharmacy-address" value="${state.pharmacy.address}"/></div>
      <div class="form-group"><label>رابط الشعار (اختياري)</label><input id="logo" value="${state.pharmacy.logo}"/></div>
      <h3>الفروع</h3>
      ${branchFields}
      <button class="secondary-btn" id="add-branch">إضافة فرع آخر</button>
      <div class="form-group"><label>كلمة المرور</label><input id="register-pass" type="password"/></div>
      <div class="form-group"><label>تأكيد كلمة المرور</label><input id="register-pass2" type="password"/></div>
      <button class="primary-btn" id="do-register">إنشاء الحساب</button>
      <p>${t("haveAccount")} <button class="link-btn" id="goto-login">${t("login")}</button></p>
    </div>`;
  }

  if (state.authView === "forgot") {
    authShell.innerHTML = `${shared}
      <p>أدخل بريدك الإلكتروني لإرسال رابط الاستعادة (واجهة فقط).</p>
      <div class="form-group"><label>${t("email")}</label><input id="forgot-email" type="email" /></div>
      <button class="primary-btn" id="send-reset">إرسال رابط الاستعادة</button>
      <p><button class="link-btn" id="goto-login">${t("login")}</button></p>
      <div id="forgot-msg" class="success-text"></div>
    </div>`;
  }

  if (state.authView === "verify") {
    authShell.innerHTML = `${shared}
      <p>تم إنشاء الحساب. يرجى تأكيد الحساب عبر البريد الإلكتروني (UI فقط).</p>
      <div class="form-group"><label>رمز التأكيد</label><input /></div>
      <button class="primary-btn" id="verify-btn">تأكيد</button>
      <button class="link-btn">إعادة إرسال</button>
    </div>`;
  }

  bindAuthEvents();
}

function bindAuthEvents() {
  document.getElementById("goto-register")?.addEventListener("click", () => {
    state.authView = "register";
    render();
  });
  document.getElementById("goto-login")?.addEventListener("click", () => {
    state.authView = "login";
    render();
  });
  document.getElementById("goto-forgot")?.addEventListener("click", () => {
    state.authView = "forgot";
    render();
  });
  document.getElementById("send-reset")?.addEventListener("click", () => {
    document.getElementById("forgot-msg").textContent = "تم إرسال رابط الاستعادة (محاكاة).";
  });
  document.getElementById("do-login")?.addEventListener("click", () => {
    const email = document.getElementById("login-email").value.trim();
    const pass = document.getElementById("login-pass").value.trim();
    if (!email || !pass) {
      alert("يرجى إدخال البريد وكلمة المرور.");
      return;
    }
    state.authenticated = true;
    render();
  });

  document.getElementById("add-branch")?.addEventListener("click", () => {
    state.pharmacy.branches.push({ pharmacyName: "", branchName: "", address: "", city: "", email: "" });
    render();
  });

  document.querySelectorAll("[data-remove-branch]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.dataset.removeBranch);
      state.pharmacy.branches.splice(idx, 1);
      render();
    });
  });

  document.querySelectorAll("[data-b][data-k]").forEach((input) => {
    input.addEventListener("input", () => {
      const idx = Number(input.dataset.b);
      const key = input.dataset.k;
      state.pharmacy.branches[idx][key] = input.value;
    });
  });

  document.getElementById("do-register")?.addEventListener("click", () => {
    state.pharmacy.name = document.getElementById("pharmacy-name").value.trim();
    state.pharmacy.owner = document.getElementById("owner").value.trim();
    state.pharmacy.email = document.getElementById("pharmacy-email").value.trim();
    state.pharmacy.address = document.getElementById("pharmacy-address").value.trim();
    state.pharmacy.logo = document.getElementById("logo").value.trim();
    const pass1 = document.getElementById("register-pass").value;
    const pass2 = document.getElementById("register-pass2").value;
    if (!state.pharmacy.name || !state.pharmacy.owner || !state.pharmacy.email || !pass1 || !pass2) {
      alert("يرجى تعبئة الحقول المطلوبة.");
      return;
    }
    if (pass1 !== pass2) {
      alert("كلمتا المرور غير متطابقتين.");
      return;
    }
    state.authView = "verify";
    render();
  });

  document.getElementById("verify-btn")?.addEventListener("click", () => {
    state.authenticated = true;
    render();
  });
}

function getLowStockCount() {
  return state.medicines.filter((m) => m.quantity <= 10).length;
}

function getTotalUnits() {
  return state.medicines.reduce((sum, m) => sum + m.quantity, 0);
}

function getInventoryValue() {
  return state.medicines.reduce((sum, m) => sum + m.price * m.quantity, 0);
}

function filterMedicines(term) {
  const q = term.trim().toLowerCase();
  if (!q) return state.medicines;
  return state.medicines.filter((m) => m.name.toLowerCase().includes(q) || m.barcode.includes(q));
}

function renderDashboardView() {
  const map = {
    dashboard: renderHomeView,
    inventory: renderInventoryView,
    invoice: renderInvoiceView,
    reports: renderReportsView
  };

  viewTitle.textContent = document.querySelector(`.nav-item[data-view="${state.currentView}"]`)?.textContent || "A.AI";
  document.querySelectorAll(".nav-item[data-view]").forEach((el) => el.classList.toggle("active", el.dataset.view === state.currentView));
  content.innerHTML = map[state.currentView]();
  bindDashboardEvents();
}

function renderHomeView() {
  const branch = state.pharmacy.branches[0] || {};
  return `
    <section class="card full">
      <h3>${state.pharmacy.name || "اسم الصيدلية"} - ${branch.branchName || "الفرع الرئيسي"}</h3>
      <div class="kv-grid">
        <p><strong>المالك:</strong> ${state.pharmacy.owner || "-"}</p>
        <p><strong>البريد:</strong> ${state.pharmacy.email || "-"}</p>
        <p><strong>العنوان:</strong> ${state.pharmacy.address || "-"}</p>
        <p><strong>عدد الفروع:</strong> ${state.pharmacy.branches.length}</p>
      </div>
    </section>
    <section class="metrics-grid full">
      <article class="metric-card">
        <p>عدد الأصناف</p>
        <strong>${state.medicines.length}</strong>
      </article>
      <article class="metric-card">
        <p>إجمالي الكمية</p>
        <strong>${getTotalUnits()}</strong>
      </article>
      <article class="metric-card">
        <p>أدوية على وشك النفاد</p>
        <strong>${getLowStockCount()}</strong>
      </article>
      <article class="metric-card">
        <p>قيمة المخزون</p>
        <strong>${currency(getInventoryValue())}</strong>
      </article>
    </section>
  `;
}

function renderInventoryView() {
  const filtered = filterMedicines(state.inventorySearch);
  const rows = filtered
    .map(
      (m) => `
      <tr>
        <td>${m.name}</td>
        <td>${m.barcode}</td>
        <td>${m.category}</td>
        <td>${currency(m.price)}</td>
        <td>${m.quantity}</td>
        <td>
          <div class="inline-actions">
            <button class="secondary-btn" data-edit-med="${m.id}">تعديل</button>
            <button class="secondary-btn danger-soft" data-delete-med="${m.id}">حذف</button>
          </div>
        </td>
      </tr>`
    )
    .join("");

  return `
    <section class="card full">
      <h3>مستودع الصيدلية</h3>
      <div class="toolbar full inv-toolbar">
        <input id="inventory-search" value="${state.inventorySearch}" placeholder="بحث باسم الدواء أو الباركود" />
        <button id="scan-inventory" class="secondary-btn">📷 فتح الكاميرا</button>
        <button id="add-medicine" class="primary-btn">+ إضافة دواء</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr><th>الدواء</th><th>الباركود</th><th>الصنف</th><th>السعر</th><th>الكمية</th><th>إجراءات</th></tr>
          </thead>
          <tbody>${rows || `<tr><td colspan="6">لا توجد نتائج.</td></tr>`}</tbody>
        </table>
      </div>
    </section>
  `;
}

function renderInvoiceView() {
  const products = filterMedicines(state.invoiceSearch);
  const productRows = products
    .map(
      (m) => `
      <tr>
        <td>${m.name}</td>
        <td>${m.barcode}</td>
        <td>${m.quantity}</td>
        <td>${currency(m.price)}</td>
        <td><button class="primary-btn" data-add-cart="${m.id}">إضافة</button></td>
      </tr>`
    )
    .join("");

  const cartRows = state.invoiceCart
    .map(
      (item) => `
      <tr>
        <td>${item.name}</td>
        <td>${currency(item.price)}</td>
        <td>
          <div class="qty-wrap">
            <button class="secondary-btn" data-dec-cart="${item.id}">-</button>
            <span>${item.qty}</span>
            <button class="secondary-btn" data-inc-cart="${item.id}">+</button>
          </div>
        </td>
        <td>${currency(item.price * item.qty)}</td>
        <td><button class="secondary-btn danger-soft" data-remove-cart="${item.id}">حذف</button></td>
      </tr>`
    )
    .join("");

  const subtotal = state.invoiceCart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const totalItems = state.invoiceCart.reduce((sum, item) => sum + item.qty, 0);

  return `
    <section class="card full">
      <h3>واجهة الفاتورة</h3>
      <div class="toolbar full inv-toolbar">
        <input id="invoice-search" value="${state.invoiceSearch}" placeholder="بحث في الأدوية بالاسم أو الباركود" />
        <button id="scan-invoice" class="secondary-btn">📷 مسح باركود</button>
        <button id="clear-cart" class="secondary-btn">تفريغ السلة</button>
      </div>
      <div class="split-grid">
        <article class="card nested-card">
          <h4>الأدوية المتوفرة</h4>
          <div class="table-wrap">
            <table>
              <thead><tr><th>الاسم</th><th>الباركود</th><th>المتوفر</th><th>السعر</th><th></th></tr></thead>
              <tbody>${productRows || `<tr><td colspan="5">لا توجد أدوية مطابقة.</td></tr>`}</tbody>
            </table>
          </div>
        </article>
        <article class="card nested-card">
          <h4>سلة الفاتورة</h4>
          <div class="table-wrap">
            <table>
              <thead><tr><th>الصنف</th><th>السعر</th><th>الكمية</th><th>الإجمالي</th><th></th></tr></thead>
              <tbody>${cartRows || `<tr><td colspan="5">السلة فارغة.</td></tr>`}</tbody>
            </table>
          </div>
          <div class="invoice-summary">
            <p><strong>عدد القطع:</strong> ${totalItems}</p>
            <p><strong>الإجمالي:</strong> ${currency(subtotal)}</p>
          </div>
          <button id="checkout" class="primary-btn" ${state.invoiceCart.length === 0 ? "disabled" : ""}>تأكيد الفاتورة</button>
        </article>
      </div>
    </section>
  `;
}

function renderReportsView() {
  const totalSales = state.salesHistory.reduce((sum, inv) => sum + inv.amount, 0);
  const totalProfit = state.salesHistory.reduce((sum, inv) => sum + inv.profit, 0);
  const totalInvoices = state.salesHistory.length;

  const rows = state.salesHistory
    .map(
      (inv) => `
      <tr>
        <td>${inv.id}</td>
        <td>${inv.date}</td>
        <td>${inv.items}</td>
        <td>${currency(inv.amount)}</td>
        <td>${currency(inv.profit)}</td>
      </tr>`
    )
    .join("");

  return `
    <section class="metrics-grid full">
      <article class="metric-card">
        <p>إجمالي المبيعات</p>
        <strong>${currency(totalSales)}</strong>
      </article>
      <article class="metric-card">
        <p>إجمالي الأرباح</p>
        <strong>${currency(totalProfit)}</strong>
      </article>
      <article class="metric-card">
        <p>عدد الفواتير</p>
        <strong>${totalInvoices}</strong>
      </article>
      <article class="metric-card">
        <p>متوسط الفاتورة</p>
        <strong>${currency(totalInvoices ? totalSales / totalInvoices : 0)}</strong>
      </article>
    </section>
    <section class="card full">
      <h3>تفاصيل المبيعات</h3>
      <div class="table-wrap">
        <table>
          <thead><tr><th>رقم الفاتورة</th><th>التاريخ</th><th>القطع</th><th>المبيعات</th><th>الربح</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </section>
  `;
}

function bindDashboardEvents() {
  document.getElementById("inventory-search")?.addEventListener("input", (e) => {
    state.inventorySearch = e.target.value;
    renderDashboardView();
  });

  document.getElementById("invoice-search")?.addEventListener("input", (e) => {
    state.invoiceSearch = e.target.value;
    renderDashboardView();
  });

  document.getElementById("scan-inventory")?.addEventListener("click", () => {
    alert("سيتم ربط الكاميرا في المرحلة القادمة. حالياً هذه واجهة أمامية فقط.");
  });

  document.getElementById("scan-invoice")?.addEventListener("click", () => {
    alert("ميزة المسح بالكاميرا جاهزة تصميمياً وستربط لاحقاً بالـ backend.");
  });

  document.getElementById("add-medicine")?.addEventListener("click", () => {
    const name = prompt("اسم الدواء:");
    if (!name) return;
    const barcode = prompt("الباركود:");
    if (!barcode) return;
    const price = Number(prompt("السعر:") || 0);
    const quantity = Number(prompt("الكمية:") || 0);

    state.medicines.push({
      id: Date.now(),
      name,
      barcode,
      category: "عام",
      price: Number.isFinite(price) ? price : 0,
      cost: Number.isFinite(price) ? price * 0.7 : 0,
      quantity: Number.isFinite(quantity) ? quantity : 0
    });
    render();
  });

  document.querySelectorAll("[data-edit-med]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.editMed);
      const med = state.medicines.find((m) => m.id === id);
      if (!med) return;
      const nextName = prompt("تعديل اسم الدواء:", med.name);
      if (nextName === null) return;
      const nextPrice = Number(prompt("تعديل السعر:", med.price));
      const nextQty = Number(prompt("تعديل الكمية:", med.quantity));
      med.name = nextName.trim() || med.name;
      med.price = Number.isFinite(nextPrice) ? nextPrice : med.price;
      med.quantity = Number.isFinite(nextQty) ? nextQty : med.quantity;
      render();
    });
  });

  document.querySelectorAll("[data-delete-med]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.deleteMed);
      state.medicines = state.medicines.filter((m) => m.id !== id);
      state.invoiceCart = state.invoiceCart.filter((item) => item.id !== id);
      render();
    });
  });

  document.querySelectorAll("[data-add-cart]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.addCart);
      const med = state.medicines.find((m) => m.id === id);
      if (!med || med.quantity <= 0) {
        alert("الدواء غير متوفر حالياً.");
        return;
      }

      const existing = state.invoiceCart.find((item) => item.id === id);
      const currentQty = existing ? existing.qty : 0;
      if (currentQty >= med.quantity) {
        alert("لا يمكن إضافة كمية أكبر من المتوفر في المستودع.");
        return;
      }

      if (existing) {
        existing.qty += 1;
      } else {
        state.invoiceCart.push({ id: med.id, name: med.name, price: med.price, qty: 1 });
      }
      renderDashboardView();
    });
  });

  document.querySelectorAll("[data-inc-cart]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.incCart);
      const cartItem = state.invoiceCart.find((item) => item.id === id);
      const med = state.medicines.find((m) => m.id === id);
      if (!cartItem || !med) return;
      if (cartItem.qty >= med.quantity) return;
      cartItem.qty += 1;
      renderDashboardView();
    });
  });

  document.querySelectorAll("[data-dec-cart]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.decCart);
      const cartItem = state.invoiceCart.find((item) => item.id === id);
      if (!cartItem) return;
      cartItem.qty -= 1;
      if (cartItem.qty <= 0) {
        state.invoiceCart = state.invoiceCart.filter((item) => item.id !== id);
      }
      renderDashboardView();
    });
  });

  document.querySelectorAll("[data-remove-cart]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.removeCart);
      state.invoiceCart = state.invoiceCart.filter((item) => item.id !== id);
      renderDashboardView();
    });
  });

  document.getElementById("clear-cart")?.addEventListener("click", () => {
    state.invoiceCart = [];
    renderDashboardView();
  });

  document.getElementById("checkout")?.addEventListener("click", () => {
    if (state.invoiceCart.length === 0) return;

    let total = 0;
    let profit = 0;
    let items = 0;

    state.invoiceCart.forEach((item) => {
      const med = state.medicines.find((m) => m.id === item.id);
      if (!med) return;
      med.quantity -= item.qty;
      total += item.qty * item.price;
      profit += item.qty * (item.price - med.cost);
      items += item.qty;
    });

    state.salesHistory.unshift({
      id: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().slice(0, 10),
      amount: Number(total.toFixed(2)),
      items,
      profit: Number(profit.toFixed(2))
    });

    state.invoiceCart = [];
    state.currentView = "reports";
    render();
  });
}

function applyI18n() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
}

function render() {
  app.setAttribute("data-theme", state.theme);
  setDirection();
  applyI18n();

  if (!state.authenticated) {
    authShell.classList.remove("hidden");
    dashboardShell.classList.add("hidden");
    sidebarBackdrop.classList.add("hidden");
    sidebar.classList.add("closed");
    renderAuth();
    return;
  }

  authShell.classList.add("hidden");
  dashboardShell.classList.remove("hidden");
  renderDashboardView();
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js");
}

render();
