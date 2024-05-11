import { useForm } from "react-hook-form";
import CheckError from "@/components/CheckError";
import { TextInput, Textarea, Spinner } from "keep-react";
import { useState } from "react";
import useAuth from "@/hooks/useAuth";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import Swal from "sweetalert2";

const AddAnnouncement = () => {
  const [spinner, setSpinner] = useState(false);
  const axiosSecure = useAxiosSecure();
  const { user, userData, token } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const submitData = async (e) => {
    try {
      setSpinner(true);
      const { data } = await axiosSecure.post(
        "/announcement",
        { title: e.title, details: e.des },
        {
          params: { email: user.email, userId: userData._id },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!data.success) {
        throw new Error("Something went wrong");
      }

      Swal.fire({
        icon: "success",
        title: "Announcement is created",
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        text: err,
      });
    } finally {
      setSpinner(false);
      reset();
    }
  };
  return (
    <>
      <h4 className="text-blue-600 text-4xl md:text-5xl font-bold text-center">
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

export default AddAnnouncement;
