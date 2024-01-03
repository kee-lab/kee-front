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
  enableNavToSetting = false
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
    <ContextMenu
      cid={cid}
      uid={uid}
      enable={enableContextMenu}
      visible={contextMenuVisible}
      hide={hideContextMenu}
    >
      <div
        className={containerClass}
        onClick={enableNavToSetting ? handleNavToSetting : undefined}
        onDoubleClick={dm ? handleDoubleClick : undefined}
        onContextMenu={enableContextMenu ? handleContextMenuEvent : undefined}
      >
        <div
          className="cursor-pointer relative"
          style={{ width: `${avatarSize}px`, height: `${avatarSize}px` }}
        >
          <Avatar
            className="w-full h-full rounded-full object-cover"
            width={avatarSize}
            height={avatarSize}
            src={curr.avatar}
            name={curr.name}
            alt="avatar"
          />
          {curr.is_bot ? (
            <IconBot
              className={clsx("absolute -bottom-[2.5px] -right-[2.5px]", "!w-[15px] !h-[15px]")}
            />
          ) : (
            statusElement
          )}
        </div>
        {!compact && (
          <span className={nameClass} title={curr?.name}>
            {curr?.name}
          </span>
        )}
        {owner && <IconOwner />}
      </div>
    </ContextMenu>
  );
};

export default memo(UserShare, (prev, next) => prev.uid == next.uid);
