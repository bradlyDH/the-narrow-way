// // supabase/functions/email/index.ts
// // deno-lint-ignore-file no-explicit-any
// import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

// // CORS
// const corsHeaders = {
//   "access-control-allow-origin": "*",
//   "access-control-allow-headers":
//     "authorization, x-client-info, apikey, content-type",
//   "access-control-allow-methods": "POST, OPTIONS",
// };

// type EmailInput = {
//   to: string;
//   subject: string;
//   html?: string;
//   text?: string;
// };

// const PROVIDER = (Deno.env.get("EMAIL_PROVIDER") || "postmark").toLowerCase();
// const EMAIL_FROM =
//   Deno.env.get("EMAIL_FROM") || "The Narrow Way <no-reply@mail.yourdomain.com>";
//   const REPLY_TO = Deno.env.get("REPLY_TO") || undefined;


// // --- Providers -------------------------------------------------------------

// async function sendViaPostmark(input: EmailInput) {
//   const token = Deno.env.get("POSTMARK_TOKEN");
//   if (!token) throw new Error("POSTMARK_TOKEN not set");

//   const res = await fetch("https://api.postmarkapp.com/email", {
//     method: "POST",
//     headers: {
//       "X-Postmark-Server-Token": token,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       From: EMAIL_FROM,
//       To: input.to,
//       Subject: input.subject,
//       HtmlBody: input.html ?? undefined,
//       TextBody: input.text ?? undefined,
//       MessageStream: "outbound",
//       ReplyTo: REPLY_TO,
//     }),
//   });

//   if (!res.ok) {
//     const err = await res.text();
//     throw new Error(`Postmark failed: ${res.status} ${err}`);
//   }
//   return await res.json();
// }

// // Minimal SES v2 HTTP API call (signed with SigV4)
// // If you prefer to keep Postmark for transactional and only switch Supabase SMTP to SES later,
// // you can skip this and keep PROVIDER=postmark.
// async function sendViaSES(input: EmailInput) {
//   const region = Deno.env.get("SES_REGION") || "us-east-1";
//   const accessKeyId = Deno.env.get("AWS_ACCESS_KEY_ID");
//   const secretAccessKey = Deno.env.get("AWS_SECRET_ACCESS_KEY");
//   if (!accessKeyId || !secretAccessKey) {
//     throw new Error("AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY not set");
//   }

//   const endpoint = `https://email.${region}.amazonaws.com/v2/email/outbound-emails`;
//   const payload = {
//     FromEmailAddress: EMAIL_FROM,
//     Destination: { ToAddresses: [input.to] },
//     ReplyToAddress: REPLY_TO ? [REPLY_TO] : undefined,
//     Content: {
//       Simple: {
//         Subject: { Data: input.subject },
//         Body: {
//           Html: input.html ? { Data: input.html } : undefined,
//           Text: input.text ? { Data: input.text } : undefined,
//         },
//       },
//     },
//   };

//   const { default: aws4 } = await import(
//     "https://deno.land/x/aws_sign_v4@v4.0.0/mod.ts"
//   );

//   const signed = await aws4.sign("POST", endpoint, {
//     headers: { "content-type": "application/json" },
//     body: JSON.stringify(payload),
//     service: "ses",
//     region,
//     accessKeyId,
//     secretAccessKey,
//   });

//   const res = await fetch(endpoint, signed);
//   if (!res.ok) {
//     const err = await res.text();
//     throw new Error(`SES failed: ${res.status} ${err}`);
//   }
//   return await res.json();
// }

// async function sendEmail(input: EmailInput) {
//   if (!input?.to || !input?.subject) {
//     throw new Error(`"to" and "subject" are required`);
//   }
//   if (PROVIDER === "ses") return sendViaSES(input);
//   return sendViaPostmark(input);
// }

// // --- HTTP handler ----------------------------------------------------------
// serve(async (req) => {
//   if (req.method === "OPTIONS") {
//     return new Response("ok", { headers: corsHeaders });
//   }

//   if (req.method !== "POST") {
//     return new Response("Method Not Allowed", {
//       status: 405,
//       headers: corsHeaders,
//     });
//   }

//   try {
//     const body: EmailInput = await req.json();
//     const out = await sendEmail(body);
//     return new Response(JSON.stringify({ ok: true, out }), {
//       status: 200,
//       headers: { ...corsHeaders, "content-type": "application/json" },
//     });
//   } catch (e: any) {
//     return new Response(
//       JSON.stringify({ ok: false, error: String(e?.message || e) }),
//       {
//         status: 500,
//         headers: { ...corsHeaders, "content-type": "application/json" },
//       }
//     );
//   }
// });


// supabase/functions/email/index.ts
// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

/**
 * CORS
 */
const corsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-headers":
    "authorization, x-client-info, apikey, content-type",
  "access-control-allow-methods": "POST, OPTIONS",
} as const;

/**
 * Request payload
 */
type EmailInput = {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  // Optional Postmark template support
  templateId?: number | string;
  templateModel?: Record<string, unknown>;
};

