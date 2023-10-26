import { FC, ReactElement, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import {
  useBindWallet2UserMutation,
  useGetAuthByTwitterQuery,
  useLazyCheckWalletExistQuery
} from "@/app/services/auth";
import { HDNodeWallet, Wallet, ethers } from "ethers";
import { KEY_WALLET_ADDRESS, KEY_WALLET_PRIVATE_KEY } from "@/app/config";
import { useAppSelector } from "@/app/store";
import { shallowEqual } from "react-redux";

// 如果用户没有得到从twitter的授权，则跳转到twitter授权页面。

interface Props {
  children: ReactElement;
  redirectTo?: string;
}

const RequireNoTwitterAuth: FC<Props> = ({ children, redirectTo = "/twitterAuth" }) => {
  const [wallet, setWallet] = useState<Wallet>();
  const [bindWallet2User] = useBindWallet2UserMutation();
  const createNewWallet = () => {
    const user_wallet = Wallet.createRandom();
    console.log("private key:" + user_wallet.privateKey);
    localStorage.setItem(KEY_WALLET_PRIVATE_KEY, user_wallet.privateKey);
    console.log("address key:" + user_wallet.address);
    localStorage.setItem(KEY_WALLET_ADDRESS, user_wallet.address);
    console.log("memo word:" + JSON.stringify(user_wallet.mnemonic));
    let normalWallet: Wallet = new Wallet(user_wallet.privateKey);
    return normalWallet;
  };
  //检查用户是否有钱包,如果没有钱包,则生成一个钱包给用户.
  const [checkWalletExist, { isLoading }] = useLazyCheckWalletExistQuery();
  checkWalletExist().then((isWalletExist) => {
    if (!isWalletExist) {
      let wallet = createNewWallet();
      // setWallet(address);
      bindWallet2User(wallet.address);
    }
  });
  // useEffect(() => {
  //   if (wallet) {
  //     // bind user wallet address to user_id
  //     bindWallet2User(wallet.address);
  //   }
  // }, [wallet]);

  //查询用户状态，是否授权过twitter。
  const { data: twitterId } = useGetAuthByTwitterQuery();
  console.log("query-----------------");
  console.log(twitterId?.toString());
  let authTwitter = false;
  if (twitterId !== "0") {
    authTwitter = true;
  }
  console.log("authTwitter is:" + authTwitter);
  // const { authTwitter, twitterUid } = useAppSelector((store) => store.authData, shallowEqual);
  // if (authTwitter) return null;
  //  未初始化 则先走setup 流程
  console.log("to onAuthTwitter");
  if (!authTwitter) return <Navigate to={`/onAuthTwitter`} replace />;
  console.log("to home page!");
  if (authTwitter) return children;
};

export default RequireNoTwitterAuth;
