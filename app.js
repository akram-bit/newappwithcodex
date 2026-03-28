const state = {
  lang: localStorage.getItem("lang") || "ar",
  theme: localStorage.getItem("theme") || "light",
  authenticated: false,
  currentView: "account",
  authView: "login",
  pharmacy: {
    name: "",
    owner: "",
    email: "",
    logo: "",
    address: "",
    branches: [
      {
        pharmacyName: "",
        branchName: "",
        address: "",
        city: "",
        email: ""
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
  subscription: { plan: "Starter", price: "$0", features: ["إدارة حساب", "إدارة موظفين", "إدارة فروع"] }
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
    accountManagement: "إدارة الحساب",
    branchesManagement: "إدارة الفروع",
    employeesManagement: "إدارة الموظفين",
    rolesPermissions: "إدارة الصلاحيات",
    planSubscription: "الخطة والاشتراك",
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
    accountManagement: "Account",
    branchesManagement: "Branches",
    employeesManagement: "Employees",
    rolesPermissions: "Roles & Permissions",
    planSubscription: "Plan",
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

function renderDashboardView() {
  const map = {
    account: renderAccountView,
    branches: renderBranchesView,
    employees: renderEmployeesView,
    roles: renderRolesView,
    plan: renderPlanView
  };

  viewTitle.textContent = document.querySelector(`.nav-item[data-view="${state.currentView}"]`)?.textContent || "A.AI";
  document.querySelectorAll(".nav-item[data-view]").forEach((el) => el.classList.toggle("active", el.dataset.view === state.currentView));
  content.innerHTML = map[state.currentView]();
  bindDashboardEvents();
}

function renderAccountView() {
  return `
    <section class="card full">
      <h3>إدارة الحساب</h3>
      <div class="row">
        <div class="form-group"><label>اسم الصيدلية</label><input id="acc-name" value="${state.pharmacy.name}" /></div>
        <div class="form-group"><label>اسم المالك</label><input id="acc-owner" value="${state.pharmacy.owner}" /></div>
        <div class="form-group"><label>البريد</label><input id="acc-email" type="email" value="${state.pharmacy.email}" /></div>
        <div class="form-group"><label>العنوان</label><input id="acc-address" value="${state.pharmacy.address}" /></div>
      </div>
      <button id="save-account" class="primary-btn">حفظ التغييرات</button>
    </section>
  `;
}

function renderBranchesView() {
  const cards = state.pharmacy.branches
    .map(
      (b, i) => `
        <article class="branch-card">
          <h4>${b.branchName || `فرع ${i + 1}`}</h4>
          <p>${b.address || "-"} - ${b.city || "-"}</p>
          <p>${b.email || "-"}</p>
        </article>
      `
    )
    .join("");
  return `
    <section class="card full">
      <h3>إدارة الفروع</h3>
      <div class="row">${cards}</div>
    </section>
  `;
}

function renderEmployeesView() {
  const employeeCards =
    state.employees.length === 0
      ? `<p>لا يوجد موظفون بعد.</p>`
      : state.employees
          .map(
            (e, i) => `
      <article class="employee-card">
        <strong>${e.name}</strong>
        <p>${e.email}</p>
        <div class="badges">
          <span class="badge">${e.role}</span>
          <span class="badge">${e.branch}</span>
          <span class="badge ${e.status === "فعال" ? "active" : e.status === "موقوف" ? "suspended" : "pending"}">${e.status}</span>
        </div>
        <button class="secondary-btn" data-remove-employee="${i}">حذف</button>
      </article>
    `
          )
          .join("");

  const branchOptions = state.pharmacy.branches.map((b) => `<option value="${b.branchName}">${b.branchName || "فرع بدون اسم"}</option>`).join("");

  return `
    <section class="card full">
      <h3>إدارة الموظفين</h3>
      <div class="toolbar full">
        <input id="emp-search" placeholder="بحث بالاسم أو البريد" />
      </div>
      <div class="row" id="employees-list">${employeeCards}</div>
    </section>
    <section class="card full">
      <h3>إضافة موظف</h3>
      <div class="row">
        <div class="form-group"><label>الاسم</label><input id="emp-name" /></div>
        <div class="form-group"><label>البريد</label><input id="emp-email" type="email" /></div>
        <div class="form-group"><label>الدور</label>
          <select id="emp-role">${state.roles.map((r) => `<option>${r}</option>`).join("")}</select>
        </div>
        <div class="form-group"><label>الفرع</label>
          <select id="emp-branch">${branchOptions}</select>
        </div>
        <div class="form-group"><label>الحالة</label>
          <select id="emp-status">
            <option>فعال</option><option>موقوف</option><option>بانتظار التفعيل</option>
          </select>
        </div>
      </div>
      <button id="add-employee" class="primary-btn">إضافة موظف</button>
    </section>
  `;
}

function renderRolesView() {
  const permRows = Object.entries(state.permissions)
    .map(
      ([key, value]) => `
    <label><input type="checkbox" data-perm="${key}" ${value ? "checked" : ""} /> ${key}</label>
  `
    )
    .join("<br>");

  return `
    <section class="card full">
      <h3>الأدوار الجاهزة</h3>
      <div class="badges">${state.roles.map((r) => `<span class="badge">${r}</span>`).join("")}</div>
    </section>
    <section class="card full">
      <h3>الصلاحيات التفصيلية</h3>
      ${permRows}
      <p class="success-text" id="perm-msg"></p>
      <button class="primary-btn" id="save-perms">حفظ الصلاحيات</button>
    </section>
  `;
}

function renderPlanView() {
  return `
    <section class="card full">
      <h3>الخطة والاشتراك</h3>
      <p>الخطة الحالية: <strong>${state.subscription.plan}</strong></p>
      <p>السعر: <strong>${state.subscription.price}</strong></p>
      <ul>
        ${state.subscription.features.map((f) => `<li>${f}</li>`).join("")}
      </ul>
      <button class="primary-btn">ترقية الخطة (واجهة فقط)</button>
    </section>
  `;
}

function bindDashboardEvents() {
  document.getElementById("save-account")?.addEventListener("click", () => {
    state.pharmacy.name = document.getElementById("acc-name").value.trim();
    state.pharmacy.owner = document.getElementById("acc-owner").value.trim();
    state.pharmacy.email = document.getElementById("acc-email").value.trim();
    state.pharmacy.address = document.getElementById("acc-address").value.trim();
    alert("تم حفظ بيانات الحساب.");
  });

  document.getElementById("add-employee")?.addEventListener("click", () => {
    const employee = {
      name: document.getElementById("emp-name").value.trim(),
      email: document.getElementById("emp-email").value.trim(),
      role: document.getElementById("emp-role").value,
      branch: document.getElementById("emp-branch").value,
      status: document.getElementById("emp-status").value
    };

    if (!employee.name || !employee.email) {
      alert("يرجى إدخال اسم الموظف والبريد.");
      return;
    }

    state.employees.push(employee);
    render();
  });

  document.querySelectorAll("[data-remove-employee]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.dataset.removeEmployee);
      state.employees.splice(idx, 1);
      render();
    });
  });

  document.querySelectorAll("[data-perm]").forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      state.permissions[checkbox.dataset.perm] = checkbox.checked;
    });
  });

  document.getElementById("save-perms")?.addEventListener("click", () => {
    document.getElementById("perm-msg").textContent = "تم حفظ الصلاحيات.";
  });

  document.getElementById("emp-search")?.addEventListener("input", (e) => {
    const term = e.target.value.trim().toLowerCase();
    if (!term) {
      render();
      return;
    }
    const filtered = state.employees.filter((emp) => emp.name.toLowerCase().includes(term) || emp.email.toLowerCase().includes(term));
    const html = filtered
      .map(
        (e) => `<article class="employee-card"><strong>${e.name}</strong><p>${e.email}</p><div class="badges"><span class="badge">${e.role}</span><span class="badge">${e.branch}</span><span class="badge">${e.status}</span></div></article>`
      )
      .join("");
    document.getElementById("employees-list").innerHTML = html || "<p>لا نتائج.</p>";
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
