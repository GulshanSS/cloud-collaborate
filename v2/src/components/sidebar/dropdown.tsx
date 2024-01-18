"use client";

import { useAppState } from "@/lib/providers/state-provider";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import clsx from "clsx";
import EmojiPicker from "../global/emoji-picker";
import { addFile, updateFile, updateFolder } from "@/lib/supabase/queries";
import { toast } from "../ui/use-toast";
import TooltipComponent from "../global/tooltip-component";
import { PlusIcon, Trash } from "lucide-react";
import { File } from "@/lib/supabase/supabase.types";
import { v4 } from "uuid";
import { useSupabaseUser } from "@/lib/providers/supabase-user-provider";

interface DropdownProps {
  title: string;
  id: string;
  listType: "folder" | "file";
  iconId: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  title,
  id,
  listType,
  iconId,
  children,
  disabled,
  ...props
}) => {
  const supabase = createClientComponentClient();
  const { user } = useSupabaseUser();
  const { state, dispatch, workspaceId, folderId } = useAppState();
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  //folder title synced server and local
  const folderTitle: string | undefined = useMemo(() => {
    if (listType === "folder") {
      const stateTitle = state.workspaces
        .find((workspace) => workspace.id === workspaceId)
        ?.folders.find((folder) => folder.id === id)?.title;
      if (title === stateTitle || !stateTitle) return title;
      return stateTitle;
    }
  }, [state, listType, workspaceId, id, title]);

  //file title
  const fileTitle: string | undefined = useMemo(() => {
    if (listType === "file") {
      const fileAndFolderId = id.split("folder");
      const stateTitle = state.workspaces
        .find((workspace) => workspace.id === workspaceId)
        ?.folders.find((folder) => folder.id === fileAndFolderId[0])
        ?.files.find((file) => file.id === fileAndFolderId[1])?.title;
      if (title === stateTitle || !stateTitle) return title;
      return stateTitle;
    }
  }, [state, listType, workspaceId, id, title]);

  //func to navigate user to a different page
  const navigatePage = (accordionId: string, type: string) => {
    if (type === "folder") {
      router.push(`/dashboard/${workspaceId}/${accordionId}`);
    }
    if (type === "file") {
      router.push(
        `/dashboard/${workspaceId}/${folderId}/${
          accordionId.split("folder")[1]
        }`
      );
    }
  };

  //add a file
  const addNewFile = async () => {
    if (!workspaceId) return;
    const newFile: File = {
      folderId: id,
      data: null,
      createdAt: new Date().toISOString(),
      inTrash: null,
      title: "Untitled",
      iconId: "📄",
      id: v4(),
      workspaceId,
      bannerUrl: "",
    };

    dispatch({
      type: "ADD_FILE",
      payload: {
        workspaceId,
        folderId: id,
        file: newFile,
      },
    });

    const { data, error } = await addFile(newFile);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not create a file",
      });
    } else {
      toast({
        title: "Success",
        description: "File created!",
      });
    }
  };

  //double click handler
  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  //blur
  const handleBlur = async () => {
    setIsEditing(false);
    const fId = id.split("folder");
    if (fId.length === 1) {
      if (!folderTitle) return;
      const { data, error } = await updateFolder(fId[0], {
        title: folderTitle,
      });
      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not update folder title",
        });
      } else {
        toast({
          title: "Success",
          description: "Folder title Updated!",
        });
      }
    }

    if (fId.length === 2 && fId[1]) {
      if (!fileTitle) return;
      const { data, error } = await updateFile(fId[1], { title: fileTitle });
      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not update file title",
        });
      } else {
        toast({
          title: "Success",
          description: "File title Updated!",
        });
      }
    }
  };

  //onChnages
  const onChangeEmoji = async (selectedEmoji: string) => {
    if (!workspaceId || !folderId) return;

    if (listType === "folder") {
      dispatch({
        type: "UPDATE_FOLDER",
        payload: {
          workspaceId,
          folderId,
          folder: { iconId: selectedEmoji },
        },
      });

      const { data, error } = await updateFolder(id, { iconId: selectedEmoji });
      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not update the emoji for this folder",
        });
      } else {
        toast({
          title: "Success",
          description: "Updated emoji for the folder",
        });
      }
    }
  };

  const folderTitleChange = (e: any) => {
    if (!workspaceId) return;
    const fId = id.split("folder");
    if (fId.length === 1) {
      dispatch({
        type: "UPDATE_FOLDER",
        payload: {
          folder: { title: e.target.value },
          folderId: fId[0],
          workspaceId,
        },
      });
    }
  };

  const fileTitleChange = (e: any) => {
    if (!workspaceId) return;
    const fId = id.split("folder");
    if (fId.length === 2 && fId[1]) {
      dispatch({
        type: "UPDATE_FILE",
        payload: {
          file: { title: e.target.value },
          workspaceId,
          folderId: fId[0],
          fileId: fId[1],
        },
      });
    }
  };

  //move to trash
  const moveToTrash = async () => {
    if (!user?.email || !workspaceId) return;
    const pathId = id.split("folder");
    if (listType === "folder") {
      dispatch({
        type: "UPDATE_FOLDER",
        payload: {
          workspaceId,
          folderId: pathId[0],
          folder: {
            inTrash: `Deleted by ${user?.email}`,
          },
        },
      });

      const { data, error } = await updateFolder(pathId[0], {
        inTrash: `Deleted by ${user?.email}`,
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not move the folder to trash",
        });
      } else {
        toast({
          title: "Success",
          description: "Moved folder to the trash!",
        });
      }
    }

    if (listType === "file") {
      dispatch({
        type: "UPDATE_FILE",
        payload: {
          workspaceId,
          folderId: pathId[0],
          fileId: pathId[1],
          file: {
            inTrash: `Deleted by ${user?.email}`,
          },
        },
      });

      const { data, error } = await updateFile(pathId[1], {
        inTrash: `Deleted by ${user?.email}`,
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not move the file to trash",
        });
      } else {
        toast({
          title: "Success",
          description: "Moved file to the trash!",
        });
      }
    }
  };

  const isFolder = listType === "folder";

  const groupIdentifies = useMemo(() => {
    return clsx(
      "text-white whitespace-nowrap flex justify-between items-center w-full relative",
      {
        "group/folder": isFolder,
        "group/file": !isFolder,
      }
    );
  }, []);

  const listStyles = useMemo(() => {
    return clsx("relative", {
      "border-none text-md": isFolder,
      "border-none ml-6 text-[16px] py-1": !isFolder,
    });
  }, [isFolder]);

  const hoverStyles = useMemo(() => {
    return clsx("h-full hidden rounded-sm absolute right-0", {
      "group-hover/file:block": listType === "file",
      "group-hover/folder:block": listType === "folder",
    });
  }, [listType]);

  return (
    <AccordionItem
      value={id}
      className={listStyles}
      onClick={(e) => {
        e.stopPropagation();
        navigatePage(id, listType);
      }}
    >
      <AccordionTrigger
        id={listType}
        className="hover:no-underline p-2 text-sm text-muted-foreground"
        disabled={listType === "file"}
      >
        <div className={groupIdentifies}>
          <div className="flex gap-4 justify-center items-center overflow-hidden">
            <div className="relative">
              <EmojiPicker getValue={onChangeEmoji}>{iconId}</EmojiPicker>
            </div>
            <input
              type="text"
              value={listType === "folder" ? folderTitle : fileTitle}
              className={clsx(
                "outline-none overflow-hidden w-[140px] text-slate-300",
                {
                  "bg-muted cursor-text": isEditing,
                  "bg-transparent cursor-pointer": !isEditing,
                }
              )}
              readOnly={!isEditing}
              onDoubleClick={handleDoubleClick}
              onBlur={handleBlur}
              onChange={
                listType === "folder" ? folderTitleChange : fileTitleChange
              }
            />
          </div>
          <div className={hoverStyles}>
            <TooltipComponent
              message={isFolder ? "Delete Folder" : "Delete File"}
            >
              <Trash
                onClick={moveToTrash}
                size={15}
                className="text-white hover:text-slate-300 transition-colors"
              />
            </TooltipComponent>
            {listType === "folder" && !isEditing && (
              <TooltipComponent message="Add File">
                <PlusIcon
                  onClick={addNewFile}
                  size={15}
                  className="text-white hover:text-slate-300 transition-colors"
                />
              </TooltipComponent>
            )}
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        {state.workspaces
          .find((workspace) => workspace.id === workspaceId)
          ?.folders.find((folder) => folder.id === id)
          ?.files.filter((file) => !file.inTrash)
          .map((file) => {
            const customFileId = `${id}folder${file.id}`;
            return (
              <Dropdown
                key={file.id}
                title={file.title}
                listType="file"
                id={customFileId}
                iconId={file.iconId}
              />
            );
          })}
      </AccordionContent>
    </AccordionItem>
  );
};

export default Dropdown;
