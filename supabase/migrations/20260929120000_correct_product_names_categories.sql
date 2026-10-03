-- Corrects public.products.name/category/short_description/description for
-- the 15 live rows against the real Petimix source catalog
-- (https://petimix.com/tum-urunler?o=3, cross-checked against
-- https://petimix.com/products.xml for each item's exact product page), AND
-- against the actual photographed retail packaging already used as each
-- product's own image (public.images, via image_id) — the package is the
-- more authoritative source where the two disagree, since it's a photo of
-- the literal item we sell, not just a same-named catalog listing.
--
-- Also replaces the single placeholder category ("Doğal Atıştırmalıklar",
-- the same value on every row today) with the two product-type categories
-- the source actually distinguishes: "Çiğneme Kemikleri" (chew bones) and
-- "Ödül Maması" (soft treats/cubes/freeze-dry). No dog/cat category is
-- introduced: most packages read "Köpek Ödül Maması" (dog only), but three
-- — dondurulmus-ve-kurutulmus-hamsi, odul-mamasi-tavuk-gogsu,
-- odul-mamasi-tavuk-yurek — are printed "Kedi ve Köpek Ödül Maması" (cat
-- AND dog); with a 12/3 split and no per-row species column to hold it,
-- adding a species facet is left as a follow-up rather than forced in here.
--
-- ---------------------------------------------------------------- names
--
-- Renamed (confirmed by the packaging photo itself, not just the website):
--   dana-cigeri-kupleri            "Dana Ciğeri Küpleri"        -> "Dana Ciğer Küpleri"
--     (package: "Dana Ciğer Küpleri / Ödül Maması 2x2cm")
--   dana-derisi-cigneme-kemigi     "Dana Derisi Çiğneme Kemiği" -> "Dana Kafa Derisi Çiğneme Kemikleri"
--     (package: "Beef Headskin / Chewing Bones"; composition "100% Dried
--     Beef Headskin")
--   dondurulmus-ve-kurutulmus-hamsi "Dondurulmuş ve Kurutulmuş Hamsi" -> "Freeze Dry Hamsi"
--     (package: "FREEZE DRY HAMSI / Kedi ve Köpek Ödül Maması")
--   fistik-ezmeli-dana-cigeri      "Fıstık Ezmeli Dana Ciğeri"  -> "Fıstık Ezmeli Dana Ciğer Küpleri"
--     (package: "Fıstık Ezmeli Dana Ciğer Küpleri / Köpek Ödül Maması")
--   kuzu-derisi-cigneme-kemigi     "Kuzu Derisi Çiğneme Kemiği" -> "Burgu Kuzu Derisi Çiğneme Kemikleri"
--     (resolved — see "kuzu-derisi" note below)
--   odul-mamasi-dana-yurek         "Ödül Maması Dana Yürek"     -> "Freeze Dry Dana Yürek Ödül Maması"
--     (package: "FREEZE DRIED SERIES / Köpek Ödül Maması / Dana Yürek 40g")
--   odul-mamasi-tavuk-gogsu        "Ödül Maması Tavuk Göğsü"    -> "Freeze Dry Tavuk Göğüs Ödül Maması"
--     (package: "FREEZE DRIED SERIES / Kedi ve Köpek Ödül Maması / Tavuk Göğüs 40g")
--   odul-mamasi-tavuk-yurek        "Ödül Maması Tavuk Yürek"    -> "Freeze Dry Tavuk Yürek Ödül Maması"
--     (package: "FREEZE DRIED SERIES / Kedi ve Köpek Ödül Maması / Tavuk Yürek 40g")
--
-- Left unchanged — an earlier pass (dated the same day, superseded by this
-- version) proposed renaming these four from the *website's* product
-- titles, but each one's own packaging photo prints the ORIGINAL database
-- name verbatim, so the website title was the wrong source to follow here
-- and the original name stands corrected-as-is:
--   inek-memesi-cigneme-kemikleri  "İnek Memesi Çiğneme Kemikleri" (package: exactly this, no "Meme Çubuk" prefix)
--   kuzu-kulak                     "Kuzu Kulak" (package: exactly "Kuzu Kulak", no "Kemikleri"/plural)
--   mini-dana-ciger-kupleri        "Mini Dana Ciğer Küpleri" (package: "Dana" is on the label; dropping it was wrong)
--   sigirbasi-kulak                "Sığırbaşı Kulak" (package: "Sığırbaşı Kulak" IS the printed Turkish name,
--                                   with "Beef Ears" as its English line — "Sığırbaşı" is real, not a placeholder)
--
-- dana-kamis-cigneme-kemikleri: name left unchanged — already matches the
-- source exactly, doubly confirmed by its package ("Bully Sticks", the
-- English trade term for what Turkish calls "kamış").
--
-- ---------------------------------------------------------- kuzu-derisi
--
-- kuzu-derisi-cigneme-kemigi was left unresolved in the prior pass: Petimix
-- sells both a twisted ("Burgu Kuzu Derisi") and a braided ("Örgü Kuzu
-- Deri") lamb-skin chew, and the two could not be told apart from the
-- website alone. Resolved now by looking at the product's own packaging
-- photo (public.images via its image_id) instead of the website: the bag
-- is printed "PETİMİX Burgu Çiğneme Kemikleri / Kuzu Derisi", and the
-- sticks visible through the window are visibly twisted (spiraled), not
-- braided. This is the packaging of the literal item we sell, so it is
-- treated as reliable — renamed to "Burgu Kuzu Derisi Çiğneme Kemikleri",
-- matching the existing "Burgu Dana Derisi Çiğneme Kemikleri" naming
-- pattern already used for its beef counterpart.
--
-- -------------------------------------------------------- dana-girtlak
--
-- New open question found while re-checking against packaging:
-- dana-girtlak-cigneme-kemigi's own package is printed "Beef Ariyoş /
-- Chewing Bones" — not "Gırtlak" anywhere on it, and "Ariyoş" does not
-- match any URL in Petimix's current sitemap (https://petimix.com/
-- products.xml) either, unlike every other product here. The website's
-- dana-girtlak-100g-cigneme-kemikleri page is a strong independent match
-- for the slug (title "Dana Gırtlak Çiğneme Kemikleri", description "beef
-- throat pieces up to 15cm, cartilage rich in glucosamine"), but since the
-- literal package for this specific product does not confirm "Gırtlak" at
-- all, this migration does NOT rename it (neither to "Dana Gırtlak
-- Çiğneme Kemikleri" nor to anything containing "Ariyoş" — the latter
-- isn't a confirmed catalog term either). Name is left exactly as-is;
-- only its category is corrected. Flagging for a human check: it's
-- possible "Beef Ariyoş" is simply this packaging template's own trade
-- name for the same cut Petimix's website calls "Dana Gırtlak" — but that
-- is a guess, not a finding.
--
-- ---------------------------------------------------- descriptions
--
-- short_description and description are identical one-sentence strings on
-- every row today (a pre-existing convention, not changed here). Updated
-- only where the corrected name changes what the sentence should say
-- (material/cut/shape/method), kept to one concise, factual sentence each,
-- and restricted to information already visible on the packaging or
-- implied by the corrected name — no ingredients, nutrition figures,
-- benefits, weights, prices or stock claims are added, even though real
-- nutrition panels ARE visible on the packaging photos, because that is
-- out of scope for this pass. Species (cat + dog vs dog-only) is
-- mentioned only for the three packages that print it explicitly.
-- Left unchanged: dana-derisi-burgu-cigneme-kemikleri, dana-girtlak-
-- cigneme-kemigi, dana-kamis-cigneme-kemikleri, inek-memesi-cigneme-
-- kemikleri — their existing sentences already match the (unchanged or
-- confirmed) name.
--
-- ---------------------------------------------------------------------
--
-- NOT executed as part of this task — this repo's anon key cannot write to
-- public.products (UPDATE is admin-gated via public.is_admin(), see
-- 20260923120000_products_schema.sql's products_admin_update policy), and
-- no live data should be changed without review. Apply via the Supabase
-- SQL Editor once reviewed, OR make the same edits by hand through
-- /admin/products — see the accompanying task report.

begin;

update public.products set
  name = 'Dana Ciğer Küpleri',
  category = 'Ödül Maması',
  short_description = 'Dana ciğerinden hazırlanmış, küp şeklinde bir ödül maması.',
  description = 'Dana ciğerinden hazırlanmış, küp şeklinde bir ödül maması.'
  where slug = 'dana-cigeri-kupleri';

update public.products set
  category = 'Çiğneme Kemikleri'
  where slug = 'dana-derisi-burgu-cigneme-kemikleri';

update public.products set
  name = 'Dana Kafa Derisi Çiğneme Kemikleri',
  category = 'Çiğneme Kemikleri',
  short_description = 'Dana kafa derisinden hazırlanmış bir çiğneme kemiği.',
  description = 'Dana kafa derisinden hazırlanmış bir çiğneme kemiği.'
  where slug = 'dana-derisi-cigneme-kemigi';

update public.products set
  category = 'Çiğneme Kemikleri'
  where slug = 'dana-girtlak-cigneme-kemigi';

update public.products set
  category = 'Çiğneme Kemikleri'
  where slug = 'dana-kamis-cigneme-kemikleri';

update public.products set
  name = 'Freeze Dry Hamsi',
  category = 'Ödül Maması',
  short_description = 'Freeze dry yöntemiyle hazırlanmış, kedi ve köpekler için hamsi ödül maması.',
  description = 'Freeze dry yöntemiyle hazırlanmış, kedi ve köpekler için hamsi ödül maması.'
  where slug = 'dondurulmus-ve-kurutulmus-hamsi';

update public.products set
  name = 'Fıstık Ezmeli Dana Ciğer Küpleri',
  category = 'Ödül Maması',
  short_description = 'Fıstık ezmesiyle hazırlanmış, küp şeklinde dana ciğeri ödül maması.',
  description = 'Fıstık ezmesiyle hazırlanmış, küp şeklinde dana ciğeri ödül maması.'
  where slug = 'fistik-ezmeli-dana-cigeri';

update public.products set
  category = 'Çiğneme Kemikleri'
  where slug = 'inek-memesi-cigneme-kemikleri';

update public.products set
  name = 'Burgu Kuzu Derisi Çiğneme Kemikleri',
  category = 'Çiğneme Kemikleri',
  short_description = 'Kuzu derisinden burgu şeklinde hazırlanmış çiğneme kemikleri.',
  description = 'Kuzu derisinden burgu şeklinde hazırlanmış çiğneme kemikleri.'
  where slug = 'kuzu-derisi-cigneme-kemigi';

update public.products set
  category = 'Çiğneme Kemikleri',
  short_description = 'Kuzu kulağından hazırlanmış doğal bir çiğneme kemiği.',
  description = 'Kuzu kulağından hazırlanmış doğal bir çiğneme kemiği.'
  where slug = 'kuzu-kulak';

update public.products set
  category = 'Ödül Maması',
  short_description = 'Dana ciğerinden hazırlanmış, mini küp şeklinde bir ödül maması.',
  description = 'Dana ciğerinden hazırlanmış, mini küp şeklinde bir ödül maması.'
  where slug = 'mini-dana-ciger-kupleri';

update public.products set
  name = 'Freeze Dry Dana Yürek Ödül Maması',
  category = 'Ödül Maması',
  short_description = 'Freeze dry yöntemiyle hazırlanmış dana yüreğinden köpek ödül maması.',
  description = 'Freeze dry yöntemiyle hazırlanmış dana yüreğinden köpek ödül maması.'
  where slug = 'odul-mamasi-dana-yurek';

update public.products set
  name = 'Freeze Dry Tavuk Göğüs Ödül Maması',
  category = 'Ödül Maması',
  short_description = 'Freeze dry yöntemiyle hazırlanmış, kedi ve köpekler için tavuk göğsü ödül maması.',
  description = 'Freeze dry yöntemiyle hazırlanmış, kedi ve köpekler için tavuk göğsü ödül maması.'
  where slug = 'odul-mamasi-tavuk-gogsu';

update public.products set
  name = 'Freeze Dry Tavuk Yürek Ödül Maması',
  category = 'Ödül Maması',
  short_description = 'Freeze dry yöntemiyle hazırlanmış, kedi ve köpekler için tavuk yüreği ödül maması.',
  description = 'Freeze dry yöntemiyle hazırlanmış, kedi ve köpekler için tavuk yüreği ödül maması.'
  where slug = 'odul-mamasi-tavuk-yurek';

update public.products set
  category = 'Çiğneme Kemikleri',
  short_description = 'Sığırbaşı kulağından hazırlanmış doğal bir çiğneme kemiği.',
  description = 'Sığırbaşı kulağından hazırlanmış doğal bir çiğneme kemiği.'
  where slug = 'sigirbasi-kulak';

commit;
