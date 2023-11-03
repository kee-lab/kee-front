import { useLazyGetNewTwitterInfoQuery } from "@/app/services/user";
import clsx from "clsx";
import { useEffect, useRef } from "react";
import { ViewportList } from "react-viewport-list";
import GoBackNav from "@/components/GoBackNav";
import { TwitterUserInfo } from "@/types/user";
import Ui from "@/app/slices/ui";

function newPostPage() {
  const ref = useRef<HTMLUListElement | null>(null);
  const [
    getNewTwitterInfo,
    { isLoading: usersLoading, isSuccess: usersSuccess, isError: usersError, data: twitterUsers }
  ] = useLazyGetNewTwitterInfoQuery();

  useEffect(() => {
    getNewTwitterInfo();
  }, []);

  return (
    <ul
      className="flex flex-col gap-1 w-full md:w-[512px] mb-44 max-h-[800px] overflow-y-scroll"
      ref={ref}
    >
      <ViewportList viewportRef={ref} items={twitterUsers}>
        {(twitterUser: TwitterUserInfo) => {
          return (
            <li
              key={twitterUser.uid}
              className="w-full flex items-center justify-between px-3 py-2 rounded-md md:hover:bg-slate-50 md:dark:hover:bg-gray-800"
            >
              <div className="flex gap-4">
                <div className="flex flex-col">
                  <span className="md:block text-xs text-gray-500 dark:text-slate-50">
                    <img src={twitterUser.profile_image_url} alt="" />
                  </span>
                  <span className="font-bold text-sm text-gray-600 dark:text-white flex items-center gap-1">
                    {twitterUser.username}
                  </span>
                  <span className="font-bold text-sm text-gray-600 dark:text-white flex items-center gap-1">
                    {twitterUser.twitter_id}
                  </span>
                  <span className="font-bold text-sm text-gray-600 dark:text-white flex items-center gap-1">
                    {twitterUser.created_time.toLocaleString()}
                  </span>
                  <span className="font-bold text-sm text-gray-600 dark:text-white flex items-center gap-1">
                    {twitterUser.price}
                  </span>
                </div>
              </div>
            </li>
          );
        }}
      </ViewportList>
    </ul>
  );
}

export default newPostPage;
