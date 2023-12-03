import { useState } from "react";
import { Dropdown, SearchBar, Badge } from "keep-react";
import bannerBg from "../assets/img/banner-bg.jpg";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { BiRightArrowAlt } from "react-icons/bi";
import { postTags } from "../api/staticData";
import AllPost from "../sections/AllPost";
import useTitle from "../hooks/useTitle";

const Home = () => {
  const [tags, setTags] = useState([]);
  const [data, setData] = useState([]);
  const changeTitle = useTitle();
  changeTitle();
  const handleOnChange = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const results = postTags.filter((tag) =>
      tag.tagName.toLowerCase().includes(searchTerm)
    );
    if (searchTerm === "") {
      setData([]);
    } else {
      setData(results);
    }
  };
  const handleAddTag = (currentTag) => {
    if (!tags.includes(currentTag)) {
      setTags([...tags, currentTag]);
    }
  };
  const renderTags = postTags?.map((tagEle) => (
    <Badge
      key={tagEle._id}
      className="capitalize select-none"
      colorType="light"
      color="info"
      badgeType="outline"
      onClick={() => handleAddTag(tagEle.tagName)}
    >
      {tagEle.tagName}
    </Badge>
  ));
  return (
    <>
      <div
        className="w-full h-[80vh] rounded-md flex justify-center items-center p-2"
        style={{
          background: `linear-gradient(to right, rgba(0,0,0,0.5), rgba(0,0,0,0.9)), url('${bannerBg}')`,
        }}
      >
        <div className="relative shadow-md">
          <SearchBar
            placeholder="Search Anything"
            addon={<FaMagnifyingGlass size={15} />}
            addonPosition="left"
            size="md"
            icon={<BiRightArrowAlt size={25} />}
            iconPosition="right"
            handleOnChange={handleOnChange}
          >
            <div className="flex flex-wrap gap-1 mt-1">{renderTags}</div>
            <ul className="absolute top-full left-0 z-50 w-full bg-gray-200 rounded-md overflow-hidden mt-1">
              {data.map((tag) => (
                <Dropdown.Item key={tag?._id}>
                  {tag?.tagName}
                  <span className="ml-auto">
                    <BiRightArrowAlt size={25} />
                  </span>
                </Dropdown.Item>
              ))}
            </ul>
          </SearchBar>
        </div>
      </div>
      <AllPost />
    </>
  );
};

export default Home;
