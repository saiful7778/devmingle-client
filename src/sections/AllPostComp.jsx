import { useState } from "react";
import PropTypes from "prop-types";
import { useQuery } from "@tanstack/react-query";
import useAxios from "@/hooks/useAxios";
import Loading from "@/components/Loading";
import PostItem from "@/components/PostItem";
import { Pagination } from "keep-react";
import ErrorDataShow from "@/components/ErrorDataShow";

const AllPostComp = ({ tag, currentPage, setCurrentPage }) => {
  const axios = useAxios();
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 5;
  const {
    data: posts,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["posts", { currentPage, itemsPerPage, tag }],
    queryFn: async () => {
      const { data } = await axios.get("/posts/all", {
        params: { page: currentPage - 1, size: itemsPerPage, tag },
      });
      if (tag === "all") {
        setTotalItems(data?.totalCount);
        return data?.data;
      } else {
        setTotalItems(data?.count);
        return data?.data;
      }
    },
  });
  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <ErrorDataShow />;
  }
  const numberOfPage = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="mb-28">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {posts?.map((post, idx) => (
          <PostItem key={"home_page_post" + idx} inputData={post} />
        ))}
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
