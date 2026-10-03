import { appointmentCopy } from "@/data/appointment";
import type { AppointmentCopy } from "@/data/appointment";

// Russian translation of the public-facing half of src/data/appointment.ts —
// see appointment.tr.ts for the full rationale (same file, mirrored). Admin
// copy is intentionally left in English.
export const appointmentCopyRu: AppointmentCopy = {
  locale: "ru-RU",
  page: {
    title: "Запросить запись",
    description: "Расскажите нам о своём питомце и выберите время — мы подтвердим визит мобильного грумера.",
  },
  loading: "Загрузка…",
  progressLabel: "Шаги записи",
  stepProgress: (current, total) => `Шаг ${current} из ${total}`,
  steps: {
    service: { title: "Выберите услугу", description: "Что бы вы хотели, чтобы мы сделали?" },
    pet: { title: "Ваш питомец", description: "Несколько деталей помогут нам подготовиться к визиту." },
    address: { title: "Адрес", description: "Куда нам приехать? Мы работаем в пределах наших зон обслуживания." },
    date: { title: "Дата", description: "Выберите удобный день." },
    time: { title: "Время", description: "Выберите доступное время начала." },
    customer: { title: "Ваши данные", description: "Как нам связаться с вами по поводу этой записи?" },
    review: { title: "Проверка", description: "Проверьте всё перед отправкой заявки." },
  },
  actions: {
    back: "Назад",
    next: "Продолжить",
    edit: "Изменить",
    submit: "Запросить запись",
    submitting: "Отправка…",
    startOver: "Начать заново",
    retry: "Повторить",
    changeDate: "Выбрать другую дату",
  },
  fields: {
    service: { label: "Услуга" },
    date: { label: "Дата" },
    time: { label: "Время начала" },
    petName: { label: "Кличка питомца" },
    petType: { label: "Вид животного" },
    breed: { label: "Порода", placeholder: "Выберите породу" },
    size: { label: "Размер", helper: "Выберите ближайший вариант для вашей собаки." },
    petNotes: {
      label: "Что нам стоит знать?",
      helper: "Характер, состояние здоровья, шерсть и т.д.",
    },
    serviceArea: { label: "Зона обслуживания", placeholder: "Выберите зону" },
    addressLine: { label: "Адрес" },
    addressDetails: { label: "Дом, этаж, квартира", helper: "Любые детали, которые помогут нас найти." },
    fullName: { label: "Полное имя" },
    phone: { label: "Номер телефона", helper: "Мы используем его для подтверждения записи." },
    email: { label: "Эл. почта" },
    customerNotes: { label: "Примечания" },
  },
  optional: "(необязательно)",
  petTypes: {
    dog: "Собака",
    cat: "Кошка",
  },
  sizes: {
    small: { label: "Маленький", description: "До 10 кг" },
    medium: { label: "Средний", description: "Около 10–25 кг" },
    large: { label: "Крупный", description: "Более 25 кг" },
  },
  price: {
    label: "Цена",
    onRequest: "Цена будет подтверждена вместе с записью",
    unavailable: {
      "unknown-service": "Эту услугу пока нельзя забронировать онлайн. Свяжитесь с нами.",
      "pet-not-offered": "Эта услуга недоступна для этого питомца.",
      "size-required": "Выберите размер питомца, чтобы увидеть цену.",
    },
  },
  service: {
    none: "Онлайн-запись сейчас недоступна. Свяжитесь с нами, чтобы записаться.",
  },
  availability: {
    loading: "Проверка доступности…",
    loadError: "Не удалось загрузить доступность. Попробуйте ещё раз.",
  },
  date: {
    fullyBooked: "Занято",
    none: "Сейчас нет доступных дат. Свяжитесь с нами, чтобы записаться.",
  },
  time: {
    noSlots: "На этот день нет доступного времени. Выберите другую дату.",
    provisionalNotice: "Время — это запрос, мы подтвердим запись с вами напрямую.",
  },
  summary: {
    service: "Услуга",
    pet: "Питомец",
    address: "Адрес",
    date: "Дата",
    time: "Время",
    customer: "Контактные данные",
    price: "Цена",
    reference: "Номер заявки",
    editSection: (section) => `Изменить: ${section.toLowerCase()}`,
  },
  validation: {
    required: "Это поле обязательно.",
    tooLong: "Слишком длинно.",
    invalidOption: "Пожалуйста, выберите один из вариантов.",
    invalidPhone: "Введите корректный номер телефона.",
    invalidEmail: "Введите корректный адрес эл. почты.",
    invalidServiceArea: "Пожалуйста, выберите одну из наших зон обслуживания.",
    dateUnavailable: "Этот день недоступен. Пожалуйста, выберите другой.",
    serviceUnavailable: "Эта услуга недоступна для этого питомца.",
    priceChanged: "Цена этой записи изменилась. Пожалуйста, проверьте её снова.",
    slotUnavailable: "Это время недоступно. Пожалуйста, выберите другое.",
    slotTaken: "Это время только что заняли. Пожалуйста, выберите другое.",
  },
  // Admin-only — not translated (see appointment.tr.ts).
  statuses: appointmentCopy.statuses,
  result: {
    successTitle: "Заявка получена",
    successDescription: "Спасибо! Мы скоро свяжемся с вами, чтобы подтвердить запись.",
    whatsappCta: "Отправить детали в WhatsApp",
    whatsappHelper: "Откроется WhatsApp с уже заполненными деталями записи — просто нажмите отправить.",
    contactFallback: "Вы также можете связаться с нами напрямую:",
    call: "Позвонить",
    whatsapp: "WhatsApp",
    newTab: "(откроется в новой вкладке)",
    errorTitle: "Что-то пошло не так",
    errorDescription: "Не удалось отправить заявку. Попробуйте ещё раз или свяжитесь с нами напрямую.",
    rateLimited:
      "Мы получили несколько заявок с этого номера телефона за последний час. Попробуйте позже или свяжитесь с нами напрямую.",
  },
  whatsappMessage: {
    greeting: (businessName) => `Здравствуйте, ${businessName}! Я только что запросил(а) запись на вашем сайте.`,
    labels: {
      reference: "Номер",
      service: "Услуга",
      pet: "Питомец",
      date: "Дата",
      time: "Время",
      area: "Зона",
      address: "Адрес",
      name: "Имя",
      phone: "Телефон",
    },
  },
  privacy: {
    formNote: "Мы используем эти данные только для организации и подтверждения вашей записи.",
    policyLink: "Политика конфиденциальности",
    kvkkLink: "Уведомление KVKK",
    reviewNotice:
      "Отправка этой заявки не подтверждает запись — мы свяжемся с вами, чтобы подтвердить её. О том, как мы обрабатываем ваши данные:",
    sectionTitle: "Заявки на запись",
    intro: "Когда вы запрашиваете запись на этом сайте, мы просим:",
    collected: [
      "ваше имя и номер телефона, а также, при желании, адрес эл. почты",
      "адрес визита и его зону обслуживания",
      "кличку, вид, породу, размер питомца и любые добавленные примечания",
      "выбранную услугу, дату и время, а также примечания для нас",
    ],
    purpose:
      "Мы используем эти данные только для организации, подтверждения и проведения визита грумера, а также для связи с вами по этому поводу.",
    whatsapp:
      "Если вы решите отправить нам детали записи через WhatsApp, это сообщение обрабатывается WhatsApp согласно его собственным условиям.",
  },
  marketing: {
    checkboxLabel: "Хочу также получать периодические акции и предложения по SMS, WhatsApp или email.",
    helper: "Необязательно — не связано с вашей записью. Если не отметить, на запись это не повлияет.",
  },
  // Admin-only — not translated (see appointment.tr.ts).
  admin: appointmentCopy.admin,
};
