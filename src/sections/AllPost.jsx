import Loading from "../components/Loading";
import PostItem from "../components/PostItem";
import useAxios from "../hooks/useAxios";
import { useQuery } from "@tanstack/react-query";

const AllPost = () => {
  const axios = useAxios();
  const {
    data: posts,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await axios.get("/post/all");
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
  const renderAllPosts = posts?.map((post) => (
    <PostItem key={post._id} inputData={post} />
  ));
  return (
    <div className="my-20">
      <div className="grid grid-cols-2 gap-3">{renderAllPosts}</div>
    </div>
  );
};

export default AllPost;
