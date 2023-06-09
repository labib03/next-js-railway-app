import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { toast } from "react-hot-toast";
import Loader from "../Loader/Loader";

type Props = {
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
};

function CreatePost({ isLoading, setIsLoading }: Props) {
  const [inputValue, setInputValue] = useState("");

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => {
      return axios.post("/api/posts/addPost", { data: inputValue });
    },
    onSuccess: (data) => {
      toast.success("Yeay, post berhasil dibuat", {
        id: "success",
      });
      setIsLoading(false);
      setInputValue("");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        const lengthChar = err.response?.data?.message?.length || "";
        toast.error(err?.response?.data?.message, {
          id: "error",
          duration: lengthChar * 100,
        });
        setIsLoading(false);
      }
    },
  });

  const createPostHandler = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    mutation.mutate();
  };

  return (
    <div className="bg-sage-100 shadow-md shadow-sage-100 rounded-md p-4">
      <textarea
        rows={4}
        placeholder="Write something ..."
        value={inputValue}
        disabled={mutation.isLoading}
        className="w-full bg-light border-2 px-4 py-2 resize-none outline-none border-sage-200 rounded-md transition-all duration-200 focus:border-sage-200 focus:outline-none"
        onChange={(e) => setInputValue(e.target.value)}
      />

      <div className="flex justify-between items-center my-3">
        <h2
          className={`ml-2 ${
            inputValue?.length > 340 && inputValue?.length < 380
              ? "text-champagne-300"
              : inputValue?.length >= 380
              ? "text-red-500"
              : ""
          }`}
        >
          {inputValue.length} / 400
        </h2>
        <button
          onClick={createPostHandler}
          disabled={mutation.isLoading}
          className="bg-sage-200 px-4 py-2 tracking-wide rounded-md text-sm transition-all duration-200 hover:bg-sage-300 disabled:cursor-auto disabled:bg-stone-300 disabled:border-stone-400/50"
        >
          <span className="flex flex-row items-center gap-2">
            {mutation?.isLoading ? (
              <Loader borderColor="border-white" text="Loading" />
            ) : (
              <>
                <PaperAirplaneIcon className="w-5" />
                <span className="hidden md:block">Create a post</span>
              </>
            )}
          </span>
        </button>
      </div>
    </div>
  );
}

export default CreatePost;
