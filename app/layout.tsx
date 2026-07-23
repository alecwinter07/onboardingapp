import type { Metadata } from "next";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";

export const metadata: Metadata = {
  title: "LEVEL Market Onboarding",
  description: "Complete your LEVEL Market onboarding",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <CustomCursor />
        <div className="ambient-bg" aria-hidden="true">
          <div className="ambient-grid" />

          <div className="float-card card-1">
            <div className="float-icon" style={{ background: '#0B99FF' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <path d="M9 22V12h6v10" />
              </svg>
            </div>
            <div>
              <div className="float-label">New listing matched</div>
              <div className="float-sublabel">Downtown · 3 bed</div>
            </div>
          </div>

          <div className="float-card card-2">
            <div className="float-icon" style={{ background: 'var(--color-accent-tint)' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#0B99FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <div>
              <div className="float-label">Compliance cleared</div>
              <div className="float-sublabel">Fair Housing ✓</div>
            </div>
          </div>

          <div className="float-card card-3">
            <div className="float-icon" style={{ background: '#0EA5E9' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                <polyline points="17 6 23 6 23 12" />
              </svg>
            </div>
            <div>
              <div className="float-label">Lead score 87</div>
              <div className="float-sublabel">Warm · ready for handoff</div>
            </div>
          </div>

          <div className="float-card card-4">
            <div className="float-icon" style={{ background: 'var(--color-accent-tint)' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#0B99FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <div>
              <div className="float-label">Consult booked</div>
              <div className="float-sublabel">Tomorrow, 2:00 PM</div>
            </div>
          </div>

          <div className="float-card card-5">
            <div className="float-icon" style={{ background: '#38BDF8' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2l2.9 6.3L21 9l-4.5 4.6L17.8 22 12 18.6 6.2 22l1.3-8.4L3 9l6.1-.7z" />
              </svg>
            </div>
            <div>
              <div className="float-label">5-star review</div>
              <div className="float-sublabel">"Made it so easy!"</div>
            </div>
          </div>

          <div className="float-card card-6">
            <div className="float-icon" style={{ background: 'var(--color-accent-tint)' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#0B99FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="5" />
                <path d="M20 21a8 8 0 1 0-16 0" />
              </svg>
            </div>
            <div>
              <div className="float-label">Profile verified</div>
              <div className="float-sublabel">Licensed agent</div>
            </div>
          </div>

          <div className="float-dot dot-1" />
          <div className="float-dot dot-2" />
          <div className="float-dot dot-3" />
          <div className="float-dot dot-4" />
        </div>
        {children}
      </body>
    </html>
  );
}
