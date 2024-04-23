import { Avatar } from "keep-react";
import PropTypes from "prop-types";
import moment from "moment";

const Comments = ({ inputData }) => {
  const {
    user: { userName, userImage },
    details,
    createdAt,
  } = inputData || {};
  const commentTimeAgo = moment(createdAt).fromNow();
  return (
    <div className="flex gap-2">
      <div className="flex-shrink-0">
        <Avatar shape="circle" size="sm" bordered img={userImage} />
      </div>
      <div>
        <h6 className="text-lg text-blue-600 leading-3 font-semibold">
          {userName}
        </h6>
        <div className="text-sm italic text-gray-500">{commentTimeAgo}</div>
        <p className="md:text-sm text-xs">{details}</p>
      </div>
    </div>
  );
};
Comments.propTypes = {
  inputData: PropTypes.object,
};
export default Comments;
