import type { Metadata } from "next"
import "@fontsource/noto-sans-sc/chinese-simplified-400.css"
import "@fontsource/noto-sans-sc/chinese-simplified-500.css"
import "@fontsource/noto-sans-sc/chinese-simplified-700.css"
import "@fontsource/noto-sans-sc/latin-400.css"
import "@fontsource/noto-serif-sc/chinese-simplified-600.css"
import "@fontsource/noto-serif-sc/chinese-simplified-700.css"
import "@fontsource/noto-serif-sc/latin-600.css"
import "./globals.css"

export const metadata: Metadata = {
  title: "问名 · 青囊起名",
  description: "用八字五行、生肖、五格音韵和品牌语气，为新生儿与品牌取可解释的名字。",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
