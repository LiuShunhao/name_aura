import type { Metadata, Viewport } from "next"
import { PwaRegister } from "@/components/pwa-register"
import "@fontsource/noto-sans-sc/chinese-simplified-400.css"
import "@fontsource/noto-sans-sc/chinese-simplified-500.css"
import "@fontsource/noto-sans-sc/chinese-simplified-700.css"
import "@fontsource/noto-sans-sc/latin-400.css"
import "@fontsource/noto-serif-sc/chinese-simplified-600.css"
import "@fontsource/noto-serif-sc/chinese-simplified-700.css"
import "@fontsource/noto-serif-sc/latin-600.css"
import "./globals.css"

const assetBase = process.env.PAGES_EXPORT === "1" ? "/name_aura" : ""

export const metadata: Metadata = {
  title: "问名 · 青囊起名",
  description: "用八字五行、生肖、五格音韵和品牌语气，为新生儿与品牌取可解释的名字。",
  applicationName: "青囊起名",
  manifest: `${assetBase}/manifest.webmanifest`,
  appleWebApp: {
    capable: true,
    title: "青囊起名",
    statusBarStyle: "default",
  },
  icons: {
    icon: [
      { url: `${assetBase}/icon-192.png`, sizes: "192x192", type: "image/png" },
      { url: `${assetBase}/icon-512.png`, sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: `${assetBase}/apple-touch-icon.png`, sizes: "180x180" }],
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f4efe4",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col pb-[env(safe-area-inset-bottom)]">
        <PwaRegister />
        {children}
      </body>
    </html>
  )
}
