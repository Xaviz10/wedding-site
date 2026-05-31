import { useMemo, useState, type FormEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { submitRSVP, type RSVPInput } from "../lib/submitRSVP";
import type { RSVPConfig } from "../types/wedding";

type RSVPState = "idle" | "loading" | "success" | "error";

type RSVPFormErrors = Partial<Record<keyof RSVPInput, string>>;

const initialData: RSVPInput = {
  fullName: "",
  email: "",
  attending: "si",
  guests: 1,
  dietaryNotes: "",
};

function validate(data: RSVPInput): RSVPFormErrors {
  const errors: RSVPFormErrors = {};

  if (data.fullName.trim().length < 3) {
    errors.fullName = "Escribe nombre y apellido.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(data.email)) {
    errors.email = "Escribe un correo válido.";
  }

  if (data.guests < 1 || data.guests > 6) {
    errors.guests = "Número de invitados entre 1 y 6.";
  }

  if (data.dietaryNotes && data.dietaryNotes.length > 280) {
    errors.dietaryNotes = "Máximo 280 caracteres.";
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

  const charsLeft = useMemo(() => 280 - (formData.dietaryNotes?.length ?? 0), [formData.dietaryNotes]);

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
    setFormData((current) => ({ ...current, [key]: value }));
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
        <p className="section-caption mt-2 text-[var(--color-forest)]/85">{config.subtitle}</p>
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

        <label className="grid gap-2">
          <span className="text-sm uppercase tracking-[0.16em] text-[var(--color-olive)]">Correo electrónico</span>
          <input
            type="email"
            value={formData.email}
            onChange={(event) => updateField("email", event.target.value)}
            className="w-full rounded-[6px] border border-[var(--color-olive)]/30 bg-[var(--color-ivory)] px-4 py-3 text-base text-[var(--color-forest)] focus:border-[var(--color-gold)] focus:outline-none"
            autoComplete="email"
            required
          />
          {errors.email && <span className="text-sm text-[var(--color-terracotta)]">{errors.email}</span>}
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
              <span>Sí, con gusto</span>
            </label>
            <label className="inline-flex items-center gap-2 rounded-[6px] border border-[var(--color-olive)]/35 px-4 py-2">
              <input
                type="radio"
                name="attending"
                value="no"
                checked={formData.attending === "no"}
                onChange={() => updateField("attending", "no")}
              />
              <span>No podré asistir</span>
            </label>
          </div>
        </fieldset>

        <label className="grid gap-2">
          <span className="text-sm uppercase tracking-[0.16em] text-[var(--color-olive)]">Número de personas</span>
          <input
            type="number"
            min={1}
            max={6}
            value={formData.guests}
            onChange={(event) => updateField("guests", Number(event.target.value))}
            className="w-full rounded-[6px] border border-[var(--color-olive)]/30 bg-[var(--color-ivory)] px-4 py-3 text-base text-[var(--color-forest)] focus:border-[var(--color-gold)] focus:outline-none"
            required
          />
          {errors.guests && <span className="text-sm text-[var(--color-terracotta)]">{errors.guests}</span>}
        </label>

        <label className="grid gap-2">
          <span className="text-sm uppercase tracking-[0.16em] text-[var(--color-olive)]">
            Restricciones alimentarias o mensaje
          </span>
          <textarea
            value={formData.dietaryNotes}
            onChange={(event) => updateField("dietaryNotes", event.target.value)}
            rows={4}
            className="w-full rounded-[6px] border border-[var(--color-olive)]/30 bg-[var(--color-ivory)] px-4 py-3 text-base text-[var(--color-forest)] focus:border-[var(--color-gold)] focus:outline-none"
          />
          <div className="flex items-center justify-between text-sm text-[var(--color-forest)]/70">
            <span>{errors.dietaryNotes ?? ""}</span>
            <span>{charsLeft} caracteres</span>
          </div>
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 inline-flex min-h-12 items-center justify-center rounded-[6px] border border-[var(--color-terracotta)]/55 bg-[var(--color-terracotta)] px-5 py-3 text-base font-medium text-[var(--color-ivory)] transition hover:bg-[var(--color-forest)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? config.loadingLabel : config.submitLabel}
        </button>

        {isSuccess && (
          <p role="status" className="rounded-[6px] bg-[var(--color-olive)]/12 px-4 py-3 text-[var(--color-olive)]">
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
