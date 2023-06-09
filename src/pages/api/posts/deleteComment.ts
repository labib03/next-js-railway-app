// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req?.body;
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(400).json({ message: "Please login first" });
  } else {
    // get a post by user id
    try {
      const result = await prisma?.comment?.delete({
        where: { id: id },
      });

      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ message: "error while get a post" });
    }
  }
}
