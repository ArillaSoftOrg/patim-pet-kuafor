# Kulapaws Website — Project README

> Single source of truth for Claude Code before implementation.
> Read this file completely before editing the project.

## 1. Project Summary

Kulapaws is a pet-care brand focused on mobile pet grooming and related pet-care products.

The website must present the business as:

- friendly
- trustworthy
- warm
- clean
- modern
- accessible
- easy to use on mobile
- conversion-focused without feeling aggressive

The interface should feel soft and fresh rather than heavily pink, despite the logo being strongly pink.

Primary website goals:

1. Explain Kulapaws services clearly.
2. Make it easy to request/book a grooming service.
3. Present pet-care products clearly.
4. Build trust through real business information, images, process explanations and FAQs.
5. Perform well in local search.
6. Work reliably on mobile, tablet and desktop.

Do not invent business facts, testimonials, statistics, addresses, prices, service areas or claims.

---

## 2. Decision Status

### Confirmed

- Brand: Kulapaws
- Business domain: pet grooming / pet care
- Mobile-service positioning is part of the brand identity
- The business also sells pet-care products
- Primary font family: `Open Sauce One`
- Design direction: soft, friendly, fresh, natural, playful, warm
- Main canvas should be cream/white rather than pink
- Pink is a controlled brand accent, not the dominant page background
- Secondary visual family: soft sage
- Supporting accent: soft apricot

### Proposed — Validate Before Production

The following items are initial implementation proposals and may be refined when real business requirements are available:

- sitemap
- route names
- exact service taxonomy
- product structure
- form fields
- CMS requirement
- analytics provider
- email/form provider
- deployment configuration
- local SEO location pages

If project files or user instructions conflict with a proposed item, use the newer explicit instruction.

---

## 3. Brand Direction

### Personality

Kulapaws should feel:

- approachable
- caring
- competent
- energetic
- clean
- pet-friendly
- local
- practical

Avoid:

- clinical veterinary aesthetics
- luxury black/gold styling
- childish cartoon-heavy UI
- overly feminine/pink-heavy layouts
- generic corporate templates
- generic AI-generated SaaS aesthetics

### Logo

Use the official logo without:

- redrawing it
- changing its proportions
- recoloring it
- stretching it
- adding effects
- replacing it with text

Prefer an official SVG when available.
Until then, use the supplied logo asset as-is.

---

## 4. Design System

The detailed design contract lives in:

```text
docs/DESIGN.md
```

If `docs/DESIGN.md` does not exist yet, create it from this README before UI implementation.

### Core Palette

```text
background             #FFF9F4
surface                #FFFFFF
foreground             #292526

primary                #A83E68
primary-hover          #8E3156
primary-foreground     #FFFFFF

secondary              #DCE8D8
secondary-foreground   #32452F

accent                 #F3C28E
accent-foreground      #4A3420

soft-pink              #F5D9E2

muted                  #F3ECE5
muted-foreground       #6D625E

border                 #E6DDD7
input                  #D8CEC8
ring                   #A83E68

success                #527653
warning                #9A6626
destructive            #B74343
```

### Color Strategy

Approximate visual balance:

```text
55% cream / white
20% warm neutral
10% sage
10% pink
5% apricot / decorative accent
```

This is a design guideline, not a literal CSS rule.

### Typography

Primary family:

```text
Open Sauce One
```

Fallback:

```css
font-family: "Open Sauce One", Arial, Helvetica, sans-serif;
```

Recommended weights:

```text
400 Regular
500 Medium
600 SemiBold
700 Bold
```

Roles:

```text
Display       700
H1            700
H2            700
H3            600
H4            600
Body Large    400/500
Body          400
Small         400
Label         500
Button        600
Navigation    500/600
```

### UI Principles

- mobile-first
- content-first
- strong visual hierarchy
- generous but controlled whitespace
- accessible contrast
- restrained shadows
- consistent spacing
- consistent radius
- clear CTA hierarchy
- real business/pet photography preferred
- semantic HTML
- visible focus states
- no decorative complexity without purpose

### Forbidden Visual Patterns

Do not use unless explicitly requested:

