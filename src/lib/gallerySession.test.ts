import { clearSession, consumeInviteToken, readStoredSession, storeSession } from "./gallerySession";

describe("gallery session bootstrap", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("reads the invite only from the hash and removes it from the visible URL", () => {
    const replaceState = vi.fn();
    const token = consumeInviteToken(
      { hash: "#/gallery?invite=very-secret", pathname: "/wedding-site/", search: "" },
      { replaceState },
    );
    expect(token).toBe("very-secret");
    expect(replaceState).toHaveBeenCalledWith(null, "", "/wedding-site/#/gallery");
  });

  it("keeps a live session and removes an expired one", () => {
    storeSession({ token: "opaque", expiresAt: 2_000 });
    expect(readStoredSession(window.localStorage, 1_000_000)).toEqual({ token: "opaque", expiresAt: 2_000 });
    expect(readStoredSession(window.localStorage, 2_000_000)).toBeUndefined();
    clearSession();
  });
});
