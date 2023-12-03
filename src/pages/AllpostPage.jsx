import useTitle from "../hooks/useTitle";
import AllPost from "../sections/AllPost";

const AllpostPage = () => {
  const changeTitle = useTitle();
  changeTitle("All post - DevMingle");
  return (
    <>
      <AllPost />
    </>
  );
};

export default AllpostPage;
