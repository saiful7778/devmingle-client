import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import Loading from "../../components/Loading";
import UserPost from "../../components/UserPost";
import { Empty } from "keep-react";

const MyPost = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const {
    data: posts,
    isLoading,
    error,
    isError,
    refetch,
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
        <Empty
          title="Oops! You seem to be lost"
          content="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry."
          buttonText="Go To Home Page"
          redirectBtnSize="md"
          redirectUrl="/"
          image={
            <img
              src="https://staticmania.cdn.prismic.io/staticmania/499b23f3-41ed-4bc9-a9eb-43d13779d2f8_Property+1%3DSad+screen_+Property+2%3DSm.svg"
              height={234}
              width={350}
              alt="404"
            />
          }
        />
      </div>
    );
  }
  const renderPost = posts?.map((post) => (
    <UserPost key={post._id} inputData={post} reFatch={refetch} />
  ));
  return (
    <div className="bg-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">{renderPost}</div>
    </div>
  );
};

export default MyPost;
