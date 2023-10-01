import { FC } from "react";
import { HDNodeWallet, Wallet, ethers } from "ethers";
import { memo, useEffect } from "react";

//创建一个新的钱包账户
const createNewWallet = ()  => {
    const wallet = Wallet.createRandom();
    console.log("private key:"+wallet.privateKey);
    console.log("address key:"+wallet.address);
    console.log("memo word:"+JSON.stringify(wallet.mnemonic));
    return wallet;
}

const NETWORK = "rinkeby"
const API_KEY = "在infura中申请的key"

//连接内置钱包账户
const connectCustomWallet =  (wallet:Wallet) : Wallet => {
    const provider = new ethers.InfuraProvider(NETWORK, API_KEY);
    const conncetWallet = wallet.connect(provider);
    return conncetWallet;
}


function myWallet(){
    return (
        <>
            <div onClick={createNewWallet}>my wallet</div>
        </>
    );
}

export default memo(myWallet);