import { useLazyGetNewTwitterInfoQuery } from "@/app/services/user";
import useFilteredUsers from "@/hooks/useFilteredUsers";

function newPostPage() {
  const [
    getNewTwitterInfo,
    { isLoading: usersLoading, isSuccess: usersSuccess, isError: usersError, data: twitterUsers }
  ] = useLazyGetNewTwitterInfoQuery();
  return <>{getNewTwitterInfo && twitterUsers}</>;
}

export default newPostPage;
