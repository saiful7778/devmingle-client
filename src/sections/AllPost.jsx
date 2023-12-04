import { useState } from "react";
import { Button } from "keep-react";
import { postTags } from "../api/staticData";
import PropTypes from "prop-types";
import AllPostComp from "./AllPostComp";

const AllPost = () => {
  const [tag, setTag] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const renderTabButtons = postTags?.map((tab) => (
    <TabButton
      key={"tb" + tab._id}
      inputData={tab}
      setTag={setTag}
      setCurrentPage={setCurrentPage}
    />
  ));

  return (
    <div className="my-20">
      <h2 className="text-center text-4xl font-bold my-5">All posts</h2>
      <div className="text-center font-medium">
        Result of {`"`}
        {tag}
        {`"`} post tags
      </div>
      <div className="flex flex-wrap gap-2 items-center justify-center my-4">
        <Button
          type="outlinePrimary"
          onClick={() => setTag("all")}
          className="btn capitalize"
        >
          all
        </Button>
        {renderTabButtons}
      </div>
      <AllPostComp
        tag={tag}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

const TabButton = ({ inputData, setTag, setCurrentPage }) => {
  const handleAddTag = () => {
    setTag(inputData.tagName);
    setCurrentPage(1);
  };
  return (
    <Button
      type="outlinePrimary"
      onClick={handleAddTag}
      className="btn capitalize"
    >
      {inputData.tagName}
    </Button>
  );
};

TabButton.propTypes = {
  inputData: PropTypes.object,
  setTag: PropTypes.func,
  setCurrentPage: PropTypes.func,
};

export default AllPost;
