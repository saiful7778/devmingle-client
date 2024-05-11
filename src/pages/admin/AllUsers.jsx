import { useQuery } from "@tanstack/react-query";
import useAuth from "@/hooks/useAuth";
import useTitle from "@/hooks/useTitle";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import Loading from "@/components/Loading";
import { Avatar, Button, Table, Badge, Tag } from "keep-react";
import { FaTrashCan } from "react-icons/fa6";
import PropTypes from "prop-types";
import { FaUsers, FaUserAstronaut } from "react-icons/fa";
import Swal from "sweetalert2";
import { useState } from "react";
import ErrorDataShow from "@/components/ErrorDataShow";
import { Link } from "react-router-dom";

const AllUsers = () => {
  const { user, token, userData } = useAuth();
  const changeTitle = useTitle();
  const axiosSecure = useAxiosSecure();
  const {
    data: usersData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/users", {
        params: { email: user.email, userId: userData._id },
        headers: { Authorization: `Bearer ${token}` },
      });
      return data?.data;
    },
  });
  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <ErrorDataShow />;
  }
  changeTitle("All user - admin - DevMingle");

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
          <Tag color="info" leftIcon={<FaUsers />}>
            {usersData.length} Member
          </Tag>
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
      <Table.Body className="border border-gray-300">
        {usersData?.map((ele, idx) => (
          <TableRow
            key={"user" + idx}
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
  const { id, userName, userEmail, userPhoto, userRole, postCount, badge } =
    inputData;

  const { user, userData, token } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [buttonDisable, setButtonDisable] = useState(
    userRole === "admin" ? true : false
  );

  const handleAdmin = async () => {
    try {
      const { isConfirmed } = await Swal.fire({
        icon: "info",
        title: "Are you sure?",
        text: `Make "${userName}" admin account.`,
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
      });
      if (isConfirmed) {
        Swal.fire({
          title: "Loading....",
          didOpen: () => {
            Swal.showLoading();
          },
          showConfirmButton: false,
        });
        const { data } = await axiosSecure.patch(
          `/user/admin/make_admin/${id}`,
          {},
          {
            params: { email: user.email, userId: userData._id },
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (data?.data?.modifiedCount !== 1) {
          throw new Error("Something went wrong");
        }
        Swal.fire({
          title: "Successfully!",
          text: `"${userName}" is admin.`,
          icon: "success",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        text: err,
      });
    } finally {
      reFatch();
      setButtonDisable(true);
    }
  };

  const handleDelete = async () => {
    try {
      const { isConfirmed } = await Swal.fire({
        icon: "warning",
        title: "Are you sure?",
        text: `Delete "${userName}" account`,
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
        const { data } = await axiosSecure.delete(
          `/user/admin/delete_account/${id}`,
          {
            params: { email: user.email, userId: userData._id },
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!data.success) {
          throw new Error("Someting went wrong");
        }
        Swal.fire({
          icon: "success",
          title: "Successfully!",
          text: `"${userName}" is deleted.`,
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        text: err,
      });
    } finally {
      reFatch();
      setButtonDisable(true);
    }
  };

  return (
    <Table.Row className="hover:bg-gray-200 even:border-gray-300 even:bg-slate-200">
      <Table.Cell className="border-r-gray-300 py-1 px-2 text-center font-bold text-xl">
        {count}
      </Table.Cell>
      <Table.Cell className="border-r-gray-300 py-1 px-2">
        <div className="flex items-center gap-2">
          <Avatar shape="circle" bordered={true} img={userPhoto} size="md" />
          <div>
            <Link
              to={`/user/${id}`}
              className="-mb-0.5 block hover:underline text-body-4 font-medium text-metal-600"
            >
              {userName}
            </Link>
            <span>{userEmail}</span>
          </div>
        </div>
      </Table.Cell>
      <Table.Cell className="border-r-gray-300 py-1 px-2 flex flex-col items-center">
        {userRole === "user" ? (
          <FaUsers size={20} />
        ) : (
          <FaUserAstronaut size={20} />
        )}
        {userRole}
      </Table.Cell>
      <Table.Cell className="border-r-gray-300 py-1 px-2">
        {postCount}
      </Table.Cell>
      <Table.Cell className="border-r-gray-300 py-1 px-2 capitalize">
        <Badge
          className="capitalize border border-gray-300"
          size="sm"
          colorType="light"
          color={badge === "gold" ? "warning" : "info"}
        >
          {badge}
        </Badge>
      </Table.Cell>
      <Table.Cell className="border-r-gray-300 py-1 px-2">
        <div className=" flex gap-2 items-center h-full whitespace-nowrap">
          <Button
            onClick={handleDelete}
            size="sm"
            color="error"
            className="btn py-1"
            type="primary"
          >
            <FaTrashCan />
          </Button>
          <Button
            type="primary"
            color="info"
            onClick={handleAdmin}
            className="[&>span]:disabled:cursor-not-allowed btn"
            disabled={buttonDisable}
          >
            Make admin
          </Button>
        </div>
      </Table.Cell>
    </Table.Row>
  );
};

TableRow.propTypes = {
  inputData: PropTypes.object,
  count: PropTypes.number,
  reFatch: PropTypes.func,
};

export default AllUsers;
