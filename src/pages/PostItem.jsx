import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import useAxios from "../hooks/useAxios";
import Loading from "../components/Loading";
import { Empty, Badge, Avatar, Button, Textarea } from "keep-react";
import notFoundImg from "../assets/img/not-found.svg";
import getPostTime from "../utility/getPostTime";
import { FaArrowLeft } from "react-icons/fa6";
import { BsFileArrowUpFill, BsFileArrowDown } from "react-icons/bs";
import useAuth from "../hooks/useAuth";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const PostItem = () => {
  const { postID } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const axios = useAxios();
  const {
    data: postData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["postData", postID],
    queryFn: async () => {
      const res = await axios.get(`/post/${postID}`);
      return res.data;
    },
  });
  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    console.error(error.message);
    return (
      <Empty
        title="Oops! No post found"
        content="You may be in the wrong place!"
        image={<img src={notFoundImg} height={234} width={350} alt="404" />}
      />
    );
  }
  const {
    title,
    tag,
    des,
    postTime: loadTime,
    author: { imgLink, name },
    voteCount: { upVote, downVote },
    comment: { count },
  } = postData;

  const postTime = getPostTime(loadTime);

  const userCond = () => {
    if (!user) {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "You need to login/register for do this!",
        confirmButtonText: "login",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
      return false;
    }
    return true;
  };

  const handleVote = (vote) => {
    if (userCond()) {
      const body =
        vote === "up"
          ? { upVote: parseInt(upVote + 1), downVote }
          : { downVote: parseInt(downVote + 1), upVote };
      axios
        .patch(`/post/${postID}`, body, {
          params: { email: user.email },
        })
        .then(({ data }) => {
          if (data.modifiedCount) {
            refetch();
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const renderTags = tag?.map((tagEle, idx) => (
    <Badge
      key={"tg" + idx}
      className="capitalize select-none"
      colorType="light"
      color="gray"
      badgeType="outline"
    >
      {tagEle}
    </Badge>
  ));
  return (
    <div className="mt-6 space-y-2">
      <Link to="/post">
        <Button size="xs" type="primary">
          <FaArrowLeft />
          <span className="ml-2">Back</span>
        </Button>
      </Link>
      <div className="flex justify-between">
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          <div className="font-medium text-gray-600">Created: {postTime}</div>
        </div>
        <div>
          <Button
            onClick={() => handleVote("up")}
            size="xs"
            type="outlinePrimary"
            className="mb-1 active:focus:scale-95 duration-100"
          >
            <BsFileArrowUpFill size={20} />
            <span className="text-xl font-bold">{upVote}</span>
          </Button>
          <Button
            onClick={() => handleVote("down")}
            size="xs"
            type="outlinePrimary"
            className="active:focus:scale-95 duration-100"
          >
            <BsFileArrowDown size={20} />
            <span className="text-xl font-bold">{downVote}</span>
          </Button>
        </div>
      </div>
      <div className="flex gap-2 items-center">
        <Avatar shape="circle" size="sm" bordered img={imgLink} />
        <h6 className="text-lg font-medium">{name}</h6>
      </div>
      <div className="flex flex-wrap gap-1 mt-1">{renderTags}</div>
      <p>{des}</p>
      <div className="text-xl font-bold">Comments: {count}</div>
      <Textarea
        placeholder="Leave a comment..."
        withBg={true}
        color="info"
        border={true}
        rows={4}
      />
      <button
        className="w-full bg-blue-600 text-white rounded-md p-2 font-medium active:focus:scale-95 duration-150"
        type="submit"
      >
        Add comment
      </button>
    </div>
  );
};

export default PostItem;
