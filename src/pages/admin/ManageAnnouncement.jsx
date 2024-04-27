import { useQuery } from "@tanstack/react-query";
import useAxios from "@/hooks/useAxios";
import Loading from "@/components/Loading";
import { Avatar, Button, Table, Tag } from "keep-react";
import { FaTrashCan } from "react-icons/fa6";
import PropTypes from "prop-types";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import useAuth from "@/hooks/useAuth";
import Swal from "sweetalert2";
import ErrorDataShow from "@/components/ErrorDataShow";
import { Link } from "react-router-dom";

const ManageAnnouncement = () => {
  const axios = useAxios();
  const {
    data: allAnnouncement,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["allAnnouncement"],
    queryFn: async () => {
      const { data } = await axios.get("/announcements");
      return data?.data;
    },
  });
  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <ErrorDataShow />;
  }
  if (allAnnouncement?.length < 1) {
    return <ErrorDataShow />;
  }

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
        {allAnnouncement?.map((ele, idx) => (
          <TableRow
            key={"admin-announcement" + idx}
            inputData={ele}
            count={idx + 1}
            reFatch={refetch}
          />
        ))}
      </Table.Body>
    </Table>
  );
};

const TableRow = ({ inputData, count, reFatch }) => {
  const {
    id,
    title,
    details,
    author: { id: userId, userName, userPhoto },
  } = inputData;
  const axiosSecure = useAxiosSecure();
  const { user, userData, token } = useAuth();

  const handleDelete = async () => {
    try {
      const { isConfirmed } = await Swal.fire({
        icon: "warning",
        title: "Are you sure?",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });
      if (isConfirmed) {
        Swal.fire({
          title: "Loading....",
          didOpen: () => {
            Swal.showLoading();
          },
          showConfirmButton: false,
        });
        const { data } = await axiosSecure.delete(`/announcement/${id}`, {
          params: { email: user.email, userId: userData._id },
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!data.success) {
          throw new Error("Something went wrong");
        }
        Swal.fire({
          icon: "success",
          title: "Announcement is deleted",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        text: err,
      });
    } finally {
      reFatch();
    }
  };

  return (
    <Table.Row className="hover:bg-gray-200 even:border-gray-300 even:bg-slate-200 text-sm">
      <Table.Cell className="border-r-gray-300 py-1 px-2 text-center font-bold">
        {count}
      </Table.Cell>
      <Table.Cell className="border-r-gray-300 py-1 px-2">
        <h6>{title}</h6>
      </Table.Cell>
      <Table.Cell className="border-r-gray-300 py-1 px-2">{details}</Table.Cell>
      <Table.Cell className="border-r-gray-300 py-1 px-2 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <Avatar shape="circle" bordered={true} img={userPhoto} size="sm" />
          <Link
            to={`/user/${userId}`}
            className="leading-4 hover:underline font-medium"
          >
            {userName}
          </Link>
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
