import { act, render, screen } from "@testing-library/react";
import { GalleryCta, WeddingCountdown } from "./HeroSection";

describe("wedding-day hero behavior", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("hides the gallery CTA before the start and shows it afterwards", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-05T19:29:59.000Z"));
    render(<GalleryCta target="2026-09-05T14:30:00-05:00" label="Compartir recuerdos" />);
    expect(screen.queryByRole("link", { name: "Compartir recuerdos" })).not.toBeInTheDocument();

    act(() => vi.advanceTimersByTime(1_000));
    expect(screen.getByRole("link", { name: "Compartir recuerdos" })).toHaveAttribute("href", "#/gallery");
  });

  it("preserves the existing day-of thank-you message", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-05T19:30:01.000Z"));
    render(<WeddingCountdown target="2026-09-05T14:30:00-05:00" />);
    expect(screen.getByText("Gracias por tu compañía")).toBeInTheDocument();
  });
});
