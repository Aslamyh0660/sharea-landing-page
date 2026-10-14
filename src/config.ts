/**
 * Sharea — central content & links configuration.
 *
 * ✏️ Edit this file to change any visible text or link on the page.
 *    Everything the page renders comes from here.
 */

/** The Telegram bot — the primary call to action. */
export const TELEGRAM_URL = "https://t.me/Sharea_qombot"

/**
 * The WhatsApp group invite link.
 */
export const WHATSAPP_GROUP_LINK =
  "https://chat.whatsapp.com/HuPL6JguDzh8o083TfZedi?s=cl&p=i&ilr=4&iam=0"

/** The bot handle — always "qombot" (with a q), never "gombot". */
export const TELEGRAM_HANDLE = "@Sharea_qombot"

export const BRAND = {
  latin: "SHAREA",
  arabic: "الشارع",
  slogan: "كُلُّ احتياجاتِكَ في مكانٍ واحد",
  tagline: "خدمات متكاملة للزوار العرب في قم",
}

export const HERO = {
  badge: "معتمد",
  headline: "هذا المكان معتمد من بوت الشارع",
  support:
    "وجود رمز الشارع الرسمي في هذا المكان يعني أنه من الأماكن المعتمدة لدينا",
  reassurance: "استفد من خدمات هذا المكان براحة بال وثقة",
  cta: "ادخل إلى بوت الشارع",
}

export const SECTION_TITLES = {
  services: "خدمات الشارع",
  servicesIntro: "سبع خدمات تحتاجها أثناء زيارتك لقم، كلها في بوت واحد",
  trust: "لماذا الشارع؟",
  // Temporarily disabled with the like section; kept for rollback:
  // like: "هل أعجبتك صفحة الشارع؟",
  cta: "ابدأ الآن مع الشارع",
  ctaIntro: "افتح البوت واطلب ما تحتاجه مباشرة، أو انضم إلى مجموعة الواتساب",
}

export type Service = {
  icon: string
  title: string
  description: string
}

export const SERVICES: Service[] = [
  {
    icon: "school",
    title: "خدمات الطلاب",
    description: "دعم ومساندة الطلبة في شؤونهم الدراسية والمعيشية.",
  },
  {
    icon: "redeem",
    title: "الهدايا والتذكارات",
    description: "اختيار الهدايا والتذكارات من قم وإيصالها لمن تحب.",
  },
  {
    icon: "directions_car",
    title: "خدمات السيارات",
    description: "تأجير السيارات وخدمات النقل والتنقّل داخل إيران.",
  },
  {
    icon: "currency_exchange",
    title: "تصريف العملات",
    description: "خدمات تحويل العملات داخل قم بيسر وسهولة.",
  },
  {
    icon: "medical_services",
    title: "السياحة العلاجية",
    description: "تنسيق العلاج والزيارات الطبية وتوفير المرافقين.",
  },
  {
    icon: "location_city",
    title: "الخدمات داخل المدينة",
    description: "كل ما تحتاجه داخل المدينة، على بُعد رسالة واحدة.",
  },
  {
    icon: "support_agent",
    title: "الدعم المباشر",
    description: "فريق دعم يجيبك مباشرة على تيليغرام متى احتجت.",
  },
]

/** Ribbon items (also the aria labels source) */
export const RIBBON: { icon: string; label: string }[] = SERVICES.map(
  ({ icon, title }) => ({ icon, label: title })
)

export type TrustValue = { icon: string; label: string; caption: string }

export const TRUST_VALUES: TrustValue[] = [
  { icon: "verified", label: "موثوق", caption: "أماكن نعتمدها بعناية" },
  { icon: "self_care", label: "مريح", caption: "خدمة تريح بالك" },
  { icon: "bolt", label: "سريع", caption: "رد سريع على طلبك" },
  { icon: "shield", label: "آمن", caption: "تعامل واضح ومباشر" },
]

export const FOOTER = {
  line: "جميع الخدمات في قم — الشارع",
}

/** localStorage keys */
export const STORAGE = {
  // Temporarily disabled with the like section; kept for rollback:
  // liked: "sharea:liked",
}

// Temporarily disabled with the like section; kept for rollback:
// export const LIKES_ENDPOINT = "/api/likes"

// The service/trust icons are referenced dynamically (icon={service.icon}),
// so list them for scripts/icons.mjs (gen:icons):
// @icons school redeem directions_car currency_exchange medical_services location_city support_agent verified self_care bolt shield send favorite forum share content_copy
