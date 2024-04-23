import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import useAxios from "../../hooks/useAxios";
import Loading from "../../components/Loading";
import { Empty, Badge, Avatar, Button, Textarea } from "keep-react";
import notFoundImg from "../assets/img/not-found.svg";
import getPostTime from "../../utility/getPostTime";
import {
  BsFileArrowUpFill,
  BsFileArrowDown,
  BsArrowLeftShort,
} from "react-icons/bs";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";
import CheckError from "../../components/CheckError";
import Comments from "../../components/Comments";
import {
  FacebookIcon,
  FacebookShareButton,
  TwitterShareButton,
  XIcon,
  FacebookMessengerIcon,
  FacebookMessengerShareButton,
} from "react-share";
import ReCAPTCHA from "react-google-recaptcha";
import useTitle from "../../hooks/useTitle";

const PostItem = () => {
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
      const { data } = await axios.get(`/post/${postID}`);
      return data;
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
    content: {
      title,
      tag,
      des,
      postTime: loadTime,
      author: { imgLink, name },
      voteCount: { upVote, downVote },
      comment: { count },
    },
    comments,
  } = postData;

  const shareUrl = `${window.location.origin}/post/${postID}`;
  const postTime = getPostTime(loadTime);
  changeTitle(title);

  const userCond = () => {
    if (!user) {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "You need to login/register for do this!",
        confirmButtonText: "login",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login", { state: { from: location } });
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
      const captchaValue = recaptcha.current.getValue();
      if (!captchaValue) {
        Swal.fire({
          icon: "warning",
          text: "Please verify the reCAPTCHA!",
        });
        return;
      }
      axios.post("/captcha/verify", { captchaValue }).then(({ data }) => {
        if (data.success) {
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
        } else {
          Swal.fire({
            icon: "error",
            text: "Invalid reCaptcha!",
          });
        }
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
  const renderComments = comments?.map((ele) => (
    <Comments key={ele._id} inputData={ele} />
  ));

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

export default PostItem;
