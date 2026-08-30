import {
  beginAdminLogin,
  completeAdminLogin,
  readAdminSession,
} from "./adminAuth";

function jwt(claims: Record<string, unknown>): string {
  const encode = (value: unknown) => btoa(JSON.stringify(value)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  return `${encode({ alg: "none" })}.${encode(claims)}.signature`;
}

describe("Cognito admin PKCE authentication", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    window.localStorage.clear();
    vi.stubEnv("VITE_COGNITO_DOMAIN", "https://wedding.auth.us-east-1.amazoncognito.com");
    vi.stubEnv("VITE_COGNITO_CLIENT_ID", "client-id");
    vi.stubEnv("VITE_WEBSITE_URL", "https://example.test/wedding-site");
  });

  afterEach(() => vi.unstubAllEnvs());

  it("starts an authorization-code login with PKCE and no client secret", async () => {
    let destination = "";
    await beginAdminLogin(window.sessionStorage, (url) => { destination = url; }, 1_700_000_000_000);

    const url = new URL(destination);
    expect(url.pathname).toBe("/oauth2/authorize");
    expect(url.searchParams.get("response_type")).toBe("code");
    expect(url.searchParams.get("code_challenge_method")).toBe("S256");
    expect(url.searchParams.get("code_challenge")).toBeTruthy();
    expect(url.searchParams.get("client_secret")).toBeNull();
    expect(url.searchParams.get("redirect_uri")).toBe("https://example.test/wedding-site/");
  });

  it("exchanges the callback code, validates the admin group, stores the ID token, and scrubs the URL", async () => {
    let destination = "";
    const now = 1_700_000_000_000;
    await beginAdminLogin(window.sessionStorage, (url) => { destination = url; }, now);
    const state = new URL(destination).searchParams.get("state")!;
    const idToken = jwt({
      token_use: "id",
      email: "admin@example.test",
      exp: Math.floor(now / 1000) + 3600,
      "cognito:groups": ["admins"],
    });
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify({ id_token: idToken }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }));
    const replaceState = vi.fn();
    window.localStorage.setItem("wedding-gallery-session-v1", JSON.stringify({
      token: "guest-session",
      expiresAt: Math.floor(now / 1000) + 3600,
    }));

    const session = await completeAdminLogin({
      fetcher,
      storage: window.sessionStorage,
      location: { search: `?code=one-time-code&state=${state}`, pathname: "/wedding-site/" } as Location,
      history: { replaceState } as unknown as History,
      now,
    });

    expect(session).toMatchObject({ email: "admin@example.test", idToken });
    expect(readAdminSession(window.sessionStorage, now)).toEqual(session);
    expect(window.localStorage.getItem("wedding-gallery-session-v1")).toBeNull();
    expect(replaceState).toHaveBeenCalledWith(null, "", "/wedding-site/#/admin");
    expect(fetcher).toHaveBeenCalledWith(
      "https://wedding.auth.us-east-1.amazoncognito.com/oauth2/token",
      expect.objectContaining({ method: "POST" }),
    );
    const request = fetcher.mock.calls[0]?.[1];
    expect(String(request?.body)).toContain("code_verifier=");
    expect(String(request?.body)).not.toContain("client_secret");
  });

  it("rejects a valid Cognito token that is not in the admins group", async () => {
    let destination = "";
    const now = 1_700_000_000_000;
    await beginAdminLogin(window.sessionStorage, (url) => { destination = url; }, now);
    const state = new URL(destination).searchParams.get("state")!;
    const idToken = jwt({ token_use: "id", email: "admin@example.test", exp: Math.floor(now / 1000) + 3600 });
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify({ id_token: idToken }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }));

    await expect(completeAdminLogin({
      fetcher,
      storage: window.sessionStorage,
      location: { search: `?code=code&state=${state}`, pathname: "/wedding-site/" } as Location,
      history: { replaceState: vi.fn() } as unknown as History,
      now,
    })).rejects.toThrow("administradores");
  });
});
