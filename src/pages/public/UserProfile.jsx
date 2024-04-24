import { useParams } from "react-router-dom";

const UserProfile = () => {
  const { userId } = useParams();

  return <div>Profile</div>;
};

export default UserProfile;
