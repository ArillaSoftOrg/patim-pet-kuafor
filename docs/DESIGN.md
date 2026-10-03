# Design System

## Direction

Kulapaws için görsel yön:

- Soft
- Friendly
- Fresh
- Natural
- Playful
- Warm
- Approachable
- Local-service focused
- Pet-care oriented
- Mobile-first
- Conversion-focused

Kulapaws logosu güçlü, pembe ağırlıklı ve görsel olarak enerjiktir. Web arayüzü logoyla yarışmamalı; onu daha sakin, ferah ve sıcak bir görsel sistem içinde öne çıkarmalıdır.

Temel yaklaşım:

- Logo, markanın en güçlü ve en renkli görsel öğelerinden biri olarak kalır.
- Ana sayfa yüzeyleri cream, white ve warm neutral tonlarla ferah tutulur.
- Marka pembesi tüm arayüze yayılmaz; kontrollü primary accent olarak kullanılır.
- Soft sage, bakım/doğallık hissi için secondary renk ailesidir.
- Soft apricot, sınırlı ve sıcak decorative accent olarak kullanılır.
- Warm charcoal, ana foreground ve yüksek okunabilirlik için kullanılır.
- Tasarım eğlenceli fakat çocukça görünmemelidir.
- Klinik veteriner estetiğinden, aşırı pembe arayüzden ve genel kurumsal şablon görünümünden kaçınılmalıdır.

---

## Principles

1. Clear visual hierarchy
2. High readability
3. Consistent spacing
4. Strong CTA hierarchy
5. Limited decorative elements
6. Real pet/business imagery over generic stock
7. Mobile-first implementation
8. Accessible contrast
9. Reusable component patterns
10. Consistent radius and interaction states
11. Content-first layout
12. Low visual noise

Logo zaten yoğun bir görsel öğe olduğu için sayfa yüzeylerinde gereksiz renk, gradient, glow ve dekoratif şekiller kullanılmamalıdır.

---

## Colors

Kulapaws logosu pembe ağırlıklı olduğu için web arayüzü aynı rengi yoğun biçimde tekrar etmemelidir. Marka pembesi imza/vurgu rengi olarak korunurken ana yüzeylerde cream, white, sage ve warm neutral tonlar kullanılmalıdır.

### Color Strategy

Yaklaşık görsel dağılım:

```text
55%  cream / white
20%  warm neutral
10%  sage
10%  pink
5%   apricot / decorative accent
```

Bu oran sabit bir CSS kuralı değildir; görsel dengeyi tanımlayan tasarım prensibidir.

### Core Palette

| Token | Value | Usage |
|---|---|---|
| `background` | `#FFF9F4` | Ana sayfa arka planı, warm cream |
| `surface` | `#FFFFFF` | Cards, forms, navigation yüzeyleri |
| `foreground` | `#292526` | Ana metin, heading, yüksek kontrast |
| `primary` | `#A83E68` | Primary CTA, aktif durumlar, marka vurgusu |
| `primary-hover` | `#8E3156` | Primary hover/active |
| `primary-foreground` | `#FFFFFF` | Primary üzerindeki metin |
| `secondary` | `#DCE8D8` | Soft sage yüzey ve secondary UI |
| `secondary-foreground` | `#32452F` | Sage üzerindeki koyu metin |
| `accent` | `#F3C28E` | Soft apricot, sınırlı dekoratif vurgu |
| `accent-foreground` | `#4A3420` | Accent üzerindeki metin |
| `soft-pink` | `#F5D9E2` | Hafif marka yüzeyi, badge veya küçük alanlar |
| `muted` | `#F3ECE5` | Warm neutral yüzey |
| `muted-foreground` | `#6D625E` | İkincil metin |
| `border` | `#E6DDD7` | Border ve divider |
| `input` | `#D8CEC8` | Form alanı sınırları |
| `ring` | `#A83E68` | Focus ring |
| `success` | `#527653` | Başarı durumu |
| `warning` | `#9A6626` | Uyarı durumu |
| `destructive` | `#B74343` | Hata / destructive action |

