import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useAdmin = () => {
  const { user, userData, token } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { data: isAdmin, isPending } = useQuery({
    queryKey: [user.email, "isAdmin"],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/user/admin-check`, {
        params: { email: user.email, userId: userData._id },
        headers: { Authorization: `Bearer ${token}` },
      });
      return data?.data?.admin;
    },
  });
  return [isAdmin, isPending];
};

export default useAdmin;
