import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/Elements/Navbar";
import ReduxProvider from "@/redux/Provider";
import ToasterProvider from "@/components/ToasterProvider";
import { PayrollProvider } from "@/context/PayrollContext";


const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  subsets: ["latin"],
  display: "swap",
})



export const metadata = {
  title: "GuardsOS",
  description: "Security Guard Management Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${poppins.className}`}>
        <ReduxProvider>
          <Navbar />
          <PayrollProvider>
            {children}
          </PayrollProvider>
          <ToasterProvider />
        </ReduxProvider>
      </body>
    </html>
  );
}
