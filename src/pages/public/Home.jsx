import AllPost from "@/sections/AllPost";
import useTitle from "@/hooks/useTitle";
import Banner from "@/sections/Banner";
// import Footer from "@/layouts/shared/Footer";

const Home = () => {
  const changeTitle = useTitle();
  changeTitle();

  return (
    <>
      <Banner />
      <AllPost />
      {/* <Footer /> */}
    </>
  );
};

export default Home;
