// components/Breadcrumb.tsx
import React from "react";
import { useRouter } from "next/router";

type BreadcrumbItem = {
  name: string;
  href?: string;
};

export type BreadcrumbProps = {
  items?: BreadcrumbItem[];
  pathname?: string;
};

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, pathname }) => {
  const router = useRouter();
  const path = pathname || router.pathname;

  const generateItemsFromPath = (): BreadcrumbItem[] => {
    const pathSegments = path.split("/").filter((segment) => segment);

    const generatedItems: BreadcrumbItem[] = [{ name: "Home", href: "/" }];

    pathSegments.forEach((segment, index) => {
      const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
      const name = segment.charAt(0).toUpperCase() + segment.slice(1);
      generatedItems.push({
        name,
        href: index < pathSegments.length - 1 ? href : undefined,
      });
    });

    return generatedItems;
  };

  const finalItems = items || generateItemsFromPath();

  return (
    <nav className="breadcrumbs text-sm">
      <ul className="pl-0">
        {finalItems.map((item, index) => (
          <li key={index} className="pl-0">
            {item.href ? <a href={item.href}>{item.name}</a> : item.name}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Breadcrumb;
