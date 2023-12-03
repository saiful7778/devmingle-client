import AllPost from "../sections/AllPost";
import { Helmet } from "react-helmet";

const AllpostPage = () => {
  return (
    <>
      <Helmet>
        <title>All post - DevMingle</title>
      </Helmet>
      <AllPost />
    </>
  );
};

export default AllpostPage;
