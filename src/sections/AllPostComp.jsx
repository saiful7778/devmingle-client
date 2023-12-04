import { useState } from "react";
import PropTypes from "prop-types";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../hooks/useAxios";
import Loading from "../components/Loading";
import { Empty } from "keep-react";
import notFoundImg from "../assets/img/not-found.svg";
import PostItem from "../components/PostItem";
import { Pagination } from "keep-react";

const AllPostComp = ({ tag, currentPage, setCurrentPage }) => {
  const axios = useAxios();
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 5;
  const {
    data: posts,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["posts", { currentPage, itemsPerPage, tag }],
    queryFn: async () => {
      const res = await axios.get("/post/all", {
        params: { page: currentPage - 1, size: itemsPerPage, tag },
      });
      if (tag === "all") {
        setTotalItems(res.data?.totalCount);
        return res.data;
      } else {
        setTotalItems(res.data?.count);
        return res.data;
      }
    },
  });
  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    console.error(error.message);
    return (
      <Empty
        title="Oops! No post found"
        content="You may be in the wrong place!"
        image={<img src={notFoundImg} height={234} width={350} alt="404" />}
      />
    );
  }
  const numberOfPage = Math.ceil(totalItems / itemsPerPage);

  const renderAllPosts = posts?.result?.map((post) => (
    <PostItem key={post._id} inputData={post} />
  ));

  return (
    <div className="mb-28">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {renderAllPosts}
      </div>
      <div className="flex justify-center mt-3">
        <Pagination
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          totalPages={numberOfPage}
          iconWithOutText={true}
          prevNextShape="roundSquare"
        />
      </div>
    </div>
  );
};

AllPostComp.propTypes = {
  tag: PropTypes.string,
  currentPage: PropTypes.number,
  setCurrentPage: PropTypes.func,
};

export default AllPostComp;
