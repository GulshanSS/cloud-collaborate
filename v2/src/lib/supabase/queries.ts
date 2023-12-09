"use server";

import { workspaces } from "../../../migrations/schema";
import db from "./db";
import { Subscription, Workspace } from "./supabase.types";

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
    console.log("Error", error);
    return {
      data: null,
      error: "Error",
    };
  }
};
