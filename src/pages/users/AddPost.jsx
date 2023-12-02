import { useState } from "react";
import { useForm } from "react-hook-form";
import { TextInput, Spinner, Textarea, Dropdown } from "keep-react";
import CheckError from "../../components/CheckError";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

/**
 * Post Title
 * Post Description
 * Tag
 */

const AddPost = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [spinner, setSpinner] = useState(false);
  const [tag, setTag] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const submitData = (e) => {
    setSpinner(true);
    const title = e.title;
    const des = e.des;
    if (!tag) {
      return setSpinner(false);
    }
    const body = {
      title,
      des,
      tag,
      author: {
        name: user.displayName,
        imgLink: user?.photoURL ? user?.photoURL : null,
        email: user.email,
      },
      voteCount: {
        upVote: 0,
        downVote: 0,
      },
    };
    axiosSecure
      .post(`/post/${user.uid}`, body, { params: { email: user.email } })
      .then(({ data }) => {
        if (data.message) {
          Swal.fire({
            icon: "success",
            title: "Post is created",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "You have reached 5 post!",
            text: "Please update your membership",
            confirmButtonText: "Become a member",
          }).then((result) => {
            if (result.isConfirmed) {
              navigate("/membership");
            }
          });
        }
        reset();
        setSpinner(false);
      })
      .catch((err) => {
        console.error(err);
        reset();
        setSpinner(false);
      });
  };
  return (
    <>
      <h4 className="text-blue-600 text-5xl font-bold text-center">
        Add new post
      </h4>
      <p className="text-center text-gray-500 text-sm mt-2 mb-5">
        Author image, name and email is automatically added by logged user
      </p>
      <form
        className="grid grid-cols-2 gap-3"
        onSubmit={handleSubmit(submitData)}
      >
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
        <div className="flex items-center gap-2">
          <Dropdown
            className="capitalize"
            label={tag ? tag : "tag"}
            size="sm"
            type="default"
            dismissOnClick={true}
          >
            <Dropdown.Item onClick={() => setTag("frontend")}>
              frontend
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setTag("backend")}>
              backend
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setTag("react")}>React</Dropdown.Item>
            <Dropdown.Item onClick={() => setTag("jsx")}>JSX</Dropdown.Item>
            <Dropdown.Item onClick={() => setTag("node")}>node</Dropdown.Item>
            <Dropdown.Item onClick={() => setTag("express")}>
              express
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setTag("mongodb")}>
              mongodb
            </Dropdown.Item>
          </Dropdown>
          {!tag && (
            <div className="leading-3 text-sm text-red-500">
              Tag is required
            </div>
          )}
        </div>
        <div className="col-span-2">
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
          className="col-span-2 bg-blue-600 text-white rounded-md p-2 font-medium active:focus:scale-95 duration-150"
          type="submit"
        >
          {spinner ? <Spinner color="info" size="sm" /> : "Add post"}
        </button>
      </form>
    </>
  );
};

export default AddPost;
