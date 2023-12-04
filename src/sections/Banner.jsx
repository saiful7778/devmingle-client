import { useState } from "react";
import useAxios from "../hooks/useAxios";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { BiRightArrowAlt } from "react-icons/bi";
import { SearchBar, Dropdown, Badge, Spinner } from "keep-react";
import { Link } from "react-router-dom";
import bannerBg from "../assets/img/banner-bg.jpg";
import { postTags } from "../api/staticData";
import PropTypes from "prop-types";

const Banner = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [tags, setTags] = useState([]);
  const [data, setData] = useState([]);
  const axios = useAxios();

  const handleOnChange = async (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setIsLoading(true);
    const { data: results } = await axios.get("/post/all/search", {
      params: { q: searchTerm },
    });
    if (searchTerm === "") {
      setData([]);
      setIsLoading(false);
    } else {
      setData(results);
      setIsLoading(false);
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
              {isLoading ? (
                <div className="flex justify-center items-center my-2">
                  <Spinner color="info" size="xl" />
                </div>
              ) : (
                data.map((ele) => (
                  <Link key={ele?._id} to={`/post/${ele?._id}`}>
                    <Dropdown.Item>
                      <span className="hover:underline">{ele?.title}</span>
                      <span className="ml-auto">
                        <BiRightArrowAlt size={25} />
                      </span>
                    </Dropdown.Item>
                  </Link>
                ))
              )}
            </ul>
          </SearchBar>
        </div>
      </div>
      <div className="capitalize my-4 text-center font-medium">
        {tags.join(", ")}
      </div>
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

export default Banner;
