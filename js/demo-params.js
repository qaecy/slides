/**
 * Reusable query-parameter helper for demo pages.
 *
 * Type is inferred from the default value:
 *   string  → returned as-is
 *   number  → parsed with Number()
 *   boolean → 'false' and '0' become false, everything else true
 *
 * Usage:
 *   import { demoParam } from '../../../js/demo-params.js';
 *
 *   const pageSize = demoParam('page-size', 25);      // → number
 *   const variant  = demoParam('variant',   'none');  // → string
 *   const simple   = demoParam('simple',    false);   // → boolean
 */
export function demoParam(name, defaultValue) {
  const raw = new URLSearchParams(location.search).get(name);
  if (raw == null) return defaultValue;
  if (typeof defaultValue === 'number')  return Number(raw);
  if (typeof defaultValue === 'boolean') return raw !== 'false' && raw !== '0';
  return raw;
}
