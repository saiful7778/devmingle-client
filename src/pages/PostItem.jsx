import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import useAxios from "../hooks/useAxios";
import Loading from "../components/Loading";
import { Empty, Badge, Avatar, Button, Textarea } from "keep-react";
import notFoundImg from "../assets/img/not-found.svg";
import getPostTime from "../utility/getPostTime";
import {
  BsFileArrowUpFill,
  BsFileArrowDown,
  BsArrowLeftShort,
} from "react-icons/bs";
import useAuth from "../hooks/useAuth";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import CheckError from "../components/CheckError";
import Comments from "../components/Comments";
import {
  FacebookIcon,
  FacebookShareButton,
  FacebookShareCount,
} from "react-share";
import { Helmet } from "react-helmet";

const PostItem = () => {
  const { postID } = useParams();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
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
      const { data: postData } = await axios.get(`/post/${postID}`);
      const { data: commentData } = await axios.get(
        `/post/${postID}/comments`,
        {
          params: { title: postData?.title },
        }
      );
      return { postData, commentData };
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
    postData: {
      title,
      tag,
      des,
      postTime: loadTime,
      author: { imgLink, name },
      voteCount: { upVote, downVote },
      comment: { count },
    },
    commentData,
  } = postData;
  const shareUrl = `${window.location.origin}/post/${postID}`;

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

  const submitData = (e) => {
    if (userCond()) {
      const commentTime = new Date().getTime();
      const body = {
        title,
        postID,
        commentTime,
        author: {
          name: user.displayName,
          imgLink: user?.photoURL ? user?.photoURL : null,
          email: user.email,
        },
        ...e,
      };
      axios
        .post("/post/comment", body, {
          params: { email: user.email },
        })
        .then(({ data }) => {
          if (data.result.acknowledged) {
            refetch();
            reset();
            Swal.fire({
              icon: "success",
              title: "Comment is added!",
            });
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
  const renderComments = commentData?.map((ele) => (
    <Comments key={ele._id} inputData={ele} />
  ));

  return (
    <div className="my-6 space-y-2">
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <Link to="/post">
        <Button size="xs" type="primary">
          <BsArrowLeftShort size={30} />
          <span className="ml-2">Back</span>
        </Button>
      </Link>
      <div className="flex justify-between">
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          <div className="font-medium text-gray-600">Created: {postTime}</div>
          <div className="flex gap-2">
            <div>
              <FacebookShareButton url={shareUrl}>
                <FacebookIcon size={32} round />
              </FacebookShareButton>
              <FacebookShareCount
                url={shareUrl}
                className="Demo__some-network__share-count"
              >
                {(count) => count}
              </FacebookShareCount>
            </div>
          </div>
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
      <div className="py-3 space-y-3">{renderComments}</div>
      <form className="space-y-3" onSubmit={handleSubmit(submitData)}>
        <Textarea
          placeholder="Leave a comment..."
          withBg={true}
          color="info"
          border={true}
          rows={4}
          {...register("comment", { required: true })}
        />
        <CheckError error={errors} inputName="comment" fieldName="required">
          Comment is required
        </CheckError>
        <button
          className="w-full bg-blue-600 text-white rounded-md p-2 font-medium active:focus:scale-95 duration-150"
          type="submit"
        >
          Add comment
        </button>
      </form>
    </div>
  );
};

export default PostItem;
