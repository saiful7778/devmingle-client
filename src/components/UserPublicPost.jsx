import getPostTime from "@/utility/getPostTime";
import { Badge } from "keep-react";
import PropTypes from "prop-types";
import { BsFileArrowUpFill, BsFileArrowDown } from "react-icons/bs";
import { Link } from "react-router-dom";

const UserPublicPost = ({ inputData }) => {
  const {
    id,
    title,
    tags,
    createdAt,
    commentCount,
    voteCount: { upVote, downVote },
  } = inputData;

  const postTime = getPostTime(createdAt);

  return (
    <div className="p-3 shadow-md bg-white rounded-md border border-blue-500">
      <Link
        className="md:text-xl font-semibold flex-1 hover:underline"
        to={`/post/${id}`}
      >
        {title}
      </Link>
      <div className="flex mt-4 lg:flex-row flex-col justify-between gap-3">
        <div>
          <div className="text-xs font-medium text-gray-600">
            Created: {postTime}
          </div>
          <div className="flex flex-wrap gap-1 mt-1">
            {tags?.map((tagEle, idx) => (
              <Badge
                key={"tg" + idx}
                className="capitalize select-none"
                colorType="strong"
                color="gray"
                badgeType="outline"
              >
                {tagEle}
              </Badge>
            ))}
          </div>
        </div>
        <div>
          <div>Comments: {commentCount}</div>
          <div className="flex gap-2">
            <Badge
              className="select-none font-bold"
              colorType="light"
              color="success"
              badgeType="outline"
              iconPosition="left"
              icon={<BsFileArrowUpFill size={15} />}
            >
              {upVote}
            </Badge>
            <Badge
              className="select-none font-bold"
              colorType="light"
              color="info"
              badgeType="outline"
              iconPosition="left"
              icon={<BsFileArrowDown size={15} />}
            >
              {downVote}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

UserPublicPost.propTypes = {
  inputData: PropTypes.object,
};

export default UserPublicPost;
