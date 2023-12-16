"use server";

import { validate } from "uuid";
import { files, users, workspaces } from "../../../migrations/schema";
import db from "./db";
import { collaborators, folders } from "./schema";
import { File, Folder, Subscription, User, Workspace } from "./supabase.types";
import { and, eq, ilike, notExists } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const getUserSubscriptionStatus = async (userId: string) => {
  try {
    const data = await db.query.subscriptions.findFirst({
      where: (subscription, { eq }) => eq(subscription.userId, userId),
    });

    if (!data) {
      return {
        data: null,
        error: null,
      };
    }

    return {
      data: data as Subscription,
      error: null,
    };
  } catch (error) {
    console.log(error);
    return {
      data: null,
      error: `Error while fetching user subscription`,
    };
  }
};

export const createWorkspace = async (workspace: Workspace) => {
  try {
    const data = await db.insert(workspaces).values(workspace);
    return {
      data: null,
      error: null,
    };
  } catch (error) {
    console.log(error);
    return {
      data: null,
      error: "Error",
    };
  }
};

export const updateWorkspace = async (
  workspaceId: string,
  workspace: Partial<Workspace>
) => {
  const isValid = validate(workspaceId);
  if (!isValid) return { data: null, error: "Error" };
  try {
    await db
      .update(workspaces)
      .set(workspace)
      .where(eq(workspaces.id, workspaceId));
    return {
      data: null,
      error: null,
    };
  } catch (error) {
    console.log(error);
    return {
      data: null,
      error: "Error",
    };
  }
};

export const deleteWorkspace = async (workspaceId: string) => {
  if (!workspaceId) return;
  await db.delete(workspaces).where(eq(workspaces.id, workspaceId));
};

export const getWorkspaceDetails = async (workspaceId: string) => {
  const isValid = validate(workspaceId);
  if (!isValid) return { data: [], error: "Error" };
  try {
    const result = (await db.query.workspaces.findMany({
      where: (workspace, { eq }) => eq(workspace.id, workspaceId),
    })) as Workspace[];

    return {
      data: result,
      error: null,
    };
  } catch (error) {
    console.log(error);
    return {
      data: [],
      error: "Error",
    };
  }
};

export const getFolders = async (workspaceId: string) => {
  const isValid = validate(workspaceId);
  if (!isValid) {
    return {
      data: null,
      error: "Error",
    };
  }

  try {
    const results: Folder[] | [] = await db
      .select()
      .from(folders)
      .orderBy(folders.createdAt)
      .where(eq(folders.workspaceId, workspaceId));

    return {
      data: results,
      error: null,
    };
  } catch (error) {
    console.log(error);
    return {
      data: null,
      error: "Error",
    };
  }
};

export const getPrivateWorkspaces = async (userId: string) => {
  if (!userId) return [];
  const privateWorkspaces = (await db
    .selectDistinct({
      id: workspaces.id,
      createdAt: workspaces.createdAt,
      workspaceOwner: workspaces.workspaceOwner,
      title: workspaces.title,
      iconId: workspaces.iconId,
      data: workspaces.data,
      inTrash: workspaces.inTrash,
      logo: workspaces.logo,
      bannerUrl: workspaces.bannerUrl,
    })
    .from(workspaces)
    .where(
      and(
        notExists(
          db
            .select()
            .from(collaborators)
            .where(eq(collaborators.workspaceId, workspaces.id))
        ),
        eq(workspaces.workspaceOwner, userId)
      )
    )) as Workspace[];
  return privateWorkspaces;
};

export const getCollaborativeWorkspaces = async (userId: string) => {
  if (!userId) return [];
  const collaborativeWorkspaces = (await db
    .selectDistinct({
      id: workspaces.id,
      createdAt: workspaces.createdAt,
      workspaceOwner: workspaces.workspaceOwner,
      title: workspaces.title,
      iconId: workspaces.iconId,
      data: workspaces.data,
      inTrash: workspaces.inTrash,
      logo: workspaces.logo,
      bannerUrl: workspaces.bannerUrl,
    })
    .from(users)
    .innerJoin(collaborators, eq(users.id, collaborators.userId))
    .innerJoin(workspaces, eq(collaborators.workspaceId, workspaces.id))
    .where(eq(users.id, userId))) as Workspace[];
  return collaborativeWorkspaces;
};

