/**
 * validator.js — FormValidator
 * Vanilla JS, no dependencies. Single-file form validation library.
 *
 * Features:
 * - data-* and JS-configurable rules
 * - required, email, phone, min/max length, pattern/regex, date
 * - realtime (input) validation (configurable)
 * - accessible inline error messages (aria-describedby / role="alert")
 * - supports multiple forms via selector or NodeList
 *
 * Usage:
 * const v = new FormValidator('#myForm', { realtime: true, lang: 'es' });
 */

import DEFAULT_MESSAGES from './messages.js';
import { RE, parseRules, validateValue } from './rules.js';
import { uid, addClass, removeClass, format } from './utils.js';
import emailjs from '@emailjs/browser';
import { uploadToCloudinary } from './services/cloudinary.service.js';


/**
 * FormValidator
 * A small, dependency-free form validation class.
 */
class FormValidator {
    /**
     * Create a FormValidator instance.
     * @param {String|Element|NodeList} selector - form selector, a form element or a NodeList
     * @param {Object} options - configuration
     * @param {Boolean} [options.realtime=false] - validate while typing
     * @param {'es'|'en'} [options.lang='en'] - language for messages
     * @param {Object} [options.rules={}] - JS rules mapping by field name or selector
     * @param {Object} [options.emailjs] - EmailJS configuration for sending emails
     * @param {string} options.emailjs.serviceId - EmailJS service ID
     * @param {string} options.emailjs.templateId - EmailJS template ID
     * @param {string} options.emailjs.publicKey - EmailJS public key
     */
    constructor(selector, options = {}) {
        this.opts = Object.assign({ realtime: false, lang: 'en', rules: {} }, options);
        this.lang = this.opts.lang in DEFAULT_MESSAGES ? this.opts.lang : 'en';
        this.messages = DEFAULT_MESSAGES[this.lang];
        this.forms = [];
        this._handlers = new WeakMap();

        // Resolve selector to forms
        const nodes = this._resolveSelector(selector);
        nodes.forEach((f) => this.attach(f));
    }

    /**
     * Attach validator to a form element.
     * @param {HTMLFormElement} form
     * @returns {void}
     */
    attach(form) {
        if (!form || form.tagName !== 'FORM') return;
        if (this.forms.indexOf(form) !== -1) return; // already attached

        const onSubmit = async (e) => {
            e.preventDefault(); // Siempre prevenir el envío por defecto
            const ok = this.validateForm(form);
            if (!ok) return;

            const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');

            // Obtener el archivo del CV
            const cvInput = form.querySelector('input[name="cv"]');
            let cvUrl = '';

            if (cvInput && cvInput.files.length > 0) {
                const file = cvInput.files[0];
                try {
                    // Subir el CV a Cloudinary y obtener la URL
                    cvUrl = await uploadToCloudinary(file);
                } catch (error) {
                    console.error('Error al subir el CV a Cloudinary:', error);
                    alert('No se pudo subir el CV. Intenta de nuevo.');
                    if (submitBtn) submitBtn.disabled = false;
                    return;
                }
            }

            // Agregar la URL del CV al formulario como un campo oculto
            let cvUrlInput = form.querySelector('input[name="cv_url"]');
            if (!cvUrlInput) {
                cvUrlInput = document.createElement('input');
                cvUrlInput.type = 'hidden';
                cvUrlInput.name = 'cv_url';
                form.appendChild(cvUrlInput);
            }
            cvUrlInput.value = cvUrl;

            // Deshabilitar el botón de enviar mientras se procesa
            if (submitBtn) submitBtn.disabled = true;

            // Enviar el formulario a EmailJS
            let emailjsOpts = this.opts.emailjs;
            if (!emailjsOpts && window.emailjsConfig) {
                emailjsOpts = window.emailjsConfig;
            }

            if (emailjsOpts) {
                const { serviceId, templateId, publicKey } = emailjsOpts;
                const recipient = document.querySelector('meta[name="recipient-email"]')?.content || '';
                if (recipient) {
                    let toEmailInput = form.querySelector('input[name="to_email"]');
                    if (!toEmailInput) {
                        toEmailInput = document.createElement('input');
                        toEmailInput.type = 'hidden';
                        toEmailInput.name = 'to_email';
                        form.appendChild(toEmailInput);
                    }
                    toEmailInput.value = recipient;
                }

                emailjs.sendForm(serviceId, templateId, form, publicKey).then(() => {
                    if (submitBtn) submitBtn.disabled = false;
                    alert('Email enviado correctamente!');
                    form.reset();
                }).catch((error) => {
                    if (submitBtn) submitBtn.disabled = false;
                    console.error('Error al enviar el email:', error);
                    alert('Error al enviar el email. Intenta de nuevo.');
                });
            } else {
                // Fallback a mailto si no se configura EmailJS
                const recipient = document.querySelector('meta[name="recipient-email"]')?.content || '';
                if (recipient) {
                    const formData = new FormData(form);
                    const body = Array.from(formData.entries()).map(([k, v]) => {
                        if (v instanceof File) {
                            return `${k}: ${v.name}`;
                        } else {
                            return `${k}: ${v}`;
                        }
                    }).join('\n');
                    window.location.href = `mailto:${recipient}?subject=Nueva solicitud&body=${encodeURIComponent(body)}`;
                }
            }
        };

        const handlers = { submit: onSubmit, inputs: [] };
        form.addEventListener('submit', onSubmit);

        if (this.opts.realtime) {
            const inputs = Array.from(form.elements).filter(el => el.tagName && (el.tagName.toLowerCase() !== 'button'));
            inputs.forEach(input => {
                const onInput = () => this._handleRealtime(input, form);
                input.addEventListener('input', onInput);
                input.addEventListener('blur', onInput);
                handlers.inputs.push({ input, onInput });
            });
        }

        this._handlers.set(form, handlers);
        this.forms.push(form);
    }

