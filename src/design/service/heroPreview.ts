// Cookie that turns on the landing-hero preview (Spotlight × Grid) for one browser. Kept out of spotlight.tsx because
// that is a client module: server code importing a plain value from it gets a client reference, not the string.
export const HERO_PREVIEW_COOKIE = "hero-preview";
