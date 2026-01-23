import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { DemoProvider } from "@/lib/demo/DemoProvider";

export const metadata: Metadata = {
  title: "RealCo | Real Estate Investing Made Transparent",
  description: "Unified platform for capital raising, compliance workflows, construction payments, and investor reporting. Built for Sponsors, Investors, and Service Providers.",
  keywords: ["real estate", "syndication", "compliance", "construction management", "investor relations"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <DemoProvider>
            {children}
          </DemoProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
