import { Empty } from "keep-react";
import notFoundImg from "@/assets/img/not-found.svg";

const ErrorDataShow = () => {
  return (
    <Empty
      title="Oops! No post found"
      content="You may be in the wrong place!"
      image={<img src={notFoundImg} height={234} width={350} alt="404" />}
    />
  );
};

export default ErrorDataShow;
