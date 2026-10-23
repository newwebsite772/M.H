import {
  Activity,
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpLeft,
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  CircleDollarSign,
  ClipboardCheck,
  ClipboardList,
  Clock3,
  Download,
  FileCheck2,
  FileText,
  Filter,
  LayoutDashboard,
  ListFilter,
  Menu,
  MoreHorizontal,
  Package,
  Plus,
  Receipt,
  Search,
  Settings,
  Sparkles,
  Users,
  UserRound,
  UserRoundCheck,
  WalletCards,
  X,
  type LucideIcon,
} from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { useLocation } from "wouter";

type Status = "مؤكد" | "قيد التنفيذ" | "مكتمل" | "معلق" | "ملغي" | "متأخر";

type Booking = {
  id: string;
  customer: string;
  service: string;
  city: string;
  date: string;
  time: string;
  team: string;
  amount: number;
  status: Status;
};

type NavItem = { path: string; label: string; icon: LucideIcon; count?: number };

const navGroups: { label: string; items: NavItem[] }[] = [
  {
    label: "الرئيسية",
    items: [{ path: "/", label: "لوحة التحكم", icon: LayoutDashboard }],
  },
  {
    label: "التشغيل",
    items: [
      { path: "/bookings", label: "الحجوزات", icon: CalendarDays, count: 8 },
      { path: "/calendar", label: "التقويم", icon: ClipboardList },
      { path: "/clients", label: "العملاء", icon: Users },
      { path: "/workers", label: "العاملات والفرق", icon: UserRoundCheck },
    ],
  },
  {
    label: "الخدمات والماليات",
    items: [
      { path: "/services", label: "الباقات والخدمات", icon: Sparkles },
      { path: "/invoices", label: "الفواتير والمدفوعات", icon: Receipt },
      { path: "/expenses", label: "المصروفات", icon: WalletCards },
      { path: "/contracts", label: "العقود", icon: FileCheck2 },
    ],
  },
  {
    label: "الموارد والمتابعة",
    items: [
      { path: "/hr", label: "الموارد البشرية", icon: UserRound },
      { path: "/tasks", label: "المهام", icon: ClipboardCheck, count: 4 },
      { path: "/inventory", label: "المخزون", icon: Package },
      { path: "/complaints", label: "الشكاوى", icon: AlertTriangle, count: 3 },
      { path: "/reports", label: "التقارير", icon: Activity },
    ],
  },
];

const initialBookings: Booking[] = [
  { id: "BK-1048", customer: "شركة النور الطبية", service: "تنظيف مكاتب شامل", city: "الرياض", date: "اليوم", time: "09:00 ص", team: "فريق A-12", amount: 1850, status: "قيد التنفيذ" },
  { id: "BK-1047", customer: "أحمد عبدالعزيز", service: "تنظيف منزل + تعقيم", city: "الخرج", date: "اليوم", time: "11:30 ص", team: "فريق B-05", amount: 620, status: "مؤكد" },
  { id: "BK-1046", customer: "مجمع الواحة السكني", service: "صيانة دورية", city: "الرياض", date: "اليوم", time: "01:00 م", team: "فريق C-02", amount: 2400, status: "مؤكد" },
  { id: "BK-1045", customer: "نوف السالم", service: "تنظيف بعد الانتقال", city: "جدة", date: "غدًا", time: "10:00 ص", team: "فريق A-08", amount: 980, status: "معلق" },
  { id: "BK-1044", customer: "مركز مدار للأعمال", service: "اشتراك شهري", city: "الدمام", date: "غدًا", time: "03:30 م", team: "فريق D-01", amount: 3200, status: "مؤكد" },
  { id: "BK-1043", customer: "عبدالرحمن الحربي", service: "تنظيف واجهات", city: "الرياض", date: "أمس", time: "04:00 م", team: "فريق B-03", amount: 760, status: "مكتمل" },
];

const customers = [
  { name: "شركة النور الطبية", phone: "050 321 6644", city: "الرياض", bookings: 18, total: 28640, status: "نشط" },
  { name: "مجمع الواحة السكني", phone: "055 842 9103", city: "الرياض", bookings: 12, total: 19200, status: "نشط" },
  { name: "مركز مدار للأعمال", phone: "053 118 4092", city: "الدمام", bookings: 9, total: 15480, status: "نشط" },
  { name: "نوف السالم", phone: "056 904 1212", city: "جدة", bookings: 4, total: 4020, status: "جديد" },
];