### Brand Color Roles

**Pink**
- Markanın imza rengidir.
- Primary CTA, active navigation, selected state, focus ring, küçük badge veya icon accent için kullanılabilir.
- Büyük alanlarda sürekli kullanılmamalıdır.

**Soft Sage**
- Bakım, doğallık ve sakinlik hissini destekler.
- Secondary section yüzeyleri, bilgi kartları ve destekleyici UI alanlarında kullanılabilir.
- Primary CTA ile yarışmamalıdır.

**Warm Cream / White**
- Ana canvas'tır.
- Logonun renk yoğunluğunu dengeler.
- Ferah ve sıcak kullanıcı deneyimi oluşturur.

**Soft Apricot**
- Logodaki sıcak turuncu karakterini daha yumuşak biçimde taşır.
- Küçük ikon, badge, illustration detail veya decorative emphasis için kullanılabilir.
- Primary CTA olarak kullanılmamalıdır.

**Warm Charcoal**
- Ana metin ve heading rengidir.
- Saf siyah yerine daha sıcak bir kontrast sağlar.

### Color Rules

- Full-page güçlü pembe background kullanılmamalıdır.
- Aynı section içinde birden fazla güçlü accent rengi yarışmamalıdır.
- Body text için `foreground` veya yeterli kontrasta sahip `muted-foreground` kullanılmalıdır.
- Durum bilgisi yalnızca renkle aktarılmamalıdır.
- Soft pink, pink-on-pink düşük kontrastlı metin kombinasyonlarında kullanılmamalıdır.
- Logo renkleri UI token'larıyla birebir eşleşmek zorunda değildir; logo kendi orijinal renklerinde korunmalıdır.
- Resmî brand guide veya vektörel logo sağlanırsa marka renkleri yeniden doğrulanmalıdır.

---

## Typography

Ana font ailesi:

```text
Open Sauce One
```

Kulapaws arayüzünde tek ana font ailesi kullanılır. İkinci bir display/body font kombinasyonu oluşturulmaz; hiyerarşi `Open Sauce One` içindeki weight, size, line-height ve spacing değerleriyle sağlanır.

### Font Family

```text
font-family:
"Open Sauce One", Arial, Helvetica, sans-serif;
```

Not: Font dosyasının veya mevcut font paketinin teknik entegrasyonu P3 mimarisiyle uyumlu yapılmalıdır. Yeni dependency gerektiğinde P3 ile koordine edilmelidir.

### Font Weights

```text
400 = Regular
500 = Medium
600 = SemiBold
700 = Bold
```

### Type Roles

```text
Display       → Open Sauce One 700
H1            → Open Sauce One 700
H2            → Open Sauce One 700
H3            → Open Sauce One 600
H4            → Open Sauce One 600

Body Large    → Open Sauce One 400 / 500
Body          → Open Sauce One 400
Small         → Open Sauce One 400

Label         → Open Sauce One 500
Button        → Open Sauce One 600
Navigation    → Open Sauce One 500 / 600
```

### Suggested Scale

```text
Display:
desktop 56–64px
tablet 44–52px
mobile 36–42px

H1:
desktop 48–56px
tablet 40–46px
mobile 32–38px

H2:
desktop 36–42px
tablet 32–36px
mobile 28–32px

H3:
desktop 26–30px
mobile 24–28px

H4:
20–24px

Body Large:
18–20px

Body:
16–18px

Small:
14px

Label / Button / Navigation:
14–16px
```

### Typography Rules

