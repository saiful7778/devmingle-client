import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import useAuth from "@/hooks/useAuth";
import Loading from "@/components/Loading";
import UserPost from "@/components/UserPost";
import useTitle from "@/hooks/useTitle";
import { Tag } from "keep-react";
import ErrorDataShow from "@/components/ErrorDataShow";

const MyPost = () => {
  const axiosSecure = useAxiosSecure();
  const changeTitle = useTitle();
  const { user, userData, token } = useAuth();
  const {
    data: myPost,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["mypost", user.displayName],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/posts", {
        params: { email: user.email, userId: userData._id },
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
  });
  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <ErrorDataShow />;
  }
  if (myPost?.data?.length < 1) {
    return <ErrorDataShow />;
  }
  changeTitle("My all post - dashboard");

  return (
    <div className="bg-gray-100">
      <div className="flex items-center gap-5 my-5 px-6">
        <p className="text-body-1 font-semibold text-metal-600">Total posts:</p>
        <Tag color="info">{myPost?.totalCount} post</Tag>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {myPost?.data?.map((post, idx) => (
          <UserPost
            key={"user-post" + idx}
            inputData={post}
            reFatch={refetch}
          />
        ))}
      </div>
    </div>
  );
};

export default MyPost;
