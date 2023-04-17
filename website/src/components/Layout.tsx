import React from "react";
import Breadcrumb, { BreadcrumbProps } from "./Breadcrumb";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import Head from "next/head";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="prose lg:prose-xl container mx-auto p-4">
      <Head>
        <title>Explore Web3</title>
      </Head>
      <header className="mb-4 flex flex-row justify-between">
        <Breadcrumb />
        <ThemeSwitcher />
      </header>
      <div className="mt-4">{children}</div>
    </div>
  );
};

export default Layout;
