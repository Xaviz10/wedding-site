import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GuestGalleryPage, { QueuedMediaStatusIndicator } from "./GuestGalleryPage";
import { resetDemoGallery } from "../../lib/galleryDemoApi";
import * as galleryFilePreparation from "../../lib/galleryFilePreparation";
import { uploadConcurrencyFor } from "../../lib/uploadBatch";

describe("guest gallery authentication", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
    resetDemoGallery();
    vi.stubEnv("VITE_GALLERY_DEMO_MODE", "false");
    vi.stubEnv("VITE_WEDDING_API_URL", "https://api.example.test/dev");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("asks for the QR link when there is no active session", () => {
    const { container } = render(<GuestGalleryPage />);
    expect(screen.getByText(/código QR de la boda/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Galería de invitados" })).toHaveClass("font-heading", "text-white");
    expect(screen.getByText("Recuerdos de Cata & Javier")).toHaveClass("text-[var(--color-gold)]");
    expect(container.querySelector('img[aria-hidden="true"]')).toHaveAttribute("src", expect.stringContaining("hero"));
    expect(screen.getByRole("link", { name: "Volver a la invitación" })).toHaveAttribute("href", "#portada");
  });

  it("exchanges the invite and renders the empty authenticated gallery", async () => {
    const onInviteConsumed = vi.fn();
    window.sessionStorage.setItem("wedding-admin-session-v1", JSON.stringify({
      idToken: "admin-token",
      email: "admin@example.test",
      expiresAt: Date.now() + 3_600_000,
    }));
    const fetchMock = vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(new Response(JSON.stringify({ sessionToken: "session", expiresAt: 9_999_999_999 }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ items: [] }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }));

    render(<GuestGalleryPage initialInviteToken="invite-secret" onInviteConsumed={onInviteConsumed} />);
    expect(await screen.findByRole("heading", { name: "Recuerdos" })).toBeInTheDocument();
    const galleryTitle = screen.getByRole("heading", { name: "Nuestra galería" });
    expect(galleryTitle).toHaveClass("font-heading", "italic");
    expect(galleryTitle.closest("section")).toHaveClass("gallery-hero");
    await waitFor(() => expect(screen.getByText(/primera persona/i)).toBeInTheDocument());
    expect(fetchMock).toHaveBeenNthCalledWith(1, "https://api.example.test/dev/session", expect.objectContaining({
      headers: { "X-Invite-Token": "invite-secret" },
    }));
    expect(window.localStorage.getItem("wedding-gallery-session-v1")).not.toContain("invite-secret");
    expect(window.sessionStorage.getItem("wedding-admin-session-v1")).toBeNull();
    expect(onInviteConsumed).toHaveBeenCalledOnce();
  });

  it("renders video thumbnails as images from a stored session", async () => {
    window.localStorage.setItem("wedding-gallery-session-v1", JSON.stringify({
      token: "session",
      expiresAt: 9_999_999_999,
    }));
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(new Response(JSON.stringify({
      items: [
        {
          id: "image-id",
          mediaKind: "image",
          status: "READY",
          createdAt: "2026-09-05T20:00:00Z",
          caption: "Una foto",
          mediaUrl: "https://media.example/images/full.webp",
          thumbnailUrl: "https://media.example/images/thumb.webp",
        },
        {
          id: "video-id",
          mediaKind: "video",
          status: "READY",
          createdAt: "2026-09-05T20:01:00Z",
          mediaUrl: "https://media.example/videos/video.mp4",
          thumbnailUrl: "https://media.example/videos/thumbnail.webp",
        },
      ],
    }), { status: 200, headers: { "Content-Type": "application/json" } }));

    const { container } = render(<GuestGalleryPage />);
    const uploadLauncher = screen.getByRole("button", { name: "Subir recuerdos" });
    expect(uploadLauncher.parentElement).toBe(document.body);
    expect(uploadLauncher).toHaveClass("fixed", "z-[70]", "[transform:translateZ(0)]");
    await screen.findByRole("heading", { name: "Recuerdos" });
    await waitFor(() => expect(container.querySelectorAll("[aria-label='Recuerdos compartidos'] li")).toHaveLength(2));
    expect(container.querySelector(".gallery-media-surface")).toBeInTheDocument();
    const image = container.querySelector<HTMLImageElement>('img[src="https://media.example/images/thumb.webp"]');
    expect(image).not.toBeNull();
    expect(image).toHaveAttribute("loading", "lazy");
    expect(image).toHaveAttribute("src", "https://media.example/images/thumb.webp");
    expect(container.querySelector('img[src="https://media.example/videos/thumbnail.webp"]')).not.toBeNull();
    expect(container.querySelector("video")).toBeNull();
  });

  it("opens the complete seeded gallery without API calls in local demo mode", async () => {
    vi.stubEnv("VITE_GALLERY_DEMO_MODE", "true");
    const fetchSpy = vi.spyOn(globalThis, "fetch");

    render(<GuestGalleryPage />);

    expect(screen.getByText(/demo local/i)).toBeInTheDocument();
    const groupTile = await screen.findByRole("button", {
      name: /abrir grupo de 2 recuerdos de familia y amigos/i,
    });
    const collage = screen.getByRole("list", { name: "Recuerdos compartidos" });
    expect(collage).toHaveClass("gallery-collage");
    expect(collage.querySelectorAll("li.col-span-2.row-span-2").length).toBeGreaterThan(0);
    await userEvent.click(groupTile);
    expect(screen.getByRole("dialog", { name: "Recuerdos de Familia y amigos" })).toBeInTheDocument();
    expect(screen.getByText(/recuerdo de ejemplo/i)).toBeInTheDocument();
    expect(screen.getByText("1 de 2")).toBeInTheDocument();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("selects multiple photos and videos in one gallery-picker action", async () => {
    vi.stubEnv("VITE_GALLERY_DEMO_MODE", "true");
    const user = userEvent.setup();
    render(<GuestGalleryPage />);
    await user.click(screen.getByRole("button", { name: "Subir recuerdos" }));
    const picker = screen.getByLabelText(/elegir fotos y videos/i);
    const photo = new File(["photo"], "ceremonia.jpg", { type: "image/jpeg" });
    const video = new File(["video"], "baile.mp4", { type: "video/mp4" });

    await user.upload(picker, [photo, video]);

    expect(screen.getByText("2 archivos seleccionados")).toBeInTheDocument();
    const photoName = screen.getByText("ceremonia.jpg");
    expect(photoName).toBeInTheDocument();
    expect(photoName.closest("li")).not.toHaveClass("aspect-square");
    expect(photoName.closest("li")?.querySelector(".aspect-square")).toBeInTheDocument();
    expect(screen.getByText("baile.mp4")).toBeInTheDocument();
    expect(screen.getByText("Video seleccionado")).toBeInTheDocument();
    expect(screen.getByText("baile.mp4").closest("li")?.querySelector("video")).toBeNull();
    expect(screen.getByRole("button", { name: "Compartir 2 recuerdos" })).toBeEnabled();

    const removePhoto = screen.getByRole("button", { name: "Quitar ceremonia.jpg" });
    expect(removePhoto).toHaveClass("z-20", "h-11", "touch-manipulation");
    expect(photoName.closest("li")?.querySelector("img")).toHaveClass("pointer-events-none");
    await user.click(removePhoto);
    expect(screen.getByText("1 archivo seleccionado")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Compartir 1 recuerdo" })).toBeEnabled();
  });

  it("uploads iPhone videos serially while retaining parallel image uploads", () => {
    expect(uploadConcurrencyFor([
      new File(["one"], "one.jpg", { type: "image/jpeg" }),
      new File(["two"], "two.jpg", { type: "image/jpeg" }),
    ])).toBe(2);
    expect(uploadConcurrencyFor([
      new File(["video"], "video.mov", { type: "video/quicktime" }),
      new File(["photo"], "photo.jpg", { type: "image/jpeg" }),
    ])).toBe(1);
  });

  it("converts an iPhone HEIC photo before adding it to the upload queue", async () => {
    vi.stubEnv("VITE_GALLERY_DEMO_MODE", "true");
    const user = userEvent.setup();
    const heic = new File(["heic"], "IMG_2048.HEIC", { type: "image/heic", lastModified: 1234 });
    const jpeg = new File(["jpeg"], "IMG_2048.jpg", { type: "image/jpeg", lastModified: 1234 });
    vi.spyOn(galleryFilePreparation, "prepareGalleryFile").mockResolvedValueOnce({
      file: jpeg,
      convertedFromHeic: true,
    });

    render(<GuestGalleryPage />);
    await user.click(screen.getByRole("button", { name: "Subir recuerdos" }));
    await user.upload(screen.getByLabelText(/elegir fotos y videos/i), heic);

    expect(await screen.findByText("IMG_2048.jpg")).toBeInTheDocument();
    expect(screen.getByText(/foto HEIC fue convertida a JPEG/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Compartir 1 recuerdo" })).toBeEnabled();
  });

  it("resets the upload sheet after every selected file is published", async () => {
    vi.stubEnv("VITE_GALLERY_DEMO_MODE", "true");
    const revokeObjectUrl = vi.spyOn(URL, "revokeObjectURL");
    const user = userEvent.setup();
    render(<GuestGalleryPage />);

    await user.click(screen.getByRole("button", { name: "Subir recuerdos" }));
    const picker = screen.getByLabelText(/elegir fotos y videos/i);
    const displayName = screen.getByLabelText(/tu nombre/i);
    const caption = screen.getByLabelText(/mensaje para este grupo/i);
    await user.upload(picker, new File(["photo"], "nuevo-recuerdo.jpg", { type: "image/jpeg" }));
    await user.type(displayName, "Ana");
    await user.type(caption, "Un nuevo recuerdo");
    await user.click(screen.getByRole("button", { name: "Compartir 1 recuerdo" }));

    expect(await screen.findByText(/1 recuerdo publicado/i, {}, { timeout: 5_000 })).toBeInTheDocument();
    expect(screen.queryByText("nuevo-recuerdo.jpg")).not.toBeInTheDocument();
    expect(screen.queryByText(/archivo seleccionado/i)).not.toBeInTheDocument();
    expect(displayName).toHaveValue("");
    expect(caption).toHaveValue("");
    expect(screen.getByRole("button", { name: "Compartir 0 recuerdos" })).toBeDisabled();
    expect(revokeObjectUrl).toHaveBeenCalled();
  });

  it("releases the upload sheet while accepted media processes in the background", async () => {
    vi.stubEnv("VITE_GALLERY_DEMO_MODE", "true");
    const user = userEvent.setup();
    render(<GuestGalleryPage />);

    await user.click(screen.getByRole("button", { name: "Subir recuerdos" }));
    await user.upload(
      screen.getByLabelText(/elegir fotos y videos/i),
      new File(["photo"], "procesando.jpg", { type: "image/jpeg" }),
    );
    await user.click(screen.getByRole("button", { name: "Compartir 1 recuerdo" }));

    expect(await screen.findByText(/recuerdo recibido.*segundo plano/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /procesando 1 recuerdo/i })).toBeDisabled();
    const closeButton = screen.getByRole("button", { name: "Cerrar" });
    expect(closeButton).toBeEnabled();
    await user.click(closeButton);
    expect(screen.queryByRole("dialog", { name: "Subir recuerdos" })).not.toBeInTheDocument();
  });

  it("shows progress and processing feedback on each selected item", () => {
    const { rerender } = render(<QueuedMediaStatusIndicator status="uploading" progress={42} />);
    expect(screen.getByRole("status", { name: "Subiendo 42%" })).toBeInTheDocument();
    expect(screen.getByText("42%")).toBeInTheDocument();

    rerender(<QueuedMediaStatusIndicator status="processing" progress={100} />);
    expect(screen.getByRole("status", { name: "Procesando archivo" })).toBeInTheDocument();
    expect(screen.getByText("Procesando")).toBeInTheDocument();
  });
});
