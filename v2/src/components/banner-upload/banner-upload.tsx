import {
  AppFoldersType,
  AppWorkspacesType,
} from "@/lib/providers/state-provider";
import { File, Folder, Workspace } from "@/lib/supabase/supabase.types";
import React from "react";
import CustomDialogTrigger from "../global/custom-dialog-trigger";
import BannerUploadForm from "./banner-upload-form";

interface BannerUploadProps {
  children: React.ReactNode;
  className?: string;
  dirType: "file" | "folder" | "workspace";
  id: string;
}

const BannerUpload: React.FC<BannerUploadProps> = ({
  children,
  className,
  dirType,
  id,
}) => {
  return (
    <CustomDialogTrigger
      header="Upload Banner"
      content={<BannerUploadForm dirType={dirType} id={id} />}
      className={className}
    >
      {children}
    </CustomDialogTrigger>
  );
};

export default BannerUpload;
