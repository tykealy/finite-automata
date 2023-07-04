import "./globals.css";
import { Inter } from "next/font/google";
import Topbar from "@/components/Topbar";
import Footer from "@/components/Footer";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Finite Automata",
  description: "A powerful web app to design and test Finite Automata",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Topbar />
        {children}
        {/* <Footer /> */}
      </body>
    </html>
  );
}
