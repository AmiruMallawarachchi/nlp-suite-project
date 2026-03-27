import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NLP Suite | AI Intelligence Lab',
  description: 'Premium Multi-Task NLP Intelligence Suite for modern developers.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased bg-black selection:bg-brand-accent/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
