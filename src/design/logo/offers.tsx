import type { ComponentType } from "react";
import { archivedMarks, marks } from "./marks";
import Showcase from "./Showcase";

// The /design/logo offers: one per mark in marks.tsx, each shown through the Showcase.
export const logoOffers = marks.map((m) => {
  const Component: ComponentType = () => <Showcase id={m.id} />;
  Component.displayName = `Logo${m.id}`;
  return { id: m.id, name: m.name, summary: m.summary, Component, archived: archivedMarks.has(m.id) };
});