- Headings sıcak, güçlü ve okunabilir görünmelidir.
- Font weight yalnızca görsel vurgu için değil, hiyerarşi için kullanılmalıdır.
- Body line-height yaklaşık `1.5–1.7` aralığında tutulmalıdır.
- Heading line-height yaklaşık `1.1–1.25` aralığında tutulmalıdır.
- Uzun paragraph genişliği yaklaşık `60–70ch` ile sınırlandırılmalıdır.
- Navigation ve Button metinleri kısa ve yüksek okunabilirlikte tutulmalıdır.
- H1/H2/H3 kullanımı semantic hierarchy'ye göre yapılmalıdır.
- Mobile'da typography ayrı ölçeklenmeli; desktop değerleri sadece mekanik olarak küçültülmemelidir.
- Aşırı letter-spacing kullanılmamalıdır.
- All-caps yalnızca kısa label/badge gibi sınırlı kullanım alanlarında değerlendirilebilir.

---

## Spacing

Tutarlı bir spacing scale kullanılmalıdır.

```text
space-1  = 4px
space-2  = 8px
space-3  = 12px
space-4  = 16px
space-5  = 24px
space-6  = 32px
space-7  = 48px
space-8  = 64px
space-9  = 80px
space-10 = 96px
```

### Usage

- Small internal gaps: `8–16px`
- Component padding: `16–24px`
- Card padding: `20–32px`
- Form field gaps: `16–24px`
- Section spacing mobile: `56–72px`
- Section spacing desktop: `80–112px`

Sebepsiz `37px`, `53px`, `71px` gibi arbitrary değerler kullanılmamalıdır.

---

## Containers

Standard container sistemi kullanılmalıdır.

```text
content-max: 1200px
wide-max: 1360px
narrow-max: 760px

mobile gutter: 20px
tablet gutter: 32px
desktop gutter: 40px
```

Kurallar:

- Her section kendi farklı max-width değerini oluşturmamalıdır.
- Metin ağırlıklı içeriklerde narrow container tercih edilmelidir.
- Hero ve güçlü görsel bölümlerde wide container kullanılabilir.
- Tüm ana sayfa hizalamaları aynı container sistemine bağlanmalıdır.

---

## Grid

Conceptual grid:

```text
Desktop: 12-column
Tablet: 8-column
Mobile: single-column dominant flow
```

Kurallar:

- CSS Grid veya Flexbox ihtiyaca göre kullanılabilir.
- Amaç her şeyi 12 kolona zorlamak değil, hizalama tutarlılığı sağlamaktır.
- Mobile'da içerik öncelikle tek kolon akmalıdır.
- Card grid davranışı içerik yoğunluğuna göre `3 → 2 → 1` olabilir.

---

## Radius

```text
radius-sm = 6px
radius-md = 10px
radius-lg = 16px
radius-xl = 24px
radius-pill = 999px
```

Kullanım:

- Inputs: `radius-md`
- Buttons: `radius-md` veya `radius-lg`
- Cards: `radius-lg`
- Büyük visual surfaces: `radius-xl`
- Tags/badges: `radius-pill`

Her elemanı aşırı yuvarlatılmış card görünümüne dönüştürmekten kaçınılmalıdır.

---

## Borders

```text
default: 1px solid border
strong: 1px solid rgba/strong semantic border
```

Kurallar:

- Borders layout ayırmak için gölge yerine tercih edilebilir.
- Dekoratif kalın border kullanımından kaçınılmalıdır.
- Focus border yerine yalnızca renk değişimi yeterli değildir; ring kullanılmalıdır.

---

## Shadows

Gölgeler düşük yoğunlukta ve işlevsel kullanılmalıdır.

```text
shadow-sm: subtle elevation
shadow-md: cards/dropdowns
shadow-lg: dialogs/mobile navigation overlays
```

Kurallar:

- Neon veya renkli glow kullanılmamalıdır.
- Her card'a shadow verilmemelidir.
- Border + whitespace yeterliyse shadow kullanılmamalıdır.

---

## Buttons

### Variants

```text
Primary
Secondary
Tertiary
Destructive
```

### Primary

