import db from "../utils/db.server";

export const findByIdOrCreateDocument = async (id: string) => {
  const document = await db.document.findUnique({
    where: {
      id,
    },
  });

  if (!document) {
    const document = await db.document.create({
      data: {
        id,
      },
    });
    return document;
  }
  return document;
};

export const saveDocument = async (id: string, content: string) => {
  await db.document.update({
    where: {
      id,
    },
    data: {
      content,
    },
  });
};
