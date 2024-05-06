import { Toaster } from "react-hot-toast";
import "./globals.css";
import Navbar from "@/components/navbar";
import Loading from "@/components/ui/loading";

export const metadata = {
  title: "Promptron",
  description: "The innovative platform that connects creators and enthusiasts to buy and sell prompts using blockchain technology. We empower your creativity by enabling you to sell captivating ideas embedded within intriguing prompts.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-950 text-white">
        <Navbar />
        <main>
          {children}
        </main>
        <Loading />
        <Toaster />
      </body>
    </html>
  );
}