- Background: `primary`
- Text: `primary-foreground`
- Hover: `primary-hover`
- Güçlü conversion CTA'larında kullanılır.

### Secondary

- Background: `secondary`
- Text: `secondary-foreground`
- Soft sage karakterinde olmalı ve Primary CTA ile yarışmamalıdır.

### Tertiary

- Text/link style
- Düşük öncelikli actions için kullanılır.

### Button Rules

- Minimum tap target: yaklaşık `44px`
- Visible focus state zorunlu
- Loading sırasında layout zıplamamalıdır
- Disabled state hem görsel hem semantic olmalıdır
- Aynı bölümde birden fazla Primary CTA kullanılmamalıdır
- Buton metni satır kırdığında tasarım bozulmamalıdır

---

## Forms

Her form field şu yapıya sahip olmalıdır:

```text
Label
Input / Textarea / Select
Helper text or Error
```

Kurallar:

- Placeholder label yerine kullanılamaz.
- Required state açık olmalıdır.
- Error mesajı alanla ilişkilendirilmelidir.
- Focus state belirgin olmalıdır.
- Disabled, loading, error ve success durumları tanımlanmalıdır.
- Mobile form alanları rahat dokunulabilir olmalıdır.
- Submission/backend davranışı P3 sorumluluğundadır; P2 görsel state'leri tanımlar.

---

## Cards

Card kullanım amacı:

- service
- product
- trust signal
- informational content
- testimonial
- FAQ grouping

Kurallar:

- Gereksiz nested card kullanılmamalıdır.
- Cards aynı radius, spacing ve border sistemini takip etmelidir.
- Tüm kartlar aynı yükseklikte olmak zorunda değildir; içerik akışı önceliklidir.
- Hover yalnızca gerçekten interactive card'larda kullanılmalıdır.
- Dekorasyon için boş card oluşturulmamalıdır.

---

## Navigation

Navigation onaylanmış sitemap'i yansıtmalıdır.

### Desktop

- Logo solda
- Primary navigation açık ve kısa
- Primary CTA sağda
- Dropdown yalnızca gerekli ise kullanılmalı

### Mobile

- Açık menu trigger
- Geniş tap targets
- Menu open/close state
- Escape ile kapanabilen yapı
- Keyboard erişimi
- CTA görünür erişimde
- Horizontal overflow olmamalı

Navigation route hiyerarşisi P2 tarafından uydurulmamalıdır.

---

## Sections

Her section şu amaçlardan en az birine hizmet etmelidir:

- information
- trust
- navigation
- conversion
- objection handling

Önerilen section yapıları:

```text
Hero
Trust
Services
Products
Benefits
Process
Testimonials
FAQ
CTA
Footer
```

Gerçek sayfa yapısı P1 `PAGE_SPECS.md` ve `SITEMAP.md` contract'ına göre belirlenmelidir.

Section'lar sadece görsel çeşitlilik sağlamak amacıyla eklenmemelidir.

---

## Icons

- Tek bir icon system kullanılmalıdır.
- Farklı icon kütüphaneleri karıştırılmamalıdır.
- Stroke weight ve boyutlar tutarlı olmalıdır.
- Emoji UI icon yerine kullanılmamalıdır.
- Yeni icon dependency gerekirse P3 ile koordine edilmelidir.

---

## Imagery

Öncelik:

1. Gerçek Kulapaws araç/grooming görselleri
2. Gerçek çalışan ve pet görselleri
3. Gerçek ürün görselleri
4. Gerekirse kaliteli ve doğal stock photography

Kurallar:

- Generic veterinary/clinic stock imagery kullanılmamalıdır.
- Görseller yalnızca boşluk doldurmak için eklenmemelidir.
- Aspect ratio component seviyesinde tanımlanmalıdır.
- Crop davranışı kontrollü olmalıdır.
- Alt text içerik niyetine uygun olmalıdır.
- Dekoratif görseller gerektiğinde boş alt kullanabilir.
- Logo hiçbir şekilde stretch edilmemelidir.

