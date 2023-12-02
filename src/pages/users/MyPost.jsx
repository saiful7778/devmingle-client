import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import Loading from "../../components/Loading";
import UserPost from "../../components/UserPost";

const MyPost = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const {
    data: posts,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ["post"],
    queryFn: async () => {
      const res = await axiosSecure.get("/post", {
        params: { email: user.email },
      });
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
  if (posts?.length === 0) {
    return (
      <div className="text-center">
        <h4 className="text-3xl">No Post found</h4>
      </div>
    );
  }
  const renderPost = posts?.map((post) => (
    <UserPost key={post._id} inputData={post} />
  ));
  return (
    <div className="bg-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">{renderPost}</div>
    </div>
  );
};

export default MyPost;
