import { useLazyGetNewTwitterInfoQuery } from "@/app/services/user";
import clsx from "clsx";
import { useEffect, useRef } from "react";
import { ViewportList } from "react-viewport-list";
import GoBackNav from "@/components/GoBackNav";
import { TwitterUserInfo } from "@/types/user";
import Ui from "@/app/slices/ui";

function newPostPage() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [
    getNewTwitterInfo,
    { isLoading: usersLoading, isSuccess: usersSuccess, isError: usersError, data: twitterUsers }
  ] = useLazyGetNewTwitterInfoQuery();

  useEffect(() => {});

  return (
    <div className={clsx("flex h-screen md:h-full md:pt-2 md:pb-2.5 md:pr-12")}>
      <div
        className={clsx(
          "md:rounded-l-2xl bg-white dark:bg-gray-800 relative flex flex-col w-full md:w-auto md:min-w-[268px] shadow-[inset_-1px_0px_0px_rgba(0,_0,_0,_0.1)]"
        )}
      >
        <div className="flex flex-col md:gap-1 px-2 pt-3 pb-20 md:py-3 overflow-scroll" ref={ref}>
          <ViewportList viewportRef={ref} items={twitterUsers}>
            {(twitterUser: TwitterUserInfo) => {
              return (
                <div>
                  <ul>
                    <li>twitterUser.username</li>
                  </ul>
                </div>
              );
            }}
          </ViewportList>
        </div>
      </div>
      <div
        className={clsx(
          `md:rounded-r-2xl bg-white w-full flex justify-center items-start dark:bg-gray-700`
        )}
      >
        <GoBackNav />
      </div>
    </div>
  );
}

export default newPostPage;
