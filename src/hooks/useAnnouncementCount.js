import { useQuery } from "@tanstack/react-query";
import useAxios from "./useAxios";

const useAnnouncementCount = () => {
  const axios = useAxios();
  const { data, isPending } = useQuery({
    queryKey: ["announcementCount"],
    queryFn: async () => {
      const { data } = await axios.get("/announcement/count");
      return data.count;
    },
  });
  return [data, isPending];
};

export default useAnnouncementCount;
