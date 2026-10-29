"use client";
import { useMoney } from "@/lib/money";
import { rentCheapest } from "@/content/rent-en";
import { PageShell } from "../otp/parts";
import { CountryRadios, DurationRadios, Heading, Points, RentCheckout, RentFaq, RentOrderView, RentSummary, Title, useRent } from "./parts";

// Page A — "Rental Builder": two plain questions on the left (country, then how long), the order summary always in
// view on the right. Each duration shows its total, the price per day and how much you save.
export default function RentA() {
  const usd = useMoney().format;
  const r = useRent();
  if (r.order) return <PageShell><div className="px-6 py-14"><RentOrderView order={r.order} onReset={r.reset} /></div></PageShell>;

  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-6 pb-24 pt-14">
        <Title sub={<>Keep one number for a week or a month and receive every SMS, from any app. From <strong>{usd(rentCheapest.week)}</strong> a week.</>}>Rent a number for unlimited SMS</Title>

        <div className="mt-12 grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-12">
            <section aria-labelledby="q1"><Heading id="q1">1. Choose a country</Heading><div className="mt-5"><CountryRadios r={r} legend="Country" /></div></section>
            <section aria-labelledby="q2"><Heading id="q2">2. Choose how long</Heading><div className="mt-5"><DurationRadios r={r} legend="Rental length" /></div></section>
          </div>
          <div className="lg:sticky lg:top-24 lg:self-start"><RentSummary r={r} /></div>
        </div>

        <section aria-labelledby="why" className="mt-20"><Heading id="why">Why rent instead of a one-time number?</Heading><div className="mt-6"><Points /></div></section>
        <section aria-labelledby="faq" className="mt-16 max-w-3xl"><Heading id="faq">Common questions</Heading><div className="mt-6"><RentFaq /></div></section>
      </div>
      <RentCheckout r={r} />
    </PageShell>
  );
}
