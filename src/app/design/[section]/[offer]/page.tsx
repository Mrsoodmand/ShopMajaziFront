import { notFound } from "next/navigation";
import { getSection } from "@/design/registry";

export default async function OfferPreview({ params }: { params: Promise<{ section: string; offer: string }> }) {
  const { section: sid, offer: oid } = await params;
  const section = getSection(sid);
  const offer = section?.offers.find((o) => o.id === oid.toUpperCase());
  if (!section || !offer) notFound();
  const { Component } = offer;
  const Context = section.context;
  return (
    <>
      <Component />
      {Context && <Context overlay={offer.overlay} />}
    </>
  );
}
