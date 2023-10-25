import { FC } from "react";
import { HDNodeWallet, Wallet, ethers } from "ethers";
import { memo, useEffect } from "react";
import { KEY_WALLET_ADDRESS, KEY_WALLET_PRIVATE_KEY } from "@/app/config";
import { useTwitterCodeAuthMutation, useBindWallet2UserMutation } from "@/app/services/auth";

/**
 *
 * @returns 此文件应该修改为授权完twitter oath2后,直接自动生成用户钱包.
 */
const [twitterCodeAuth, { isLoading, isSuccess, error }] = useTwitterCodeAuthMutation();
const [bindWallet2User] = useBindWallet2UserMutation();

//创建一个新的钱包账户
export const createNewWallet = () => {
  const user_wallet = Wallet.createRandom();
  console.log("private key:" + user_wallet.privateKey);
  localStorage.setItem(KEY_WALLET_PRIVATE_KEY, user_wallet.privateKey);
  console.log("address key:" + user_wallet.address);
  localStorage.setItem(KEY_WALLET_ADDRESS, user_wallet.address);
  console.log("memo word:" + JSON.stringify(user_wallet.mnemonic));
  let normalWallet: Wallet = new Wallet(user_wallet.privateKey);
  // bind user wallet address to user_id
  // bindWallet2User(user_wallet.address).then((data) => {
  //   console.log(data);
  // });
  // connectJsonRpcUrl(normalWallet);
  return normalWallet;
};

const NETWORK = "rinkeby";
const API_KEY = "在infura中申请的key";
const JSON_RPC_URL = "https://eth.llamarpc.com";

const connectJsonRpcUrl = (wallet: Wallet) => {
  const provider = new ethers.JsonRpcProvider(JSON_RPC_URL);
  provider.getBalance(wallet).then((balance) => {
    alert(balance);
  });
};

//连接内置钱包账户
const connectCustomWallet = (wallet: Wallet): Wallet => {
  const provider = new ethers.InfuraProvider(NETWORK, API_KEY);
  provider.getBalance(wallet);
  const connectWallet = wallet.connect(provider);
  return connectWallet;
};

function myWallet() {
  return (
    <>
      <div onClick={createNewWallet}>my wallet</div>
    </>
  );
}

export default memo(myWallet);