    /**
     * Detach validator from a form element and remove handlers.
     * @param {HTMLFormElement} form
     * @returns {void}
     */
    detach(form) {
        const handlers = this._handlers.get(form);
        if (!handlers) return;
        form.removeEventListener('submit', handlers.submit);
        (handlers.inputs || []).forEach(h => h.input.removeEventListener('input', h.onInput));
        this._handlers.delete(form);
        const idx = this.forms.indexOf(form);
        if (idx !== -1) this.forms.splice(idx, 1);
    }

    /**
     * Remove validation from all attached forms.
     * @returns {void}
     */
    destroy() {
        this.forms.slice().forEach(f => this.detach(f));
    }

    /**
     * Internal: handle realtime input/blur events.
     * @param {HTMLElement} input
     * @param {HTMLFormElement} form
     * @returns {void}
     */
    _handleRealtime(input, form) {
        this.validateField(input, form, { show: true });
    }

    /**
     * Validate all fields in a form. Returns true if valid.
     * @param {HTMLFormElement} form
     * @returns {boolean}
     */
    validateForm(form) {
        let ok = true;
        const elements = Array.from(form.elements).filter((el) => el.name || el.dataset.validate || el.required);
        elements.forEach((el) => {
            const valid = this.validateField(el, form, { show: true });
            if (!valid) ok = false;
        });
        return ok;
    }