const workers = [
  { initials: "س", name: "سارة محمد", role: "قائدة فريق", city: "الرياض", rating: "4.9", status: "متاحة", color: "teal" },
  { initials: "ن", name: "نجلاء أحمد", role: "مشرفة جودة", city: "الرياض", rating: "4.8", status: "في مهمة", color: "violet" },
  { initials: "ر", name: "ريم خالد", role: "عاملة خدمات", city: "جدة", rating: "4.7", status: "متاحة", color: "amber" },
  { initials: "ه", name: "هند علي", role: "عاملة خدمات", city: "الدمام", rating: "4.6", status: "إجازة", color: "rose" },
];

const statCards = [
  { label: "حجوزات اليوم", value: "24", delta: "+12.5%", note: "مقارنة بالأمس", icon: CalendarDays, tone: "teal" },
  { label: "إيرادات الشهر", value: "86,420 ر.س", delta: "+8.2%", note: "مقارنة بالشهر الماضي", icon: CircleDollarSign, tone: "blue" },
  { label: "عملاء نشطون", value: "1,284", delta: "+4.6%", note: "منذ بداية الشهر", icon: Users, tone: "violet" },
  { label: "المهام المفتوحة", value: "18", delta: "3 عاجلة", note: "تحتاج إلى متابعة", icon: ClipboardCheck, tone: "amber" },
];

const moduleMeta: Record<string, { title: string; subtitle: string; icon: LucideIcon }> = {
  "/bookings": { title: "الحجوزات", subtitle: "إدارة المواعيد وأوامر العمل والفرق الميدانية", icon: CalendarDays },
  "/calendar": { title: "التقويم التشغيلي", subtitle: "نظرة يومية وأسبوعية على جدول الزيارات", icon: CalendarDays },
  "/clients": { title: "العملاء", subtitle: "ملفات العملاء وسجل الطلبات والمدفوعات", icon: Users },
  "/workers": { title: "العاملات والفرق", subtitle: "إدارة التوفر والتكليفات وتقييم الجودة", icon: UserRoundCheck },
  "/services": { title: "الباقات والخدمات", subtitle: "الأسعار، المدد، والخدمات الإضافية", icon: Sparkles },
  "/invoices": { title: "الفواتير والمدفوعات", subtitle: "متابعة الاستحقاقات والتحصيل والضريبة", icon: Receipt },
  "/expenses": { title: "المصروفات", subtitle: "تسجيل المصروفات ودورة الاعتماد", icon: WalletCards },
  "/contracts": { title: "العقود", subtitle: "العقود النشطة وقرب انتهاء التجديد", icon: FileCheck2 },
  "/hr": { title: "الموارد البشرية", subtitle: "الحضور والإجازات والرواتب والسلف", icon: UserRound },
  "/tasks": { title: "المهام", subtitle: "متابعة أعمال الفريق والأولويات", icon: ClipboardCheck },
  "/inventory": { title: "المخزون", subtitle: "الأصناف والتنبيهات وحركة المستودع", icon: Package },
  "/complaints": { title: "الشكاوى", subtitle: "تسجيل الشكاوى والإجراءات التصحيحية", icon: AlertTriangle },
  "/reports": { title: "التقارير", subtitle: "تقارير الأداء والتشغيل والتحصيل", icon: Activity },
  "/settings": { title: "الإعدادات", subtitle: "إعدادات الشركة والصلاحيات والتنبيهات", icon: Settings },
};

const formatMoney = (amount: number) => `${amount.toLocaleString("ar-SA")} ر.س`;

function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    "مؤكد": "status-blue",
    "قيد التنفيذ": "status-teal",
    "مكتمل": "status-green",
    "معلق": "status-amber",
    "ملغي": "status-red",
    "متأخر": "status-red",
    "نشط": "status-green",
    "جديد": "status-blue",
    "متاحة": "status-green",
    "في مهمة": "status-teal",
    "إجازة": "status-amber",
  };
  return <span className={`status-pill ${styles[status] ?? "status-neutral"}`}><span className="status-dot" />{status}</span>;
}

