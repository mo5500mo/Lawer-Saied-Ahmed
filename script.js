/* ===== بيانات المكتب: عدّل هذا الجزء فقط ===== */
const OFFICE = {
  name: "الأستاذ سعيد أحمد",          // اسم المحامي
  title: "المحامي والمستشار القانوني",  // التخصص أو الصفة
  phone: "01128414479",               // رقم الموبايل
  whatsapp: "+201128414479",           
  address: "القاهرة، زهراء المعادي، مساكن بتشو",
  hours: "من السبت إلى الخميس، 10 ص - 6 م"
};
const SERVICES = [
  { t: "القضايا الجنائية", d: "حضور التحقيقات والترافع في الجنح والجنايات.", i: ["حضور التحقيق مع الموكل", "إعداد مذكرات الدفاع", "الطعن على الأحكام"] },
  { t: "القضايا المدنية", d: "المنازعات والتعويضات والدعاوى المرتبطة بالعقود والحقوق.", i: ["صحيفة الدعوى والمذكرات", "دعاوى التعويض وصحة التوقيع", "التنفيذ بعد الحكم"] },
  { t: "الأسرة والأحوال الشخصية", d: "قضايا تمس الأسرة وتحتاج إلى حكمة وسرعة في التصرف.", i: ["النفقة والحضانة والرؤية", "الطلاق والخلع", "الميراث وإعلام الوراثة"] },
  { t: "العقود والعقارات", d: "صياغة ومراجعة العقود وحماية الملكية قبل وقوع النزاع.", i: ["صياغة ومراجعة العقود", "قضايا الملكية والإيجارات", "فحص المستندات قبل الشراء"] },
  { t: "التجاري والشركات", d: "نزاعات الأعمال والمطالبات المالية وعقود الشركات.", i: ["قضايا الشيكات والكمبيالات", "عقود التأسيس والشراكة", "المطالبات المالية"] },
  { t: "الاستشارات القانونية", d: "رأي قانوني واضح قبل أن تتخذ أي خطوة.", i: ["دراسة الأوراق وتقييم الموقف", "شرح الخيارات والمخاطر", "متابعة بعد الاستشارة عند الحاجة"] }
];


const $ = id => document.getElementById(id);
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

document.querySelectorAll("[data-bind]").forEach(el => el.textContent = OFFICE[el.dataset.bind]);
document.title = OFFICE.name + " | استشارات قانونية وترافع";
$("phone").textContent = OFFICE.phone; $("phone").href = "tel:" + OFFICE.phone;
$("wa").href = "https://wa.me/" + OFFICE.whatsapp;
$("year").textContent = new Date().getFullYear().toLocaleString("ar-EG", { useGrouping: false });

/* الشريط المتحرك: نكرر المحتوى لتكتمل الحلقة */
const track = document.querySelector(".track");
track.innerHTML += track.innerHTML;

/* التخصصات: قائمة + لوحة تفاصيل */
const tabs = $("tabs"), panel = $("panel");
tabs.innerHTML = SERVICES.map((s, i) => `<button role="tab" id="tab${i}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-i="${i}">${s.t}</button>`).join("");
$("fType").innerHTML = SERVICES.map(s => `<option>${s.t}</option>`).join("");
function pick(i, focus) {
  tabs.querySelectorAll("button").forEach((b, k) => { b.setAttribute("aria-selected", k === i); b.tabIndex = k === i ? 0 : -1; });
  if (focus) tabs.children[i].focus();
  const s = SERVICES[i];
  panel.setAttribute("aria-labelledby", "tab" + i);
  panel.innerHTML = `<h3>${s.t}</h3><p>${s.d}</p><ul>${s.i.map(x => `<li>${x}</li>`).join("")}</ul>`;
  panel.classList.remove("swap"); void panel.offsetWidth; panel.classList.add("swap");
  $("fType").selectedIndex = i;
}
tabs.addEventListener("click", e => { const b = e.target.closest("button"); if (b) pick(+b.dataset.i); });
tabs.addEventListener("keydown", e => {
  const cur = +document.activeElement.dataset.i, n = SERVICES.length;
  if (e.key === "ArrowDown") { e.preventDefault(); pick((cur + 1) % n, true); }
  if (e.key === "ArrowUp") { e.preventDefault(); pick((cur - 1 + n) % n, true); }
});
pick(0);

/* قائمة الموبايل */
$("burger").onclick = () => { const o = $("menu").classList.toggle("open"); $("burger").setAttribute("aria-expanded", o); };
$("menu").onclick = e => { if (e.target.tagName === "A") { $("menu").classList.remove("open"); $("burger").setAttribute("aria-expanded", false); } };

/* الهيدر + القسم النشط + خط آلية العمل */
const links = [...document.querySelectorAll("#menu a")], secs = links.map(a => document.querySelector(a.getAttribute("href")));
const steps = [...document.querySelectorAll("#tl li")];
let tick = false;
function onScroll() {
  $("nav").classList.toggle("solid", scrollY > 30);
  let cur = -1; secs.forEach((s, i) => { if (s.getBoundingClientRect().top < innerHeight * 0.4) cur = i; });
  links.forEach((a, i) => a.classList.toggle("active", i === cur));
  const r = $("tl").getBoundingClientRect(), p = Math.min(1, Math.max(0, (innerHeight * 0.75 - r.top) / (r.height + 40)));
  $("tl").style.setProperty("--p", p.toFixed(3));
  steps.forEach((li, i) => li.classList.toggle("on", p >= i / steps.length + 0.02));
  tick = false;
}
addEventListener("scroll", () => { if (!tick) { tick = true; requestAnimationFrame(onScroll); } }, { passive: true });
onScroll();

/* ظهور تدريجي */
if (!reduce && "IntersectionObserver" in window) {
  const io = new IntersectionObserver(en => en.forEach(x => { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } }), { threshold: 0.15 });
  document.querySelectorAll(".h2, .quote, .about-side > *, .vals li, .svc > *, .tl li, .contact > *").forEach((el, i) => {
    el.classList.add("reveal"); el.style.setProperty("--d", (i % 4) * 0.08 + "s"); io.observe(el);
  });
}

/* نموذج التواصل -> واتساب */
$("form").addEventListener("submit", e => {
  e.preventDefault();
  const name = $("fName").value.trim(), phone = $("fPhone").value.trim(), msg = $("formMsg");
  msg.className = "formMsg";
  if (!name || !phone) { msg.textContent = "اكتب اسمك ورقم موبايلك أولًا."; return; }
  const text = `السلام عليكم، أنا ${name}\nرقمي: ${phone}\nالموضوع: ${$("fType").value}\n${$("fMsg").value.trim()}`;
  window.open(`https://wa.me/${OFFICE.whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  msg.className = "formMsg ok"; msg.textContent = "تم فتح واتساب، اضغط إرسال لإتمام الرسالة.";
});