export const getSharedWorkspaces = async (userId: string) => {
  if (!userId) return [];
  const sharedWorkspaces = (await db
    .selectDistinct({
      id: workspaces.id,
      createdAt: workspaces.createdAt,
      workspaceOwner: workspaces.workspaceOwner,
      title: workspaces.title,
      iconId: workspaces.iconId,
      data: workspaces.data,
      inTrash: workspaces.inTrash,
      logo: workspaces.logo,
      bannerUrl: workspaces.bannerUrl,
    })
    .from(workspaces)
    .orderBy(workspaces.createdAt)
    .innerJoin(collaborators, eq(workspaces.id, collaborators.workspaceId))
    .where(eq(workspaces.workspaceOwner, userId))) as Workspace[];
  return sharedWorkspaces;
};

export const addCollaborators = async (users: User[], workspaceId: string) => {
  const response = users.forEach(async (user: User) => {
    const userExists = await db.query.collborators.findFirst({
      where: (collborator, { eq }) =>
        and(
          eq(collborator.userId, user.id),
          eq(collborator.workspaceId, workspaceId)
        ),
    });
    if (!userExists) {
      await db.insert(collaborators).values({ workspaceId, userId: user.id });
    }
  });
};

export const removeCollaborators = async (
  users: User[],
  workspaceId: string
) => {
  const response = users.forEach(async (user: User) => {
    const userExists = await db.query.collborators.findFirst({
      where: (u, { eq }) =>
        and(eq(u.userId, user.id), eq(u.workspaceId, workspaceId)),
    });

    if (userExists) {
      await db
        .delete(collaborators)
        .where(
          and(
            eq(collaborators.workspaceId, workspaceId),
            eq(collaborators.userId, user.id)
          )
        );
    }
  });
};

export const getCollaborators = async (workspaceId: string) => {
  const response = await db
    .select()
    .from(collaborators)
    .where(eq(collaborators.workspaceId, workspaceId));
  if (!response.length) return [];

  const userInformation: Promise<User | undefined>[] = response.map(
    async (user) => {
      const exists = await db.query.users.findFirst({
        where: (u, { eq }) => eq(u.id, user.userId),
      });
      return exists;
    }
  );

  const resolvedUsers = await Promise.all(userInformation);

  return resolvedUsers.filter(Boolean) as User[];
};

export const getUserFormSearch = async (email: string) => {
  if (!email) return [];
  const accounts = db
    .select()
    .from(users)
    .where(ilike(users.email, `${email}%`));
  return accounts;
};

export const createFolder = async (folder: Folder) => {
  try {
    await db.insert(folders).values(folder);
    return { data: null, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: "Error" };
  }
};

export const updateFolder = async (
  folderId: string,
  folder: Partial<Folder>
) => {
  try {
    await db.update(folders).set(folder).where(eq(folders.id, folderId));
    return { data: null, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: "Error" };
  }
};

export const deleteFolder = async (folderId: string) => {
  try {
    await db.delete(folders).where(eq(folders.id, folderId));
    return {
      data: null,
      error: null,
    };
  } catch (error) {
    console.log(error);
    return {
      data: null,
      error: "Error",
    };
  }
};

export const getFolderDetails = async (folderId: string) => {
  const isValid = validate(folderId);
  if (!isValid) return { data: [], error: "Error" };
  try {
    const result = (await db.query.folders.findMany({
      where: (folder, { eq }) => eq(folder.id, folderId),
    })) as Folder[];
    return {
      data: result,
      error: null,
    };
  } catch (error) {
    console.log(error);
    return {
      data: [],
      error: "Error",
    };
  }
};

export const getFiles = async (folderId: string) => {
  const isValid = validate(folderId);
  if (!isValid) return { data: null, error: "Error" };
  try {
    const results = (await db
      .select()
      .from(files)
      .orderBy(files.createdAt)
      .where(eq(files.folderId, folderId))) as File[] | [];

    return { data: results, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: "Error" };
  }
};

export const addFile = async (file: File) => {
  try {
    await db.insert(files).values(file);
    return { data: null, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: "Error" };
  }
};

export const updateFile = async (fileId: string, file: Partial<File>) => {
  try {
    await db.update(files).set(file).where(eq(files.id, fileId));
    return { data: null, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: "Error" };
  }
};

export const deleteFile = async (fileId: string) => {
  try {
    await db.delete(files).where(eq(files.id, fileId));
    return { data: null, error: null };
  } catch (error) {
    console.log(error);
    return {
      data: null,
      error: "Error",
    };
  }
};

export const getFileDetails = async (fileId: string) => {
  const isValid = validate(fileId);
  if (!isValid) return { data: [], error: "Error" };
  try {
    const result = (await db.query.files.findMany({
      where: (file, { eq }) => eq(file.id, fileId),
    })) as File[];
    return {
      data: result,
      error: null,
    };
  } catch (error) {
    console.log(error);
    return {
      data: [],
      error: "Error",
    };
  }
};
