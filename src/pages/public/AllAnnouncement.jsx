import { Avatar, Empty } from "keep-react";
import PropTypes from "prop-types";
import useAxios from "@/hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/components/Loading";
import notFoundImg from "@/assets/img/not-found.svg";
import ErrorDataShow from "@/components/ErrorDataShow";

const AllAnnouncement = () => {
  const axios = useAxios();
  const {
    data: allAnnouncement,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["allAnnouncement"],
    queryFn: async () => {
      const { data } = await axios.get("/announcements");
      return data;
    },
  });
  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <ErrorDataShow />;
  }

  if (allAnnouncement?.data?.length === 0) {
    return (
      <Empty
        title="Oops! No announcement found"
        image={<img src={notFoundImg} height={234} width={350} alt="404" />}
      />
    );
  }

  return (
    <div className="bg-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {allAnnouncement?.data?.map((ele, idx) => (
          <AnnouncementItem key={"announcement" + idx} inputData={ele} />
        ))}
      </div>
    </div>
  );
};

const AnnouncementItem = ({ inputData }) => {
  const {
    title,
    details,
    author: { userImage, userName },
  } = inputData;

  return (
    <div className="flex flex-col gap-3 p-3 shadow-md bg-white rounded-md border border-blue-500">
      <div className="flex-1">
        <h3 className="md:text-xl font-semibold">{title}</h3>
        <p className="text-sm">{details}</p>
      </div>
      <div className="flex gap-1 items-center">
        <Avatar shape="circle" size="sm" bordered img={userImage} />
        <h6 className="text-lg font-medium">{userName}</h6>
      </div>
    </div>
  );
};

AnnouncementItem.propTypes = {
  inputData: PropTypes.object,
};

export default AllAnnouncement;
