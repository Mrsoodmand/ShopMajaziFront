"use client";

import OtpL from "../OtpL";
import type { OrderViewId } from "./views";

// Page L opened straight on a fresh order, with each order screen; registered as offers of "page-otp-order".
// The code arrives after 30s so there is time to try Cancel.
const preview = (id: OrderViewId) => function OrderPreview() { return <OtpL orderView={id} previewOrder />; };
export const OrderPreviewA = preview("A");
export const OrderPreviewB = preview("B");
export const OrderPreviewC = preview("C");
export const OrderPreviewD = preview("D");
export const OrderPreviewE = preview("E");
