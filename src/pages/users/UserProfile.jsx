import useAuth from "../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loading from "../../components/Loading";
import { Avatar, Badge } from "keep-react";
import { HiOutlineBadgeCheck } from "react-icons/hi";
import { FaUserAstronaut } from "react-icons/fa";
import useTitle from "../../hooks/useTitle";
import ErrorDataShow from "@/components/ErrorDataShow";

const UserProfile = () => {
  const { user, userData, token } = useAuth();
  const changeTitle = useTitle();
  const axiosSecure = useAxiosSecure();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["user", user?.displayName],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/user/data/${userData._id}`, {
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
  const { badge, userEmail, userName, userPhoto, userRole } = data;
  changeTitle("User profile - dashboard");
  return (
    <div className="flex sm:flex-row flex-col items-center gap-4">
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
            color={badge === "gold" ? "warning" : "info"}
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
