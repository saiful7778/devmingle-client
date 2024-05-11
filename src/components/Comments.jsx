import { Avatar } from "keep-react";
import PropTypes from "prop-types";
import moment from "moment";
import { Link } from "react-router-dom";

const Comments = ({ inputData }) => {
  const {
    user: { id, userName, userPhoto },
    details,
    createdAt,
  } = inputData || {};

  const commentTimeAgo = moment(createdAt).fromNow();
  return (
    <div className="flex gap-2">
      <div className="flex-shrink-0">
        <Avatar shape="circle" size="md" bordered img={userPhoto} />
      </div>
      <div>
        <Link
          to={`/user/${id}`}
          className="text-blue-600 hover:underline font-semibold"
        >
          {userName}
        </Link>
        <div className="text-xs italic text-gray-500 leading-tight">
          {commentTimeAgo}
        </div>
        <p className="md:text-sm text-xs">{details}</p>
      </div>
    </div>
  );
};

Comments.propTypes = {
  inputData: PropTypes.object,
};

export default Comments;
