import { useState } from "react";
import { Dropdown, SearchBar, Badge } from "keep-react";
import bannerBg from "../assets/img/banner-bg.jpg";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { BiRightArrowAlt } from "react-icons/bi";
import { postTags } from "../api/staticData";
import AllPost from "../sections/AllPost";
import useTitle from "../hooks/useTitle";
import PropTypes from "prop-types";
import useAxios from "../hooks/useAxios";
import { Link } from "react-router-dom";

const Home = () => {
  const [tags, setTags] = useState([]);
  const [data, setData] = useState([]);
  const axios = useAxios();
  const changeTitle = useTitle();
  changeTitle();
  const handleOnChange = async (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const { data: results } = await axios.get("/post/all/search", {
      params: { q: searchTerm },
    });
    if (searchTerm === "") {
      setData([]);
    } else {
      setData(results);
    }
  };
  const renderTags = postTags?.map((tagEle) => (
    <SearchQuery
      key={tagEle._id}
      inputData={tagEle}
      tags={tags}
      setTags={setTags}
    />
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
              {data.slice(0, 5).map((ele) => (
                <Link key={ele?._id} to={`/post/${ele?._id}`}>
                  <Dropdown.Item>
                    <span className="hover:underline">{ele?.title}</span>
                    <span className="ml-auto">
                      <BiRightArrowAlt size={25} />
                    </span>
                  </Dropdown.Item>
                </Link>
              ))}
            </ul>
          </SearchBar>
        </div>
      </div>
      <div className="capitalize my-4 text-center font-medium">
        {tags.join(", ")}
      </div>
      <AllPost />
    </>
  );
};

const SearchQuery = ({ inputData, tags, setTags }) => {
  const [isActive, setIsActive] = useState(false);
  const handleAddTag = () => {
    if (isActive) {
      setIsActive((l) => !l);
      const remain = tags.filter((ele) => ele !== inputData.tagName);
      setTags(remain);
    } else {
      setIsActive((l) => !l);
      setTags([...tags, inputData.tagName]);
    }
  };
  return (
    <Badge
      className={`capitalize select-none ${isActive ? "bg-success-100" : ""}`}
      colorType="strong"
      color="success"
      badgeType="outline"
      onClick={handleAddTag}
    >
      {inputData.tagName}
    </Badge>
  );
};

SearchQuery.propTypes = {
  inputData: PropTypes.object,
  tags: PropTypes.array,
  setTags: PropTypes.func,
};

export default Home;
