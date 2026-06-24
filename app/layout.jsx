import { Metadata } from 'next';
import './globals.css';

export const metadata = {
  title: '🌸 Orchid - Where Promises Matter',
  description: 'A platform dedicated to transparent promises and visible accountability. Coming to theorchidwebsite.vercel.app in July.',
  keywords: 'transparency, promises, trust, accountability',
  author: 'Orchid',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#d946a6" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
