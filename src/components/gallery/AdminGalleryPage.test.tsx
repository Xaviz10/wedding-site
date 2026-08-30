import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AdminGalleryPage from "./AdminGalleryPage";

const mediaItems = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    mediaKind: "image",
    status: "READY",
    createdAt: "2026-09-05T20:00:00Z",
    batchId: "33333333-3333-4333-8333-333333333333",
    displayName: "Familia",
    originalFileName: "familia-1.jpg",
    mediaUrl: "https://media.example.test/images/one.webp",
    thumbnailUrl: "https://media.example.test/images/one-thumb.webp",
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    mediaKind: "image",
    status: "READY",
    createdAt: "2026-09-05T20:00:01Z",
    batchId: "33333333-3333-4333-8333-333333333333",
    displayName: "Familia",
    originalFileName: "familia-2.jpg",
    mediaUrl: "https://media.example.test/images/two.webp",
    thumbnailUrl: "https://media.example.test/images/two-thumb.webp",
  },
];

function storeAdminSession(): void {
  window.sessionStorage.setItem("wedding-admin-session-v1", JSON.stringify({
    idToken: "admin-token",
    email: "admin@example.test",
    expiresAt: Date.now() + 3_600_000,
  }));
}

describe("admin gallery", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    window.history.replaceState(null, "", "/wedding-site/#/admin");
    vi.stubEnv("VITE_WEDDING_API_URL", "https://api.example.test/prod");
    vi.stubEnv("VITE_COGNITO_DOMAIN", "https://wedding.auth.example.test");
    vi.stubEnv("VITE_COGNITO_CLIENT_ID", "client-id");
    vi.stubEnv("VITE_WEBSITE_URL", "https://example.test/wedding-site");
    storeAdminSession();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it("selects and permanently removes an entire visible group", async () => {
    const fetcher = vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(new Response(JSON.stringify({ items: mediaItems }), { status: 200, headers: { "Content-Type": "application/json" } }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ deletedMediaIds: mediaItems.map((item) => item.id) }), { status: 200, headers: { "Content-Type": "application/json" } }));
    vi.spyOn(window, "confirm").mockReturnValue(true);
    const user = userEvent.setup();

    render(<AdminGalleryPage />);
    await screen.findByRole("button", { name: "Administrar grupo" });
    await user.click(screen.getByLabelText("Seleccionar Familia"));
    expect(screen.getAllByText("1 grupo")).toHaveLength(2);
    await user.click(screen.getByRole("button", { name: "Eliminar" }));

    await waitFor(() => expect(screen.getByText("No hay recuerdos publicados")).toBeInTheDocument());
    expect(fetcher).toHaveBeenLastCalledWith(
      "https://api.example.test/prod/admin/media",
      expect.objectContaining({
        method: "DELETE",
        headers: expect.objectContaining({ Authorization: "Bearer admin-token" }),
        body: JSON.stringify({ mediaIds: mediaItems.map((item) => item.id) }),
      }),
    );
  });

  it("prepares downloads for all files in one selected group", async () => {
    const downloads = mediaItems.map((item, index) => ({ id: item.id, fileName: `foto-${index}.webp`, url: `https://download.example.test/${index}` }));
    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(new Response(JSON.stringify({ items: mediaItems }), { status: 200, headers: { "Content-Type": "application/json" } }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ items: downloads, expiresIn: 300 }), { status: 200, headers: { "Content-Type": "application/json" } }));
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => undefined);
    const user = userEvent.setup();

    render(<AdminGalleryPage />);
    await screen.findByRole("button", { name: "Administrar grupo" });
    await user.click(screen.getByLabelText("Seleccionar Familia"));
    await user.click(screen.getByRole("button", { name: "Descargar" }));

    expect(await screen.findByRole("region", { name: "Descargas preparadas" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "foto-0.webp" })).toHaveAttribute("href", downloads[0]?.url);
    expect(screen.getByRole("link", { name: "foto-1.webp" })).toHaveAttribute("href", downloads[1]?.url);
  });

  it("keeps the authenticated page visible when the API returns a forbidden response", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(new Response(JSON.stringify({
      message: "Esta cuenta no tiene acceso de administración.",
    }), { status: 403, headers: { "Content-Type": "application/json" } }));

    render(<AdminGalleryPage />);

    expect(await screen.findByRole("alert")).toHaveTextContent("Esta cuenta no tiene acceso de administración.");
    expect(screen.getByRole("heading", { name: "Administrar recuerdos" })).toBeInTheDocument();
    expect(window.sessionStorage.getItem("wedding-admin-session-v1")).not.toBeNull();
    expect(screen.queryByRole("button", { name: "Iniciar sesión con Cognito" })).not.toBeInTheDocument();
  });
});
