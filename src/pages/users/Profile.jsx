import useAuth from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import Loading from "@/components/Loading";
// import { Avatar, Badge } from "keep-react";
import { Badge } from "keep-react";
import { HiOutlineBadgeCheck } from "react-icons/hi";
import { FaUserAstronaut } from "react-icons/fa";
import useTitle from "@/hooks/useTitle";
import ErrorDataShow from "@/components/ErrorDataShow";
import userProfileBanner from "@/assets/img/user-profile-banner.jpg";
import Avatar from "@/components/utilities/Avatar";

const Profile = () => {
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
    <div className="w-full text-center max-w-sm mx-auto">
      <div className="relative mb-10">
        <img
          className="rounded-lg"
          src={userProfileBanner}
          alt="user banner image"
        />
        <div className="absolute shadow top-16 left-1/2 -translate-x-1/2 border-8 border-white rounded-full">
          <Avatar img={userPhoto} size="xl" />
        </div>
        <div className="absolute top-2 right-2">
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
      </div>
      <h3 className="text-4xl mt-16 mb-4 clear-both leading-6 font-semibold">
        {userName}
      </h3>
      <p className="my-2">{userEmail}</p>
      <div className="flex gap-2 mt-2 justify-center">
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
  );
};

export default Profile;
