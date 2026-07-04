import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Netflix Clone',
  description: 'A production-style streaming app built for learning and portfolio purposes.',
};

// NOTE: Auth session provider, React Query provider, and Zustand
// hydration boundaries get wired in here during Phase 3 (Auth) and
// Phase 8 (State Management). Kept bare for now so the folder
// structure + schema in this phase are the only things under review.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">{children}</body>
    </html>
  );
}
