import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import useTitle from "@/hooks/useTitle";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import useAuth from "@/hooks/useAuth";
import Loading from "@/components/Loading";
import { Avatar, Button, Dropdown, Table, Modal, Tag } from "keep-react";
import getPostTime from "@/utility/getPostTime";
import { GoCommentDiscussion } from "react-icons/go";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import ErrorDataShow from "@/components/ErrorDataShow";
import commentExcerpt from "@/utility/commentExcerpt";

const PostComments = () => {
  const { postId } = useParams();
  const { user, token } = useAuth();
  const changeTitle = useTitle();

  const axiosSecure = useAxiosSecure();

  const {
    data: commentData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["postComment", postId],
    queryFn: async () => {
      const { data } = await axiosSecure.get(
        `/post/comment/all-comment/${postId}`,
        {
          params: { email: user.email },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return data?.data;
    },
  });

  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <ErrorDataShow />;
  }
  changeTitle("Comments - DevMingle");

  if (commentData?.length < 1) {
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
            Total Comments:
          </p>
          <Tag color="info" leftIcon={<GoCommentDiscussion />}>
            {commentData.length}
          </Tag>
        </div>
      </Table.Caption>
      <Table.Head className="bg-gray-300 border border-gray-400">
        <Table.HeadCell className="text-gray-500 border-r border-r-gray-400 text-lg min-w-[200px] py-1 px-2">
          User
        </Table.HeadCell>
        <Table.HeadCell className="text-gray-500 border-r border-r-gray-400 text-lg min-w-[300px] py-1 px-2">
          Comment
        </Table.HeadCell>
        <Table.HeadCell className="text-gray-500 border-r border-r-gray-400 text-lg min-w-[200px] py-1 px-2">
          Feedback
        </Table.HeadCell>
        <Table.HeadCell className="text-gray-500 border-r border-r-gray-400 text-lg min-w-[200px] py-1 px-2">
          Report
        </Table.HeadCell>
      </Table.Head>
      <Table.Body className="border border-gray-300">
        {commentData?.map((comment, idx) => (
          <TableRow key={"comment" + idx} inputData={comment} />
        ))}
      </Table.Body>
    </Table>
  );
};

const TableRow = ({ inputData }) => {
  const { user, userData, token } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [feedback, setFeedback] = useState("");
  const [disableButton, setDisableButton] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const {
    id,
    user: { id: userId, userPhoto, userName, userEmail },
    details,
    createdAt,
  } = inputData || {};

  const [excerpt, excerptedComment] = commentExcerpt(details);

  const handleReport = async () => {
    try {
      const { data } = await axiosSecure.post(
        `/post/comment/${id}/report`,
        { feedback },
        {
          params: { email: user.email, userId: userData._id },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!data.success) {
        throw new Error("Report do not create");
      }
      Swal.fire({
        icon: "success",
        text: "Report is added",
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        text: err,
      });
    } finally {
      setDisableButton(true);
    }
  };

  const handleOptions = (optionName) => {
    setFeedback(optionName);
    setDisableButton(false);
  };

  return (
    <Table.Row className="hover:bg-gray-200 even:border-gray-300 even:bg-slate-200">
      <Table.Cell className="border-r-gray-300 py-1 p-2">
        <div className="flex items-center gap-2">
          <Avatar shape="circle" bordered={true} img={userPhoto} size="md" />
          <div>
            <Link
              to={`/user/${userId}`}
              className="-mb-0.5 block text-body-4 hover:underline font-medium text-metal-600"
            >
              {userName}
            </Link>
            <span>{userEmail}</span>
          </div>
        </div>
      </Table.Cell>
      <Table.Cell className="border-r-gray-300 py-1 p-2 text-sm">
        {excerpt ? (
          <div>
            <p>
              {excerptedComment}
              <button
                type="button"
                onClick={() => setShowModal((l) => !l)}
                className="inline-block ml-2 text-blue-600 underline"
              >
                Read....
              </button>
            </p>
            <Modal
              position="center"
              show={showModal}
              icon={<GoCommentDiscussion size={25} />}
              onClose={() => setShowModal((l) => !l)}
            >
              <Modal.Header></Modal.Header>
              <Modal.Body>
                <p className="text-gray-500">{details}</p>
              </Modal.Body>
              <Modal.Footer>
                <Button type="primary" onClick={() => setShowModal((l) => !l)}>
                  Done
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        ) : (
          <p>{excerptedComment}</p>
        )}
        <p className="text-sm font-medium mt-2">
          Posted: {getPostTime(createdAt)}
        </p>
      </Table.Cell>
      <Table.Cell className="border-r-gray-300 py-1 p-2">
        <Dropdown
          label="Feedback"
          size="xs"
          type="primary"
          dismissOnClick={true}
        >
          <Dropdown.Item onClick={() => handleOptions("spam")}>
            Spam
          </Dropdown.Item>
          <Dropdown.Item onClick={() => handleOptions("hateful")}>
            Hateful
          </Dropdown.Item>
          <Dropdown.Item onClick={() => handleOptions("misleading")}>
            Misleading
          </Dropdown.Item>
        </Dropdown>
      </Table.Cell>
      <Table.Cell className="border-r-gray-300 py-1 p-2">
        <Button
          type="primary"
          color="error"
          onClick={handleReport}
          className="[&>span]:disabled:cursor-not-allowed "
          disabled={disableButton}
        >
          Report
        </Button>
      </Table.Cell>
    </Table.Row>
  );
};

TableRow.propTypes = {
  inputData: PropTypes.object,
};

export default PostComments;
