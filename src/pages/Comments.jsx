import useTitle from "../hooks/useTitle";

const Comments = () => {
  const changeTitle = useTitle();
  changeTitle("Comments - DevMingle");
  return <div>Comments</div>;
};

export default Comments;
