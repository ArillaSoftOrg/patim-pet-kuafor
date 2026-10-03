// Server Component — renders synchronously into the initial HTML, no
// client-side injection. `data` can ultimately trace back to admin-entered
// text (a service's title/description from Supabase), so this escapes
// "<", ">", and "&" rather than trusting JSON.stringify alone, which does
// not escape "</script>" and would let such content break out of the tag.
interface JsonLdProps {
  data: object;
}

export function JsonLd({ data }: JsonLdProps) {
  const json = JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
