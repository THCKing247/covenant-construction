import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Covenant Construction of CA | Building a Higher Standard",
  description:
    "Covenant Construction of CA: residential and commercial building, remodeling, design-build and repairs serving San Luis Obispo and Santa Barbara Counties on California’s Central Coast.",
};

export const viewport: Viewport = {
  themeColor: "#0b0a09",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/css/styles.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
