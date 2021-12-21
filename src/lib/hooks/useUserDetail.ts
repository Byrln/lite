import useSWR from "swr";

const useUserDetail = () => {
    const { data, error } = useSWR(`/user/detail`);

    return {
        userDetail: data,
        isUserDetailLoading: !error && !data,
        isUserDetailError: error,
    };
};

export default useUserDetail;
