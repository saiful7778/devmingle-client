import AllPost from "@/sections/AllPost";
import useTitle from "@/hooks/useTitle";
import Banner from "@/sections/Banner";
import { Button } from "@/components/ui/button";
// import Footer from "@/layouts/shared/Footer";

const Home = () => {
  const changeTitle = useTitle();
  changeTitle();

  return (
    <>
      <Banner />
      <Button>Click me</Button>
      <AllPost />
      {/* <Footer /> */}
    </>
  );
};

export default Home;
