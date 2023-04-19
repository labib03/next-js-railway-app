import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { FormEvent, useState } from "react";
import Loader from "../Loader/Loader";

function CreatePost() {
  const [inputValue, setInputValue] = useState("");

  const mutation = useMutation({
    mutationFn: async (payload) => {
      await axios.post("/api/posts/addPost", payload);
    },
  });

  const createPostHandler = (e: FormEvent) => {
    e.preventDefault();
    mutation.mutate({ data: inputValue });
  };

  return (
    <div className="bg-sage-100 rounded-md p-4">
      <textarea
        rows={4}
        placeholder="Write something ..."
        value={inputValue}
        className="w-full bg-light border-2 px-4 py-2 border-sage-200 rounded-md transition-all duration-200 focus:border-light focus:outline-none placeholder:italic"
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
          className="bg-sage-200 px-4 py-1 tracking-wide rounded-md border border-sage-300 transition-all duration-200 hover:bg-sage-300 disabled:cursor-auto disabled:bg-sage-300"
        >
          <span>
            {mutation?.isLoading ? (
              <Loader borderColor="border-white" text="Loading" />
            ) : (
              "Create a post"
            )}
          </span>
        </button>
      </div>
    </div>
  );
}

export default CreatePost;
