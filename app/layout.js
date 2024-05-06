import "./globals.css";

export const metadata = {
  title: "Promptron",
  description: "The innovative platform that connects creators and enthusiasts to buy and sell prompts using blockchain technology. We empower your creativity by enabling you to sell captivating ideas embedded within intriguing prompts.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
