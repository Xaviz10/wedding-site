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
  const attendingYes = formData.attending === "si";

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
      className="rounded-2xl p-6 md:p-8 rsvp-form-shell"
      noValidate
    >
      <div className="mb-8 grid gap-4">
        <div className="grid gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#bc6c25]">RSVP</p>
          <h3 className="font-heading text-2xl leading-tight md:text-3xl">{config.title}</h3>
        </div>
        <p className="section-caption max-w-xl text-(--color-forest)/85">{config.intro}</p>
      </div>

      <div className="grid gap-5">
        <label className="grid gap-2">
          <span className="form-label">Nombre completo</span>
          <input
            value={formData.fullName}
            onChange={(event) => updateField("fullName", event.target.value)}
            className="form-control"
            autoComplete="name"
            placeholder="Ej. Ana García"
            required
          />
          {errors.fullName && <span className="form-error">{errors.fullName}</span>}
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

        <div className="grid gap-5">
          <label className="grid gap-2">
            <span className="form-label">Número de acompañantes</span>
            <input
              type="number"
              min={0}
              max={6}
              value={formData.companions}
              onChange={(event) => updateField("companions", Number(event.target.value))}
              className="form-control"
              required
            />
            {errors.companions && <span className="form-error">{errors.companions}</span>}
          </label>

          {attendingYes ? (
            <label className="grid gap-2">
              <span className="form-label">Nombre de acompañante(s)</span>
              <input
                value={formData.companionNames}
                onChange={(event) => updateField("companionNames", event.target.value)}
                className="form-control"
                placeholder="Si aplica"
              />
              {errors.companionNames && <span className="form-error">{errors.companionNames}</span>}
            </label>
          ) : (
            <div className="form-note">Nos alegramos de recibir tu mensaje, gracias por avisarnos con cariño.</div>
          )}
        </div>

        <label className="grid gap-2">
          <span className="form-label">Restricciones alimentarias</span>
          <textarea
            value={formData.dietaryRestrictions}
            onChange={(event) => updateField("dietaryRestrictions", event.target.value)}
            rows={3}
            className="form-control resize-none"
            placeholder="Ej. Sin frutos secos, vegetarian@"
          />
          {errors.dietaryRestrictions && <span className="form-error">{errors.dietaryRestrictions}</span>}
        </label>

        <label className="grid gap-2">
          <span className="form-label">¿Necesitas información de hospedaje o transporte?</span>
          <textarea
            value={formData.travelSupport}
            onChange={(event) => updateField("travelSupport", event.target.value)}
            rows={3}
            className="form-control resize-none"
            placeholder="Cuéntanos si necesitas ayuda"
          />
          {errors.travelSupport && <span className="form-error">{errors.travelSupport}</span>}
        </label>

        <label className="grid gap-2">
          <span className="form-label">Mensaje para los novios</span>
          <textarea
            value={formData.message}
            onChange={(event) => updateField("message", event.target.value)}
            rows={4}
            className="form-control resize-none"
            placeholder="Comparte un abrazo y buenos deseos"
          />
          {errors.message && <span className="form-error">{errors.message}</span>}
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rsvp-submit-button"
        >
          {isSubmitting ? config.loadingLabel : config.submitLabel}
        </button>

        {isSuccess && (
          <p role="status" className="form-feedback form-feedback--success">
            {config.successMessage}
          </p>
        )}
        {isError && (
          <p role="alert" className="form-feedback form-feedback--error">
            {config.errorMessage}
          </p>
        )}
      </div>
    </motion.form>
  );
}
