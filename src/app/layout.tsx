import type { Metadata } from "next";
import Script from 'next/script'
import { Inter } from "next/font/google";
import { ActiveStatus } from './components'
import { AuthContext, ToasterContext } from './context'
import 'react-toastify/dist/ReactToastify.css';
import "./globals.css";
import dynamic from "next/dynamic";
import { getServerSession } from "next-auth";
import SessionProviderClientComponent from "./components/SessionProviderComponent";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'QuickChat - The Fastest Chat App',
  description:
    'Nexus is a revolutionary chat application that transcends traditional messaging. Immerse yourself in rich, dynamic conversations, collaborate effortlessly, and forge meaningful connections with friends and colleagues. Join Nexus today and experience a new era of communication.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await getServerSession();

  return (
    <html lang="en">
      <head>
        {/* <link href="/css/template.min.css" rel="stylesheet"/> */}
        <link href="/css/template.dark.min.css" rel="stylesheet" media="(prefers-color-scheme: dark)" />
        <link rel="icon" href="/images/favicon.ico" type="image/x-icon" />
      </head>
      <body>
        <AuthContext>
          <ToasterContext />
          <ActiveStatus />
          {children}
          {/* </SessionProviderClientComponent> */}
        </AuthContext>
        <Script src="/js/libs/jquery.min.js" />
        <Script src="/js/bootstrap/bootstrap.bundle.min.js" />
        <Script src="/js/plugins/plugins.bundle.js" />
        {/* <Script src="/js/template.js"/> */}
      </body>
    </html>
  );
}
