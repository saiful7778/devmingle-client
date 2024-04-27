import { Button } from "keep-react";
import PropTypes from "prop-types";
import { FaTrashCan } from "react-icons/fa6";
import { BsFileArrowUpFill, BsFileArrowDown } from "react-icons/bs";
import Swal from "sweetalert2";
import useAxiosSecure from "../hooks/useAxiosSecure";
import useAuth from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";

const UserPost = ({ inputData, reFatch }) => {
  const {
    id,
    title,
    voteCount: { upVote, downVote },
    commentCount,
  } = inputData;
  const navigate = useNavigate();

  const axiosSecure = useAxiosSecure();
  const { user, userData, token } = useAuth();

  const handleDelete = async () => {
    try {
      const { isConfirmed } = await Swal.fire({
        icon: "warning",
        title: "Are you sure?",
        text: `delete "${title}"`,
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });
      if (isConfirmed) {
        Swal.fire({
          title: "Loading....",
          didOpen: () => {
            Swal.showLoading();
          },
          showConfirmButton: false,
        });
        const { data } = await axiosSecure.delete(`/post/delete/${id}`, {
          params: { email: user.email, userId: userData._id },
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!data.success) {
          throw new Error("Something went wrong");
        }
        if (data?.data?.deletedCount === 1) {
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: `"${title}" has been deleted.`,
          });
          reFatch();
        } else {
          Swal.fire({
            title: "Delete incomplate!",
            text: `"${title}" not deleted.`,
            icon: "error",
          });
          reFatch();
        }
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        text: err,
      });
    }
  };

  return (
    <div className="flex overflow-hidden justify-between gap-2 p-2 rounded-lg border border-blue-600 bg-white">
      <div className="flex flex-col">
        <Link to={`/post/${id}`}>
          <h3 className="flex-1 leading-5 md:text-xl font-semibold capitalize hover:underline max-h-16 overflow-hidden">
            {title}
          </h3>
        </Link>
        <div className="my-2">Comments: {commentCount}</div>
        <div className="flex gap-2 items-center">
          <Button
            onClick={() => navigate(`/dashboard/comments/${id}`)}
            size="sm"
            className="btn"
            type="primary"
          >
            Comment
          </Button>
          <Button
            onClick={handleDelete}
            size="sm"
            color="error"
            className="btn py-1"
            type="primary"
          >
            <FaTrashCan />
          </Button>
        </div>
      </div>
      <div>
        <Button size="sm" className="mb-1">
          <BsFileArrowUpFill size={20} />
          <span className="text-xl font-bold ml-1">{upVote}</span>
        </Button>
        <Button size="sm">
          <BsFileArrowDown size={20} />
          <span className="text-xl font-bold ml-1">{downVote}</span>
        </Button>
      </div>
    </div>
  );
};
UserPost.propTypes = {
  inputData: PropTypes.object,
  reFatch: PropTypes.func,
};
export default UserPost;
