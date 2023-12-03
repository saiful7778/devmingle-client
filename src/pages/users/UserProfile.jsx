import useAuth from "../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loading from "../../components/Loading";
import { Avatar, Badge } from "keep-react";
import { HiOutlineBadgeCheck } from "react-icons/hi";
import { FaUserAstronaut } from "react-icons/fa";
import useTitle from "../../hooks/useTitle";

const UserProfile = () => {
  const { user } = useAuth();
  const changeTitle = useTitle();
  const axiosSecure = useAxiosSecure();
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["user", user?.displayName],
    queryFn: async () => {
      const res = await axiosSecure.get(`/user/${user?.uid}`, {
        params: { email: user.email },
      });
      return res.data;
    },
  });
  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    console.error(error);
    return <div>error</div>;
  }
  const { badge, userEmail, userName, userPhoto, userRole } = data;
  changeTitle("User profile - dashboard");
  return (
    <div className="flex items-center gap-4">
      <Avatar
        className="ml-2 cursor-pointer rounded-full bg-gray-200"
        shape="circle"
        size="2xl"
        bordered={true}
        img={userPhoto || ""}
      />
      <div>
        <div className="flex gap-2">
          <h3 className="text-3xl leading-6 font-semibold">{userName}</h3>
          <Badge
            className="capitalize border border-gray-300"
            size="xs"
            colorType="light"
            icon={<HiOutlineBadgeCheck size={15} />}
            iconPosition="left"
          >
            {badge}
          </Badge>
        </div>
        <p className="text-sm">{userEmail}</p>
        <div className="flex gap-2 mt-2">
          <Badge
            size="sm"
            colorType="strong"
            badgeType="outline"
            color="warning"
            icon={<FaUserAstronaut />}
            iconPosition="right"
          />
          <h6 className="capitalize font-medium">: {userRole}</h6>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
