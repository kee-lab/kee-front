import { InterfaceAbi, Wallet, ethers } from "ethers";
import { memo } from "react";
import { KEY_WALLET_ADDRESS, KEY_WALLET_PRIVATE_KEY } from "@/app/config";
const fs = require("fs");

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
    // const provider = new ethers.getDefaultProvider('https://goerli.infura.io/v3/9df29b35c83d4e4c87a8cde2034794f1');
    // const privateKey = fs.readFileSync(".secret").toString().trim();
    // const wallet = new ethers.Wallet(privateKey, provider);

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

  // 获取合约
  const getContract = async () => {
    const wallet = getWallet();
    const provider = new ethers.JsonRpcProvider(JSON_RPC_URL);
    const signer = await provider.getSigner();
    const abi = JSON.parse(fs.readFileSync("./abis/abi"));
    // 获取合约，参数：contractAddress、contractABI、signer
    const contract = new ethers.Contract(contractAddress, abi, signer);
    return contract;
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
