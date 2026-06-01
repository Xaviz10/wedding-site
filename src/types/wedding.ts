export type PhotoFormat = "portrait" | "landscape" | "square";
export type StoryFrame = "instant" | "polaroid" | "postcard";

export interface StoryBeatImage {
  src: string;
  alt: string;
}

export interface HeroContent {
  title: string;
  subtitle: string;
  text: string;
  date: string;
  cta: string;
}

export interface StoryBeat {
  title: string;
  moment: string;
  text: string;
  image: string;
  alt: string;
  images?: StoryBeatImage[];
  frame: StoryFrame;
}

export interface JourneyBeat {
  title: string;
  location: string;
  text: string;
}

export interface MilkaPhoto {
  src: string;
  alt: string;
  caption: string;
}

export interface ProposalBeat {
  text: string;
  emphasis?: "highlight" | "humor";
}

export interface ProposalPhoto {
  src: string;
  alt: string;
  caption: string;
  format: PhotoFormat;
}

export interface GalleryPhoto {
  src: string;
  alt: string;
  caption: string;
  format: PhotoFormat;
}

export interface GalleryCategory {
  title: string;
  photos: GalleryPhoto[];
}

export interface EventDetail {
  label: string;
  value: string;
}

export interface ScheduleItem {
  time: string;
  event: string;
}

export interface RSVPConfig {
  title: string;
  subtitle: string;
  successMessage: string;
  errorMessage: string;
  submitLabel: string;
  loadingLabel: string;
}

export interface WeddingContent {
  couple: string;
  weddingDate: string;
  hero: HeroContent;
  story: {
    intro: string;
    beats: StoryBeat[];
  };
  journey: {
    intro: string;
    beats: JourneyBeat[];
  };
  milka: {
    intro: string;
    paragraphs: string[];
    quote: string;
    note: string[];
    photos: MilkaPhoto[];
  };
  proposal: {
    intro: string;
    beats: ProposalBeat[];
    photos: ProposalPhoto[];
    videoLabel: string;
    videoUrl: string;
    videoPoster: string;
  };
  gallery: {
    title: string;
    subtitle: string;
    categories: GalleryCategory[];
  };
  event: {
    title: string;
    subtitle: string;
    details: EventDetail[];
    schedule: ScheduleItem[];
    note: string;
  };
  rsvp: RSVPConfig;
}
