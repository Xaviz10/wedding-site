import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { submitRSVP, type RSVPInput } from "../lib/submitRSVP";
import type { RSVPConfig } from "../types/wedding";

type RSVPState = "idle" | "loading" | "success" | "error";

type RSVPFormErrors = Partial<Record<keyof RSVPInput, string>>;

const initialData: RSVPInput = {
  fullName: "",
  attending: "si",
  dietaryRestrictions: "",
  travelSupport: "no",
  messageToCouple: "",
};

function validate(data: RSVPInput): RSVPFormErrors {
  const errors: RSVPFormErrors = {};

  if (data.fullName.trim().length < 3) {
    errors.fullName = "Escribe nombre y apellido.";
  }

  if (data.dietaryRestrictions.length > 280) {
    errors.dietaryRestrictions = "Máximo 280 caracteres.";
  }

  if (data.messageToCouple.length > 500) {
    errors.messageToCouple = "Máximo 500 caracteres.";
  }

  return errors;
}

interface RSVPFormProps {
  config: RSVPConfig;
}

export default function RSVPForm({ config }: RSVPFormProps) {
  const [formData, setFormData] = useState<RSVPInput>(initialData);
  const [errors, setErrors] = useState<RSVPFormErrors>({});
  const [status, setStatus] = useState<RSVPState>("idle");
  const shouldReduceMotion = useReducedMotion();
  const fieldId = useId();
  const fullNameRef = useRef<HTMLInputElement>(null);
  const dietaryRef = useRef<HTMLTextAreaElement>(null);
  const messageToCoupleRef = useRef<HTMLTextAreaElement>(null);
  const successCloseRef = useRef<HTMLButtonElement>(null);
  const fullNameId = `${fieldId}-full-name`;
  const fullNameErrorId = `${fullNameId}-error`;
  const dietaryId = `${fieldId}-dietary`;
  const dietaryErrorId = `${dietaryId}-error`;
  const messageToCoupleId = `${fieldId}-message-to-couple`;
  const messageToCoupleErrorId = `${messageToCoupleId}-error`;
  const successTitleId = `${fieldId}-success-title`;
  const successMessageId = `${fieldId}-success-message`;
  const successMessageLines = config.successMessage.split(/\n{2,}/);

  const isSubmitting = status === "loading";
  const isSuccess = status === "success";
  const isError = status === "error";

  useEffect(() => {
    if (!isSuccess) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    successCloseRef.current?.focus();

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        setStatus("idle");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSuccess]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = validate(formData);
    setErrors(validation);

    if (Object.keys(validation).length > 0) {
      setStatus("idle");
      requestAnimationFrame(() => {
        if (validation.fullName) fullNameRef.current?.focus();
        else if (validation.dietaryRestrictions) dietaryRef.current?.focus();
        else if (validation.messageToCouple) messageToCoupleRef.current?.focus();
      });
      return;
    }

    try {
      setStatus("loading");
      await submitRSVP(formData);
      setStatus("success");
      setFormData(initialData);
      setErrors({});
    } catch {
      setStatus("error");
    }
  }

  function updateField<K extends keyof RSVPInput>(key: K, value: RSVPInput[K]) {
    setFormData((current) => ({ ...current, [key]: value }));
    setStatus("idle");
  }

  return (
    <>
      <motion.form
        onSubmit={onSubmit}
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: shouldReduceMotion ? 0 : 1 }}
        className="rsvp-form-shell p-6 md:p-12"
        noValidate
        aria-busy={isSubmitting}
      >
        <div className="rsvp-form-header">
          <div className="grid gap-3">
            <p className="rsvp-form-eyebrow">RSVP</p>
            <h3 className="rsvp-form-title">
              {config.title}
            </h3>
          </div>
          <p className="rsvp-form-intro">
            {config.intro}
          </p>
        </div>

        <div className="rsvp-form-fields">
          <label className="grid gap-2" htmlFor={fullNameId}>
            <span className="form-label">Nombre completo</span>
            <input
              ref={fullNameRef}
              id={fullNameId}
              value={formData.fullName}
              onChange={(event) => updateField("fullName", event.target.value)}
              className="form-control"
              autoComplete="name"
              placeholder="Ej. Ana García"
              required
              aria-invalid={Boolean(errors.fullName)}
              aria-describedby={errors.fullName ? fullNameErrorId : undefined}
            />
            {errors.fullName && <span id={fullNameErrorId} className="form-error">{errors.fullName}</span>}
          </label>

          <fieldset className="grid gap-3">
            <legend className="form-label">¿Asistirás?</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="rsvp-chip">
                <input
                  type="radio"
                  name="attending"
                  value="si"
                  checked={formData.attending === "si"}
                  onChange={() => updateField("attending", "si")}
                />
                <span>Sí, con mucha emoción</span>
              </label>
              <label className="rsvp-chip">
                <input
                  type="radio"
                  name="attending"
                  value="no"
                  checked={formData.attending === "no"}
                  onChange={() => updateField("attending", "no")}
                />
                <span>No podré asistir, pero les mando todo mi cariño</span>
              </label>
            </div>
          </fieldset>

          <label className="grid gap-2" htmlFor={dietaryId}>
            <span className="form-label">Restricciones alimentarias</span>
            <textarea
              ref={dietaryRef}
              id={dietaryId}
              value={formData.dietaryRestrictions}
              onChange={(event) => updateField("dietaryRestrictions", event.target.value)}
              rows={3}
              className="form-control resize-none"
              placeholder="Ej. Sin frutos secos, vegetarian@"
              aria-invalid={Boolean(errors.dietaryRestrictions)}
              aria-describedby={errors.dietaryRestrictions ? dietaryErrorId : undefined}
            />
            {errors.dietaryRestrictions && (
              <span id={dietaryErrorId} className="form-error">{errors.dietaryRestrictions}</span>
            )}
          </label>

          <fieldset className="grid gap-3">
            <legend className="form-label">¿Necesitas información de hospedaje o transporte?</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="rsvp-chip">
                <input
                  type="radio"
                  name="travelSupport"
                  value="si"
                  checked={formData.travelSupport === "si"}
                  onChange={() => updateField("travelSupport", "si")}
                />
                <span>Sí, necesito información</span>
              </label>
              <label className="rsvp-chip">
                <input
                  type="radio"
                  name="travelSupport"
                  value="no"
                  checked={formData.travelSupport === "no"}
                  onChange={() => updateField("travelSupport", "no")}
                />
                <span>No, gracias</span>
              </label>
            </div>
          </fieldset>

          <label className="grid gap-2" htmlFor={messageToCoupleId}>
            <span className="form-label">Mensaje para los novios</span>
            <textarea
              ref={messageToCoupleRef}
              id={messageToCoupleId}
              value={formData.messageToCouple}
              onChange={(event) => updateField("messageToCouple", event.target.value)}
              rows={4}
              maxLength={500}
              className="form-control resize-none"
              placeholder="Escríbenos unas palabras..."
              aria-invalid={Boolean(errors.messageToCouple)}
              aria-describedby={errors.messageToCouple ? messageToCoupleErrorId : undefined}
            />
            {errors.messageToCouple && (
              <span id={messageToCoupleErrorId} className="form-error">{errors.messageToCouple}</span>
            )}
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="rsvp-submit-button"
          >
            <span>{isSubmitting ? config.loadingLabel : config.submitLabel}</span>
          </button>

          {isError && (
            <p role="alert" className="form-feedback form-feedback--error">
              {config.errorMessage}
            </p>
          )}
        </div>
      </motion.form>

      <AnimatePresence>
        {isSuccess && (
          <motion.div
            className="fixed inset-0 z-[130] flex items-center justify-center bg-[rgba(10,12,8,0.68)] px-5 py-6 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby={successTitleId}
            aria-describedby={successMessageId}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.26 }}
            onClick={() => setStatus("idle")}
          >
            <motion.div
              className="relative w-full max-w-[31rem] overflow-hidden rounded-[8px] border border-white/38 bg-[var(--color-surface)] px-7 py-9 text-center text-[var(--color-forest)] shadow-[0_34px_90px_rgba(0,0,0,0.34)] md:px-10 md:py-11"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 24, scale: 0.96 }}
              animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, y: 18, scale: 0.97 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.38, ease: [0.16, 1, 0.3, 1] }}
              onClick={(event) => event.stopPropagation()}
            >
              <div
                className="pointer-events-none absolute -right-14 -top-16 h-40 w-40 rounded-full bg-[color-mix(in_oklab,var(--color-olive)_22%,transparent)]"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute -bottom-20 -left-16 h-44 w-44 rounded-full bg-[color-mix(in_oklab,var(--color-gold)_42%,transparent)]"
                aria-hidden
              />

              <button
                ref={successCloseRef}
                type="button"
                onClick={() => setStatus("idle")}
                className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-forest)]/12 bg-white/55 text-2xl leading-none text-[var(--color-forest)] backdrop-blur-md transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-olive)]"
                aria-label="Cerrar confirmación"
              >
                ×
              </button>

              <div className="relative mx-auto grid max-w-[24rem] justify-items-center gap-5">
                <span
                  className="flex h-14 w-14 items-center justify-center rounded-full border border-[var(--color-olive)]/25 bg-[var(--color-ivory)] text-[var(--color-olive)] shadow-[0_12px_28px_rgba(36,41,31,0.12)]"
                  aria-hidden
                >
                  <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7">
                    <path
                      d="M5 12.2L9.1 16.2L19 6.8"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>

                <div className="grid gap-2">
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-[var(--color-olive)]">
                    RSVP recibido
                  </p>
                  <h3
                    id={successTitleId}
                    className="font-heading text-[clamp(2.45rem,8vw,4rem)] font-medium italic leading-[0.9] tracking-normal text-[var(--color-forest)]"
                  >
                    Confirmación enviada
                  </h3>
                </div>

                <div
                  id={successMessageId}
                  className="font-editorial grid gap-3 text-[clamp(1.24rem,4vw,1.7rem)] italic leading-[1.16] text-[var(--color-forest)]/84"
                >
                  {successMessageLines.map((line) => (
                    <p key={line} className="m-0">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
