import { Button } from "keep-react";
import PropTypes from "prop-types";
import { FaTrashCan } from "react-icons/fa6";
import { BsFileArrowUpFill, BsFileArrowDown } from "react-icons/bs";

const UserPost = ({ inputData }) => {
  const {
    _id,
    title,
    voteCount: { upVote, downVote },
  } = inputData;
  return (
    <div className="flex overflow-hidden justify-between gap-2 p-2 rounded-lg border border-blue-600 bg-white">
      <div className="flex flex-col">
        <h3 className="flex-1 leading-5 md:text-xl font-semibold capitalize max-h-16 overflow-hidden">
          {title}
        </h3>
        <div className="flex gap-2 items-center">
          <Button size="sm" className="btn" type="primary">
            Comment
          </Button>
          <Button size="sm" color="error" className="btn p-1" type="primary">
            <FaTrashCan />
          </Button>
        </div>
      </div>
      <div>
        <Button>
          <BsFileArrowUpFill size={25} />
          {upVote}
        </Button>
        <Button>
          <BsFileArrowDown size={25} />
          {downVote}
        </Button>
      </div>
    </div>
  );
};
UserPost.propTypes = {
  inputData: PropTypes.object,
};
export default UserPost;
