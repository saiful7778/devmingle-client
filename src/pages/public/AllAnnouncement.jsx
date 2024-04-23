import { Avatar, Empty } from "keep-react";
import PropTypes from "prop-types";
import useAxios from "../../hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../components/Loading";
import notFoundImg from "../assets/img/not-found.svg";

const AllAnnouncement = () => {
  const axios = useAxios();
  const {
    data: allAnnouncement,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["allAnnouncement"],
    queryFn: async () => {
      const { data } = await axios.get("/announcement");
      return data;
    },
  });
  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    console.error(error);
    return (
      <Empty
        title="Oops! No announcement found"
        image={<img src={notFoundImg} height={234} width={350} alt="404" />}
      />
    );
  }
  if (allAnnouncement?.length === 0) {
    return (
      <Empty
        title="Oops! No announcement found"
        image={<img src={notFoundImg} height={234} width={350} alt="404" />}
      />
    );
  }
  const renderAnnouncements = allAnnouncement?.map((ele) => (
    <AnnouncementItem key={ele._id} inputData={ele} />
  ));
  return (
    <div className="bg-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {renderAnnouncements}
      </div>
    </div>
  );
};

const AnnouncementItem = ({ inputData }) => {
  const {
    title,
    des,
    authorInfo: { imgLink, name },
  } = inputData || {};
  return (
    <div className="flex flex-col gap-3 p-3 shadow-md bg-white rounded-md border border-blue-500">
      <div className="flex-1">
        <h3 className="md:text-xl font-semibold">{title}</h3>
        <p className="text-sm">{des}</p>
      </div>
      <div className="flex gap-1 items-center">
        <Avatar shape="circle" size="sm" bordered img={imgLink} />
        <h6 className="text-lg font-medium">{name}</h6>
      </div>
    </div>
  );
};

AnnouncementItem.propTypes = {
  inputData: PropTypes.object,
};

export default AllAnnouncement;
