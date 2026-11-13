"use client";

// The root layout itself failed, so there is no header, fonts or language provider: a plain page in design D's
// words, Persian first, that works on its own.
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="fa" dir="rtl">
      <body style={{ margin: 0, minHeight: "100vh", display: "grid", placeItems: "center", background: "#F5F6FB", color: "#0f172a", fontFamily: "Tahoma, system-ui, sans-serif" }}>
        <main style={{ maxWidth: 520, padding: 24 }}>
          <p style={{ fontFamily: "ui-monospace, monospace", color: "#94a3b8", fontSize: 14, margin: 0 }} dir="ltr">Error 500</p>
          <h1 style={{ fontSize: 32, margin: "12px 0 0" }}>مشکلی از سمت ما پیش آمد</h1>
          <p style={{ color: "#475569", fontSize: 18, lineHeight: 1.8 }}>مشکل از شما نیست. خطا ثبت شد و در حال رفع آن هستیم. کیف پول و سفارش‌هایتان امن هستند.</p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 24 }}>
            <button onClick={() => reset()} style={{ background: "#0f172a", color: "#fff", border: 0, borderRadius: 12, padding: "12px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>دوباره امتحان کنید</button>
            <a href="/" style={{ border: "1px solid #e2e8f0", background: "#fff", color: "#334155", borderRadius: 12, padding: "12px 20px", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>رفتن به صفحه اصلی</a>
          </div>
          <p style={{ marginTop: 32 }}><a href="https://t.me/shopmajazi" style={{ color: "#64748b", fontSize: 14 }}>پیام به پشتیبانی در تلگرام</a></p>
        </main>
      </body>
    </html>
  );
}
