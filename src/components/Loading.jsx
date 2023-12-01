import { Spinner } from "keep-react";

const Loading = () => {
  return (
    <div className="w-full h-[50vh] flex justify-center items-center">
      <Spinner color="info" size="xl" />
    </div>
  );
};

export default Loading;
