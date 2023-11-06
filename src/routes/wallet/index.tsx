import { InterfaceAbi, Wallet, ethers } from "ethers";
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
  const contractAddress = "0x6c50E3C83d7710DE9a993dac8bBC990e459e3865";

  const getWallet = (): Wallet | null => {
    // const provider = new ethers.getDefaultProvider('https://goerli.infura.io/v3/9df29b35c83d4e4c87a8cde2034794f1');
    // const privateKey = fs.readFileSync(".secret").toString().trim();
    // const wallet = new ethers.Wallet(privateKey, provider);

    const privateKey = localStorage.getItem(KEY_WALLET_PRIVATE_KEY);
    let wallet = null;
    if (privateKey) {
      const provider = new ethers.JsonRpcProvider(JSON_RPC_URL);
      wallet = new Wallet(privateKey, provider);
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
    const abi = require("@/abis/abi.json");
    // 获取合约，参数：contractAddress、contractABI、signer
    const contract = new ethers.Contract(contractAddress, abi, wallet);
    // 检查用户钱包地址是否存在.
    // 得到用户的购买价格
    let buyPriceAfterFee = await contract.getBuyPriceAfterFee.staticCall(
      "0xeA398f3037b3F7EE32BC7E1FABBF66cf22Bb537E",
      1
    );
    // 去购买用户的share
    alert("buyPriceAfterFee is:  " + buyPriceAfterFee);
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
      <div onClick={getContract}>my wallet</div>
    </>
  );
}

export default memo(myWallet);
