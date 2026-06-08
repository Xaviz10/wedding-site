import { useState, type FormEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { submitRSVP, type RSVPInput } from "../lib/submitRSVP";
import type { RSVPConfig } from "../types/wedding";

type RSVPState = "idle" | "loading" | "success" | "error";

type RSVPFormErrors = Partial<Record<keyof RSVPInput, string>>;

const initialData: RSVPInput = {
  fullName: "",
  attending: "si",
  companions: 0,
  companionNames: "",
  dietaryRestrictions: "",
  travelSupport: "",
  message: "",
};

function validate(data: RSVPInput): RSVPFormErrors {
  const errors: RSVPFormErrors = {};

  if (data.fullName.trim().length < 3) {
    errors.fullName = "Escribe nombre y apellido.";
  }

  if (!Number.isInteger(data.companions) || data.companions < 0 || data.companions > 6) {
    errors.companions = "Número de acompañantes entre 0 y 6.";
  }

  if (data.attending === "si" && data.companions > 0 && data.companionNames.trim().length < 3) {
    errors.companionNames = "Escribe el nombre de tu acompañante.";
  }

  if (data.companionNames.length > 240) {
    errors.companionNames = "Máximo 240 caracteres.";
  }

  if (data.dietaryRestrictions.length > 280) {
    errors.dietaryRestrictions = "Máximo 280 caracteres.";
  }

  if (data.travelSupport.length > 280) {
    errors.travelSupport = "Máximo 280 caracteres.";
  }

  if (data.message.length > 400) {
    errors.message = "Máximo 400 caracteres.";
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

  const isSubmitting = status === "loading";
  const isSuccess = status === "success";
  const isError = status === "error";

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = validate(formData);
    setErrors(validation);

    if (Object.keys(validation).length > 0) {
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
    setFormData((current) => {
      if (key === "attending" && value === "no") {
        return {
          ...current,
          attending: "no",
          companions: 0,
          companionNames: "",
        };
      }

      return { ...current, [key]: value };
    });
    setStatus("idle");
  }

  return (
    <motion.form
      onSubmit={onSubmit}
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: shouldReduceMotion ? 0 : 1 }}
      className="paper-surface rounded-[8px] p-6 md:p-8"
      noValidate
    >
      <div className="mb-6">
        <h3 className="font-heading text-3xl leading-tight">{config.title}</h3>
        <p className="section-caption mt-2 text-[var(--color-forest)]/85">{config.intro}</p>
      </div>

      <div className="grid gap-5">
        <label className="grid gap-2">
          <span className="text-sm uppercase tracking-[0.16em] text-[var(--color-olive)]">Nombre completo</span>
          <input
            value={formData.fullName}
            onChange={(event) => updateField("fullName", event.target.value)}
            className="w-full rounded-[6px] border border-[var(--color-olive)]/30 bg-[var(--color-ivory)] px-4 py-3 text-base text-[var(--color-forest)] focus:border-[var(--color-gold)] focus:outline-none"
            autoComplete="name"
            required
          />
          {errors.fullName && <span className="text-sm text-[var(--color-terracotta)]">{errors.fullName}</span>}
        </label>

        <fieldset className="grid gap-2">
          <legend className="text-sm uppercase tracking-[0.16em] text-[var(--color-olive)]">¿Asistirás?</legend>
          <div className="flex flex-wrap gap-3">
            <label className="inline-flex items-center gap-2 rounded-[6px] border border-[var(--color-olive)]/35 px-4 py-2">
              <input
                type="radio"
                name="attending"
                value="si"
                checked={formData.attending === "si"}
                onChange={() => updateField("attending", "si")}
              />
              <span>Sí, con mucha emoción</span>
            </label>
            <label className="inline-flex items-center gap-2 rounded-[6px] border border-[var(--color-olive)]/35 px-4 py-2">
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

        <label className="grid gap-2">
          <span className="text-sm uppercase tracking-[0.16em] text-[var(--color-olive)]">Número de acompañantes</span>
          <input
            type="number"
            min={0}
            max={6}
            value={formData.companions}
            onChange={(event) => updateField("companions", Number(event.target.value))}
            className="w-full rounded-[6px] border border-[var(--color-olive)]/30 bg-[var(--color-ivory)] px-4 py-3 text-base text-[var(--color-forest)] focus:border-[var(--color-gold)] focus:outline-none"
            required
          />
          {errors.companions && <span className="text-sm text-[var(--color-terracotta)]">{errors.companions}</span>}
        </label>

        <label className="grid gap-2">
          <span className="text-sm uppercase tracking-[0.16em] text-[var(--color-olive)]">Nombre de acompañante(s)</span>
          <input
            value={formData.companionNames}
            onChange={(event) => updateField("companionNames", event.target.value)}
            className="w-full rounded-[6px] border border-[var(--color-olive)]/30 bg-[var(--color-ivory)] px-4 py-3 text-base text-[var(--color-forest)] focus:border-[var(--color-gold)] focus:outline-none"
            placeholder="Si aplica"
          />
          {errors.companionNames && <span className="text-sm text-[var(--color-terracotta)]">{errors.companionNames}</span>}
        </label>

        <label className="grid gap-2">
          <span className="text-sm uppercase tracking-[0.16em] text-[var(--color-olive)]">Restricciones alimentarias</span>
          <textarea
            value={formData.dietaryRestrictions}
            onChange={(event) => updateField("dietaryRestrictions", event.target.value)}
            rows={3}
            className="w-full rounded-[6px] border border-[var(--color-olive)]/30 bg-[var(--color-ivory)] px-4 py-3 text-base text-[var(--color-forest)] focus:border-[var(--color-gold)] focus:outline-none"
          />
          {errors.dietaryRestrictions && (
            <span className="text-sm text-[var(--color-terracotta)]">{errors.dietaryRestrictions}</span>
          )}
        </label>

        <label className="grid gap-2">
          <span className="text-sm uppercase tracking-[0.16em] text-[var(--color-olive)]">
            ¿Necesitas información de hospedaje o transporte?
          </span>
          <textarea
            value={formData.travelSupport}
            onChange={(event) => updateField("travelSupport", event.target.value)}
            rows={3}
            className="w-full rounded-[6px] border border-[var(--color-olive)]/30 bg-[var(--color-ivory)] px-4 py-3 text-base text-[var(--color-forest)] focus:border-[var(--color-gold)] focus:outline-none"
            placeholder="Cuéntanos si necesitas ayuda"
          />
          {errors.travelSupport && <span className="text-sm text-[var(--color-terracotta)]">{errors.travelSupport}</span>}
        </label>

        <label className="grid gap-2">
          <span className="text-sm uppercase tracking-[0.16em] text-[var(--color-olive)]">Mensaje para los novios</span>
          <textarea
            value={formData.message}
            onChange={(event) => updateField("message", event.target.value)}
            rows={4}
            className="w-full rounded-[6px] border border-[var(--color-olive)]/30 bg-[var(--color-ivory)] px-4 py-3 text-base text-[var(--color-forest)] focus:border-[var(--color-gold)] focus:outline-none"
          />
          {errors.message && <span className="text-sm text-[var(--color-terracotta)]">{errors.message}</span>}
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 inline-flex min-h-12 items-center justify-center rounded-[6px] border border-[var(--color-terracotta)]/55 bg-[var(--color-terracotta)] px-5 py-3 text-base font-medium text-[var(--color-ivory)] transition hover:bg-[var(--color-forest)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? config.loadingLabel : config.submitLabel}
        </button>

        {isSuccess && (
          <p
            role="status"
            className="whitespace-pre-line rounded-[6px] bg-[var(--color-olive)]/12 px-4 py-3 text-[var(--color-olive)]"
          >
            {config.successMessage}
          </p>
        )}
        {isError && (
          <p role="alert" className="rounded-[6px] bg-[var(--color-terracotta)]/12 px-4 py-3 text-[var(--color-terracotta)]">
            {config.errorMessage}
          </p>
        )}
      </div>
    </motion.form>
  );
}
