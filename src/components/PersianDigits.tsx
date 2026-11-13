"use client";

import { useEffect } from "react";
import { installPersianDigits } from "@/lib/persian-digits";

/** Lets every input accept Persian/Arabic digits by converting them to 0-9 as they are typed or pasted. */
export default function PersianDigits() {
  useEffect(() => installPersianDigits(), []);
  return null;
}
