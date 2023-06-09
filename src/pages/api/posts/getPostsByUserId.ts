// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  // get user
  const user = await prisma?.user?.findUnique({
    where: { email: session?.user?.email || "" },
  });

  // get a post by user id
  try {
    const result = await prisma.post?.findMany({
      where: { userId: user?.id || "" },
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
        like: true,
        comment: { orderBy: { createdAt: "desc" }, include: { user: true } },
      },
    });

    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ message: "error while get a post" });
  }
}