function Avatar({ initials, tone = "teal" }: { initials: string; tone?: string }) {
  return <span className={`avatar avatar-${tone}`}>{initials}</span>;
}

function SectionHeader({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <div className="section-heading">
      <div>
        <h2>{title}</h2>
      </div>
      {action && <button className="text-button" onClick={onAction}>{action}<ChevronLeft size={16} /></button>}
    </div>
  );
}

function Dashboard({ bookings, onNewBooking, onNavigate }: { bookings: Booking[]; onNewBooking: () => void; onNavigate: (path: string) => void }) {
  const today = bookings.filter((booking) => booking.date === "اليوم");
  return (
    <div className="page-stack">
      <div className="welcome-row">
        <div>
          <p className="eyebrow">الخميس، 23 أكتوبر 2026</p>
          <h1>نظرة سريعة على تشغيل اليوم</h1>
          <p className="page-subtitle">أهلًا بك مجددًا، هذه آخر مستجدات إم إتش للخدمات.</p>
        </div>
        <button className="primary-button" onClick={onNewBooking}><Plus size={18} /> حجز جديد</button>
      </div>

      <div className="stats-grid">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return <div className="stat-card" key={stat.label}>
            <div className={`stat-icon stat-${stat.tone}`}><Icon size={20} /></div>
            <div className="stat-copy"><span>{stat.label}</span><strong>{stat.value}</strong><small className={stat.delta.startsWith("+") ? "positive" : "warning"}>{stat.delta} <em>{stat.note}</em></small></div>
            <MoreHorizontal size={18} className="muted-icon" />
          </div>;
        })}
      </div>

      <div className="dashboard-grid main-grid">
        <section className="panel chart-panel">
          <SectionHeader title="الإيرادات والتحصيل" action="عرض التقرير" onAction={() => onNavigate("/reports")} />
          <div className="chart-topline"><strong>86,420 ر.س</strong><span className="positive"><ArrowUpLeft size={15} /> 8.2%</span><span className="muted-text">آخر 7 أيام</span></div>
          <div className="bar-chart" aria-label="رسم الإيرادات لآخر سبعة أيام">
            {[42, 56, 48, 72, 61, 88, 78].map((height, index) => <div className="bar-column" key={index}><div className={`bar ${index === 5 ? "bar-active" : ""}`} style={{ height: `${height}%` }} /><span>{["سبت", "أحد", "اثن", "ثلث", "أربع", "خمس", "جمع"][index]}</span></div>)}
          </div>
        </section>
        <section className="panel calendar-mini-panel">
          <SectionHeader title="تقويم اليوم" action="فتح التقويم" onAction={() => onNavigate("/calendar")} />
          <div className="mini-calendar-head"><button><ChevronRightIcon /></button><strong>أكتوبر 2026</strong><button><ChevronLeft size={16} /></button></div>
          <div className="mini-weekdays">{["س", "ح", "ن", "ث", "ر", "خ", "ج"].map((day) => <span key={day}>{day}</span>)}</div>
          <div className="mini-days">{Array.from({ length: 35 }, (_, i) => <span className={i === 22 ? "day-active" : i === 19 || i === 24 ? "day-dot" : ""} key={i}>{i < 3 ? "" : ((i - 2) <= 31 ? i - 2 : "")}</span>)}</div>
          <div className="calendar-summary"><span className="summary-number">8</span><span><strong>زيارات مجدولة اليوم</strong><small>3 فرق في الميدان الآن</small></span></div>
        </section>
      </div>

      <div className="dashboard-grid bottom-grid">
        <section className="panel table-panel">
          <SectionHeader title="حجوزات اليوم" action="كل الحجوزات" onAction={() => onNavigate("/bookings")} />
          <div className="table-scroll"><table><thead><tr><th>رقم الحجز</th><th>العميل</th><th>الخدمة</th><th>الموعد</th><th>الحالة</th><th>القيمة</th></tr></thead><tbody>{today.slice(0, 4).map((booking) => <tr key={booking.id}><td><strong className="table-link">{booking.id}</strong></td><td><div className="person-cell"><Avatar initials={booking.customer.charAt(0)} /><span>{booking.customer}</span></div></td><td>{booking.service}</td><td>{booking.time}</td><td><StatusPill status={booking.status} /></td><td><strong>{formatMoney(booking.amount)}</strong></td></tr>)}</tbody></table></div>
        </section>
        <section className="panel alerts-panel"><SectionHeader title="تنبيهات تحتاج متابعة" action="كل التنبيهات" /><div className="alert-list"><div className="alert-item alert-warning"><span className="alert-icon"><AlertTriangle size={17} /></span><div><strong>3 فواتير متأخرة</strong><small>إجمالي المستحق 4,850 ر.س</small></div><ChevronLeft size={16} /></div><div className="alert-item alert-blue"><span className="alert-icon"><Package size={17} /></span><div><strong>5 أصناف مخزون منخفض</strong><small>منها مواد التعقيم والمناديل</small></div><ChevronLeft size={16} /></div><div className="alert-item alert-teal"><span className="alert-icon"><Clock3 size={17} /></span><div><strong>عقدان ينتهيان قريبًا</strong><small>يحتاجان إلى تجديد خلال 14 يومًا</small></div><ChevronLeft size={16} /></div></div><button className="soft-button full-width" onClick={() => onNavigate("/reports")}>مراجعة مركز التنبيهات</button></section>
      </div>
    </div>
  );
}

