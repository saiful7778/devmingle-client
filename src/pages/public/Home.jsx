import AllPost from "../../sections/AllPost";
import useTitle from "../../hooks/useTitle";
import Banner from "../../sections/Banner";

const Home = () => {
  const changeTitle = useTitle();
  changeTitle();

  return (
    <>
      <Banner />
      {/* <AllPost /> */}
    </>
  );
};

export default Home;
