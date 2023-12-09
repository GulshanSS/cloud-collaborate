import React from "react";

interface DashboardLaytoutProps {
  children: React.ReactNode;
  params: any;
}

const DashboardLayout: React.FC<DashboardLaytoutProps> = ({
  children,
  params,
}) => {
  return <main className="flex overflow-hidden h-screen">{children}</main>;
};

export default DashboardLayout;