---

## Motion

Motion yalnızca şu amaçlarla kullanılmalıdır:

- feedback
- orientation
- hierarchy
- state transition

Kaçınılacaklar:

- parallax
- sürekli hareket
- decorative entrance animation
- ağır scroll animation
- gereksiz bouncing CTA
- autoplay visual effects

`prefers-reduced-motion` desteklenmelidir.

---

## Responsive Rules

Mobile-first uygulanmalıdır.

En az şu genişlik davranışları kontrol edilmelidir:

```text
Small mobile
Large mobile
Tablet
Laptop
Desktop
Large desktop
```

### General

- Horizontal overflow kabul edilmez.
- Uzun heading'ler test edilmelidir.
- Button group mobile'da gerektiğinde stack olabilir.
- Cards mobile'da tek kolona düşmelidir.
- Images container dışına taşmamalıdır.
- Navigation mobile için ayrı davranışa sahip olmalıdır.
- Footer mobile'da okunabilir sıralamaya dönüşmelidir.
- Form fields mobile'da tam genişlik kullanabilir.

Breakpoint değerleri mevcut project architecture/styling system ile uyumlu olmalıdır; yeni breakpoint sistemi keyfi olarak oluşturulmamalıdır.

---

## Accessibility

Accessibility implementation'ın doğal bir parçasıdır.

Zorunlu kontroller:

- Semantic HTML
- Keyboard navigation
- Visible focus
- Form labels
- Heading hierarchy
- Image alt text
- Sufficient color contrast
- Accessible tap targets
- Dialog/drawer keyboard behavior
- Reduced motion
- Error identification
- Disabled state clarity

Native HTML element mevcutken generic clickable `div` kullanılmamalıdır.

Örnek:

```html
<button>...</button>
```

tercih edilir.

---

## States

Her interactive component mümkün olduğunda şu state'leri desteklemelidir:

```text
default
hover
focus
active
disabled
loading
error
success
```

State değişimleri yalnızca renk üzerinden ifade edilmemelidir.

Örnek:

- Loading: spinner/icon + text veya aria state
- Error: icon/message + color
- Success: icon/message + color
- Disabled: opacity + disabled semantics
- Focus: görünür focus ring

---

## Forbidden Patterns

Aşağıdaki tasarım örüntülerinden marka gerektirmedikçe kaçınılmalıdır:

- Random gradients
- Glassmorphism
- Neon glow
- Background blobs
- Excessive animation
- Parallax
- Decorative floating objects
- Random card colors
- Full-page strong pink backgrounds
- Generic corporate blue visual system
- Luxury black/gold styling
- Clinical veterinary aesthetic
- Fake testimonials
- Fake business statistics
- Fake trust claims
- Emoji-based icon system
- Multiple unrelated icon libraries
- Arbitrary spacing values
- One-off typography styles
- Invisible focus states
- Placeholder-only form labels
- Desktop-only navigation behavior
- P1 content or route changes for visual convenience
- New dependencies without P3 coordination

---

## Contract Status

**Version:** v0

Bu belge Kulapaws logosu ve mevcut P2 proje kuralları temel alınarak oluşturulmuş ilk Design System contract'ıdır.

Henüz doğrulanması gereken alanlar:

- Resmî logo SVG veya yüksek çözünürlüklü logo
- Resmî brand color değerleri
- `Open Sauce One` font dosyalarının/proje entegrasyonunun teknik doğrulaması
- Gerçek işletme fotoğrafları
- P1 tarafından kesinleştirilecek page/content contracts
- P3 tarafından kesinleştirilecek teknik styling/font implementation detayları

Bu alanlar kesinleştiğinde `DESIGN.md` güncellenebilir; yaygın kullanılan token, component API veya responsive contract değişiklikleri ekibe bildirilmelidir.