    /**
     * Validate a single field against configured rules.
     * @param {HTMLElement} field
     * @param {HTMLFormElement} form
     * @param {{show:boolean}} [opts]
     * @returns {boolean}
     */
    validateField(field, form, opts = { show: true }) {
        if (!field || field.disabled) return true;
        const name = field.name || field.id || null;
        // Build rules: data-validate attribute, HTML attributes, JS config
        const dataRules = parseRules(field.dataset.validate);
        if (field.required && !dataRules.some(r => r.name === 'required')) dataRules.unshift({ name: 'required' });
        // Only add min when explicitly set (> 0). Default minLength is 0 (falsy) and should be ignored.
        if (typeof field.minLength === 'number' && field.minLength > 0 && !dataRules.some((r) => r.name === 'min')) {
            dataRules.push({ name: 'min', arg: String(field.minLength) });
        }
        // Only add max when explicitly set. Some browsers use -1 for "no limit"; ignore negatives.
        if (typeof field.maxLength === 'number' && field.maxLength > -1 && !dataRules.some((r) => r.name === 'max')) {
            dataRules.push({ name: 'max', arg: String(field.maxLength) });
        }
        if (field.pattern && !dataRules.some(r => r.name === 'pattern')) dataRules.push({ name: 'pattern', arg: field.pattern });

        // JS-config rules
        const jsRuleKey = name || null;
        if (jsRuleKey && this.opts.rules && this.opts.rules[jsRuleKey]) {
            const jsRules = parseRules(this.opts.rules[jsRuleKey]);
            jsRules.forEach(r => dataRules.push(r));
        }

        // If input type=email and no explicit rule, add email
        if (field.type === 'email' && !dataRules.some(r => r.name === 'email')) dataRules.push({ name: 'email' });

        // No rules -> considered valid
        if (dataRules.length === 0) {
            this._clearError(field);
            this._applyValid(field);
            return true;
        }

        // Special handling for file inputs (validate using FileList)
        if (field.type === 'file') {
            for (let i = 0; i < dataRules.length; i++) {
                const rule = dataRules[i];
                if (rule.name === 'file') {
                    const files = field.files;
                    if (!files || files.length === 0) {
                        if (opts.show) this._showError(field, 'required');
                        this._applyInvalid(field);
                        return false;
                    }
                    const f = files[0];
                    const accept = (rule.arg || '').toLowerCase();
                    if (accept === 'pdf' && f.type !== 'application/pdf' && !f.name.toLowerCase().endsWith('.pdf')) {
                        if (opts.show) this._showError(field, 'file');
                        this._applyInvalid(field);
                        return false;
                    }
                    // file passed
                }
            }
            this._clearError(field);
            this._applyValid(field);
            return true;
        }

        const value = field.value;

        // Salary must not start with a leading zero (e.g. '012345').
        if (name === 'salary' && value) {
            const vtrim = String(value).trim();
            if ((vtrim.length > 1 && vtrim.startsWith('0')) || /^0\d+/.test(vtrim)) {
                if (opts.show) this._showError(field, 'leadingZero');
                this._applyInvalid(field);
                return false;
            }
        }
        for (let i = 0; i < dataRules.length; i++) {
            const rule = dataRules[i];
            const result = validateValue(value, rule);
            if (result === true) continue;
            // Found error
            let code = 'default';
            let arg = undefined;
            if (result === 'required' || result === 'email' || result === 'phone' || result === 'pattern' || result === 'date') code = result;
            else if (typeof result === 'object') { code = result.code || 'default'; arg = result.arg; }
            else if (typeof result === 'string') code = result;

            if (opts.show) this._showError(field, code, arg);
            this._applyInvalid(field);
            return false;
        }

        // all rules passed
        this._clearError(field);
        this._applyValid(field);
        return true;
    }

    /**
     * Mark a field as invalid (visual + ARIA).
     * @param {HTMLElement} field
     */
    _applyInvalid(field) {
        addClass(field, 'fv-invalid');
        removeClass(field, 'fv-valid');
        field.setAttribute('aria-invalid', 'true');
    }

    /**
     * Mark a field as valid (visual + ARIA cleanup).
     * @param {HTMLElement} field
     */
    _applyValid(field) {
        removeClass(field, 'fv-invalid');
        addClass(field, 'fv-valid');
        field.removeAttribute('aria-invalid');
    }

    /**
     * Show an inline error message for a field.
     * @param {HTMLElement} field
     * @param {string} code
     * @param {string} [arg]
     */
    _showError(field, code, arg) {
        let msg = this.messages[code] || this.messages.default;
        if (arg) msg = format(msg, arg);

        let err = field.nextElementSibling;
        if (!err || !err.classList.contains('fv-error-message')) {
            err = document.createElement('div');
            err.className = 'fv-error-message';
            err.setAttribute('role', 'alert');
            err.setAttribute('aria-live', 'assertive');
            const id = uid('fv-err');
            err.id = id;
            field.parentNode && field.parentNode.insertBefore(err, field.nextSibling);
        }
        err.textContent = msg;
        field.setAttribute('aria-describedby', err.id);
    }

    /**
     * Remove any inline error message for a field.
     * @param {HTMLElement} field
     */
    _clearError(field) {
        const err = field.nextElementSibling;
        if (err && err.classList.contains('fv-error-message')) {
            err.parentNode && err.parentNode.removeChild(err);
        }
        field.removeAttribute('aria-describedby');
    }

    _resolveSelector(selector) {
        if (typeof selector === 'string') return Array.from(document.querySelectorAll(selector));
        if (selector instanceof Element && selector.tagName === 'FORM') return [selector];
        if (NodeList.prototype.isPrototypeOf(selector) || Array.isArray(selector)) return Array.from(selector);
        return [];
    }
}

// Expose for browser globals and module consumers
if (typeof window !== 'undefined') window.FormValidator = FormValidator;

export default FormValidator;