function ChevronRightIcon() { return <ChevronLeft size={16} className="rotate-180" />; }

function ModulePage({ path, bookings, onNewBooking, onNavigate }: { path: string; bookings: Booking[]; onNewBooking: () => void; onNavigate: (path: string) => void }) {
  const meta = moduleMeta[path] ?? moduleMeta["/bookings"];
  const Icon = meta.icon;
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("الكل");
  const [view, setView] = useState<"table" | "cards">("table");
  const filteredBookings = bookings.filter((booking) => `${booking.customer} ${booking.service} ${booking.id}`.includes(query) && (filter === "الكل" || booking.status === filter));

  const genericRows = useMemo(() => {
    if (path === "/clients") return customers.map((item) => ({ key: item.name, cells: [item.name, item.phone, item.city, `${item.bookings} حجوزات`, formatMoney(item.total)], status: item.status }));
    if (path === "/workers") return workers.map((item) => ({ key: item.name, cells: [item.name, item.role, item.city, `${item.rating} / 5`, item.status], status: item.status }));
    if (path === "/services") return [{ key: "الباقة الأساسية", cells: ["الباقة الأساسية", "تنظيف منزل", "4 ساعات", "620 ر.س", "48 مشترك"], status: "نشط" }, { key: "باقة الأعمال", cells: ["باقة الأعمال", "مكاتب وشركات", "اشتراك شهري", "3,200 ر.س", "22 مشترك"], status: "نشط" }, { key: "تنظيف ما بعد الانتقال", cells: ["تنظيف ما بعد الانتقال", "خدمة إضافية", "6 ساعات", "980 ر.س", "قيد المراجعة"], status: "معلق" }];
    if (path === "/invoices") return [{ key: "INV-2081", cells: ["INV-2081", "شركة النور الطبية", "23 أكتوبر 2026", "1,850 ر.س", "تحويل بنكي"], status: "مدفوعة" }, { key: "INV-2080", cells: ["INV-2080", "نوف السالم", "22 أكتوبر 2026", "980 ر.س", "بانتظار الدفع"], status: "معلق" }, { key: "INV-2079", cells: ["INV-2079", "مركز مدار للأعمال", "21 أكتوبر 2026", "3,200 ر.س", "متأخرة"], status: "متأخر" }];
    if (path === "/expenses") return [{ key: "EX-031", cells: ["EX-031", "مواد تنظيف", "مستودع الرياض", "1,240 ر.س", "اليوم"], status: "بانتظار الاعتماد" }, { key: "EX-030", cells: ["EX-030", "وقود ونقل", "التشغيل", "860 ر.س", "أمس"], status: "معتمد" }, { key: "EX-029", cells: ["EX-029", "صيانة معدات", "الفرق الميدانية", "2,450 ر.س", "20 أكتوبر"], status: "مدفوع" }];
    if (path === "/tasks") return [{ key: "تحديث عقد الواحة", cells: ["تحديث عقد الواحة", "نجلاء أحمد", "اليوم", "عالية", "تجديد عقد العميل"], status: "قيد التنفيذ" }, { key: "شراء مواد تعقيم", cells: ["شراء مواد تعقيم", "سارة محمد", "غدًا", "متوسطة", "المخزون"], status: "مؤكد" }, { key: "مراجعة صور الخدمة", cells: ["مراجعة صور الخدمة", "ريم خالد", "اليوم", "منخفضة", "جودة"], status: "مكتمل" }];
    if (path === "/inventory") return [{ key: "مطهر أسطح 5 لتر", cells: ["مطهر أسطح 5 لتر", "مواد تعقيم", "12 عبوة", "5 عبوات", "مستودع الرياض"], status: "منخفض" }, { key: "مناديل مايكروفايبر", cells: ["مناديل مايكروفايبر", "أدوات", "84 قطعة", "20 قطعة", "مستودع جدة"], status: "متاح" }, { key: "أكياس نفايات كبيرة", cells: ["أكياس نفايات كبيرة", "مستهلكات", "9 كراتين", "8 كراتين", "منخفض"], status: "منخفض" }];
    if (path === "/complaints") return [{ key: "شكوى #204", cells: ["شكوى #204", "شركة النور الطبية", "تأخر الوصول", "اليوم 09:20", "سارة محمد"], status: "قيد التنفيذ" }, { key: "شكوى #203", cells: ["شكوى #203", "نوف السالم", "جودة الخدمة", "أمس", "نجلاء أحمد"], status: "معلق" }, { key: "شكوى #202", cells: ["شكوى #202", "مجمع الواحة", "فاتورة", "20 أكتوبر", "الإدارة"], status: "مكتمل" }];
    if (path === "/contracts") return [{ key: "CT-104", cells: ["CT-104", "مجمع الواحة السكني", "01 يناير 2026", "31 ديسمبر 2026", "69 يومًا"], status: "نشط" }, { key: "CT-103", cells: ["CT-103", "مركز مدار للأعمال", "15 فبراير 2026", "15 نوفمبر 2026", "23 يومًا"], status: "قريب الانتهاء" }, { key: "CT-102", cells: ["CT-102", "شركة النور الطبية", "01 مارس 2026", "28 فبراير 2027", "نشط"], status: "نشط" }];
    if (path === "/hr") return workers.map((item) => ({ key: item.name, cells: [item.name, item.role, "حاضر", "08:42 ص", "8.5 ساعات"], status: item.status }));
    if (path === "/settings") return [{ key: "بيانات الشركة", cells: ["بيانات الشركة", "الهوية والعنوان", "محدّث", "إم إتش للخدمات", "الإدارة"], status: "نشط" }, { key: "صلاحيات المستخدمين", cells: ["صلاحيات المستخدمين", "الأدوار والوصول", "4 أدوار", "آخر تعديل اليوم", "مدير النظام"], status: "نشط" }, { key: "الإشعارات", cells: ["الإشعارات", "البريد والتنبيهات", "مفعّلة", "3 قنوات", "التشغيل"], status: "نشط" }];
    return bookings.map((booking) => ({ key: booking.id, cells: [booking.id, booking.customer, booking.service, `${booking.date} · ${booking.time}`, formatMoney(booking.amount)], status: booking.status }));
  }, [path, bookings]);

  const isBooking = path === "/bookings";
  return <div className="page-stack">
    <div className="module-header"><div className="module-title"><div className="module-icon"><Icon size={23} /></div><div><p className="eyebrow">إدارة النظام / {meta.title}</p><h1>{meta.title}</h1><p className="page-subtitle">{meta.subtitle}</p></div></div><div className="header-actions"><button className="soft-button"><Download size={16} /> تصدير</button><button className="primary-button" onClick={onNewBooking}><Plus size={18} /> {isBooking ? "حجز جديد" : "إضافة جديد"}</button></div></div>
    <div className="stats-grid compact-stats"><div className="stat-card mini-stat"><div className="stat-icon stat-teal"><Activity size={18} /></div><div className="stat-copy"><span>إجمالي السجلات</span><strong>{isBooking ? bookings.length + 42 : genericRows.length + 128}</strong></div></div><div className="stat-card mini-stat"><div className="stat-icon stat-blue"><Clock3 size={18} /></div><div className="stat-copy"><span>هذا الأسبوع</span><strong>{isBooking ? "38" : "24"}</strong></div></div><div className="stat-card mini-stat"><div className="stat-icon stat-amber"><AlertTriangle size={18} /></div><div className="stat-copy"><span>يحتاج متابعة</span><strong>{isBooking ? "6" : "9"}</strong></div></div><div className="stat-card mini-stat"><div className="stat-icon stat-violet"><CircleDollarSign size={18} /></div><div className="stat-copy"><span>القيمة الإجمالية</span><strong>{isBooking ? "42,680 ر.س" : "86,420 ر.س"}</strong></div></div></div>
    {path === "/calendar" ? <CalendarModule bookings={bookings} onNewBooking={onNewBooking} /> : path === "/reports" ? <ReportsModule onNavigate={onNavigate} /> : <section className="panel table-panel module-table"><div className="toolbar"><div className="search-box"><Search size={17} /><input placeholder="ابحث في السجلات..." value={query} onChange={(event) => setQuery(event.target.value)} /></div><div className="toolbar-actions"><button className="filter-button"><Filter size={16} /> فلاتر</button><select value={filter} onChange={(event) => setFilter(event.target.value)}><option>الكل</option><option>مؤكد</option><option>مكتمل</option><option>معلق</option><option>متأخر</option></select><div className="view-switch"><button className={view === "table" ? "active" : ""} onClick={() => setView("table")}><ListFilter size={16} /></button><button className={view === "cards" ? "active" : ""} onClick={() => setView("cards")}><LayoutDashboard size={16} /></button></div></div></div>{view === "cards" ? <div className="record-cards">{(isBooking ? filteredBookings : genericRows).map((item: any) => <div className="record-card" key={item.key ?? item.id}><div className="record-card-top"><strong>{item.key ?? item.id}</strong><StatusPill status={item.status} /></div><p>{item.customer ?? item.cells?.[1]}</p><small>{item.service ?? item.cells?.[2]}</small><div className="record-card-bottom"><span>{item.date ?? item.cells?.[3]}</span><b>{item.amount ? formatMoney(item.amount) : item.cells?.[4]}</b></div></div>)}</div> : <div className="table-scroll"><table><thead><tr>{(isBooking ? ["رقم الحجز", "العميل", "الخدمة", "الموعد", "القيمة", "الحالة"] : ["السجل", "البيان", "التفاصيل", "التاريخ / القيمة", "ملاحظات", "الحالة"]).map((head) => <th key={head}>{head}</th>)}</tr></thead><tbody>{isBooking ? filteredBookings.map((booking) => <tr key={booking.id}><td><strong className="table-link">{booking.id}</strong></td><td><div className="person-cell"><Avatar initials={booking.customer.charAt(0)} /><span>{booking.customer}</span></div></td><td>{booking.service}</td><td>{booking.date} · {booking.time}</td><td><strong>{formatMoney(booking.amount)}</strong></td><td><StatusPill status={booking.status} /></td></tr>) : genericRows.map((row) => <tr key={row.key}>{row.cells.map((cell, index) => <td key={`${row.key}-${index}`}>{index === 0 ? <strong className="table-link">{cell}</strong> : cell}</td>)}<td><StatusPill status={row.status} /></td></tr>)}</tbody></table></div>}<div className="table-footer"><span>عرض {isBooking ? filteredBookings.length : genericRows.length} من {isBooking ? bookings.length : genericRows.length + 128} سجل</span><div><button><ChevronRightIcon /></button><button className="page-active">1</button><button>2</button><button>3</button><button><ChevronLeft size={16} /></button></div></div></section>}
  </div>;
}

