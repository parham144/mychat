export const metadata = {
  title: 'Next.js mychat',
  description: 'A simple AI chatbot integration',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        {children}
      </body>
    </html>
  )
}