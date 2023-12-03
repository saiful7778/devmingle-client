import useTitle from "../../hooks/useTitle";

const AllUsers = () => {
  const changeTitle = useTitle();
  changeTitle("All user - admin - DevMingle");
  return <div>AllUsers</div>;
};

export default AllUsers;
