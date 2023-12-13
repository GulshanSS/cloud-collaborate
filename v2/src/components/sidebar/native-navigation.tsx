import { HomeIcon, Settings2, Trash } from "lucide-react";
import Link from "next/link";
import React from "react";
import { twMerge } from "tailwind-merge";
import Settings from "../settings/settings";

interface NativeNavigationProps {
  myWorkspaceId: string;
  className?: string;
  getSelectedElement?: (selection: string) => void;
}

const NativeNavigation: React.FC<NativeNavigationProps> = ({
  myWorkspaceId,
  className,
  getSelectedElement,
}) => {
  return (
    <nav className={twMerge("my-2", className)}>
      <ul className="flex flex-col gap-2">
        <li>
          <Link
            className="group/native flex text-slate-300 transition-all gap-2"
            href={`/dashboard/${myWorkspaceId}`}
          >
            <HomeIcon />
            <span>My Workspace</span>
          </Link>
        </li>
        <Settings>
          <li className="group/native flex text-slate-300 transition-all gap-2 cursor-pointer">
            <Settings2 />
            <span>Settings</span>
          </li>
        </Settings>
        <li>
          <Link
            className="group/native flex text-slate-300 transition-all gap-2"
            href={`/dashboard/${myWorkspaceId}`}
          >
            <Trash />
            <span>Trash</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default NativeNavigation;
