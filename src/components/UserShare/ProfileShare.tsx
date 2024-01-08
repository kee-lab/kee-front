import { FC, memo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import Tippy from "@tippyjs/react";
import clsx from "clsx";

import { useGetAgoraStatusQuery } from "@/app/services/server";
import { useAppSelector } from "@/app/store";
import useUserOperation from "@/hooks/useUserOperation";
import IconCall from "@/assets/icons/call.svg";
import IconMessage from "@/assets/icons/message.svg";
import IconMore from "@/assets/icons/more.svg";
import Avatar from "../Avatar";
import ContextMenu, { Item } from "../ContextMenu";
import { shallowEqual } from "react-redux";
import { convertToRelativeTime } from "@/utils";
import { TwitterUserInfo } from "@/types/user";
import { useLazyGetTwitterUserByUidQuery } from "@/app/services/user";
import BuyShare from "../BuyShare";
import SellShare from "../SellShare";

interface Props {
  uid: number;
  type?: "embed" | "card";
  cid?: number;
  twitterUser?: TwitterUserInfo;
}

const ProfileShare: FC<Props> = ({ uid, type = "embed", cid }) => {
  // const { data: agoraEnabled } = useGetAgoraStatusQuery();
  const [getTwitterUserByUid, { isLoading, data: twitterUser }] = useLazyGetTwitterUserByUidQuery();
  useEffect(() => {
    getTwitterUserByUid(uid);
  }, []);

  const { t } = useTranslation("member");
  const { t: ct } = useTranslation();
  const {
    canCopyEmail,
    copyEmail,
    startCall,
    removeFromChannel,
    canRemoveFromChannel,
    canRemove,
    removeUser,
    isAdmin,
    canUpdateRole,
    updateRole
  } = useUserOperation({ uid, cid });

  const data = useAppSelector((store) => store.users.byId[uid], shallowEqual);
  if (!data) return null;
  console.log("profile", data);
  const {
    name,
    email,
    avatar
    // introduction = "This guy has nothing to introduce",
  } = data;
  const isCard = type == "card";
  const canRemoveFromServer = !isCard && canRemove;
  const hasMore = email || canRemoveFromChannel || canRemoveFromServer;
  const iconClass = `cursor-pointer flex flex-col items-center gap-1 rounded-lg w-32 text-primary-400 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 text-sm pt-3.5 pb-3`;
  const containerClass = clsx(
    `flex-center flex-col gap-1 z-[99] mt-20 select-none`,
    isCard ? "p-4 w-[280px] bg-white dark:bg-gray-800 drop-shadow rounded-md" : "md:w-[432px]"
  );
  if (isLoading || !twitterUser) {
    return <div>loading</div>;
  } else {
    let twitterUserInfo: TwitterUserInfo = twitterUser!;
    return (
      <div className={containerClass} style={{ width: "100%" }}>
        <div className="flex" style={{ width: "100%" }}>
          <div style={{ width: "80%", textAlign: "center" }}>
            <Avatar
              width={80}
              height={80}
              className="rounded-full w-20 h-20 object-cover"
              src={avatar}
              name={name}
            />
          </div>
          <div className="button:-5">
            <SellShare subjectUid={twitterUser.uid}></SellShare>
            <BuyShare subjectUid={twitterUser.uid}></BuyShare>
          </div>
        </div>
        <h2 className="text-lg select-text font-bold text-gray-900 dark:text-white">
          {name} <span className="font-normal text-gray-500">#{uid}</span>
        </h2>
        <div className="flex">
          <span className="text-sm text-gray-600 dark:text-white flex items-center gap-1">
            Created: {convertToRelativeTime(twitterUserInfo.created_time)}&nbsp;
          </span>
          <span className="text-sm text-gray-600 dark:text-white flex items-center gap-1">
            | Price: {twitterUserInfo.price / 1000000000000}
          </span>
        </div>
        <span className="text-sm text-gray-400  dark:text-gray-200 select-text">{email}</span>
        {/* <p className="intro">{introduction}</p> */}
        <ul
          className={clsx("mt-6 flex flex-col md:flex-row items-center gap-2", isCard && "pb-0.5")}
        >
          {/* <NavLink to={`/chat/dm/${uid}`}>
            <li className={`${iconClass} icon chat`}>
              <IconMessage />
              <span>{t("send_msg")}</span>
            </li>
          </NavLink> 
          {type == "embed" && (
            <li role="button" onClick={startCall} className={`${iconClass} icon chat`}>
              <IconCall className="fill-primary-400" />
              <span>{t("call")}</span>
            </li>
          )}
          <Tippy
            disabled={!hasMore}
            interactive
            popperOptions={{ strategy: "fixed" }}
            placement="right"
            trigger="click"
            hideOnClick={true}
            content={
              <ContextMenu
                items={
                  [
                    type == "card" && {
                      title: t("call"),
                      handler: startCall
                    },
                    canCopyEmail && {
                      title: t("copy_email"),
                      handler: copyEmail
                    },
                    canUpdateRole && {
                      title: t("roles"),
                      handler: updateRole,
                      subs: [
                        {
                          title: t("set_normal"),
                          checked: !isAdmin,
                          handler: updateRole
                        },
                        {
                          title: t("set_admin"),
                          checked: isAdmin,
                          handler: updateRole
                        }
                      ]
                    },
                    canRemoveFromChannel && {
                      title: t("remove_from_channel"),
                      danger: true,
                      handler: removeFromChannel
                    },
                    canRemoveFromServer && {
                      title: t("remove"),
                      handler: removeUser,
                      danger: true
                    }
                  ].filter(Boolean) as Item[]
                }
              />
            }
          >
            <li className={`${iconClass} icon ${hasMore ? "" : "text-gray-500"}`}>
              <IconMore className={hasMore ? "fill-primary-500" : ""} />
              <span>{ct("more")}</span>
            </li>
          </Tippy>
          */}
        </ul>
      </div>
    );
  }
};

export default memo(ProfileShare);
