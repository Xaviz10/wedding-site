import { galleryVideoSource } from "./galleryVideo";

describe("gallery video preview", () => {
  it("asks iOS Safari to decode a first frame when no poster exists", () => {
    expect(galleryVideoSource("https://media.example/video.mp4")).toBe(
      "https://media.example/video.mp4#t=0.001",
    );
  });

  it("keeps the canonical video URL when a generated poster is available", () => {
    expect(galleryVideoSource(
      "https://media.example/video.mp4",
      "https://media.example/poster.jpg",
    )).toBe("https://media.example/video.mp4");
  });
});
