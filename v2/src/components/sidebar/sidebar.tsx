import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import React from "react";
import { cookies } from "next/headers";
import {
  getCollaborativeWorkspaces,
  getFolders,
  getPrivateWorkspaces,
  getSharedWorkspaces,
  getUserSubscriptionStatus,
} from "@/lib/supabase/queries";
import { redirect } from "next/navigation";
import { twMerge } from "tailwind-merge";
import WorkspaceDropdown from "./workspace-dropdown";
import PlanUsage from "./plan-usage";
import NativeNavigation from "./native-navigation";
import { ScrollArea } from "../ui/scroll-area";
import FoldersDropdownList from "./folders-dropdown-list";
import UserCard from "./user-card";

interface SidebarProps {
  params: { workspaceId: string };
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = async ({ params, className }) => {
  const supabase = createServerComponentClient({ cookies });
  //user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  //subsrciption
  const { data: subscriptionData, error: subscriptionError } =
    await getUserSubscriptionStatus(user.id);

  //folder
  const { data: workspaceFolderData, error: foldersError } = await getFolders(
    params.workspaceId
  );

  //error
  if (subscriptionError || foldersError) redirect("/dashboard");

  //get all the different workspaces [private, collaborative, shared]
  const [privateWorkspaces, collaborativeWorkspaces, sharedWorkspaces] =
    await Promise.all([
      getPrivateWorkspaces(user.id),
      getCollaborativeWorkspaces(user.id),
      getSharedWorkspaces(user.id),
    ]);

  return (
    <aside
      className={twMerge(
        "hidden md:flex md:flex-col w-[280px] shrink-0 p-4 md:gap-4 !justify-between",
        className
      )}
    >
      <div>
        <WorkspaceDropdown
          privateWorkspaces={privateWorkspaces}
          sharedWorkspaces={sharedWorkspaces}
          collaborativeWorkspaces={collaborativeWorkspaces}
          defaultValue={[
            ...privateWorkspaces,
            ...collaborativeWorkspaces,
            ...sharedWorkspaces,
          ].find((workspace) => workspace.id === params.workspaceId)}
        />
        <PlanUsage
          foldersLength={workspaceFolderData?.length || 0}
          subscription={subscriptionData}
        />
        <NativeNavigation myWorkspaceId={params.workspaceId} />
        <ScrollArea className="overflow-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] relative h-[450px]">
          <div className="pointer-events-none w-full absolute bottom-0 h-20 bg-gradient-to-t from-background to-transparent z-40"></div>
          <FoldersDropdownList
            workspaceFolders={workspaceFolderData || []}
            workspaceId={params.workspaceId}
          />
        </ScrollArea>
      </div>
      <UserCard subscription={subscriptionData} />
    </aside>
  );
};

export default Sidebar;