function CalendarModule({ bookings, onNewBooking }: { bookings: Booking[]; onNewBooking: () => void }) {
  const days = Array.from({ length: 35 }, (_, index) => index - 2);
  return <section className="panel calendar-module"><div className="calendar-toolbar"><div><h2>أكتوبر 2026</h2><p>الأسبوع الثالث · 8 زيارات مجدولة</p></div><div className="calendar-actions"><button className="soft-button">اليوم</button><button className="icon-button"><ChevronRightIcon /></button><button className="icon-button"><ChevronLeft size={16} /></button><button className="primary-button" onClick={onNewBooking}><Plus size={17} /> حجز جديد</button></div></div><div className="week-grid">{["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"].map((day) => <div className="week-day" key={day}>{day}</div>)}{days.map((day, index) => <div className={`month-cell ${day === 23 ? "today-cell" : ""}`} key={index}><span className="cell-date">{day > 0 && day <= 31 ? day : ""}</span>{day === 23 && <><div className="event event-teal">09:00 · شركة النور</div><div className="event event-blue">11:30 · أحمد عبدالعزيز</div></>}{day === 24 && <div className="event event-amber">10:00 · نوف السالم</div>}{day === 26 && <div className="event event-violet">03:00 · زيارة متابعة</div>}</div>)}</div><div className="calendar-legend"><span><i className="legend-dot teal-dot" /> زيارات جديدة</span><span><i className="legend-dot blue-dot" /> زيارات مؤكدة</span><span><i className="legend-dot amber-dot" /> تحتاج متابعة</span></div></section>;
}

