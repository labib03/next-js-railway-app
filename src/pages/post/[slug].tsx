"use client";
import {
  AllComment,
  CreateComment,
  ModalConfirmationDelete,
  RootLayout,
  Skeleton,
  SplashScreen,
} from "@/components";
import PostComponent from "@/components/PostComponent/PostComponent";
import FetchLikePost from "@/handler/FetchLikePost";
import { Comment, User } from "@/helpers/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
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
  try {
    await fetch("/api/posts/getPostByPostId", {
      method: "POST",
      body: JSON.stringify({
        id: params?.query?.slug,
      }),
    });
  } catch (error) {
    console.log(error);
  }

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

  const { handleLikePost, handleUnlikePost } = FetchLikePost();

  const query = useQuery({
    queryKey: ["post-detail"],
    queryFn: async () => {
      try {
        const data = await axios.post("/api/posts/getPostByPostId", {
          id: params?.slug,
        });
        return data;
      } catch (error) {
        console.log(error);
      }
    },
    // onError: (err: ErrorProps) => {
    //   if (err?.response?.status === 400) {
    //     const lengthChar = err.response?.data?.message?.length || 5;
    //     toast.error(err?.response?.data?.message, {
    //       duration: lengthChar * 100,
    //     });
    //   } else {
    //     const lengthChar = err?.response?.statusText?.length || 5;
    //     const errMsg = err?.response?.statusText || "Something went wrong :(";
    //     toast.error(errMsg, {
    //       duration: lengthChar * 100,
    //     });
    //   }
    // },
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
            <PostComponent
              item={data}
              disabledCommentButton
              handleLikePost={handleLikePost}
              handleUnlikePost={handleUnlikePost}
            />
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
