import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Poppins, Playfair_Display } from "next/font/google";

// Body font
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

// Logo / Title font
export const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"], // Bold for headings
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={poppins.className}>
      <Component {...pageProps} />
    </main>
  );
}
