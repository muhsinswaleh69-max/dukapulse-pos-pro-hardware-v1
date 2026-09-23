export const metadata = { title: "DukaPulse Pro Hardware" };
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{margin:0, background:"#f5f7f3", fontFamily:"sans-serif"}}>{children}</body>
    </html>
  );
}