- random gradients
- glassmorphism
- neon glow
- background blobs
- parallax
- excessive entrance animations
- floating decorative objects
- random card colors
- full-page strong pink backgrounds
- emoji as UI icons
- multiple unrelated icon libraries

---

## 5. Proposed Sitemap

This is the initial information architecture.

```text
/
├── services
│   ├── dog-grooming
│   ├── cat-grooming
│   └── mobile-pet-grooming
├── products
│   └── [product-slug]
├── about
├── faq
├── contact
└── privacy
```

Optional routes, only if real business requirements justify them:

```text
/service-areas
/service-areas/[location]
/blog
/blog/[slug]
/terms
```

Do not create location pages, blog pages or legal pages with fake content.

### Route Rules

- Keep URLs short and descriptive.
- Use lowercase kebab-case.
- Do not rename approved routes casually.
- Every route must have a clear purpose.
- Avoid duplicate pages targeting the same intent.
- Navigation must mirror the approved sitemap.

---

## 6. Page Specifications

### Homepage `/`

Purpose:

- explain what Kulapaws is
- establish trust quickly
- expose core services
- highlight mobile-service convenience
- introduce products
- guide users to a primary conversion

Suggested sections:

```text
Header
Hero
Trust / Value Proposition
Core Services
Why Kulapaws
How It Works
Featured Products
FAQ Preview
Final CTA
Footer
```

Primary CTA:

```text
Request Appointment / Book Grooming
```

Final CTA wording must use real business terminology once confirmed.

### Services `/services`

Purpose:

- summarize all grooming/service categories
- help users choose the right service
- link to detailed service pages

Suggested sections:

```text
Hero
Service Grid
Service Comparison / Guidance
Process
FAQ
CTA
```

### Dog Grooming `/services/dog-grooming`

Purpose:

- explain dog grooming service
- clarify process and suitability
- answer common objections/questions
- drive booking/contact action

Suggested sections:

```text
Hero
Service Overview
What Is Included
Who It Is For
Process
Preparation / Notes
FAQ
CTA
```

Do not invent exact inclusions or pricing.

### Cat Grooming `/services/cat-grooming`

Use the same structural logic as dog grooming, with real cat-specific content only.

### Mobile Pet Grooming `/services/mobile-pet-grooming`

Purpose:

- explain the mobile grooming model
- emphasize convenience
- explain how the service works
- clarify service-area limitations when real data exists

Suggested sections:

```text
Hero
How Mobile Grooming Works
Benefits
Vehicle / Process
Service Area
FAQ
CTA
```

### Products `/products`

Purpose:

- present Kulapaws products
- support discovery and purchase intent

Suggested sections:

```text
Hero
Product Grid
Product Categories
Product Benefits
FAQ / Product Guidance
CTA
```

Do not create fake products.

### Product Detail `/products/[product-slug]`

Suggested content:

```text
Product Name
Real Product Images
Short Description
Benefits
Usage
Ingredients / Materials if applicable
Warnings if applicable
Price if confirmed
Availability if confirmed
CTA
Related Products
```

### About `/about`

Purpose:

- explain the real business story
- build credibility
- show people/process/values

Suggested sections:

```text
Hero
Business Story
Mission / Approach
Team or Founder if real data exists
Mobile Service Story
Real Photos
Values
CTA
```

### FAQ `/faq`

Group real questions by category:

```text
General
Dog Grooming
Cat Grooming
Mobile Service
Appointments
Products
```

### Contact `/contact`

Suggested content:

```text
Contact Intro
Contact Form
Phone if confirmed
Email if confirmed
WhatsApp if confirmed
Service Area if confirmed
Business Hours if confirmed
Map only if a real business location is relevant
```

### Privacy `/privacy`

Use only real legal/business information.
Do not fabricate company identity or data-processing claims.

---

## 7. Content Requirements

Never use `Lorem ipsum` in production-ready pages.

Content should be:

- concise
- clear
- human
- helpful
- specific
- conversion-aware
- factual
- non-repetitive
- easy to scan

### Homepage Content Needed

Before final homepage implementation, collect:

```text
brand tagline
hero headline
hero supporting copy
primary CTA label
secondary CTA label if needed
service names
service summaries
real trust signals
mobile grooming explanation
process steps
product highlights
real FAQs
contact information
service area
real imagery
```

