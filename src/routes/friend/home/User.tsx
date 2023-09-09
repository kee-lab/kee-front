import { FC } from "react";
import { NavLink, useLocation } from "react-router-dom";

import { useAppSelector } from "@/app/store";
import Avatar from "@/components/Avatar";
import { shallowEqual } from "react-redux";

interface Props {
  uid: number;
}

const User: FC<Props> = ({ uid }) => {
  const { pathname } = useLocation();
  const user = useAppSelector((store) => store.users.byId[uid], shallowEqual);
  if (!user) return null;

  return (
    <div className="px-3 py-2.5 invisible md:visible">
      <NavLink to={`/setting/my_account?f=${pathname}`}>
        <div className="w-8 h-8">
          <Avatar
            className=" object-cover w-full h-full rounded-full"
            width={32}
            height={32}
            src={user.avatar}
            name={user.name}
          />
        </div>
      </NavLink>
    </div>
  );
};

export default User;
