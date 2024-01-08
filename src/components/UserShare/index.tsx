import { FC, memo } from "react";
import { useNavigate } from "react-router-dom";
import Tippy from "@tippyjs/react";
import clsx from "clsx";

import { useAppSelector } from "@/app/store";
import useContextMenu from "@/hooks/useContextMenu";
import IconBot from "@/assets/icons/bot.svg";
import IconOwner from "@/assets/icons/owner.svg";
import Avatar from "../Avatar";
import Profile from "../Profile";
import ContextMenu from "./ContextMenu";
import { shallowEqual } from "react-redux";
import { TwitterUserInfo } from "@/types/user";
import { convertToRelativeTime } from "@/utils";

interface Props {
  uid: number;
  cid?: number;
  owner?: boolean;
  dm?: boolean;
  interactive?: boolean;
  popover?: boolean;
  compact?: boolean;
  avatarSize?: number;
  enableContextMenu?: boolean;
  enableNavToSetting?: boolean;
  twitterUser: TwitterUserInfo;
}

const UserShare: FC<Props> = ({
  cid,
  uid,
  owner = false,
  dm = false,
  interactive = true,
  popover = false,
  compact = false,
  avatarSize = 32,
  enableContextMenu = false,
  enableNavToSetting = false,
  twitterUser
}) => {
  const navigate = useNavigate();
  const { visible: contextMenuVisible, handleContextMenuEvent, hideContextMenu } = useContextMenu();
  const curr = useAppSelector((store) => store.users.byId[uid], shallowEqual);
  const loginUid = useAppSelector((store) => store.authData.user?.uid, shallowEqual);
  const showStatus = useAppSelector((store) => store.server.show_user_online_status, shallowEqual);
  const handleDoubleClick = () => {
    navigate(`/chat/dm/${uid}`);
  };
  const handleNavToSetting = () => {
    navigate(`/setting/dm/${uid}/overview?f=/chat/dm/${uid}`);
  };
  if (!curr) return null;
  const online = curr.online || curr.uid == loginUid;
  const containerClass = clsx(
    `relative flex items-center justify-start gap-2 rounded-lg select-none`,
    interactive && "md:hover:bg-gray-500/10",
    compact ? "p-0" : "p-2",
    enableNavToSetting && "cursor-pointer"
  );
  const nameClass = clsx(
    `text-sm text-gray-500 max-w-[190px] truncate font-semibold dark:text-white`
  );
  const statusClass = clsx(
    `absolute -bottom-[2.5px] -right-[2.5px] border-content rounded-full border-[1px] border-white dark:border-gray-300`,
    online ? "bg-green-500" : "bg-zinc-400",
    compact ? "w-[15px] h-[15px]" : "w-3 h-3"
  );
  const statusElement = showStatus ? <div className={statusClass}></div> : null;
  return (
    <div
      key={twitterUser.uid}
      // onClick={buyShare.bind(null, twitterUser.uid)}
      className="w-full flex items-center justify-between px-3 py-2 rounded-md md:hover:bg-slate-50 md:dark:hover:bg-gray-800"
    >
      <div className="flex gap-4 items-stretch">
        <div
          className="cursor-pointer relative"
          style={{ width: `${avatarSize}px`, height: `${avatarSize}px` }}
        >
          <Avatar
            className="w-full h-full rounded-full object-cover"
            width={avatarSize}
            height={avatarSize}
            src={twitterUser.profile_image_url}
            name={curr.name}
            alt="avatar"
          />
          {statusElement}
        </div>
        <div className="flex flex-col justify-center">
          <span className="font-bold text-md text-gray-600 dark:text-white flex items-center gap-1">
            {twitterUser.username}
          </span>
          <div className="flex">
            <span className="text-sm text-gray-600 dark:text-white flex items-center gap-1">
              Created: {convertToRelativeTime(twitterUser.created_time)}&nbsp;
            </span>
            <span className="text-sm text-gray-600 dark:text-white flex items-center gap-1">
              | Price: {twitterUser.price / 1000000000000}
            </span>
          </div>
          <div>{twitterUser.uid}</div>
        </div>
      </div>
    </div>
  );
};

export default memo(UserShare, (prev, next) => prev.uid == next.uid);
