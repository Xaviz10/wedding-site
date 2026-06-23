import { useState, type FormEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { submitRSVP, type RSVPInput } from "../lib/submitRSVP";
import type { RSVPConfig } from "../types/wedding";

type RSVPState = "idle" | "loading" | "success" | "error";

type RSVPFormErrors = Partial<Record<keyof RSVPInput, string>>;

const initialData: RSVPInput = {
  fullName: "",
  attending: "si",
  dietaryRestrictions: "",
  travelSupport: "no",
};

function validate(data: RSVPInput): RSVPFormErrors {
  const errors: RSVPFormErrors = {};

  if (data.fullName.trim().length < 3) {
    errors.fullName = "Escribe nombre y apellido.";
  }

  if (data.dietaryRestrictions.length > 280) {
    errors.dietaryRestrictions = "Máximo 280 caracteres.";
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
      className="rsvp-form-shell p-6 md:p-12"
      noValidate
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

        <button
          type="submit"
          disabled={isSubmitting}
          className="rsvp-submit-button"
        >
          <span>{isSubmitting ? config.loadingLabel : config.submitLabel}</span>
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
