import MobileSidebar from "@/components/sidebar/mobile-sidebar";
import Sidebar from "@/components/sidebar/sidebar";
import React from "react";

interface WorkspaceLayoutProps {
  children: React.ReactNode;
  params: {
    workspaceId: string;
  };
}

const WorkspaceLayout: React.FC<WorkspaceLayoutProps> = ({
  children,
  params,
}) => {
  return (
    <main className="flex overflow-hidden h-screen w-screen">
      <Sidebar params={params} />
      <MobileSidebar>
        <Sidebar params={params} className="w-screen inline-block sm:hidden" />
      </MobileSidebar>
      <div className="border-l-[1px] w-full relative overflow-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {children}
      </div>
    </main>
  );
};

export default WorkspaceLayout;
