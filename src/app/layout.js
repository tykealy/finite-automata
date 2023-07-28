import "./globals.css";
import { Inter } from "next/font/google";
import Topbar from "@/components/Topbar";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Finite Automata",
  description:
    "A powerful tool to design and test Deterministic and Non-Deterministic Finite Automata.",
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
