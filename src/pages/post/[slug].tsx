"use client";
import {
  AllComment,
  CreateComment,
  ModalConfirmationDelete,
  RootLayout,
  Skeleton,
  SplashScreen,
} from "@/components";
import { Comment, User } from "@/helpers/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import moment from "moment";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
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

export const getServerSideProps: GetServerSideProps = async (params) => {
  fetch("/api/posts/getPostByPostId", {
    method: "POST",
    body: JSON.stringify({
      id: params?.query?.slug,
    }),
  });

  return {
    props: {
      message: "Hello World",
    },
  };
};

function DetailPost() {
  const session = useSession();
  const router = useRouter();
  const params = router?.query;

  const [showModal, setShowModal] = useState(false);
  const [commentId, setCommentId] = useState("");

  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["post-detail"],
    queryFn: async () => {
      const data = await axios.post("/api/posts/getPostByPostId", {
        id: params?.slug,
      });
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err?.response?.status === 400) {
          const lengthChar = err.response?.data?.message?.length || 5;
          toast.error(err?.response?.data?.message, {
            duration: lengthChar * 100,
          });
        } else {
          const lengthChar = err?.response?.statusText?.length || 5;
          toast.error(err?.response?.statusText, {
            duration: lengthChar * 100,
          });
        }
      }
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
      {/* <h1>Detail Post</h1> */}

      {showModal && (
        <ModalConfirmationDelete
          showModal={showModal}
          setShowModal={setShowModal}
          onDelete={() => mutation.mutate()}
          isLoading={mutation.status === "loading"}
          type="comment"
        />
      )}

      {query?.isError ? (
        <h2 className="bg-red-200 text-center py-4 mt-10">
          Something went wrong :({" "}
        </h2>
      ) : (
        <>
          {!query?.isFetchedAfterMount ? (
            <Skeleton type="post" total={1} />
          ) : query?.status === "success" ? (
            <div className="w-full bg-sage-100 rounded-lg shadow-lg shadow-sage-100 px-6 py-6">
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

              <div className="mt-4 w-full bg-light/60 px-4 py-2 rounded-lg">
                <pre
                  className={`font-sans whitespace-pre-wrap leading-relaxed text-base tracking-wide`}
                >
                  {data?.title}
                </pre>
              </div>

              <div className="flex items-center mt-4 ml-1 gap-3">
                <h2 className="text-sm tracking-wide">
                  {data?.comment?.length} Comment
                </h2>
              </div>
            </div>
          ) : null}
          <div className="mt-4">
            {!query?.isFetchedAfterMount ? (
              <Skeleton type="input-comment" total={1} />
            ) : (
              <CreateComment postId={params?.slug} />
            )}
          </div>
          <div className="mt-4">
            {!query?.isFetchedAfterMount ? (
              <Skeleton type="comment" total={2} />
            ) : query?.status === "success" ? (
              <AllComment data={data?.comment} deleteHandler={deleteHandler} />
            ) : null}
          </div>
        </>
      )}
    </RootLayout>
  );
}

export default DetailPost;