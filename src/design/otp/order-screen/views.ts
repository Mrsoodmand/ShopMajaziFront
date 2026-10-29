import type { ComponentType } from "react";
import OrderA from "./OrderA";
import OrderB from "./OrderB";
import OrderC from "./OrderC";
import OrderD from "./OrderD";
import OrderE from "./OrderE";
import type { OrderViewProps } from "./shared";
import { OrderF, OrderG, OrderH, OrderI, OrderJ } from "../../numbers/orderScreens";

// The order screens offered in the "page-otp-order" section, by offer id.
export type OrderViewId = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J";
export const orderViews: Record<OrderViewId, ComponentType<OrderViewProps>> = { A: OrderA, B: OrderB, C: OrderC, D: OrderD, E: OrderE, F: OrderF, G: OrderG, H: OrderH, I: OrderI, J: OrderJ };
