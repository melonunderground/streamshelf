import "./globals.css";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Stream Shelf",
  description: "Search streaming availability by title",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen flex flex-col">
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
