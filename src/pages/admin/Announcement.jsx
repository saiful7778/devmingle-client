import { useForm } from "react-hook-form";
import CheckError from "../../components/CheckError";
import { TextInput, Textarea, Spinner } from "keep-react";
import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const Announcement = () => {
  const [spinner, setSpinner] = useState(false);
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const submitData = (e) => {
    setSpinner(true);
    const data = {
      ...e,
      authorInfo: {
        name: user.displayName,
        imgLink: user?.photoURL ? user?.photoURL : null,
      },
    };
    axiosSecure
      .post("/announcement", data, { params: { email: user.email } })
      .then(({ data }) => {
        if (data.acknowledged) {
          Swal.fire({
            icon: "success",
            title: "Announcement is created",
          });
          reset();
          setSpinner(false);
        } else {
          Swal.fire({
            icon: "error",
            title: "Announcement is created!",
          });
          reset();
          setSpinner(false);
        }
      })
      .catch((err) => {
        console.error(err);
        reset();
        Swal.fire({
          icon: "error",
          title: "Announcement is created!",
        });
        setSpinner(false);
      });
  };
  return (
    <>
      <h4 className="text-blue-600 text-5xl font-bold text-center">
        Announcement
      </h4>
      <p className="text-center text-gray-500 text-sm mt-2 mb-5">
        Author image and name is automatically added by logged user
      </p>
      <form className="space-y-3" onSubmit={handleSubmit(submitData)}>
        <div>
          <TextInput
            placeholder="Title"
            type="text"
            {...register("title", {
              required: true,
            })}
          />
          <CheckError error={errors} inputName="title" fieldName="required">
            Title is required
          </CheckError>
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
          {spinner ? <Spinner color="info" size="sm" /> : "Submit"}
        </button>
      </form>
    </>
  );
};

export default Announcement;
