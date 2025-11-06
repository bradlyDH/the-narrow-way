// Deno Deploy / Supabase Edge Function
// Set ESV_API_KEY in project secrets: supabase secrets set ESV_API_KEY=xxx
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

Deno.serve(async (req) => {
  try {
    const url = new URL(req.url);
    const q = url.searchParams.get('q')?.trim();
    if (!q) return new Response('Missing q', { status: 400 });

    const esvKey = Deno.env.get('ESV_API_KEY');
    if (!esvKey) return new Response('No ESV key', { status: 500 });

    const params = new URLSearchParams({
      'q': q,
      'include-passage-references': 'false',
      'include-verse-numbers': 'false',
      'include-footnotes': 'false',
      'include-headings': 'false',
      'include-short-copyright': 'false',
    });

    const esvRes = await fetch(`https://api.esv.org/v3/passage/text/?${params}`, {
      headers: { Authorization: `Token ${esvKey}` },
    });

    if (!esvRes.ok) {
      const t = await esvRes.text().catch(() => '');
      return new Response(`ESV error ${esvRes.status}: ${t}`, { status: 502 });
    }

    const data = await esvRes.json();
    return new Response(JSON.stringify({
      reference: q,
      passage: (data?.passages?.[0] || '').trim(),
    }), {
      headers: { 'content-type': 'application/json' },
      status: 200,
    });
  } catch (e) {
    return new Response(e?.message || 'Server error', { status: 500 });
  }
});
