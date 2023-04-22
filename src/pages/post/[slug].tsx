import {
  AllComment,
  CreateComment,
  ModalConfirmation,
  RootLayout,
  Skeleton,
  SplashScreen,
} from "@/components";
import { Comment, User } from "@/helpers/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import moment from "moment";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { toast } from "react-hot-toast";

type queryProps = {
  data: {
    comment: Comment[];
    createdAt: string;
    id: string;
    published: boolean;
    title: string;
    updatedAt: string;
    userId: string;
    user?: User;
  };
};

function DetailPost() {
  const session = useSession();
  const router = useRouter();
  const params = router.query;

  const [showModal, setShowModal] = useState(false);
  const [commentId, setCommentId] = useState("");

  const queryClient = useQueryClient();

  const query = useQuery<queryProps>({
    queryKey: ["post-detail"],
    queryFn: () => {
      return axios.post("/api/posts/getPostByPostId", { id: params?.id });
    },
  });

  const mutation = useMutation({
    mutationFn: () => {
      return axios.post("/api/posts/deleteComment", { id: commentId });
    },
    onSuccess: () => {
      toast.success("Comment berhasil dihapus", {
        id: "success",
      });
      setShowModal(false);
      queryClient.invalidateQueries({ queryKey: ["post-detail"] });
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        const lengthChar = err.response?.data?.message?.length || "";
        toast.error(err?.response?.data?.message, {
          id: "error",
          duration: lengthChar * 100,
        });
        setShowModal(false);
      }
    },
  });

  const { data } = query?.data || {};

  const deleteHandler = (payload: string) => {
    setShowModal(!showModal);
    setCommentId(payload);
  };

  if (session?.status?.toLowerCase() === "unauthenticated") {
    setTimeout(() => {
      router.push({
        pathname: "/auth",
      });
    }, 900);
    return <SplashScreen />;
  }

  if (session?.status === "loading") {
    return <SplashScreen />;
  }

  return (
    <RootLayout>
      <h1>Detail Post</h1>

      {showModal && (
        <ModalConfirmation
          showModal={showModal}
          setShowModal={setShowModal}
          onDelete={() => mutation.mutate()}
          isLoading={mutation.status === "loading"}
          type="comment"
        />
      )}

      {!query?.isFetchedAfterMount ? (
        <Skeleton total={1} />
      ) : query?.status === "success" ? (
        <div className="w-full bg-sage-100 border-2 border-sage-200 rounded-lg shadow-lg shadow-sage-100 px-6 py-6 mt-10">
          <div className="flex items-center gap-2">
            <Image
              src={data?.user?.image || ""}
              alt="user-image"
              className="rounded-full"
              width={30}
              height={30}
            />

            <h2 className="text-lg tracking-wide text-gallery-950">
              {data?.user?.name}
            </h2>
          </div>

          <div className="text-xs tracking-wide mt-3 text-slate-500">
            <span className="font-semibold">
              {moment(data?.createdAt).fromNow()}
            </span>{" "}
            - <span className="text-black">{data?.user?.email}</span>
          </div>

          <div className="mt-4 w-full bg-light border-2 border-sage-200 px-4 py-2 rounded-lg">
            <pre
              className={`font-sans whitespace-pre-wrap leading-relaxed text-base tracking-wide`}
            >
              {data?.title}
            </pre>
          </div>

          <div className="flex items-center mt-4 gap-3">
            {/* <Link
              className="text-sm tracking-wide inline-block bg-champagne-200 border border-champagne-300 py-1 px-2 rounded-lg transition-all duration-200 hover:bg-champagne-300"
              href={{
                pathname: `/post/${data?.id}`,
                query: { id: data?.id },
              }}
            >
              Reply
            </Link> */}
            <h2 className="text-sm tracking-wide">
              {data?.comment?.length} Comment
            </h2>
          </div>
        </div>
      ) : null}

      {!query?.isFetchedAfterMount ? (
        <Skeleton total={1} />
      ) : query?.status === "success" ? (
        <>
          <div className="mt-4">
            <CreateComment postId={params?.id} />
          </div>
          <div className="mt-4">
            <AllComment data={data?.comment} deleteHandler={deleteHandler} />
          </div>
        </>
      ) : null}
    </RootLayout>
  );
}

export default DetailPost;
