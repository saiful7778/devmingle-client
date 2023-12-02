import { Badge, Avatar } from "keep-react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import getPostTime from "../utility/getPostTime";

const PostItem = ({ inputData }) => {
  const {
    _id,
    author: { imgLink, name },
    title,
    tag,
    postTime: loadTime,
    comment: { count },
  } = inputData || {};

  const postTime = getPostTime(loadTime);

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

  return (
    <div className="flex flex-col gap-3 p-3 shadow-md bg-white rounded-md border border-blue-500">
      <Link
        className="md:text-xl font-semibold flex-1 hover:underline"
        to={`/post/${_id}`}
      >
        {title}
      </Link>
      <div className="flex justify-between gap-2">
        <div>
          <div className="flex gap-2 items-center">
            <Avatar shape="circle" size="sm" bordered img={imgLink} />
            <h6 className="text-lg font-medium">{name}</h6>
            <div className="text-xs font-medium text-gray-600">
              Created: {postTime}
            </div>
          </div>
          <div className="flex flex-wrap gap-1 mt-1">{renderTags}</div>
        </div>
        <div>
          <div>Comments: {count}</div>
        </div>
      </div>
    </div>
  );
};

PostItem.propTypes = {
  inputData: PropTypes.object,
};

export default PostItem;
