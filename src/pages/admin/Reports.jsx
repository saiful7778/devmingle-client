import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import useAuth from "@/hooks/useAuth";
import { Button, Modal, Table, Tag } from "keep-react";
import Loading from "@/components/Loading";
import useTitle from "@/hooks/useTitle";
import { GoCommentDiscussion } from "react-icons/go";
import { FaTrashCan } from "react-icons/fa6";
import { GoReport } from "react-icons/go";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import ErrorDataShow from "@/components/ErrorDataShow";
import { useState } from "react";
import moment from "moment";
import Avatar from "@/components/utilities/Avatar";

const Reports = () => {
  const axiosSecure = useAxiosSecure();
  const { user, userData, token } = useAuth();
  const changeTitle = useTitle();
  const {
    data: reportData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/post/comment/admin/reports", {
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
  changeTitle("Reports - admin - DevMingle");

  if (reportData?.length < 1) {
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
            Total Reports:
          </p>
          <Tag color="error" leftIcon={<GoReport />}>
            {reportData?.length} report
          </Tag>
        </div>
      </Table.Caption>
      <Table.Head className="bg-gray-300 border border-gray-400">
        <Table.HeadCell className="text-gray-500 border-r border-r-gray-400 text-lg w-14 py-1 px-2">
          #No
        </Table.HeadCell>
        <Table.HeadCell className="text-gray-500 border-r border-r-gray-400 text-lg min-w-[220px] py-1 px-2">
          Report user
        </Table.HeadCell>
        <Table.HeadCell className="text-gray-500 border-r border-r-gray-400 text-lg w-fit py-1 px-2">
          Report
        </Table.HeadCell>
        <Table.HeadCell className="text-gray-500 border-r border-r-gray-400 text-lg min-w-[220px] py-1 px-2">
          Comment user
        </Table.HeadCell>
        <Table.HeadCell className="text-gray-500 border-r border-r-gray-400 text-lg min-w-[350px] py-1 px-2">
          Details
        </Table.HeadCell>
        <Table.HeadCell className="text-gray-500 border-r border-r-gray-400 text-lg w-fit py-1 px-2">
          Action
        </Table.HeadCell>
      </Table.Head>
      <Table.Body className="border border-gray-300">
        {reportData?.map((ele, idx) => (
          <TableRow
            key={"reports" + idx}
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
    feedback,
    comment: {
      details,
      createdAt: commentCreatedAt,
      user: {
        id: commentUserId,
        userName: commentUserName,
        userEmail: commentUserEmail,
        userPhoto: commentUserPhoto,
      },
      post: { id: postId, title },
    },
    reportUser: { id: reportUserId, userName, userEmail, userPhoto },
    createdAt,
  } = inputData;

  const axiosSecure = useAxiosSecure();
  const { user, userData, token } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const commentAddTime = moment(commentCreatedAt).format("D/M/YY, h:m:s a");
  const reportAddTime = moment(createdAt).format("D/M/YY, h:m:s a");

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
        const { data } = await axiosSecure.delete(
          `/post/comment/admin/report/${id}`,
          {
            params: { email: user.email, userId: userData._id },
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!data.success) {
          throw new Error("Something went wrong");
        }
        if (data?.data?.deletedCount !== 1) {
          throw new Error("Delete is incomplete");
        }
        Swal.fire({
          title: "Deleted!",
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
    }
  };

  return (
    <Table.Row className="hover:bg-gray-200 even:border-gray-300 even:bg-slate-200 text-sm">
      <Table.Cell className="border-r-gray-300 py-1 px-2 text-center font-bold text-lg">
        {count}
      </Table.Cell>
      <Table.Cell className="border-r-gray-300 py-1 px-2">
        <div className="flex items-center gap-2">
          <Avatar img={userPhoto} size="sm" />
          <div>
            <Link
              to={`/user/${reportUserId}`}
              className="-mb-0.5 block hover:underline text-body-4 font-medium text-metal-600"
            >
              {userName}
            </Link>
            <span>{userEmail}</span>
          </div>
        </div>
      </Table.Cell>
      <Table.Cell className="border-r-gray-300 py-1 px-2 capitalize">
        {feedback}
      </Table.Cell>
      <Table.Cell className="border-r-gray-300 py-1 px-2 capitalize">
        <div className="flex items-center gap-2">
          <Avatar img={commentUserPhoto} size="sm" />
          <div>
            <Link
              to={`/user/${commentUserId}`}
              className="-mb-0.5 block hover:underline text-body-4 font-medium text-metal-600"
            >
              {commentUserName}
            </Link>
            <span>{commentUserEmail}</span>
          </div>
        </div>
      </Table.Cell>
      <Table.Cell className="border-r-gray-300 py-1 px-2">
        <Button
          onClick={() => setShowModal((l) => !l)}
          type="primary"
          size="xs"
        >
          Details
        </Button>
        <Modal
          position="center"
          show={showModal}
          icon={<GoCommentDiscussion size={25} />}
          onClose={() => setShowModal((l) => !l)}
        >
          <Modal.Header></Modal.Header>
          <Modal.Body>
            <div className="text-gray-500">
              <div>
                Post:{" "}
                <Link to={`/post/${postId}`} className="hover:underline">
                  {title}
                </Link>
              </div>
              <div>Comment: {details}</div>
              <div>Comment created: {commentAddTime}</div>
              <div>Report: {feedback}</div>
              <div>Report created: {reportAddTime}</div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button type="primary" onClick={() => setShowModal((l) => !l)}>
              Done
            </Button>
          </Modal.Footer>
        </Modal>
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
  reFatch: PropTypes.func,
};

export default Reports;
