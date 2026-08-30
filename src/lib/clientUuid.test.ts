import { createClientUuid } from "./clientUuid";

const UUID_V4_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

describe("client UUID generation", () => {
  it("uses the browser-native generator when it is available", () => {
    const nativeUuid = "11111111-1111-4111-8111-111111111111";
    const randomUUID = vi.fn(() => nativeUuid);

    expect(createClientUuid({ randomUUID })).toBe(nativeUuid);
    expect(randomUUID).toHaveBeenCalledOnce();
  });

  it("uses getRandomValues when randomUUID is blocked on local HTTP", () => {
    const getRandomValues = vi.fn((bytes: Uint8Array) => {
      bytes.fill(0xff);
      return bytes;
    });

    const uuid = createClientUuid({
      randomUUID: () => {
        throw new DOMException("Only secure origins are allowed", "SecurityError");
      },
      getRandomValues,
    });

    expect(uuid).toBe("ffffffff-ffff-4fff-bfff-ffffffffffff");
    expect(uuid).toMatch(UUID_V4_PATTERN);
    expect(getRandomValues).toHaveBeenCalledOnce();
  });

  it("still creates a valid temporary UUID if Web Crypto is unavailable", () => {
    expect(createClientUuid(null)).toMatch(UUID_V4_PATTERN);
  });
});
