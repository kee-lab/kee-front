import { memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Loading from "@/components/Loading";
import Manifest from "@/components/Manifest";
import usePreload from "@/hooks/usePreload";
import LogoutConfirmModal from "@/routes/setting/LogoutConfirmModal";
import { NavLink, Outlet, useLocation, useMatch } from "react-router-dom";
import { useSetState } from "rooks";
import { HDNodeWallet, Wallet, ethers } from "ethers";
import { KEY_WALLET_ADDRESS, KEY_WALLET_PRIVATE_KEY } from "@/app/config";
import { useBindWallet2UserMutation, useLazyCheckWalletExistQuery } from "@/app/services/auth";
import StreamStatus from "@/components/StreamStatus";
import MobileNavs from "./MobileNavs";
import { useAppSelector } from "@/app/store";
import { shallowEqual } from "react-redux";
import User from "./User";
import Tooltip from "@/components/Tooltip";
import ChatIcon from "@/assets/icons/chat.svg";
import UserIcon from "@/assets/icons/user.svg";
import FavIcon from "@/assets/icons/bookmark.svg";
import FolderIcon from "@/assets/icons/folder.svg";
import Menu from "./Menu";

function HomePage() {
  console.log("in home page!!!");
  const guest = useAppSelector((store) => store.authData.guest, shallowEqual);
  // preload basic data
  // const { success } = usePreload();

  // console.info("preload success", success);
  // if (!success) {
  //   return <Loading reload={true} fullscreen={true} context="home-route" />;
  // }

  const createNewWallet = () => {
    alert("createNewWallet!");
    const user_wallet = Wallet.createRandom();
    console.log("private key:" + user_wallet.privateKey);
    localStorage.setItem(KEY_WALLET_PRIVATE_KEY, user_wallet.privateKey);
    console.log("address key:" + user_wallet.address);
    localStorage.setItem(KEY_WALLET_ADDRESS, user_wallet.address);
    console.log("memo word:" + JSON.stringify(user_wallet.mnemonic));
    let normalWallet: Wallet = new Wallet(user_wallet.privateKey);
    return normalWallet;
  };

  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const loginUid = useAppSelector((store) => store.authData.user?.uid ?? 0, shallowEqual);
  const linkClass = `flex items-center gap-2.5 px-3 py-2 font-semibold text-sm text-gray-600 rounded-lg md:hover:bg-gray-800/10`;
  const isHomePath = useMatch(`/`);
  const { pathname } = useLocation();
  const isChattingPage = isHomePath || pathname.startsWith("/chat");
  const isChatHomePath = useMatch(`/chat`);
  const { t } = useTranslation();
  const { chat: chatPath, user: userPath } = useAppSelector(
    (store) => store.ui.rememberedNavs,
    shallowEqual
  );
  const userNav = userPath || "/users";
  // 有点绕
  const chatNav = isChatHomePath ? "/chat" : chatPath || "/chat";
  const toggleLogoutConfirm = () => {
    setLogoutConfirm(false);
  };

  const userLogout = () => {
    setLogoutConfirm(true);
  };

  //检查用户是否有钱包,如果没有钱包,则生成一个钱包给用户.
  const [checkWalletExist, { isLoading }] = useLazyCheckWalletExistQuery();
  const [bindWallet2User] = useBindWallet2UserMutation();
  useEffect(() => {
    checkWalletExist(localStorage.getItem(KEY_WALLET_ADDRESS) || "").then((isWalletExist) => {
      alert("isWalletExist is:" + isWalletExist.data);
      if (!isWalletExist.data) {
        let wallet = createNewWallet();
        // setWallet(address);
        bindWallet2User(wallet.address);
      }
    });
  }, []);

  return (
    <>
      <StreamStatus />
      <div
        className={`vocechat-container flex w-screen h-screen bg-neutral-100 dark:bg-neutral-900`}
      >
        {!guest && (
          <div
            className={`hidden md:flex h-full flex-col items-center relative w-16 transition-all`}
          >
            {loginUid && <User uid={loginUid} />}
            <nav className="flex flex-col gap-1 px-3 py-6">
              <NavLink
                className={({ isActive }) =>
                  `${linkClass} ${
                    isActive || isChattingPage ? "bg-primary-400 md:hover:bg-primary-400" : ""
                  }`
                }
                to={chatNav}
              >
                {({ isActive }) => {
                  return (
                    <Tooltip tip={t("chat")}>
                      <ChatIcon className={isActive || isChattingPage ? "fill-white" : ""} />
                    </Tooltip>
                  );
                }}
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  `${linkClass} ${isActive ? "bg-primary-400 md:hover:bg-primary-400" : ""}`
                }
                to={userNav}
              >
                {({ isActive }) => {
                  return (
                    <Tooltip tip={t("members")}>
                      <UserIcon className={isActive ? "fill-white" : ""} />
                    </Tooltip>
                  );
                }}
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  `${linkClass} ${isActive ? "bg-primary-400 md:hover:bg-primary-400" : ""}`
                }
                to={"/favs"}
              >
                {({ isActive }) => {
                  return (
                    <Tooltip tip={t("favs")}>
                      <FavIcon className={isActive ? "fill-white" : ""} />
                    </Tooltip>
                  );
                }}
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  `${linkClass} ${isActive ? "bg-primary-400 md:hover:bg-primary-400" : ""}`
                }
                to={"/files"}
              >
                {({ isActive }) => {
                  return (
                    <Tooltip tip={t("files")}>
                      <FolderIcon className={isActive ? "fill-white" : ""} />
                    </Tooltip>
                  );
                }}
              </NavLink>
            </nav>
            <Menu />
          </div>
        )}
        <div className="h-full flex flex-col w-full">
          <Outlet />
        </div>
      </div>
      {!guest && <MobileNavs />}
    </>
  );
}
export default memo(HomePage);
