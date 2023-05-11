/* eslint-disable react-hooks/exhaustive-deps */
import { Post } from "@/helpers/types";
import {
  HeartIcon as HeartOutlineIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import {
  ChatBubbleLeftRightIcon,
  HeartIcon as HeartSolidIcon,
} from "@heroicons/react/24/solid";
import { useDebouncedValue } from "@mantine/hooks";
import moment from "moment";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type Params = {
  name: string | undefined | null;
  postId: string;
  type: string;
};

type Props = {
  item: Post;
  disabledCommentButton?: boolean;
  disabledLikeButton?: boolean;
  withDeleteButton?: boolean;
  handleLikePost?: (params: Params) => void;
  handleUnlikePost?: (params: Params) => void;
  deleteHandler?: (payload: string) => void;
};

function PostComponent({
  item,
  disabledCommentButton,
  disabledLikeButton,
  withDeleteButton,
  handleLikePost = () => {},
  handleUnlikePost = () => {},
  deleteHandler = () => {},
}: Props) {
  const session = useSession();
  const [isLike, setIsLike] = useState(false);
  const [totalLike, setTotalLike] = useState(0);
  const [fetchLikeAPI, setFetchLikeAPI] = useState({
    like: false,
    unlike: false,
  });
  const [debounced] = useDebouncedValue(isLike, 2000);

  useEffect(() => {
    setIsLike(false);
    if (item?.like) {
      setTotalLike(item?.like?.length);
      for (const key of item?.like) {
        if (key?.name === session?.data?.user?.name) {
          setIsLike(true);
        }
      }
    }
  }, [item?.like]);

  useEffect(() => {
    if (debounced && fetchLikeAPI?.like) {
      handleLikePost({
        name: session?.data?.user?.name,
        postId: item?.id,
        type: "LIKE",
      });
    }
    if (!debounced && fetchLikeAPI?.unlike) {
      handleUnlikePost({
        name: session?.data?.user?.name,
        postId: item?.id,
        type: "UNLIKE",
      });
    }
  }, [debounced]);

  const handleLike = () => {
    if (!isLike) {
      setFetchLikeAPI({ like: true, unlike: false });
      setIsLike(true);
      setTotalLike((like) => like + 1);
    } else {
      setFetchLikeAPI({ like: false, unlike: true });
      setIsLike(false);
      setTotalLike((like) => like - 1);
    }
  };

  // const handleLikebackup = () => {
  //   if (item?.like?.length > 0) {
  //     for (const key of item?.like) {
  //       if (key?.name === session?.data?.user?.name) {
  //         return toast.error("Akun ini sudah memberi like pada postingan ini");
  //       } else {
  //         setIsLike(true);
  //         if (!isLike) {
  //           setTotalLike((like) => like + 1);
  //           handleLikePost({ name: item?.user?.name, postId: item?.id });
  //         }
  //       }
  //     }
  //   } else {
  //     setIsLike(true);
  //     if (!isLike) {
  //       setTotalLike((like) => like + 1);
  //       handleLikePost({ name: item?.user?.name, postId: item?.id });
  //     }
  //   }
  // };

  return (
    <div
      key={item?.id}
      className="w-full bg-sage-100/80 rounded-lg shadow-lg shadow-sage-100 px-6 py-6"
    >
      <div className="flex items-center gap-2 mb-7">
        <Image
          src={item?.user?.image || ""}
          alt="user-image"
          className="rounded-full"
          width={42}
          height={42}
        />

        <div className="flex flex-col">
          <h2 className="text-lg font-semibold tracking-wide text-gallery-950">
            {item?.user?.name}
          </h2>

          <p className="text-xs tracking-wide text-slate-500 flex items-center">
            {moment(item?.createdAt).format("Do MMMM YYYY")} -{" "}
            {moment(item?.createdAt).fromNow()}
          </p>
        </div>
      </div>

      <div className="mt-4 w-full bg-light/60 px-4 py-2 rounded-lg">
        <pre
          className={`font-sans whitespace-pre-wrap leading-relaxed text-base tracking-wide`}
        >
          {item?.title}
        </pre>
      </div>

      <div className="flex flex-row justify-between items-center mt-4 ml-1">
        <div className="flex items-center gap-3">
          {disabledCommentButton ? (
            <button
              disabled={true}
              className="flex items-center gap-1.5 text-sm tracking-wide bg-sage-100 py-1 px-3 rounded-lg"
            >
              <span>
                <ChatBubbleLeftRightIcon className="w-5 text-sage-400" />
              </span>
              {item?.comment?.length}
              <span>Komentar</span>
            </button>
          ) : (
            <button
              disabled={true}
              className="text-sm tracking-wide bg-sage-100 py-1 px-3 rounded-lg transition-all duration-200 hover:bg-sage-300/80 disabled:cursor-auto"
            >
              <Link
                className="flex items-center gap-1.5"
                href={{
                  pathname: `/post/${item?.id}`,
                }}
              >
                <span>
                  <ChatBubbleLeftRightIcon className="w-5 text-sage-400" />
                </span>
                {item?.comment?.length}
                <span>Komentar</span>
              </Link>
            </button>
          )}

          {disabledLikeButton ? (
            <button
              disabled={true}
              className="flex items-center gap-1.5 text-sm tracking-wide bg-sage-100 py-1 px-3 rounded-lg"
            >
              <span>
                <HeartSolidIcon className="w-5 text-red-400" />
              </span>
              {item?.like?.length}
              <span>Like</span>
            </button>
          ) : (
            <div
              className="bg-sage-100 py-1 px-3 rounded-lg transition-all duration-200 hover:bg-red-300/80 hover:cursor-pointer"
              onClick={handleLike}
            >
              <div>
                {isLike ? (
                  <h2 className="flex items-center gap-1 text-sm">
                    <span>
                      <HeartSolidIcon className="w-5 text-red-400" />
                    </span>
                    {totalLike}
                    <span>Like</span>
                  </h2>
                ) : (
                  <h2 className="flex items-center gap-1 text-sm">
                    <span>
                      <HeartOutlineIcon className="w-5" />
                    </span>
                    {totalLike}
                    <span>Like</span>
                  </h2>
                )}
              </div>
            </div>
          )}
        </div>

        {withDeleteButton && (
          <div>
            <button
              onClick={() => deleteHandler(item?.id)}
              className="flex items-center gap-1 text-sm bg-red-200 px-3 py-1 rounded-md text-red-400 transition-all duration-200 hover:bg-red-400 hover:text-white"
            >
              <span>
                <TrashIcon className="w-4" />
              </span>
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PostComponent;
