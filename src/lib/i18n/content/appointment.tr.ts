import { appointmentCopy } from "@/data/appointment";
import type { AppointmentCopy } from "@/data/appointment";

// Turkish translation of the public-facing half of src/data/appointment.ts
// (the booking wizard, its success/error screens, and the WhatsApp message
// it builds). `admin` is deliberately NOT translated — spread verbatim from
// the English default — because the admin appointments section has no
// locale-prefixed routes of its own (see LocaleProvider.tsx) and translating
// internal/admin-only labels was explicitly out of scope for this pass.
//
// Pure content, no business logic: field labels, step copy, validation
// *messages* (not the validation rules themselves, which stay in
// lib/appointments/validation.ts untouched), and static UI strings only.
export const appointmentCopyTr: AppointmentCopy = {
  locale: "tr-TR",
  page: {
    title: "Randevu talep edin",
    description: "Evcil dostunuz hakkında bize bilgi verin ve bir zaman seçin — mobil bakım ziyaretinizi onaylayacağız.",
  },
  loading: "Yükleniyor…",
  progressLabel: "Randevu adımları",
  stepProgress: (current, total) => `Adım ${current}/${total}`,
  steps: {
    service: { title: "Hizmet seçin", description: "Sizin için ne yapmamızı istersiniz?" },
    pet: { title: "Evcil dostunuz", description: "Birkaç detay, ziyarete hazırlanmamıza yardımcı olur." },
    address: { title: "Adres", description: "Nereye gelmemizi istersiniz? Hizmet bölgelerimiz içinde seyahat ederiz." },
    date: { title: "Tarih", description: "Size uygun bir gün seçin." },
    time: { title: "Saat", description: "Uygun bir başlangıç saati seçin." },
    customer: { title: "Bilgileriniz", description: "Bu randevu hakkında sizinle nasıl iletişime geçebiliriz?" },
    review: { title: "Gözden geçirin", description: "Talebinizi göndermeden önce her şeyi kontrol edin." },
  },
  actions: {
    back: "Geri",
    next: "Devam et",
    edit: "Düzenle",
    submit: "Randevu talep et",
    submitting: "Gönderiliyor…",
    startOver: "Baştan başla",
    retry: "Tekrar dene",
    changeDate: "Başka bir tarih seçin",
  },
  fields: {
    service: { label: "Hizmet" },
    date: { label: "Tarih" },
    time: { label: "Başlangıç saati" },
    petName: { label: "Evcil dostunuzun adı" },
    petType: { label: "Evcil hayvan türü" },
    breed: { label: "Irk", placeholder: "Bir ırk seçin" },
    size: { label: "Boyut", helper: "Köpeğinize en yakın seçeneği belirleyin." },
    petNotes: {
      label: "Bilmemiz gereken bir şey var mı?",
      helper: "Mizaç, sağlık notları, tüy durumu vb.",
    },
    serviceArea: { label: "Hizmet bölgesi", placeholder: "Bir bölge seçin" },
    addressLine: { label: "Açık adres" },
    addressDetails: { label: "Bina, kat, daire", helper: "Sizi bulmamıza yardımcı olacak herhangi bir detay." },
    fullName: { label: "Ad Soyad" },
    phone: { label: "Telefon numarası", helper: "Randevunuzu onaylamak için bunu kullanacağız." },
    email: { label: "E-posta" },
    customerNotes: { label: "Notlar" },
  },
  optional: "(isteğe bağlı)",
  petTypes: {
    dog: "Köpek",
    cat: "Kedi",
  },
  sizes: {
    small: { label: "Küçük", description: "Yaklaşık 10 kg'a kadar" },
    medium: { label: "Orta", description: "Yaklaşık 10–25 kg" },
    large: { label: "Büyük", description: "Yaklaşık 25 kg üzeri" },
  },
  price: {
    label: "Fiyat",
    onRequest: "Fiyat, randevunuzu onayladığımızda kesinleşir",
    unavailable: {
      "unknown-service": "Bu hizmet henüz online olarak rezerve edilemiyor. Lütfen bizimle iletişime geçin.",
      "pet-not-offered": "Bu hizmet bu evcil hayvan için mevcut değil.",
      "size-required": "Fiyatı görmek için evcil hayvanınızın boyutunu seçin.",
    },
  },
  service: {
    none: "Online randevu şu anda mevcut değil. Randevu almak için lütfen bizimle iletişime geçin.",
  },
  availability: {
    loading: "Uygunluk kontrol ediliyor…",
    loadError: "Uygunluk bilgisi yüklenemedi. Lütfen tekrar deneyin.",
  },
  date: {
    fullyBooked: "Dolu",
    none: "Şu anda uygun tarih yok. Randevu almak için lütfen bizimle iletişime geçin.",
  },
  time: {
    noSlots: "Bu günde uygun saat yok. Lütfen başka bir tarih seçin.",
    provisionalNotice: "Saatler taleptir — randevunuzu sizinle doğrudan onaylayacağız.",
  },
  summary: {
    service: "Hizmet",
    pet: "Evcil Hayvan",
    address: "Adres",
    date: "Tarih",
    time: "Saat",
    customer: "İletişim bilgileri",
    price: "Fiyat",
    reference: "Referans",
    editSection: (section) => `${section} bölümünü düzenle`,
  },
  validation: {
    required: "Bu alan zorunludur.",
    tooLong: "Bu çok uzun.",
    invalidOption: "Lütfen seçeneklerden birini seçin.",
    invalidPhone: "Geçerli bir telefon numarası girin.",
    invalidEmail: "Geçerli bir e-posta adresi girin.",
    invalidServiceArea: "Lütfen hizmet bölgelerimizden birini seçin.",
    dateUnavailable: "O gün uygun değil. Lütfen başka bir gün seçin.",
    serviceUnavailable: "Bu hizmet bu evcil hayvan için mevcut değil.",
    priceChanged: "Bu randevunun fiyatı değişti. Lütfen tekrar gözden geçirin.",
    slotUnavailable: "O saat uygun değil. Lütfen başka bir saat seçin.",
    slotTaken: "O saat az önce doldu. Lütfen başka bir saat seçin.",
  },
  // Admin-only — not translated (see file header).
  statuses: appointmentCopy.statuses,
  result: {
    successTitle: "Talebiniz alındı",
    successDescription: "Teşekkürler! Randevunuzu onaylamak için kısa süre içinde sizinle iletişime geçeceğiz.",
    whatsappCta: "WhatsApp'tan detayları gönderin",
    whatsappHelper: "Randevu bilgileriniz doldurulmuş olarak WhatsApp'ı açar — sadece gönder'e basın.",
    contactFallback: "Bize doğrudan da ulaşabilirsiniz:",
    call: "Ara",
    whatsapp: "WhatsApp",
    newTab: "(yeni sekmede açılır)",
    errorTitle: "Bir şeyler ters gitti",
    errorDescription: "Talebiniz gönderilemedi. Lütfen tekrar deneyin veya doğrudan bizimle iletişime geçin.",
    rateLimited:
      "Bu telefon numarasından son bir saat içinde birkaç talep aldık. Lütfen daha sonra tekrar deneyin veya doğrudan bizimle iletişime geçin.",
  },
  whatsappMessage: {
    greeting: (businessName) => `Merhaba ${businessName}! Web sitenizden az önce bir randevu talep ettim.`,
    labels: {
      reference: "Referans",
      service: "Hizmet",
      pet: "Evcil Hayvan",
      date: "Tarih",
      time: "Saat",
      area: "Bölge",
      address: "Adres",
      name: "Ad",
      phone: "Telefon",
    },
  },
  privacy: {
    formNote: "Bu bilgileri yalnızca randevunuzu ayarlamak ve onaylamak için kullanırız.",
    policyLink: "Gizlilik politikası",
    kvkkLink: "KVKK Aydınlatma Metni",
    reviewNotice:
      "Bu talebi göndermeniz randevunuzu onaylamaz — randevunuzu sizinle teyit etmek için ayrıca iletişime geçeceğiz. Bilgilerinizi nasıl işlediğimize ilişkin:",
    sectionTitle: "Randevu talepleri",
    intro: "Bu web sitesinde bir randevu talep ettiğinizde şunları isteriz:",
    collected: [
      "adınız ve telefon numaranız, isteğe bağlı olarak e-posta adresiniz",
      "ziyaretin gerçekleşeceği adres ve hizmet bölgesi",
      "evcil hayvanınızın adı, türü, ırkı, boyutu ve eklediğiniz notlar",
      "seçtiğiniz hizmet, tarih ve saat ile bize yönelik notlar",
    ],
    purpose:
      "Bu bilgileri yalnızca bakım ziyaretinizi ayarlamak, onaylamak ve gerçekleştirmek ile bu konuda sizinle iletişime geçmek için kullanırız.",
    whatsapp:
      "Randevu bilgilerinizi bize WhatsApp üzerinden göndermeyi seçerseniz, bu mesaj WhatsApp'ın kendi koşulları kapsamında işlenir.",
  },
  marketing: {
    checkboxLabel: "SMS, WhatsApp veya e-posta ile ara sıra kampanya ve fırsat bildirimleri almak istiyorum.",
    helper: "İsteğe bağlıdır — randevunuzdan tamamen ayrıdır. İşaretlemezseniz randevunuz etkilenmez.",
  },
  // Admin-only — not translated (see file header).
  admin: appointmentCopy.admin,
};