### Business Data Needed

Create a structured source for confirmed data only.

Suggested shape:

```ts
business = {
  name,
  phone,
  email,
  whatsapp,
  address,
  serviceAreas,
  businessHours,
  socialLinks
}
```

Unknown values should remain absent/TBD, not invented.

---

## 8. SEO Architecture

### Primary SEO Goals

- clear service intent
- strong local relevance
- crawlable architecture
- correct semantic hierarchy
- useful internal linking
- unique metadata
- structured data where valid
- no thin/duplicate pages

### Per-Page Requirements

Every indexable page should define:

```text
SEO title
meta description
canonical URL
one clear H1
logical H2/H3 structure
Open Graph metadata
internal links
image alt text
```

### Technical SEO

Implement:

```text
metadata
canonical URLs
sitemap.xml
robots.txt
Open Graph
favicon
404 page
structured data
semantic headings
breadcrumbs where useful
redirects when routes change
```

### Structured Data

Only implement schema supported by real data.

Potential types:

```text
LocalBusiness
Organization
Product
BreadcrumbList
FAQPage
```

Do not generate fake ratings, reviews, prices or availability.

### Local SEO

When real location/service-area information is available:

- use consistent business information
- describe service areas accurately
- connect contact data consistently
- avoid doorway/location spam pages
- create location pages only when they contain substantial unique value

---

## 9. Recommended Tech Stack

This is the default stack unless an existing repository defines something else.

### Core

```text
Framework: Next.js
Router: App Router
Language: TypeScript
Runtime: Node.js
Rendering: Server Components by default
Styling: Tailwind CSS
Package manager: use the repository's existing lockfile
```

### Frontend Rules

- Prefer Server Components.
- Add `"use client"` only when interaction requires it.
- Keep client bundles small.
- Use semantic HTML.
- Reuse components before creating page-specific duplicates.
- Avoid unnecessary state management libraries.
- Avoid dependencies that duplicate native/browser/framework features.

### Forms

Recommended pattern:

```text
UI form
→ schema validation
→ server action / API boundary
→ provider/backend
→ success/error UI
```

Exact provider is TBD.

Do not hardcode secrets.

### Images

Use Next.js image optimization where appropriate.

Prefer:

```text
WebP / AVIF for photos
SVG for logos/icons when official SVG exists
```

### Icons

Use one consistent icon system.
If no icon package already exists, request/confirm one before installing it.

### State Management

Default:

```text
local component state
URL state
server state
```

Do not add Redux/Zustand/etc. unless application complexity genuinely requires it.

### Database

Default:

```text
None
```

Add a database only if a real feature requires persistent structured data.

### CMS

Default:

```text
None initially
```

Consider a CMS only if the user needs non-developer editing for products, blog, service content or other frequently changing content.

---

## 10. Proposed Project Structure

Follow the existing repository structure if already established.

Recommended target:

```text
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── services/
│   ├── products/
│   ├── about/
│   ├── faq/
│   ├── contact/
│   └── privacy/
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── sections/
│   ├── forms/
│   └── product/
│
├── content/
│
├── data/
│
├── lib/
│
└── actions/

public/
├── brand/
└── images/

docs/
├── DESIGN.md
├── CONTENT.md
├── SITEMAP.md
├── SEO.md
└── ARCHITECTURE.md
```

Do not reorganize an established repository without a clear reason.

---

## 11. Component Architecture

Separate:

```text
UI primitives
Layout components
Section components
Page composition
```

### Initial UI Primitives

Create only when needed:

```text
Button
Container
Section
Heading
Card
Badge
Input
Textarea
Select
Accordion
```

### Layout Components

Potential examples:

```text
Header
MobileNavigation
Footer
PageHeader
```

### Reusable Section Components

Potential examples:

```text
Hero
ServiceGrid
BenefitsSection
ProcessSection
FAQSection
CTASection
ProductGrid
```

Avoid giant page components containing the entire page UI.

---

## 12. Component API Rules

Prefer explicit variants.

Good:

```tsx
<Button variant="primary" size="lg">
  Book Grooming
</Button>
```

