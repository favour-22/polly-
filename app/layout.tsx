import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Polly",
  description: "Polling app scaffold",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans bg-background text-foreground min-h-screen">
        {children}
      </body>
    </html>
  );
}
