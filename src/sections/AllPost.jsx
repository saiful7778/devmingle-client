import { useState } from "react";
import Loading from "../components/Loading";
import PostItem from "../components/PostItem";
import useAxios from "../hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import { Pagination } from "keep-react";

const AllPost = () => {
  const axios = useAxios();
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const {
    data: posts,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["posts", { currentPage, itemsPerPage }],
    queryFn: async () => {
      const res = await axios.get("/post/all", {
        params: { page: currentPage - 1, size: itemsPerPage },
      });
      setTotalItems(res.data.count);
      return res.data;
    },
  });
  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    console.error(error);
    return "error";
  }

  const numberOfPage = Math.ceil(totalItems / itemsPerPage);

  const renderAllPosts = posts?.result?.map((post) => (
    <PostItem key={post._id} inputData={post} />
  ));

  return (
    <div className="my-20">
      <h2 className="text-center text-4xl font-bold mb-10">All posts</h2>
      <div className="grid grid-cols-2 gap-3">{renderAllPosts}</div>
      <div className="flex justify-center mt-3">
        <Pagination
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          totalPages={numberOfPage}
          iconWithOutText={true}
          prevNextShape="roundSquare"
        />
      </div>
    </div>
  );
};

export default AllPost;
