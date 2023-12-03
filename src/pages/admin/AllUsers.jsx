import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loading from "../../components/Loading";
import { Avatar, Button, Empty, Table, Badge } from "keep-react";
import notFoundImg from "../../assets/img/not-found.svg";
import { FaTrashCan } from "react-icons/fa6";
import PropTypes from "prop-types";
import { FaUsers, FaUserAstronaut } from "react-icons/fa";
import Swal from "sweetalert2";

const AllUsers = () => {
  const { user } = useAuth();
  const changeTitle = useTitle();
  const axiosSecure = useAxiosSecure();
  const {
    data: usersData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/user/all", {
        params: { email: user.email },
      });
      return data;
    },
  });
  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    console.error(error.message);
    return (
      <Empty
        title="Oops! No data found"
        content="You may be in the wrong place!"
        image={<img src={notFoundImg} height={234} width={350} alt="404" />}
      />
    );
  }
  changeTitle("All user - admin - DevMingle");

  const renderUsers = usersData?.map((ele, idx) => (
    <TableRow key={ele._id} inputData={ele} count={idx + 1} />
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
            Total member:
          </p>
          <Badge size="xs" colorType="light" color="info">
            {usersData.length} Member
          </Badge>
        </div>
      </Table.Caption>
      <Table.Head className="bg-gray-300 border border-gray-400">
        <Table.HeadCell className="text-gray-500 border-r border-r-gray-400 text-lg w-14 py-1 px-2">
          #No
        </Table.HeadCell>
        <Table.HeadCell className="text-gray-500 border-r border-r-gray-400 text-lg min-w-[400px] py-1 px-2">
          User details
        </Table.HeadCell>
        <Table.HeadCell className="text-gray-500 border-r border-r-gray-400 text-lg w-fit py-1 px-2">
          Role
        </Table.HeadCell>
        <Table.HeadCell className="text-gray-500 border-r border-r-gray-400 text-lg w-fit py-1 px-2">
          Total post
        </Table.HeadCell>
        <Table.HeadCell className="text-gray-500 border-r border-r-gray-400 text-lg w-fit py-1 px-2">
          Badge
        </Table.HeadCell>
        <Table.HeadCell className="text-gray-500 border-r border-r-gray-400 text-lg w-fit py-1 px-2">
          Action
        </Table.HeadCell>
      </Table.Head>
      <Table.Body className="border border-gray-300">{renderUsers}</Table.Body>
    </Table>
  );
};

const TableRow = ({ inputData, count }) => {
  const {
    _id,
    userName,
    userEmail,
    userPhoto,
    userRole,
    postCount,
    badge,
    userToken,
  } = inputData || {};
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const handleDelete = () => {
    Swal.fire({
      icon: "warning",
      title: "Are you sure?",
      text: `Delete "${userName}" account`,
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
          .delete(`/user/${_id}`, {
            params: { email: user.email, uid: userToken },
          })
          .then(({ data }) => {
            console.log(data);
            if (data?.deletedCount === 1) {
              Swal.fire({
                title: "Deleted!",
                text: `"${userName}" has been deleted.`,
                icon: "success",
              });
              // reFatch();
            } else {
              Swal.fire({
                title: "Delete incomplate!",
                text: `"${userName}" is not deleted.`,
                icon: "error",
              });
              // reFatch();
            }
          })
          .catch((err) => {
            console.error(err);
            Swal.fire({
              title: "Delete incomplate!",
              text: `"${userName}" is not deleted.`,
              icon: "error",
            });
          });
      }
    });
  };
  return (
    <Table.Row className="hover:bg-gray-200 even:border-gray-300 even:bg-slate-200">
      <Table.Cell className="border-r-gray-300 py-1 p-2 text-center font-bold text-xl">
        {count}
      </Table.Cell>
      <Table.Cell className="border-r-gray-300 py-1 p-2">
        <div className="flex items-center gap-2">
          <Avatar shape="circle" bordered={true} img={userPhoto} size="md" />
          <div>
            <p className="-mb-0.5 text-body-4 font-medium text-metal-600">
              {userName}
            </p>
            <span>{userEmail}</span>
          </div>
        </div>
      </Table.Cell>
      <Table.Cell className="border-r-gray-300 py-1 p-2 flex flex-col items-center">
        {userRole === "user" ? (
          <FaUsers size={25} />
        ) : (
          <FaUserAstronaut size={25} />
        )}
        {userRole}
      </Table.Cell>
      <Table.Cell className="border-r-gray-300 py-1 p-2">
        {postCount}
      </Table.Cell>
      <Table.Cell className="border-r-gray-300 py-1 p-2 capitalize">
        <Badge
          className="capitalize border border-gray-300"
          size="sm"
          colorType="light"
          color={badge === "gold" ? "warning" : "info"}
        >
          {badge}
        </Badge>
      </Table.Cell>
      <Table.Cell className="border-r-gray-300 py-1 p-2">
        <Button
          onClick={handleDelete}
          size="sm"
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
};

export default AllUsers;
