import useFetchQuery from "@/utils/hooks/useFetchQuery";;
import request from "../axiosUtils";
import { HomePageAPI } from "../axiosUtils/API";

const useCustomDataQuery = ({ params }) => {
  return useFetchQuery(
    ["data", params],
    async () => {
      try {
        const response = await request({ url: `${HomePageAPI}/${params}`, params: { slug: params } });
        return response?.data?.content || {};
      } catch (error) {
        console.error(`Error fetching ${params}:`, error);
        return {};
      }
    },
    {
      select: (data) => data,
      refetchOnWindowFocus: false,
      enabled: true
    }
  );
};

export default useCustomDataQuery;
