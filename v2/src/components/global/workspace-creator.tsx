"use client";
import { useSupabaseUser } from "@/lib/providers/supabase-user-provider";
import { User, Workspace } from "@/lib/supabase/supabase.types";
import { Label } from "@radix-ui/react-label";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Input } from "../ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectValue,
} from "../ui/select";

import { Lock, Plus, Share } from "lucide-react";
import { Button } from "../ui/button";
import { v4 } from "uuid";
import { addCollaborators, createWorkspace } from "@/lib/supabase/queries";
import CollaboratorSearch from "./collaborator-search";
import { ScrollArea } from "../ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Shape from "../../../public/shape.svg";
import { useToast } from "../ui/use-toast";

interface WorkspaceCreatorProps {}

const WorkspaceCreator: React.FC<WorkspaceCreatorProps> = () => {
  const { user } = useSupabaseUser();

  const router = useRouter();

  const [permission, setPermission] = useState<string>("private");
  const [title, setTitle] = useState<string>("");
  const [collaborators, setCollaborators] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const addCollaborator = (user: User) => {    
    setCollaborators([...collaborators, user]);
  };

  const removeCollaborators = (user: User) => {
    setCollaborators(
      collaborators.filter((collaborator) => collaborator.id !== user.id)
    );
  };

  const createItem = async () => {
    setIsLoading(true);
    const workspaceId = v4();
    if (user?.id) {
      const newWorkspace: Workspace = {
        data: null,
        createdAt: new Date().toISOString(),
        iconId: "💼",
        id: workspaceId,
        inTrash: "",
        title,
        workspaceOwner: user.id,
        logo: null,
        bannerUrl: "",
      };

      if (permission === "private") {
        toast({ title: "Success", description: "Created the workspace" });
        await createWorkspace(newWorkspace);
        router.refresh();
      }

      if (permission === "shared") {
        toast({ title: "Success", description: "Created the workspace" });
        await createWorkspace(newWorkspace);
        await addCollaborators(collaborators, workspaceId);
        router.refresh();
      }

      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-4 flex-col">
      <div>
        <Label htmlFor="name" className="text-sm text-muted-foreground">
          Name
        </Label>
        <div className="flex justify-center items-center gap-2">
          <Input
            name="name"
            placeholder="Workspace Name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
      </div>
      <>
        <Label htmlFor="permission" className="text-sm text-muted-foreground">
          Permission
        </Label>
        <Select
          defaultValue={permission}
          onValueChange={(val) => setPermission(val)}
        >
          <SelectTrigger className="w-full h-26 -mt-3">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="w-inherit">
            <SelectGroup>
              <SelectItem value="private">
                <div className="p-2 flex gap-4 justify-center items-center">
                  <Lock />
                  <article className="text-left flex flex-col">
                    <span>Private</span>
                    <p>
                      Your workspace is private to you. You can choose to share
                      it later.
                    </p>
                  </article>
                </div>
              </SelectItem>
              <SelectItem value="shared">
                <div className="p-2 flex gap-4 justify-start items-center">
                  <Share />
                  <article className="text-left flex flex-col">
                    <span>Shared</span>
                    <p>Your can invite collaborators.</p>
                  </article>
                </div>
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </>
      {permission === "shared" && (
        <div>
          <CollaboratorSearch
            existingCollaborators={collaborators}
            getCollaborators={(user) => addCollaborator(user)}
          >
            <Button type="button" className="text-sm mt-4">
              <Plus />
              Add Collaborators
            </Button>
          </CollaboratorSearch>
          <div className="mt-4">
            <span className="text-sm text-muted-foreground">
              Collaborators {collaborators.length || ""}
            </span>
            <ScrollArea className="h-[120px] overflow-y-scroll w-full rounded-md border border-muted-foreground/20">
              {collaborators.length ? (
                collaborators.map((collaborator) => (
                  <div
                    key={collaborator.id}
                    className="p-4 flex justify-between items-center"
                  >
                    <div className="flex gap-4 items-center">
                      <Avatar>
                        <AvatarImage src={Shape} />
                        <AvatarFallback>CC</AvatarFallback>
                      </Avatar>
                      <div className="text-sm gap-2 text-muted-foreground overflow-hidden overflow-ellipsis w-[300px] md:w-[140px]">
                        {collaborator.email}
                      </div>
                    </div>
                    <Button
                      variant="secondary"
                      onClick={() => removeCollaborators(collaborator)}
                    >
                      Remove
                    </Button>
                  </div>
                ))
              ) : (
                <div className="absolute right-0 left-0 top-0 bottom-0 flex justify-center items-center">
                  <span className="text-muted-foreground text-sm">
                    You have no collaborators
                  </span>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      )}
      <Button
        type="button"
        disabled={
          !title ||
          (permission === "shared" && collaborators.length === 0) ||
          isLoading
        }
        variant="secondary"
        onClick={createItem}
      >
        Create
      </Button>
    </div>
  );
};

export default WorkspaceCreator;
