"use client";

import type { ComponentType } from "react";
import { ExtrasSlot } from "../service/slot";
import ServiceExtras from "../service/ServiceExtras";
import SingleA from "./SingleA";
import SingleB from "./SingleB";
import SingleC from "./SingleC";
import SingleD from "./SingleD";
import SingleE from "./SingleE";

// Previews for /design/page-sub-single: each single-subscription design for ChatGPT Plus with the chosen panel (A)
// and the shared sections below, so it looks like the live page.
const preview = (C: ComponentType<{ slug?: string; panel?: string }>) => function Preview() {
  return <ExtrasSlot extras={<ServiceExtras service="subs:chatgpt-plus" />}><C slug="chatgpt-plus" panel="A" /></ExtrasSlot>;
};

export const SinglePreviewA = preview(SingleA);
export const SinglePreviewB = preview(SingleB);
export const SinglePreviewC = preview(SingleC);
export const SinglePreviewD = preview(SingleD);
export const SinglePreviewE = preview(SingleE);
