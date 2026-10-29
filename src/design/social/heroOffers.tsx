"use client";

import ListF from "./ListF";

// The hero options shown inside the chosen list design (F), one per offer on /design/page-social-list-hero.
export const HeroOfferA = () => <ListF hero="A" />;
export const HeroOfferB = () => <ListF hero="B" />;
export const HeroOfferC = () => <ListF hero="C" />;
export const HeroOfferD = () => <ListF hero="D" />;
export const HeroOfferE = () => <ListF hero="E" />;

// Texture options for hero B, one per offer on /design/page-social-list-hero-texture.
export const TexGrid = () => <ListF hero="B" texture="grid" />;
export const TexRings = () => <ListF hero="B" texture="rings" />;
export const TexGrain = () => <ListF hero="B" texture="grain" />;
export const TexLines = () => <ListF hero="B" texture="lines" />;
export const TexGlyphs = () => <ListF hero="B" texture="glyphs" />;
export const TexNone = () => <ListF hero="B" texture="none" />;

// Icon styles for hero C, one per offer on /design/page-social-list-hero-icons.
export const IcoTile = () => <ListF hero="C" icons="tile" />;
export const IcoMono = () => <ListF hero="C" icons="mono" />;
export const IcoBubble = () => <ListF hero="C" icons="bubble" />;
export const IcoConstellation = () => <ListF hero="C" icons="constellation" />;
export const IcoOrbit = () => <ListF hero="C" icons="orbit" />;
export const IcoLine = () => <ListF hero="C" icons="line" />;

// Background objects for hero C, one per offer on /design/page-social-list-hero-object.
export const ObjGlobe = () => <ListF hero="C" icons="line" object="globe" />;
export const ObjOrb = () => <ListF hero="C" icons="line" object="orb" />;
export const ObjCurve = () => <ListF hero="C" icons="line" object="curve" />;
export const ObjHalo = () => <ListF hero="C" icons="line" object="halo" />;
export const ObjPulse = () => <ListF hero="C" icons="line" object="pulse" />;
export const ObjNone = () => <ListF hero="C" icons="line" object="none" />;

// Glossy 3D icons with lively motion (G–K).
export const IcoGBounce = () => <ListF hero="C" icons="g-bounce" />;
export const IcoGPop = () => <ListF hero="C" icons="g-pop" />;
export const IcoGSpin = () => <ListF hero="C" icons="g-spin" />;
export const IcoGOrbit = () => <ListF hero="C" icons="g-orbit" />;
export const IcoGRise = () => <ListF hero="C" icons="g-rise" />;
export const IcoNone = () => <ListF hero="C" icons="none" />;

// Rich-colour backgrounds for hero C, one per offer on /design/page-social-list-hero-bg (no icons, no object).
export const BgAurora = () => <ListF hero="C" icons="none" object="none" bg="aurora" />;
export const BgSunset = () => <ListF hero="C" icons="none" object="none" bg="sunset" />;
export const BgMesh = () => <ListF hero="C" icons="none" object="none" bg="mesh" />;
export const BgBeams = () => <ListF hero="C" icons="none" object="none" bg="beams" />;
export const BgWaves = () => <ListF hero="C" icons="none" object="none" bg="waves" />;
export const BgPlain = () => <ListF hero="C" icons="none" object="none" bg="none" />;
