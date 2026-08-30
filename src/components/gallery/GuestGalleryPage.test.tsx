import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GuestGalleryPage from "./GuestGalleryPage";
import { resetDemoGallery } from "../../lib/galleryDemoApi";
import * as galleryFilePreparation from "../../lib/galleryFilePreparation";

describe("guest gallery authentication", () => {
  beforeEach(() => {
    window.localStorage.clear();
    resetDemoGallery();
    vi.stubEnv("VITE_GALLERY_DEMO_MODE", "false");
    vi.stubEnv("VITE_WEDDING_API_URL", "https://api.example.test/dev");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("asks for the QR link when there is no active session", () => {
    render(<GuestGalleryPage />);
    expect(screen.getByText(/código QR de la boda/i)).toBeInTheDocument();
  });

  it("exchanges the invite and renders the empty authenticated gallery", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(new Response(JSON.stringify({ sessionToken: "session", expiresAt: 9_999_999_999 }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ items: [] }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }));

    render(<GuestGalleryPage initialInviteToken="invite-secret" />);
    expect(await screen.findByRole("heading", { name: "Recuerdos" })).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText(/primera persona/i)).toBeInTheDocument());
    expect(fetchMock).toHaveBeenNthCalledWith(1, "https://api.example.test/dev/session", expect.objectContaining({
      headers: { "X-Invite-Token": "invite-secret" },
    }));
    expect(window.localStorage.getItem("wedding-gallery-session-v1")).not.toContain("invite-secret");
  });

  it("renders lazy images and inline video from a stored session", async () => {
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
        },
      ],
    }), { status: 200, headers: { "Content-Type": "application/json" } }));

    const { container } = render(<GuestGalleryPage />);
    await screen.findByRole("heading", { name: "Recuerdos" });
    await waitFor(() => expect(container.querySelectorAll("[aria-label='Recuerdos compartidos'] li")).toHaveLength(2));
    const image = container.querySelector<HTMLImageElement>('img[src="https://media.example/images/thumb.webp"]');
    expect(image).not.toBeNull();
    expect(image).toHaveAttribute("loading", "lazy");
    expect(image).toHaveAttribute("src", "https://media.example/images/thumb.webp");
    expect(container.querySelector("video")).toHaveAttribute("src", "https://media.example/videos/video.mp4");
  });

  it("opens the complete seeded gallery without API calls in local demo mode", async () => {
    vi.stubEnv("VITE_GALLERY_DEMO_MODE", "true");
    const fetchSpy = vi.spyOn(globalThis, "fetch");

    render(<GuestGalleryPage />);

    expect(screen.getByText(/demo local/i)).toBeInTheDocument();
    const groupTile = await screen.findByRole("button", {
      name: /abrir grupo de 2 recuerdos de familia y amigos/i,
    });
    expect(screen.getByRole("list", { name: "Recuerdos compartidos" })).toHaveClass("gallery-collage");
    expect(groupTile.closest("li")).toHaveClass("col-span-2", "row-span-2");
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
    expect(screen.getByRole("button", { name: "Compartir 2 recuerdos" })).toBeEnabled();

    const removePhoto = screen.getByRole("button", { name: "Quitar ceremonia.jpg" });
    expect(removePhoto).toHaveClass("z-20", "h-11", "touch-manipulation");
    expect(photoName.closest("li")?.querySelector("img")).toHaveClass("pointer-events-none");
    await user.click(removePhoto);
    expect(screen.getByText("1 archivo seleccionado")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Compartir 1 recuerdo" })).toBeEnabled();
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
});
