import { Viewport } from 'next';
import '../public/styles/calandar.scss'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
