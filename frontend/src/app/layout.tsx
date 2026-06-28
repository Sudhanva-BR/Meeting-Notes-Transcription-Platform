import type { Metadata } from 'next';
import './globals.css';
import { AppLayout } from '@/components/layout/AppLayout';

export const metadata: Metadata = {
  title: 'Fireflies.ai Clone — Meeting Notes & Transcription Platform',
  description: 'Interactive transcripts, AI-generated summaries, action items, and structured meeting dashboard.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <AppLayout>
          {children}
        </AppLayout>
      </body>
    </html>
  );
}
