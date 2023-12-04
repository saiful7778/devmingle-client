import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import Loading from "../../components/Loading";
import UserPost from "../../components/UserPost";
import notFoundImg from "../../assets/img/not-found.svg";
import { Empty } from "keep-react";
import useTitle from "../../hooks/useTitle";
import { Tag } from "keep-react";

const MyPost = () => {
  const axiosSecure = useAxiosSecure();
  const changeTitle = useTitle();
  const { user } = useAuth();
  const {
    data: myPost,
    isLoading,
    error,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["mypost", user.displayName],
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
  if (myPost?.length === 0) {
    return (
      <>
        <Empty
          title="Oops! No post found"
          content="Please add some post"
          buttonText="Add new post"
          redirectBtnSize="md"
          redirectUrl="/dashboard/add_post"
          image={<img src={notFoundImg} height={234} width={350} alt="404" />}
        />
      </>
    );
  }
  changeTitle("My all post - dashboard");
  const renderPost = myPost?.map((post) => (
    <UserPost key={post._id} inputData={post} reFatch={refetch} />
  ));
  return (
    <div className="bg-gray-100">
      <div className="flex items-center gap-5 my-5 px-6">
        <p className="text-body-1 font-semibold text-metal-600">Total posts:</p>
        <Tag color="info">{myPost.length} post</Tag>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">{renderPost}</div>
    </div>
  );
};

export default MyPost;
