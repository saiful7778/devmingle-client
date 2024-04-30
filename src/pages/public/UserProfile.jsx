import ErrorDataShow from "@/components/ErrorDataShow";
import Loading from "@/components/Loading";
import useAxios from "@/hooks/useAxios";
import useTitle from "@/hooks/useTitle";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import userProfileBanner from "@/assets/img/user-profile-banner.jpg";
import Avatar from "@/components/utilities/Avatar";
import { Badge } from "keep-react";
import { HiOutlineBadgeCheck } from "react-icons/hi";
import { FaUserAstronaut } from "react-icons/fa";
import UserPublicPost from "@/components/UserPublicPost";

const UserProfile = () => {
  const { userId } = useParams();
  const changeTitle = useTitle();
  const axios = useAxios();

  const {
    data: userData,
    isLoading: userLoading,
    isError: userError,
  } = useQuery({
    queryKey: ["user", "public", "profile", userId],
    queryFn: async () => {
      const { data } = await axios.get(`/user/data/public/${userId}`);
      return data?.data;
    },
  });

  const {
    data: postData,
    isLoading: postLoading,
    isError: postError,
  } = useQuery({
    queryKey: ["user", "public", "post", userId],
    queryFn: async () => {
      const { data } = await axios.get(`/posts/public/${userId}`);
      return data?.data;
    },
  });

  if (userLoading || postLoading) {
    return <Loading />;
  }
  if (userError || postError) {
    return <ErrorDataShow />;
  }

  const { userName, userEmail, userPhoto, userRole, badge, postCount } =
    userData;

  changeTitle(`${userName} profile`);

  return (
    <div className="flex gap-1 md:flex-row flex-col">
      <div className="text-center max-w-xs w-full">
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
        <h3 className="text-4xl mt-20 mb-4 clear-both leading-6 font-semibold">
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
        <div>Total post: {postCount}</div>
      </div>
      <div className="grid grid-cols-2 gap-1">
        {postData?.map((post, idx) => (
          <UserPublicPost key={"user_page_post" + idx} inputData={post} />
        ))}
      </div>
    </div>
  );
};

export default UserProfile;