function ReportsModule({ onNavigate }: { onNavigate: (path: string) => void }) {
  return <div className="reports-grid"><section className="panel report-hero"><div><p className="eyebrow">ملخص الأداء</p><h2>التشغيل يسير بشكل ممتاز</h2><p>ارتفع معدل إتمام الحجوزات هذا الشهر بنسبة 12.8% مقارنة بالشهر السابق.</p></div><div className="report-score"><strong>92%</strong><span>مؤشر الأداء</span></div></section><section className="panel report-card"><SectionHeader title="توزيع الإيرادات" /><div className="donut-wrap"><div className="donut"><span>86,420<small>ر.س</small></span></div><div className="donut-legend"><span><i className="legend-dot teal-dot" /> الحجوزات <b>64%</b></span><span><i className="legend-dot blue-dot" /> الاشتراكات <b>24%</b></span><span><i className="legend-dot amber-dot" /> الخدمات الإضافية <b>12%</b></span></div></div></section><section className="panel report-card"><SectionHeader title="أهم مؤشرات التشغيل" /><div className="metric-list"><div><span>معدل رضا العملاء</span><strong>4.8 / 5</strong><div className="progress"><i style={{ width: "92%" }} /></div></div><div><span>الالتزام بالمواعيد</span><strong>94%</strong><div className="progress"><i style={{ width: "94%" }} /></div></div><div><span>استغلال الفرق</span><strong>87%</strong><div className="progress"><i style={{ width: "87%" }} /></div></div></div><button className="soft-button full-width" onClick={() => onNavigate("/bookings")}>مراجعة تفاصيل الحجوزات</button></section></div>;
}

