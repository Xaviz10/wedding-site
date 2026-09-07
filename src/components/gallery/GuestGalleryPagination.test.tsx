import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GuestGalleryPage from "./GuestGalleryPage";
import type { GalleryMedia } from "../../lib/galleryApi";

function photo(id: string, batchId = id): GalleryMedia {
  return {
    id, batchId, mediaKind: "image", status: "READY",
    createdAt: "2026-09-05T20:00:00Z",
    thumbnailUrl: `https://media.example/${id}.webp`,
    mediaUrl: `https://media.example/${id}.webp`,
  };
}

function page(items: GalleryMedia[], nextCursor?: string) {
  return new Response(JSON.stringify({ items, nextCursor }), {
    headers: { "Content-Type": "application/json" },
  });
}

describe("guest gallery infinite scroll", () => {
  let nearEnd: boolean;
  let observers: Array<{ notify: (visible: boolean) => void; disconnected: boolean }>;

  beforeEach(() => {
    nearEnd = true;
    observers = [];
    window.localStorage.clear();
    window.localStorage.setItem("wedding-gallery-session-v1", JSON.stringify({
      token: "session", expiresAt: 9_999_999_999,
    }));
    vi.stubEnv("VITE_GALLERY_DEMO_MODE", "false");
    vi.stubEnv("VITE_WEDDING_API_URL", "https://api.example.test/dev");
    vi.stubGlobal("IntersectionObserver", class {
      disconnected = false;
      constructor(private callback: IntersectionObserverCallback) { observers.push(this); }
      notify = (visible: boolean) => {
        this.callback([{ isIntersecting: visible } as IntersectionObserverEntry], this as unknown as IntersectionObserver);
      };
      observe() {
        // Browsers deliver an initial visibility notification on every observe.
        queueMicrotask(() => { if (!this.disconnected) this.notify(nearEnd); });
      }
      disconnect() { this.disconnected = true; }
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    window.localStorage.clear();
  });

  it("fills a short viewport without scrolling, including pages that add no new groups", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(page([photo("1"), photo("2"), photo("3"), photo("4")], "page-2"))
      .mockResolvedValueOnce(page([photo("5", "1")], "page-3"))
      .mockResolvedValueOnce(page([], "page-4"))
      .mockResolvedValueOnce(page([photo("6")]));

    render(<GuestGalleryPage />);

    await screen.findByText("5 historias compartidas");
    expect(fetchMock).toHaveBeenCalledTimes(4);
    expect(fetchMock.mock.calls.map(([url]) => new URL(String(url)).searchParams.get("cursor")))
      .toEqual([null, "page-2", "page-3", "page-4"]);
    expect(screen.getByRole("list", { name: "Recuerdos compartidos" }).children).toHaveLength(5);
    expect(screen.queryByRole("button", { name: "Ver más recuerdos" })).not.toBeInTheDocument();
    expect(observers.every((observer) => observer.disconnected)).toBe(true);
  });

  it("waits until the end approaches and prevents duplicate in-flight page requests", async () => {
    nearEnd = false;
    let finishPage!: (response: Response) => void;
    const fetchMock = vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(page([photo("1")], "page-2"))
      .mockImplementationOnce(() => new Promise<Response>((resolve) => { finishPage = resolve; }));
    render(<GuestGalleryPage />);
    await waitFor(() => expect(observers).toHaveLength(1));
    expect(fetchMock).toHaveBeenCalledTimes(1);

    act(() => {
      observers[0].notify(true);
      observers[0].notify(true);
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(screen.getByRole("status")).toHaveTextContent("Cargando más recuerdos");
    expect(screen.getByRole("list", { name: "Recuerdos compartidos" }).children).toHaveLength(1);
    await act(async () => { finishPage(page([photo("2")])); });
    expect(screen.getByText("2 historias compartidas")).toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("preserves loaded groups on failure and resumes automatic loading after retry", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(page([photo("1")], "page-2"))
      .mockRejectedValueOnce(new Error("Sin conexión"))
      .mockResolvedValueOnce(page([photo("2")], "page-3"))
      .mockResolvedValueOnce(page([photo("3")]));
    render(<GuestGalleryPage />);

    const retry = await screen.findByRole("button", { name: "Reintentar carga" });
    expect(screen.getByRole("alert")).toHaveTextContent("Sin conexión");
    expect(screen.getByText("1 historia compartida")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
    act(() => observers[0].notify(true));
    expect(fetchMock).toHaveBeenCalledTimes(2);

    await userEvent.click(retry);
    await screen.findByText("3 historias compartidas");
    expect(fetchMock).toHaveBeenCalledTimes(4);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("ignores queued observer callbacks after unmount", async () => {
    nearEnd = false;
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(page([photo("1")], "page-2"));
    const { unmount } = render(<GuestGalleryPage />);
    await waitFor(() => expect(observers).toHaveLength(1));
    unmount();
    act(() => observers[0].notify(true));
    expect(observers[0].disconnected).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("keeps manual pagination available when IntersectionObserver is unavailable", async () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    const fetchMock = vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(page([photo("1")], "page-2"))
      .mockResolvedValueOnce(page([photo("2")]));
    render(<GuestGalleryPage />);
    await userEvent.click(await screen.findByRole("button", { name: "Ver más recuerdos" }));
    await screen.findByText("2 historias compartidas");
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
