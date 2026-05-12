import "./globals.css";
import NavBar from "@/components/NavBar";

export const metadata = {
  title: "POD-App",
  description: "Digital Proof of Delivery System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <NavBar />
        <div>{children}</div>
      </body>
    </html>
  );
}