function BookingModal({ onClose, onSave }: { onClose: () => void; onSave: (booking: Booking) => void }) {
  const [customer, setCustomer] = useState("");
  const [service, setService] = useState("تنظيف منزل + تعقيم");
  const [city, setCity] = useState("الرياض");
  const [date, setDate] = useState("غدًا");
  const [amount, setAmount] = useState("620");
  const submit = (event: FormEvent) => { event.preventDefault(); onSave({ id: `BK-${1050 + Math.floor(Math.random() * 40)}`, customer: customer || "عميل جديد", service, city, date, time: "10:00 ص", team: "فريق A-12", amount: Number(amount) || 0, status: "مؤكد" }); };
  return <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><div className="modal-card"><div className="modal-header"><div><p className="eyebrow">تشغيل / الحجوزات</p><h2>إنشاء حجز جديد</h2><p>أدخل التفاصيل الأساسية وسيتم إنشاء أمر العمل تلقائيًا.</p></div><button className="icon-button" onClick={onClose}><X size={19} /></button></div><form onSubmit={submit}><div className="form-grid"><label>اسم العميل<input value={customer} onChange={(event) => setCustomer(event.target.value)} placeholder="مثال: شركة النور الطبية" autoFocus /></label><label>الخدمة<select value={service} onChange={(event) => setService(event.target.value)}><option>تنظيف منزل + تعقيم</option><option>تنظيف مكاتب شامل</option><option>تنظيف بعد الانتقال</option><option>اشتراك شهري</option></select></label><label>المدينة<select value={city} onChange={(event) => setCity(event.target.value)}><option>الرياض</option><option>جدة</option><option>الدمام</option><option>الخرج</option></select></label><label>الموعد<select value={date} onChange={(event) => setDate(event.target.value)}><option>اليوم</option><option>غدًا</option><option>بعد غد</option></select></label><label>الفريق<select><option>فريق A-12</option><option>فريق B-05</option><option>فريق C-02</option></select></label><label>القيمة المتوقعة<input value={amount} onChange={(event) => setAmount(event.target.value)} inputMode="numeric" /></label></div><div className="form-note"><Check size={17} /><span>سيتم التحقق من توفر الفريق وإضافة الحجز إلى جدول التشغيل.</span></div><div className="modal-actions"><button type="button" className="soft-button" onClick={onClose}>إلغاء</button><button type="submit" className="primary-button"><Plus size={17} /> إنشاء الحجز</button></div></form></div></div>;
}

