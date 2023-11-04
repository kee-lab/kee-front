import { Wallet, ethers } from "ethers";
import { memo } from "react";
import { KEY_WALLET_ADDRESS, KEY_WALLET_PRIVATE_KEY } from "@/app/config";

//创建一个新的钱包账户
export const createNewWallet = () => {
  const user_wallet = Wallet.createRandom();
  console.log("private key:" + user_wallet.privateKey);
  localStorage.setItem(KEY_WALLET_PRIVATE_KEY, user_wallet.privateKey);
  console.log("address key:" + user_wallet.address);
  localStorage.setItem(KEY_WALLET_ADDRESS, user_wallet.address);
  console.log("memo word:" + JSON.stringify(user_wallet.mnemonic));
  let normalWallet: Wallet = new Wallet(user_wallet.privateKey);
  return normalWallet;
};

function myWallet() {
  const NETWORK = "arbitrum-sepolia";
  //在infura中申请的key
  const API_KEY = "53119e34e0294563ab8d294d8ea8adb9";
  const JSON_RPC_URL = "https://arbitrum-sepolia.infura.io/v3/53119e34e0294563ab8d294d8ea8adb9";
  const contractAddress = "0x838d8929f81b968f50f3ccf7e862521c8d9f34e6";

  const getWallet = (): Wallet | null => {
    const privateKey = localStorage.getItem(KEY_WALLET_PRIVATE_KEY);
    let wallet = null;
    if (privateKey) {
      wallet = new Wallet(privateKey);
    }
    return wallet;
  };

  const connectJsonRpcUrl = async () => {
    const wallet = getWallet();
    const provider = new ethers.JsonRpcProvider(JSON_RPC_URL);
    if (wallet) {
      provider.getBalance(wallet).then((balance) => {
        alert(balance);
      });
    } else {
      alert("wallet not exist");
    }
  };

  //连接内置钱包账户
  const connectCustomWallet = (wallet: Wallet): Wallet => {
    const provider = new ethers.InfuraProvider(NETWORK, API_KEY);
    provider.getBalance(wallet);
    const connectWallet = wallet.connect(provider);
    return connectWallet;
  };

  return (
    <>
      <div onClick={connectJsonRpcUrl}>my wallet</div>
    </>
  );
}

export default memo(myWallet);
