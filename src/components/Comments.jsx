import { Avatar } from "keep-react";
import PropTypes from "prop-types";
import moment from "moment";

const Comments = ({ inputData }) => {
  const {
    author: { name, imgLink },
    comment,
    commentTime,
  } = inputData || {};
  const commentTimeAgo = moment(commentTime).fromNow();
  return (
    <div className="flex gap-2">
      <div className="flex-shrink-0">
        <Avatar shape="circle" size="sm" bordered img={imgLink} />
      </div>
      <div>
        <h6 className="text-lg text-blue-600 leading-3 font-semibold">
          {name}
        </h6>
        <div className="text-sm italic text-gray-500">{commentTimeAgo}</div>
        <p className="text-sm">{comment}</p>
      </div>
    </div>
  );
};
Comments.propTypes = {
  inputData: PropTypes.object,
};
export default Comments;