export default function Home() {
  const [location, setLocation] = useLocation();
  const [bookings, setBookings] = useState(initialBookings);
  const [modalOpen, setModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const currentPath = location === "/" ? "/" : location;
  const activeMeta = moduleMeta[currentPath];

  const saveBooking = (booking: Booking) => { setBookings((current) => [booking, ...current]); setModalOpen(false); setLocation("/bookings"); };
  const navigate = (path: string) => { setLocation(path); setSidebarOpen(false); };

  return <div className="app-shell" dir="rtl">
    <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}><div className="brand"><div className="brand-mark">M<span>.</span>H</div><div><strong>إم إتش</strong><small>للخدمات والتنظيف</small></div><button className="mobile-close" onClick={() => setSidebarOpen(false)}><X size={18} /></button></div><div className="workspace-switch"><span className="workspace-avatar">م</span><div><strong>شركة إم إتش</strong><small>المقر الرئيسي</small></div><ChevronDown size={15} /></div><nav>{navGroups.map((group) => <div className="nav-group" key={group.label}><span className="nav-label">{group.label}</span>{group.items.map((item) => { const NavIcon = item.icon; const active = currentPath === item.path; return <button className={`nav-item ${active ? "active" : ""}`} key={item.path} onClick={() => navigate(item.path)}><NavIcon size={18} /><span>{item.label}</span>{item.count && <b>{item.count}</b>}</button>; })}</div>)}</nav><div className="sidebar-bottom"><button className="nav-item" onClick={() => navigate("/settings")}><Settings size={18} /><span>الإعدادات</span></button><div className="support-card"><Sparkles size={18} /><div><strong>نحتاج مساعدة؟</strong><small>تواصل مع فريق الدعم</small></div><ChevronLeft size={15} /></div><div className="user-card"><Avatar initials="م" tone="teal" /><div><strong>محمد حسن</strong><small>مدير النظام</small></div><MoreHorizontal size={17} /></div></div></aside>
    {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
    <main className="main-area"><header className="topbar"><button className="mobile-menu" onClick={() => setSidebarOpen(true)}><Menu size={20} /></button><div className="topbar-search"><Search size={18} /><input placeholder="ابحث في النظام..." /><kbd>⌘ K</kbd></div><div className="topbar-actions"><button className="icon-button notification-button" onClick={() => setNotificationsOpen((open) => !open)}><Bell size={19} /><span className="notification-dot" /></button>{notificationsOpen && <div className="notifications-popover"><strong>التنبيهات</strong><p><AlertTriangle size={15} /> 3 فواتير متأخرة تحتاج متابعة</p><p><Package size={15} /> مخزون مطهر الأسطح منخفض</p><p><Clock3 size={15} /> عقدان ينتهيان قريبًا</p></div>}<span className="topbar-divider" /><div className="top-user"><Avatar initials="م" tone="teal" /><div><strong>محمد حسن</strong><small>مدير النظام</small></div><ChevronDown size={15} /></div></div></header><div className="content-area">{currentPath === "/" ? <Dashboard bookings={bookings} onNewBooking={() => setModalOpen(true)} onNavigate={navigate} /> : activeMeta ? <ModulePage path={currentPath} bookings={bookings} onNewBooking={() => setModalOpen(true)} onNavigate={navigate} /> : <Dashboard bookings={bookings} onNewBooking={() => setModalOpen(true)} onNavigate={navigate} />}</div></main>
    {modalOpen && <BookingModal onClose={() => setModalOpen(false)} onSave={saveBooking} />}
  </div>;
}
