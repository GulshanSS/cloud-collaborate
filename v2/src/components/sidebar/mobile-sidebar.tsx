"use client";
import React, { useState } from "react";
import { Menu, Shapes } from "lucide-react";
import clsx from "clsx";

interface MobileSidebarProps {
  children: React.ReactNode;
}

export const nativeNavigation = [
  {
    title: "Sidebar",
    id: "sidebar",
    customIcon: Menu,
  },
  {
    title: "Pages",
    id: "pages",
    customIcon: Shapes,
  },
] as const;

const MobileSidebar: React.FC<MobileSidebarProps> = ({ children }) => {
  const [selectedNav, setSelectedNav] = useState("");
  return (
    <>
      {selectedNav === "sidebar" && <>{children}</>}
      <nav className="bg-black/20 backdrop-blur-lg sm:hidden fixed z-50 bottom-0 right-0 left-0">
        <ul className="flex justify-between items-center">
          {nativeNavigation.map((item) => (
            <li
              key={item.id}
              className="flex items-center flex-col justify-center"
              onClick={() => {
                setSelectedNav(item.id);
              }}
            >
              <item.customIcon />
              <small
                className={clsx("", {
                  "text-muted-foreground": selectedNav !== item.id,
                })}
              >
                {item.title}
              </small>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default MobileSidebar;