const PROVIDER = (Deno.env.get("EMAIL_PROVIDER") || "postmark").toLowerCase();
const EMAIL_FROM =
  Deno.env.get("EMAIL_FROM") || "The Narrow Way <no-reply@thenarrowwayapp.com>";
const REPLY_TO = Deno.env.get("REPLY_TO") || undefined;

/* ----------------------------------------------------------------------------
 * Providers
 * --------------------------------------------------------------------------*/

async function sendViaPostmark(input: EmailInput) {
  const token = Deno.env.get("POSTMARK_TOKEN");
  if (!token) throw new Error("Missing POSTMARK_TOKEN secret");
  if (!EMAIL_FROM) throw new Error("Missing EMAIL_FROM secret");

  const headers = {
    "X-Postmark-Server-Token": token,
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  // Template vs simple email
  let url = "https://api.postmarkapp.com/email";
  let body: any;

  if (input.templateId) {
    url = "https://api.postmarkapp.com/email/withTemplate";
    body = {
      From: EMAIL_FROM,
      To: input.to,
      TemplateId: Number(input.templateId),
      TemplateModel: input.templateModel || {},
      ...(REPLY_TO ? { ReplyTo: REPLY_TO } : {}),
      MessageStream: "outbound",
    };
  } else {
    if (!input.text && !input.html) {
      throw new Error(
        "Provide at least one of: text, html, or templateId for Postmark"
      );
    }
    body = {
      From: EMAIL_FROM,
      To: input.to,
      Subject: input.subject,
      HtmlBody: input.html ?? undefined,
      TextBody: input.text ?? undefined,
      ...(REPLY_TO ? { ReplyTo: REPLY_TO } : {}),
      MessageStream: "outbound",
    };
  }

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  const text = await res.text();
  let parsed: any;
  try {
    parsed = JSON.parse(text);
  } catch {
    parsed = undefined;
  }

  if (!res.ok) {
    const detail =
      typeof parsed === "object" && parsed ? JSON.stringify(parsed) : text;
    // Common Postmark 401: Request does not contain a valid Server token.
    throw new Error(`Postmark failed: ${res.status} ${detail}`);
  }

  return parsed ?? text;
}

// Minimal SES v2 HTTP API call (signed with SigV4)
async function sendViaSES(input: EmailInput) {
  const region = Deno.env.get("SES_REGION") || "us-east-1";
  const accessKeyId = Deno.env.get("AWS_ACCESS_KEY_ID");
  const secretAccessKey = Deno.env.get("AWS_SECRET_ACCESS_KEY");
  if (!accessKeyId || !secretAccessKey) {
    throw new Error("Missing AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY");
  }
  if (!EMAIL_FROM) throw new Error("Missing EMAIL_FROM secret");

  const endpoint =
    `https://email.${region}.amazonaws.com/v2/email/outbound-emails`;

  const payload: any = {
    FromEmailAddress: EMAIL_FROM,
    Destination: { ToAddresses: [input.to] },
    // NOTE: SES expects this TOP-LEVEL (not inside Destination)
    ...(REPLY_TO ? { ReplyToAddresses: [REPLY_TO] } : {}),
    Content: {
      Simple: {
        Subject: { Data: input.subject },
        Body: {
          ...(input.html ? { Html: { Data: input.html } } : {}),
          ...(input.text ? { Text: { Data: input.text } } : {}),
        },
      },
    },
  };

  const { default: aws4 } = await import(
    "https://deno.land/x/aws_sign_v4@v4.0.0/mod.ts"
  );

  const signed = await aws4.sign("POST", endpoint, {
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
    service: "ses",
    region,
    accessKeyId,
    secretAccessKey,
  });

  const res = await fetch(endpoint, signed);
  const text = await res.text();

  if (!res.ok) {
    throw new Error(`SES failed: ${res.status} ${text}`);
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function sendEmail(input: EmailInput) {
  if (!input?.to || !input?.subject) {
    throw new Error(`"to" and "subject" are required`);
  }
  if (PROVIDER === "ses") return sendViaSES(input);
  if (PROVIDER !== "postmark") {
    throw new Error(`Unsupported provider: ${PROVIDER}`);
  }
  return sendViaPostmark(input);
}

/* ----------------------------------------------------------------------------
 * HTTP handler
 * --------------------------------------------------------------------------*/
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method Not Allowed", {
      status: 405,
      headers: corsHeaders,
    });
  }

  try {
    const body: EmailInput = await req.json();

    // Basic validation up-front so 400s are clear
    if (!body?.to || !body?.subject) {
      return new Response(
        JSON.stringify({ ok: false, error: '"to" and "subject" are required' }),
        { status: 400, headers: { ...corsHeaders, "content-type": "application/json" } }
      );
    }

    const out = await sendEmail(body);

    return new Response(JSON.stringify({ ok: true, provider: PROVIDER, out }), {
      status: 200,
      headers: { ...corsHeaders, "content-type": "application/json" },
    });
  } catch (e: any) {
    // Return detailed error to help debugging 500s from the app
    return new Response(
      JSON.stringify({
        ok: false,
        error: String(e?.message || e),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "content-type": "application/json" },
      }
    );
  }
});