Avoid:

```tsx
<Button pink rounded bold large shadow />
```

Rules:

- predictable props
- limited variants
- accessible defaults
- reusable without hidden behavior
- no unnecessary abstraction for one-time wrappers

---

## 13. Responsive Strategy

Use mobile-first implementation.

Validate at minimum:

```text
small mobile
large mobile
tablet
laptop
desktop
large desktop
```

Do not optimize only for preset devices.

### Required Responsive Checks

- navigation
- hero
- cards
- product grids
- forms
- images
- CTA groups
- long headings
- long service names
- long button labels
- footer
- modals/drawers if used
- horizontal overflow

Expected card behavior may follow:

```text
desktop: 3
tablet: 2
mobile: 1
```

Only when content supports it.

---

## 14. Accessibility Requirements

Accessibility is part of implementation, not final cleanup.

Required:

- semantic HTML
- keyboard navigation
- visible focus
- accessible labels
- correct heading hierarchy
- meaningful alt text
- sufficient contrast
- minimum practical touch target size
- reduced-motion support
- form error association
- correct button/link semantics

Never use:

```html
<div onclick="...">
```

when a native `<button>` or `<a>` is appropriate.

Interactive elements must account for:

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

---

## 15. Form UX

Every field should use:

```text
Label
Input
Helper/Error
```

Do not use placeholder text as the only label.

Required states:

```text
default
focus
disabled
loading
error
success
```

Potential contact form fields are TBD.

Do not collect unnecessary personal information.

---

## 16. Performance Requirements

Targets:

- minimal client-side JavaScript
- optimized images
- optimized font delivery
- lazy-load non-critical media
- avoid layout shifts
- avoid unnecessary third-party scripts
- keep component boundaries intentional
- use caching where appropriate
- remove unused code/dependencies

Before production, review:

```text
Core Web Vitals
bundle size
image sizes
font loading
third-party scripts
console warnings/errors
```

---

## 17. Security Requirements

Never commit:

- API keys
- tokens
- passwords
- private credentials
- production secrets

Use environment variables.

Create/update:

```text
.env.example
```

with variable names only, never real values.

For forms/API features consider:

- server-side validation
- sanitization where applicable
- spam protection
- rate limiting when needed
- safe error messages
- secure headers where appropriate

---

## 18. Analytics

Analytics provider is TBD.

Before adding analytics define meaningful events.

Possible events:

```text
primary_cta_click
contact_form_start
contact_form_submit
phone_click
whatsapp_click
product_view
product_cta_click
```

Do not track unnecessary personal data.

---

## 19. Testing and Validation

Before considering a task complete, run the relevant checks.

Typical checks:

```bash
lint
typecheck
tests
build
```

Also inspect:

```text
console errors
broken links
mobile layout
tablet layout
desktop layout
forms
navigation
overflow
404
metadata
images
accessibility
```

A task is not complete because Claude says it is complete.

---

## 20. Git Workflow

The previous P1/P2/P3 ownership model is no longer active.

There is one controlling developer, but `main` should still remain stable.

### Rule

Do not implement large tasks directly on `main`.

Use task branches:

```text
feature/project-foundation
feature/design-system
feature/homepage
feature/services
feature/products
feature/contact
feature/seo
fix/responsive
fix/accessibility
```

Typical flow:

```bash
git fetch origin
git switch main
git pull --ff-only
git switch -c feature/<task>
```

Before commit:

```bash
git status
git diff
```

Commit only task-related files.

Example:

```bash
git add <specific-files>
git commit -m "feat: implement homepage"
git push -u origin feature/homepage
```

Merge only after validation.

Avoid:

```text
force-pushing main
mixed unrelated commits
destructive resets without inspection
deleting unfamiliar code without investigation
```

---

## 21. Claude Code Operating Rules

Before every implementation task:

1. Read this README.
2. Read relevant files in `docs/`.
3. Inspect the existing codebase.
4. Check `git status`.
5. Check current branch.
6. Do not overwrite unrelated work.
7. Do not install dependencies unless the task requires them.
8. Do not invent business data.
9. Make the smallest coherent change.
10. Validate after implementation.

### Never

