// src/services/emailService.js
import { supabase } from '../supabase';

// Fail fast if the function is slow or hanging
const REQUEST_TIMEOUT_MS = 10000;

/**
 * Send an email via the Supabase Edge Function "email".
 * Requires your Edge Function to have verify_jwt=true and your app to have an auth session.
 *
 * @param {Object} params
 * @param {string} params.to      - recipient email
 * @param {string} params.subject - subject line
 * @param {string} [params.html]  - HTML body (optional)
 * @param {string} [params.text]  - Plain text body (optional)
 */
export async function sendEmail({ to, subject, html, text }) {
  // --- Basic validation ---
  if (!to || typeof to !== 'string') {
    throw new Error('sendEmail: "to" is required (string).');
  }
  if (!subject || typeof subject !== 'string') {
    throw new Error('sendEmail: "subject" is required (string).');
  }
  if (!html && !text) {
    throw new Error('sendEmail: provide at least one of "html" or "text".');
  }

  // --- Ensure there is an auth session so verify_jwt passes in production ---
  // (Your bootstrap already signs in anonymously; this gives a friendly error if it isn’t present.)
  const { data: sessData, error: sessErr } = await supabase.auth.getSession();
  if (sessErr) {
    throw new Error(
      `Auth session error: ${sessErr.message || String(sessErr)}`
    );
  }
  if (!sessData?.session) {
    throw new Error(
      'No auth session. Ensure you create/restore a Supabase session before sending emails.'
    );
  }

  // --- Timeout protection ---
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), REQUEST_TIMEOUT_MS);

  try {
    const { data, error } = await supabase.functions.invoke('email', {
      body: { to, subject, html, text },
      signal: ac.signal,
    });

    // Errors from the Functions client (network, 4xx/5xx with JSON body, etc.)
    if (error) {
      // surface server message if present
      const details =
        (error?.context && (await safeReadBody(error.context))) ||
        error.message ||
        'Unknown error';
      throw new Error(`Email function error: ${details}`);
    }

    // Our function wraps result as { ok: boolean, error?: string, out?: any }
    if (!data?.ok) {
      throw new Error(data?.error || 'Email send failed');
    }

    return data; // { ok: true, out: {...} }
  } catch (e) {
    // Standardize abort/cancellation error text for easier debugging
    if (e?.name === 'AbortError') {
      throw new Error(`Email request timed out after ${REQUEST_TIMEOUT_MS}ms`);
    }
    throw e;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Convenience helper to sanity-check the pipeline quickly.
 */
export async function sendTestEmail(to) {
  return sendEmail({
    to,
    subject: 'Test email from The Narrow Way',
    text: 'If you can read this, your email pipeline is working ✅',
  });
}

/* ---------- helpers ---------- */
/**
 * Try to extract a useful message from a Functions error context body.
 * Works around differences across environments.
 */
async function safeReadBody(ctx) {
  try {
    // Expo/React Native fetch polyfills expose a Blob-like structure
    if (typeof ctx?.text === 'function') {
      const t = await ctx.text();
      return t;
    }
    // Some contexts put a JSON string in ctx
    if (typeof ctx === 'string') return ctx;
    // Try to stringify anything else
    return JSON.stringify(ctx);
  } catch {
    return null;
  }
}
