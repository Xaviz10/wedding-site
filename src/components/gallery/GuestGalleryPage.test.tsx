import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GuestGalleryPage from "./GuestGalleryPage";
import { resetDemoGallery } from "../../lib/galleryDemoApi";

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
    expect(await screen.findByRole("heading", { name: "Nuestros recuerdos" })).toBeInTheDocument();
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
    const image = await screen.findByRole("img", { name: "Una foto" });
    expect(image).toHaveAttribute("loading", "lazy");
    expect(image).toHaveAttribute("src", "https://media.example/images/thumb.webp");
    expect(container.querySelector("video")).toHaveAttribute("src", "https://media.example/videos/video.mp4");
  });

  it("opens the complete seeded gallery without API calls in local demo mode", async () => {
    vi.stubEnv("VITE_GALLERY_DEMO_MODE", "true");
    const fetchSpy = vi.spyOn(globalThis, "fetch");

    render(<GuestGalleryPage />);

    expect(screen.getByText(/modo demo local/i)).toBeInTheDocument();
    expect(await screen.findByText(/recuerdo de ejemplo/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Compartir 0 recuerdos" })).toBeDisabled();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("selects multiple photos and videos in one gallery-picker action", async () => {
    vi.stubEnv("VITE_GALLERY_DEMO_MODE", "true");
    const user = userEvent.setup();
    render(<GuestGalleryPage />);
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
});
