import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";
import Loading from "../../components/Loading";
import { Avatar, Button, Empty, Table, Tag } from "keep-react";
import notFoundImg from "../../assets/img/not-found.svg";
import { FaTrashCan } from "react-icons/fa6";
import PropTypes from "prop-types";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";

const ManageAnnouncement = () => {
  const axios = useAxios();
  const {
    data: allAnnouncement,
    isLoading,
    isError,
    error,
    refetch,
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

  const renderReports = allAnnouncement?.map((ele, idx) => (
    <TableRow key={ele._id} inputData={ele} count={idx + 1} reFatch={refetch} />
  ));

  return (
    <Table
      showBorder={true}
      showBorderPosition="right"
      striped={true}
      hoverable={true}
    >
      <Table.Caption>
        <div className="flex items-center gap-5 my-5 px-6">
          <p className="text-body-1 font-semibold text-metal-600">
            Total Announcements:
          </p>
          <Tag color="info">{allAnnouncement.length}</Tag>
        </div>
      </Table.Caption>
      <Table.Head className="bg-gray-300 border border-gray-400">
        <Table.HeadCell className="text-gray-500 border-r border-r-gray-400 text-lg w-14 py-1 px-2">
          #No
        </Table.HeadCell>
        <Table.HeadCell className="text-gray-500 border-r border-r-gray-400 text-lg min-w-[150px] py-1 px-2">
          Title
        </Table.HeadCell>
        <Table.HeadCell className="text-gray-500 border-r border-r-gray-400 text-lg min-w-[350px] py-1 px-2">
          Description
        </Table.HeadCell>
        <Table.HeadCell className="text-gray-500 border-r border-r-gray-400 text-lg min-w-[170px] py-1 px-2">
          Author
        </Table.HeadCell>
        <Table.HeadCell className="text-gray-500 border-r border-r-gray-400 text-lg w-fit py-1 px-2">
          Action
        </Table.HeadCell>
      </Table.Head>
      <Table.Body className="border border-gray-300">
        {renderReports}
      </Table.Body>
    </Table>
  );
};

const TableRow = ({ inputData, count, reFatch }) => {
  const {
    _id,
    title,
    des,
    authorInfo: { name, imgLink },
  } = inputData || {};
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const handleDelete = () => {
    Swal.fire({
      icon: "warning",
      title: "Are you sure?",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(({ isConfirmed }) => {
      if (isConfirmed) {
        Swal.fire({
          title: "Loading....",
          didOpen: () => {
            Swal.showLoading();
          },
          showConfirmButton: false,
        });
        axiosSecure
          .delete(`/announcement/${_id}`, {
            params: { email: user.email },
          })
          .then(({ data }) => {
            if (data?.deletedCount === 1) {
              Swal.fire({
                title: "Deleted!",
                icon: "success",
              });
              reFatch();
            } else {
              Swal.fire({
                title: "Delete incomplate!",
                icon: "error",
              });
              reFatch();
            }
          })
          .catch((err) => {
            console.error(err);
            Swal.fire({
              title: "Delete incomplate!",
              icon: "error",
            });
          });
      }
    });
  };

  return (
    <Table.Row className="hover:bg-gray-200 even:border-gray-300 even:bg-slate-200 text-sm">
      <Table.Cell className="border-r-gray-300 py-1 px-2 text-center font-bold">
        {count}
      </Table.Cell>
      <Table.Cell className="border-r-gray-300 py-1 px-2">
        <h6>{title}</h6>
      </Table.Cell>
      <Table.Cell className="border-r-gray-300 py-1 px-2">{des}</Table.Cell>
      <Table.Cell className="border-r-gray-300 py-1 px-2 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <Avatar shape="circle" bordered={true} img={imgLink} size="sm" />
          <p className="leading-4 font-medium">{name}</p>
        </div>
      </Table.Cell>
      <Table.Cell className="border-r-gray-300 py-1 p-2">
        <Button
          onClick={handleDelete}
          color="error"
          className="btn py-1"
          type="primary"
        >
          <FaTrashCan />
        </Button>
      </Table.Cell>
    </Table.Row>
  );
};

TableRow.propTypes = {
  inputData: PropTypes.object,
  count: PropTypes.number,
  reFatch: PropTypes.func,
};

export default ManageAnnouncement;
