import './globals.css';

export const metadata = {
  title: "Orchid's Hub - Promise Pins & Blog",
  description: "Track our promises. See our transparency.",
  icons: {
    icon: "🌸",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
