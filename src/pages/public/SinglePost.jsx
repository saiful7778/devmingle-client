import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import useAxios from "@/hooks/useAxios";
import Loading from "@/components/Loading";
import { Badge, Button, Textarea } from "keep-react";
import getPostTime from "@/utility/getPostTime";
import {
  BsFileArrowUpFill,
  BsFileArrowDown,
  BsArrowLeftShort,
} from "react-icons/bs";
import useAuth from "@/hooks/useAuth";
import Swal from "sweetalert2";
import CheckError from "@/components/CheckError";
import Comments from "@/components/Comments";
import {
  FacebookIcon,
  FacebookShareButton,
  TwitterShareButton,
  XIcon,
  FacebookMessengerIcon,
  FacebookMessengerShareButton,
} from "react-share";
import ReCAPTCHA from "react-google-recaptcha";
import useTitle from "@/hooks/useTitle";
import ErrorDataShow from "@/components/ErrorDataShow";
import Avatar from "@/components/utilities/Avatar";

const SinglePost = () => {
  const { postID } = useParams();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const changeTitle = useTitle();
  const recaptcha = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, userData, token } = useAuth();
  const axios = useAxios();
  const {
    data: postData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["postData", postID],
    queryFn: async () => {
      const { data } = await axios.get(`/post/${postID}`);
      return data?.data;
    },
  });

  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <ErrorDataShow />;
  }

  const {
    title,
    tags,
    des,
    createdAt,
    author: { id: authorId, userName, userPhoto },
    voteCount: { upVote, downVote },
    commentCount,
    comments,
  } = postData;

  const shareUrl = `${window.location.origin}/post/${postID}`;
  const postTime = getPostTime(createdAt);
  changeTitle(title);

  const userCondition = async () => {
    if (!user) {
      const { isConfirmed } = await Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "You need to login/register for do this!",
        confirmButtonText: "login",
      });
      if (isConfirmed) {
        navigate("/login", { state: { from: location } });
      }
      return false;
    }
    return true;
  };

  const handleVote = async (vote) => {
    try {
      const isUserLogged = await userCondition();

      if (isUserLogged) {
        const voteKey =
          vote === "up" ? "upVote" : vote === "down" && "downVote";
        const voteValue =
          voteKey === "upVote" ? upVote : voteKey === "downVote" && downVote;

        const deffVoteKey =
          voteKey === "upVote"
            ? "downVote"
            : voteKey === "downVote" && "upVote";

        const deffVoteValue =
          voteKey === "upVote" ? downVote : voteKey === "downVote" && upVote;

        const { data } = await axios.patch(
          `/post/update/${postID}`,
          {
            voteCount: {
              [voteKey]: parseInt(voteValue) + 1,
              [deffVoteKey]: deffVoteValue,
            },
          },
          {
            params: { email: user.email, userId: userData._id },
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (data?.data?.modifiedCount) {
          refetch();
        }
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        text: err,
      });
    }
  };

  const submitData = async (e) => {
    try {
      const isUserLogged = await userCondition();
      if (isUserLogged) {
        const captchaValue = recaptcha.current.getValue();
        if (!captchaValue) {
          Swal.fire({
            icon: "warning",
            text: "Please verify the reCAPTCHA!",
          });
          return;
        }
        const { data: reCaptcha } = await axios.post("/captcha/verify", {
          captchaValue,
        });
        if (!reCaptcha.success) {
          Swal.fire({
            icon: "error",
            text: "Invalid reCaptcha!",
          });
          return;
        }
        const { data: commentData } = await axios.post(
          `/post/comment/${postID}`,
          { details: e.comment },
          {
            params: { email: user.email, userId: userData._id },
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!commentData.success) {
          Swal.fire({
            icon: "error",
            text: "Comment doesn't create",
          });
          return;
        }
        refetch();
        reset();
        Swal.fire({
          icon: "success",
          title: "Comment is added!",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        text: err,
      });
    }
  };

  return (
    <div className="my-6 space-y-2">
      <Link to="/post">
        <Button className="btn" size="xs" type="primary">
          <BsArrowLeftShort size={30} />
          <span className="ml-2">Back</span>
        </Button>
      </Link>
      <div className="flex md:flex-row flex-col justify-between py-2">
        <div>
          <h1 className="md:text-4xl text-3xl font-bold">{title}</h1>
          <div className="font-medium text-gray-600">Created: {postTime}</div>
          <div className="flex items-center gap-2 my-2">
            <div className="text-xl font-semibold">Share: </div>
            <FacebookShareButton url={shareUrl}>
              <FacebookIcon size={32} round />
            </FacebookShareButton>
            <FacebookMessengerShareButton url={shareUrl}>
              <FacebookMessengerIcon size={32} round />
            </FacebookMessengerShareButton>
            <TwitterShareButton url={shareUrl}>
              <XIcon size={32} round />
            </TwitterShareButton>
          </div>
        </div>
        <div className="flex md:flex-col flex-row gap-2">
          <Button
            onClick={() => handleVote("up")}
            size="xs"
            type="outlinePrimary"
            className="active:focus:scale-95 duration-100"
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
        <Avatar img={userPhoto} size="sm" />
        <Link
          to={`/user/${authorId}`}
          className="text-lg font-medium hover:underline"
        >
          {userName}
        </Link>
      </div>
      <div className="flex flex-wrap gap-1 mt-1">
        {tags?.map((tagEle, idx) => (
          <Badge
            key={"tag" + idx}
            className="capitalize select-none"
            colorType="light"
            color="gray"
            badgeType="outline"
          >
            {tagEle}
          </Badge>
        ))}
      </div>
      <p>{des}</p>
      <div className="text-xl font-bold">Comments: {commentCount}</div>
      <div className="py-3 space-y-3">
        {comments?.map((ele, idx) => (
          <Comments key={"comments" + idx} inputData={ele} />
        ))}
      </div>
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
        <ReCAPTCHA ref={recaptcha} sitekey={import.meta.env.VITE_SITE_KEY} />
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

export default SinglePost;
