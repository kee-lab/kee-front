import { useAppSelector } from "@/app/store";
import GoBackNav from "@/components/GoBackNav";
import ProfileShare from "@/components/UserShare/ProfileShare";
import clsx from "clsx";
import { memo } from "react";
import { shallowEqual } from "react-redux";
import { useParams } from "react-router-dom";

function profilePage() {
  const { user_id = 0 } = useParams();
  return (
    <div className={clsx("flex h-screen md:h-full md:pt-2 md:pb-2.5 md:pr-12")}>
      <div
        className={`md:rounded-r-2xl bg-white w-full flex justify-center items-start dark:bg-gray-700 h-full items-center`}
      >
        {<ProfileShare uid={+user_id} />}
        <GoBackNav />
      </div>
    </div>
  );
}

export default memo(profilePage);
