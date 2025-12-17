/**
 * rules.js — parsing and validation helpers for each rule
 */
export const RE = {
  // Basic, practical email validation (allows common addresses, enforces TLD length >=2)
  email: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, 
  // Phone: allow optional + and common separators, require at least 7 digits and max 20 chars
  phone: /^(?=(?:.*\d){7,})(\+?[0-9\s().-]{7,20})$/,
  // ISO date YYYY-MM-DD with basic month/day ranges (does not validate leap years)
  isoDate: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
  // Slash date DD/MM/YYYY with basic day/month ranges
  slashDate: /^(0?[1-9]|[12]\d|3[01])\/(0?[1-9]|1[0-2])\/\d{4}$/
};

/**
 * Parse a pipe-separated rules string into structured rule objects.
 * @param {string} ruleString
 * @returns {{name:string,arg?:string}[]}
 */
export function parseRules(ruleString) {
  if (!ruleString) return [];
  return String(ruleString).split('|').map(part => {
    const [name, val] = part.split(':');
    return { name: name.trim(), arg: val != null ? val.trim() : undefined };
  });
}

/**
 * Validate a single value against a rule.
 * Supported rules: required, email, phone, min, max, pattern, regex, date,
 * numeric, minValue, maxValue
 * @param {string|number} value
 * @param {{name:string,arg?:string}} rule
 * @returns {true|string|object} true when valid, or an error code / object
 */
export function validateValue(value, rule) {
  const v = value == null ? '' : String(value).trim();
  switch (rule.name) {
    case 'required':
      return v.length > 0 || 'required';
    case 'email':
      return (v.length === 0) || RE.email.test(v) || 'email';
    case 'phone':
      return (v.length === 0) || RE.phone.test(v) || 'phone';
    case 'min':
      return (v.length === 0) || v.length >= Number(rule.arg) || { code: 'min', arg: rule.arg };
    case 'max':
      return (v.length === 0) || v.length <= Number(rule.arg) || { code: 'max', arg: rule.arg };
    case 'pattern':
      try {
        const r = new RegExp(rule.arg);
        return (v.length === 0) || r.test(v) || 'pattern';
      } catch (e) {
        return true; // invalid pattern -> ignore
      }
    case 'regex':
      try {
        const r = new RegExp(rule.arg);
        return (v.length === 0) || r.test(v) || 'pattern';
      } catch (e) {
        return true;
      }
    case 'date':
      if (v.length === 0) return true;
      return (RE.isoDate.test(v) || RE.slashDate.test(v)) || 'date';
    case 'numeric':
      // allow integers and decimals, optional leading +/-, no thousands separators
      return (v.length === 0) || /^[-+]?\d+(?:\.\d+)?$/.test(v) || 'numeric';
    case 'minValue':
      if (v.length === 0) return true;
      try {
        return Number(v) >= Number(rule.arg) || { code: 'minValue', arg: rule.arg };
      } catch (e) {
        return true;
      }
    case 'maxValue':
      if (v.length === 0) return true;
      try {
        return Number(v) <= Number(rule.arg) || { code: 'maxValue', arg: rule.arg };
      } catch (e) {
        return true;
      }
    default:
      return true;
  }
}

export default { RE, parseRules, validateValue };
