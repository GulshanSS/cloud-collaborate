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
      <div className="border-l-[1px] w-full relative overflow-scroll">
        {children}
      </div>
    </main>
  );
};

export default WorkspaceLayout;
