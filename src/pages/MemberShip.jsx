import useTitle from "../hooks/useTitle";

const MemberShip = () => {
  const changeTitle = useTitle();
  changeTitle("MemberShip - DevMingle");
  return <div>MemberShip</div>;
};

export default MemberShip;
