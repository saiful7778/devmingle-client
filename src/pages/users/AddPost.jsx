import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { TextInput, Spinner, Textarea } from "keep-react";
import CheckError from "@/components/CheckError";
import useAuth from "@/hooks/useAuth";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { postTags } from "@/api/staticData";
import { RxCross2 } from "react-icons/rx";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import { Badge } from "keep-react";
import useTitle from "@/hooks/useTitle";

const AddPost = () => {
  const { user, userData, token } = useAuth();
  const changeTitle = useTitle();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [spinner, setSpinner] = useState(false);
  const [tag, setTag] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const handleAddTag = (currentTag) => {
    if (!tag.includes(currentTag)) {
      setTag((prop) => [...prop, currentTag]);
    }
  };

  changeTitle("Add post - dashboard");

  const renderSelectedTags = tag.map((ele, idx) => (
    <TagComp key={"tg" + idx} allTags={tag} setAllTags={setTag}>
      {ele}
    </TagComp>
  ));

  const submitData = async (e) => {
    try {
      setSpinner(true);
      if (tag.length === 0) {
        Swal.fire({
          icon: "error",
          text: "Please enter tag",
        });
        setSpinner(false);
        return;
      }

      const body = {
        title: e.title,
        des: e.des,
        tag,
      };

      const { data } = await axiosSecure.post("/post", body, {
        params: { email: user.email, userId: userData._id },
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!data.success) {
        const { isConfirmed } = await Swal.fire({
          icon: "error",
          title: "You have reached 5 post!",
          text: "Please update your membership",
          confirmButtonText: "Become a member",
        });
        if (isConfirmed) {
          navigate("/membership");
        }
      }
      Swal.fire({
        icon: "success",
        title: "Post is created",
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        text: err,
      });
    } finally {
      setSpinner(false);
      setTag([]);
      reset();
    }
  };

  return (
    <>
      <h4 className="text-blue-600 text-4xl md:text-5xl font-bold text-center">
        Add new post
      </h4>
      <p className="text-center text-gray-500 text-sm mt-2 mb-5">
        Author image, name and email is automatically added by logged user
      </p>
      <form className="space-y-3" onSubmit={handleSubmit(submitData)}>
        <div>
          <TextInput
            placeholder="Post title"
            type="text"
            {...register("title", {
              required: true,
            })}
          />
          <CheckError error={errors} inputName="title" fieldName="required">
            Post title is required
          </CheckError>
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            Tags:{renderSelectedTags}
            {tag.length === 0 && (
              <div className="leading-3 text-sm text-red-500">
                Post tag is required
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-1 mt-1">
            {postTags?.map((tagEle) => (
              <Badge
                key={tagEle._id}
                className="capitalize select-none"
                colorType="light"
                color="gray"
                badgeType="outline"
                onClick={() => handleAddTag(tagEle.tagName)}
              >
                {tagEle.tagName}
              </Badge>
            ))}
          </div>
        </div>
        <div>
          <Textarea
            placeholder="Description"
            withBg={true}
            color="gray"
            border={true}
            rows={4}
            {...register("des", {
              required: true,
            })}
          />
          <CheckError error={errors} inputName="des" fieldName="required">
            Description is required
          </CheckError>
        </div>
        <button
          className="w-full bg-blue-600 text-white rounded-md p-2 font-medium active:focus:scale-95 duration-150"
          type="submit"
        >
          {spinner ? <Spinner color="info" size="sm" /> : "Add post"}
        </button>
      </form>
    </>
  );
};

const TagComp = ({ children, allTags, setAllTags }) => {
  const handleDismiss = () => {
    const remain = allTags.filter((ele) => ele !== children);
    setAllTags(remain);
  };
  return (
    <Badge
      className="capitalize"
      colorType="strong"
      color="success"
      badgeType="outline"
      icon={<RxCross2 size={18} />}
      iconPosition="right"
      onClick={handleDismiss}
    >
      {children}
    </Badge>
  );
};

TagComp.propTypes = {
  children: PropTypes.string,
  allTags: PropTypes.array,
  setAllTags: PropTypes.func,
};

export default AddPost;