- rewrite the whole project for a small feature
- silently change routes
- silently change business content
- remove unfamiliar functionality without investigation
- introduce duplicate components
- create fake testimonials
- create fake reviews
- create fake statistics
- create fake prices
- create fake addresses
- create fake service areas
- create fake product data
- add dependencies for trivial UI
- disable accessibility focus styles
- use placeholder content in final production UI

---

## 22. Implementation Order

Use this sequence unless a real dependency requires otherwise.

### Phase 1 — Foundation

```text
1. Inspect repository
2. Confirm tech stack
3. Create project architecture
4. Configure Open Sauce One
5. Implement design tokens
6. Create base layout
```

### Phase 2 — Core UI

```text
7. Button
8. Container
9. Section
10. Heading
11. Card
12. Form primitives
13. Header
14. Mobile navigation
15. Footer
```

### Phase 3 — Content Architecture

In parallel with UI:

```text
16. Confirm sitemap
17. Confirm page purposes
18. Confirm primary CTA per page
19. Collect real business information
20. Prepare homepage content
21. Prepare service content
22. Prepare product data
23. Prepare about content
24. Prepare FAQs
```

### Phase 4 — Page Implementation

```text
25. Homepage
26. Services index
27. Service page template
28. Dog grooming page
29. Cat grooming page
30. Mobile grooming page
31. Products index
32. Product detail template
33. About
34. FAQ
35. Contact
36. Privacy
```

### Phase 5 — Integration

```text
37. Contact/booking submission
38. Validation
39. Email/API integration if required
40. Analytics
41. Spam/security controls
```

### Phase 6 — SEO

```text
42. Metadata
43. Canonicals
44. sitemap.xml
45. robots.txt
46. Open Graph
47. favicon
48. structured data
49. breadcrumbs if useful
50. redirects
51. 404
```

### Phase 7 — QA

```text
52. Responsive QA
53. Accessibility QA
54. Visual consistency QA
55. Content QA
56. SEO QA
57. Performance QA
58. Security QA
59. Build verification
```

### Phase 8 — Deployment

```text
60. Preview deployment
61. Environment variables
62. Production deployment
63. Domain/DNS
64. HTTPS
65. Production form tests
66. Analytics verification
67. Search Console
68. Sitemap submission
69. Indexing verification
70. Monitoring
```

---

## 23. Required Information Before Final Production

The project is not production-ready until the following are confirmed.

### Business

```text
official business name
phone
email
WhatsApp
service areas
business hours
real address if applicable
social media links
```

### Services

```text
exact service names
service descriptions
what is included
limitations
booking process
pricing policy
```

### Products

```text
real product names
descriptions
images
price
availability
variants if applicable
ingredients/materials if applicable
```

### Brand Assets

```text
official logo
official SVG if available
real business photography
pet grooming photography
vehicle photography
product photography
```

### Legal

```text
legal business identity
privacy policy requirements
cookie/analytics requirements
terms if applicable
```

---

## 24. Definition of Done

The website is complete only when all relevant categories are complete:

```text
Brand
Design System
Content
Sitemap
SEO
UI
Responsive
Accessibility
Forms
Products
Performance
Security
Analytics
QA
Deployment
Indexing
Monitoring
```

Final checks:

- brand feels coherent
- logo is preserved correctly
- Open Sauce One is implemented correctly
- colors follow the defined system
- site is not overly pink
- CTA hierarchy is obvious
- content is factual
- no fake business data exists
- all major screen sizes work
- keyboard navigation works
- focus states are visible
- no major overflow exists
- no broken links exist
- forms work
- metadata is correct
- production build passes
- deployment works
- indexing configuration is correct

---

## 25. Claude Code Start Protocol

When Claude Code first enters this repository, use this order:

```text
1. Read README.md completely.
2. Inspect repository structure.
3. Read docs/DESIGN.md if present.
4. Read all existing project documentation relevant to the task.
5. Run git status and identify the current branch.
6. Report inconsistencies between README.md and the actual repository.
7. Do not edit anything until the requested task is clear.
8. For implementation, preserve existing working code and make task-scoped changes only.
```

If this README conflicts with a newer direct user instruction, the newer direct user instruction wins.
