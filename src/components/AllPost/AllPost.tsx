"use client";

import { Post } from "@/helpers/types";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import NoDataComponent from "../NoDataComponent/NoDataComponent";
import PostComponent from "../PostComponent/PostComponent";

type Params = {
  name: string | undefined;
  postId: string;
};

type Props = {
  data: Post[];
  handleLikePost: (params: Params) => void;
};

function AllPost({ data, handleLikePost }: Props) {
  const [parent] = useAutoAnimate();

  return (
    <div ref={parent} className="flex flex-col gap-10 mt-10">
      {data.length > 0 ? (
        data?.map((item) => (
          <PostComponent
            key={item?.id}
            item={item}
            handleLikePost={handleLikePost}
          />
        ))
      ) : (
        <NoDataComponent type="post" />
      )}
    </div>
  );
}

export default AllPost;
