import type { LegalCopy } from "@/data/legal";

// The authoritative Turkish text of KulaPAWS's legal pages (KVKK
// Aydınlatma Metni, Gizlilik Politikası, Çerez Politikası). Written first
// and in full — legal.ts (English) and legal.ru.ts (Russian) are faithful
// informational translations of this document, not independent sources;
// in the event of any discrepancy, this Turkish text governs. See
// data/legal.ts's legalIdentity for the (currently unconfirmed) company
// identity fields this page renders.
const LAST_UPDATED = "2 Ekim 2026";

export const legalCopyTr: LegalCopy = {
  lastUpdatedLabel: "Son güncelleme",
  translationNotice: null,
  relatedDocuments: {
    heading: "İlgili belgeler",
    privacy: "Gizlilik Politikası",
    kvkk: "KVKK Aydınlatma Metni",
    cookies: "Çerez Politikası",
  },
  identityLabels: {
    heading: "Veri Sorumlusu",
    tradeName: "Ticari unvan",
    legalName: "Tescilli şirket unvanı",
    mersisNo: "MERSİS numarası",
    taxOffice: "Vergi dairesi",
    taxNumber: "Vergi numarası",
    registeredAddress: "Tescilli adres",
    contactNote: "KVKK başvuruları / veri koruma iletişimi",
    unknown: "[İşletme tarafından tamamlanacak]",
  },
  kvkk: {
    title: "KVKK Aydınlatma Metni",
    updated: LAST_UPDATED,
    showIdentity: true,
    intro:
      "Bu Aydınlatma Metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu'nun (\"Kanun\") 10. maddesi uyarınca, KulaPAWS web sitesi üzerinden randevu talebinde bulunan ilgili kişilerin kişisel verilerinin veri sorumlusu sıfatıyla KulaPAWS tarafından işlenmesi hakkında bilgilendirilmesi amacıyla hazırlanmıştır.",
    sections: [
      {
        id: "islenen-veriler",
        heading: "İşlenen Kişisel Veri Kategorileri ve Toplama Yöntemi",
        blocks: [
          {
            type: "p",
            text: "Web sitesi üzerinden randevu talebinde bulunduğunuzda, ziyareti planlayıp gerçekleştirebilmemiz için aşağıdaki kişisel verileriniz doğrudan sizden, elektronik ortamda (randevu formu) toplanır:",
          },
          {
            type: "list",
            items: [
              "Kimlik ve iletişim bilgileri: ad soyad, telefon numarası ve (paylaşmanız hâlinde) e-posta adresi.",
              "Konum bilgisi: hizmetin verileceği hizmet bölgesi, açık adres ve adrese ilişkin ek bilgiler (bina, kat, daire vb.).",
              "Randevu ve işlem bilgisi: seçilen hizmet, tarih ve saat, fiyat bilgisi ve randevuya ilişkin eklediğiniz notlar.",
              "Evcil hayvana ilişkin bilgiler: adı, türü, cinsi, büyüklüğü ve bakıma ilişkin notlar. Bu bilgiler tek başına herhangi bir gerçek kişiyi belirli veya belirlenebilir kılmadığından 6698 sayılı Kanun kapsamında \"kişisel veri\" niteliği taşımaz; şeffaflık amacıyla burada belirtilmektedir.",
            ],
          },
          {
            type: "p",
            text: "Randevu talebinde bulunmadan web sitesini yalnızca ziyaret eden kullanıcılardan, tarayıcıya kaydedilen dil tercihi dışında herhangi bir kişisel veri toplanmamaktadır; ayrıntılar için Çerez Politikası'na bakınız.",
          },
        ],
      },
      {
        id: "amac",
        heading: "Kişisel Verilerin İşlenme Amaçları",
        blocks: [
          {
            type: "p",
            text: "Toplanan kişisel verileriniz; randevu talebinizin değerlendirilmesi, planlanması ve sizinle teyit edilmesi, mobil bakım hizmetinin ifa edilmesi, hizmetin ifası kapsamında sizinle iletişime geçilmesi, aynı zaman aralığı için mükerrer randevu oluşmasının ve randevu sisteminin kötüye kullanılmasının (örneğin aynı telefon numarasından kısa süre içinde olağan dışı sayıda talep gelmesi) önlenmesi ile yürürlükteki mevzuattan kaynaklanan kayıt tutma yükümlülüklerinin yerine getirilmesi amaçlarıyla işlenir.",
          },
          {
            type: "p",
            text: "Kişisel verileriniz pazarlama, profilleme veya reklam amacıyla işlenmemektedir. Bu amaçlarla herhangi bir işleme faaliyeti yürütülmediğinden, randevu formu üzerinden bu yönde ayrıca bir onay talep edilmemektedir. KulaPAWS ileride kampanya, indirim veya tanıtım amaçlı ticari elektronik ileti göndermeye başlarsa, bu yalnızca randevu sürecinden tamamen ayrı, isteğe bağlı ve önceden işaretlenmemiş bir seçenekle açıkça verilmiş bir onaya dayanacak; bu onay hiçbir şekilde randevu talebinde bulunmak için şart olmayacak ve dilediğiniz zaman geri çekilebilecektir.",
          },
        ],
      },
      {
        id: "hukuki-sebep",
        heading: "Kişisel Verilerin İşlenmesinin Hukuki Sebebi",
        blocks: [
          {
            type: "p",
            text: "Kişisel verileriniz, 6698 sayılı Kanun'un 5. maddesinin ikinci fıkrasında yer alan aşağıdaki hukuki sebeplere dayanılarak işlenmektedir:",
          },
          {
            type: "list",
            items: [
              "bir sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili olması (talep ettiğiniz randevunun planlanması ve hizmetin ifası),",
              "veri sorumlusunun hukuki yükümlülüklerini yerine getirebilmesi için zorunlu olması (yürürlükteki mevzuattan kaynaklanan kayıt ve belge düzenleme yükümlülükleri),",
              "ilgili kişinin temel hak ve özgürlüklerine zarar vermemek kaydıyla, veri sorumlusunun meşru menfaati için veri işlenmesinin zorunlu olması (mükerrer randevu oluşmasının ve sistemin kötüye kullanılmasının önlenmesi).",
            ],
          },
          {
            type: "p",
            text: "Yukarıdaki hukuki sebepler kişisel verilerinizin işlenmesi için tek başına yeterli olduğundan, randevu formu üzerinden ayrıca açık rızanız talep edilmemektedir.",
          },
        ],
      },
      {
        id: "aktarim",
        heading: "Kişisel Verilerin Aktarılması",
        blocks: [
          {
            type: "p",
            text: "Kişisel verileriniz, hizmetin ifası için gerekli olduğu ölçüde ve yalnızca aşağıdaki alıcı gruplarına aktarılabilir:",
          },
          {
            type: "list",
            items: [
              "Web sitesinin teknik altyapısını (veritabanı, kimlik doğrulama ve dosya depolama) sağlayan hizmet sağlayıcı — hâlihazırda Supabase — veri işleyen sıfatıyla; web sitesinin barındırma/altyapı sağlayıcısına ilişkin bilgi Gizlilik Politikası'nın \"Altyapı ve Güvenlik\" bölümünde belirtilmektedir.",
              "Randevu sonrası sizinle iletişime geçmek amacıyla, yalnızca sizin tercihiniz ve girişiminizle kullanılan WhatsApp uygulaması üzerinden gönderdiğiniz mesajlar; bu mesajlar WhatsApp LLC/Meta tarafından kendi gizlilik şart ve politikaları çerçevesinde işlenir ve KulaPAWS'ın kontrolü dışındadır.",
              "Yetkili kamu kurum ve kuruluşları, yalnızca yasal bir talep veya yükümlülüğün bulunması hâlinde.",
            ],
          },
          {
            type: "p",
            text: "Kişisel verileriniz hiçbir şekilde pazarlama amacıyla üçüncü kişilerle paylaşılmaz veya satılmaz.",
          },
        ],
      },
      {
        id: "saklama",
        heading: "Kişisel Verilerin Saklanması",
        blocks: [
          {
            type: "p",
            text: "Kişisel verileriniz, işlenme amaçlarının gerektirdiği süre boyunca ve ilgili mevzuatta öngörülmesi hâlinde buradaki azami sürelerle sınırlı olarak saklanır; bu süre sona erdiğinde veya işlenmesini gerektiren sebepler ortadan kalktığında silinir, yok edilir veya anonim hâle getirilir. Saklama sürelerine ilişkin ayrıntılı işletme politikası netleştiğinde bu bölüm güncellenecektir. [TODO: saklama süresi işletme tarafından teyit edilecektir]",
          },
        ],
      },
      {
        id: "haklar",
        heading: "6698 Sayılı Kanun'un 11. Maddesi Kapsamındaki Haklarınız",
        blocks: [
          { type: "p", text: "Kişisel veri sahibi olarak aşağıdaki haklara sahipsiniz:" },
          {
            type: "list",
            items: [
              "kişisel verinizin işlenip işlenmediğini öğrenme,",
              "kişisel veriniz işlenmişse buna ilişkin bilgi talep etme,",
              "kişisel verinizin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme,",
              "yurt içinde veya yurt dışında kişisel verilerin aktarıldığı üçüncü kişileri bilme,",
              "kişisel verilerin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme,",
              "Kanun'un 7. maddesinde öngörülen şartlar çerçevesinde kişisel verilerin silinmesini veya yok edilmesini isteme,",
              "düzeltme, silme veya yok etme işlemlerinin, kişisel verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme,",
              "işlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme,",
              "kişisel verilerin kanuna aykırı olarak işlenmesi sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme.",
            ],
          },
        ],
      },
      {
        id: "basvuru",
        heading: "Başvuru Yöntemi",
        blocks: [
          {
            type: "p",
            text: "Yukarıdaki haklarınızı kullanmak için, kimliğinizi tevsik edici bilgi ve belgelerle birlikte talebinizi, Veri Sorumlusuna Başvuru Usul ve Esasları Hakkında Tebliğ'de belirtilen yöntemlerle KulaPAWS'a iletebilirsiniz. Güncel başvuru iletişim bilgisi yukarıdaki \"Veri Sorumlusu\" bölümünde yer almaktadır. Talebiniz, niteliğine göre en kısa sürede ve en geç otuz gün içinde ücretsiz olarak sonuçlandırılır.",
          },
        ],
      },
    ],
  },
  privacy: {
    title: "Gizlilik Politikası",
    updated: LAST_UPDATED,
    showIdentity: true,
    intro:
      "Bu Gizlilik Politikası, KulaPAWS web sitesinin işleyişi sırasında hangi bilgilerin toplandığını, bu bilgilerin nasıl kullanıldığını ve korunduğunu ve hangi dış hizmetlerin devrede olduğunu açıklar. Kişisel verilerin işlenmesine ilişkin resmi yasal bilgilendirme için KVKK Aydınlatma Metni'ne bakınız.",
    sections: [
      {
        id: "kapsam",
        heading: "Kapsam",
        blocks: [
          {
            type: "p",
            text: "Bu politika, genel KulaPAWS web sitesini ve randevu talep akışını kapsar. Yönetim panelinin yetkili personel tarafından dahili kullanımı, bu kapsamın dışındadır ve personelin işletmeyle olan çalışma ilişkisi çerçevesinde ayrıca düzenlenir.",
          },
        ],
      },
      {
        id: "topladigimiz-bilgiler",
        heading: "Topladığımız Bilgiler",
        blocks: [
          {
            type: "p",
            text: "Bir randevu talebinde bulunursanız; adınızı, telefon numaranızı, (verdiyseniz) e-posta adresinizi, hizmet adresini ve bölgesini, evcil hayvanınıza ilişkin bilgileri ve seçtiğiniz randevu ayrıntılarını topluyoruz — tam olarak KVKK Aydınlatma Metni'nde açıklandığı şekilde.",
          },
          {
            type: "p",
            text: "Siteyi yalnızca gezdiğiniz takdirde, hakkınızda saklanan tek bilgi bir dil tercihi çerezidir. İletişim sayfasındaki form şu anda bağlı değildir ve forma yazdığınız hiçbir bilgi iletilmez veya saklanmaz. Site; analitik, reklam amaçlı takip veya herhangi bir çevrimiçi ödeme hizmeti kullanmamaktadır — bunların hiçbiri şu anda bu web sitesinin bir parçası değildir.",
          },
        ],
      },
      {
        id: "nasil-kullaniyoruz",
        heading: "Bilgileri Nasıl Kullanıyoruz",
        blocks: [
          {
            type: "p",
            text: "Randevu bilgileriniz, KVKK Aydınlatma Metni'nde belirtildiği şekilde yalnızca talep ettiğiniz ziyaretin değerlendirilmesi, teyit edilmesi, gerçekleştirilmesi ve bu kapsamda sizinle iletişime geçilmesi amacıyla kullanılır. Reklam veya profilleme amacıyla kullanılmaz.",
          },
        ],
      },
      {
        id: "hizmet-ve-pazarlama-iletisimleri",
        heading: "Hizmet Bildirimleri ve Pazarlama İletişimleri",
        blocks: [
          {
            type: "p",
            text: "KulaPAWS'tan alacağınız iletişimler iki ayrı kategoridedir. Randevu talebinizin alındığına, onaylandığına, yaklaştığına, yeniden planlandığına veya iptal edildiğine ilişkin bildirimler hizmet iletişimidir; bunlar randevunuzun bir parçasıdır ve hiçbir zaman pazarlama onayı gerektirmez. Kampanya, indirim veya tanıtım içerikli pazarlama iletişimleri ise tamamen ayrı bir kategoridir ve yalnızca ayrıca, isteğe bağlı olarak ve açıkça verdiğiniz bir onaya dayanarak gönderilir; bu onay hiçbir şekilde randevu almak için şart değildir.",
          },
          {
            type: "p",
            text: "Bu sayfanın yayımlandığı tarih itibarıyla KulaPAWS herhangi bir pazarlama iletisi göndermemekte ve pazarlama onayı toplamamaktadır. Bu özellik ileride etkinleştirilirse, onay randevu sürecinden tamamen bağımsız olarak, önceden işaretlenmemiş bir seçenekle istenecek ve dilediğiniz zaman geri çekilebilecektir.",
          },
        ],
      },
      {
        id: "altyapi-guvenlik",
        heading: "Altyapı ve Güvenlik",
        blocks: [
          {
            type: "p",
            text: "Web sitesinin veritabanı, kimlik doğrulama ve dosya depolama altyapısı Supabase tarafından sağlanmaktadır. Randevu verileri, veritabanı düzeyinde erişim kurallarıyla (Row Level Security) korunur: anonim ziyaretçilerin randevu kayıtlarına hiçbir şekilde erişimi yoktur — randevu akışının herkese açık olarak okuyabildiği tek bilgi, kişisel veri içermeyen, hangi saatlerin dolu olduğu bilgisidir. Randevu kayıtları yalnızca kimlik doğrulamasından geçmiş ve ayrıca yetkilendirilmiş yönetici hesapları tarafından görüntülenebilir veya güncellenebilir. Randevu gönderimleri sunucu tarafında yeniden doğrulanır ve kötüye kullanımı önlemek üzere hız sınırlamasına tabidir (aynı telefon numarasından saatte en fazla üç talep). [TODO: web sitesinin barındırma/CDN sağlayıcısı teyit edilecektir]",
          },
        ],
      },
      {
        id: "cerezler",
        heading: "Çerezler ve Yerel Depolama",
        blocks: [
          {
            type: "p",
            text: "Web sitesi, az sayıda kesinlikle gerekli çerez ve herkese açık içeriğin önbelleğe alınması için bir tarayıcı yerel depolama (localStorage) mekanizması kullanır. Tam liste ve kullanım amaçları için Çerez Politikası'na bakınız.",
          },
        ],
      },
      {
        id: "ucuncu-taraf",
        heading: "Üçüncü Taraf Hizmetler",
        blocks: [
          {
            type: "list",
            items: [
              "Supabase — veritabanı, kimlik doğrulama ve dosya depolama altyapısı (veri işleyen).",
              "WhatsApp — yalnızca önceden doldurulmuş WhatsApp bağlantısını açmayı tercih etmeniz hâlinde kullanılır; WhatsApp'ın kendi şartlarına tabidir.",
              "Instagram — KulaPAWS'ın herkese açık profiline verilen bir sosyal medya bağlantısıdır; ziyaret edilmesi Instagram'ın kendi şartlarına tabidir.",
            ],
          },
          {
            type: "p",
            text: "Bu web sitesinde yukarıda sayılanların dışında herhangi bir reklam ağı, analitik sağlayıcı veya pazarlama platformu kullanılmamaktadır.",
          },
        ],
      },
      {
        id: "cocuklarin-gizliligi",
        heading: "Çocukların Gizliliği",
        blocks: [
          {
            type: "p",
            text: "Bu web sitesi, bakım randevusu almak isteyen yetişkin evcil hayvan sahiplerine yöneliktir ve çocukların kullanımı için tasarlanmamıştır.",
          },
        ],
      },
      {
        id: "haklariniz",
        heading: "Haklarınız",
        blocks: [
          {
            type: "p",
            text: "Kişisel verilerinize ilişkin haklarınız ve bu hakları nasıl kullanabileceğiniz, KVKK Aydınlatma Metni'nde ayrıntılı olarak açıklanmaktadır.",
          },
        ],
      },
      {
        id: "degisiklikler",
        heading: "Politikada Değişiklikler",
        blocks: [
          {
            type: "p",
            text: "Bu politika, web sitesi veya işletme uygulamalarındaki değişikliklere bağlı olarak güncellenebilir. Bu sayfanın başındaki tarih, yürürlükte olan güncel sürümü gösterir.",
          },
        ],
      },
    ],
  },
  cookies: {
    title: "Çerez Politikası",
    updated: LAST_UPDATED,
    showIdentity: false,
    intro:
      "Bu Çerez Politikası, KulaPAWS web sitesinin hangi çerezleri ve benzer tarayıcı depolama teknolojilerini (localStorage) hangi amaçla kullandığını açıklar.",
    sections: [
      {
        id: "kullandigimiz-cerezler",
        heading: "Kullandığımız Çerez ve Depolama Türleri",
        blocks: [
          {
            type: "list",
            items: [
              "kulapaws_locale — kesinlikle gerekli/işlevsel çerez. Seçtiğiniz görüntüleme dilini (Türkçe/İngilizce/Rusça) hatırlar. KulaPAWS tarafından ayarlanır. Süre: 1 yıl.",
              "Supabase oturum çerezleri (sb-*) — kesinlikle gerekli çerez. Yalnızca yetkili bir personel /admin yönetim paneline giriş yaptığında oluşturulur. Sıradan ziyaretçilerin tarayıcısında bu çerez bulunmaz.",
              "localStorage (tarayıcı yerel deposu) — kesinlikle gerekli/işlevsel. Hizmetler, ürünler, SSS ve işletme iletişim bilgileri gibi herkese açık ve kişisel olmayan içeriklerin hızlı ve kesintisiz gösterimi için önbelleğe alınır. Ziyaretçiyi tanımlamaz veya izlemez.",
            ],
          },
        ],
      },
      {
        id: "kullanmadiklarimiz",
        heading: "Kullanmadığımız Çerez Türleri",
        blocks: [
          {
            type: "p",
            text: "Bu web sitesi şu anda analitik çerezleri, reklam veya yeniden pazarlama (retargeting) çerezlerini ya da sosyal medya takip pikseli kullanmamaktadır. Bu tür bir teknoloji ileride eklenirse, kullanıma başlamadan önce KVKK'nın çerez rehberine uygun bir onay mekanizması kurulacak ve bu politika önceden güncellenecektir.",
          },
        ],
      },
      {
        id: "onay-gerekliligi",
        heading: "Çerez Onay Bandı Neden Yok",
        blocks: [
          {
            type: "p",
            text: "Kişisel Verileri Koruma Kurumu'nun (KVKK) çerezlere ilişkin rehberine göre, kesinlikle gerekli çerezler için önceden onay alınması gerekmemektedir. Bu web sitesinde kullanılan her çerez ve depolama öğesi bu kategoriye girdiğinden, sitede bir çerez onay bandı gösterilmemektedir. İleride zorunlu olmayan bir çerez eklenmesi hâlinde, kullanımdan önce açık ve bilgilendirilmiş onayınız alınacak ve tercihinizi sonradan değiştirebilmeniz sağlanacaktır; bugün böyle bir çerez bulunmadığından bu mekanizmaya henüz ihtiyaç yoktur.",
          },
        ],
      },
      {
        id: "tarayici-ayarlari",
        heading: "Tarayıcı Ayarları",
        blocks: [
          {
            type: "p",
            text: "Çerezleri tarayıcı ayarlarınızdan istediğiniz zaman silebilir veya engelleyebilirsiniz. Dil tercihi çerezini engellemeniz, bir sonraki ziyaretinizde sitenin varsayılan dilde gösterilmesinden başka bir etki yaratmaz; sitenin diğer işlevlerini etkilemez.",
          },
        ],
      },
    ],
  },
};
