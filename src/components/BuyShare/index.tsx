import React, { useEffect } from "react";
import { CreateType, ProgramMetadata } from "@gear-js/api";
import useGearApi from "@/hooks/useGearApi";
import Keyring from "@polkadot/keyring";
import { getGearWallet } from "@/routes/wallet/index";
import { KeyringPair } from "@polkadot/keyring/types";
import MetaText from "@/assets/gear_friend_share.meta.txt";
import { ethers } from "ethers";

const BuyShare: React.FC = () => {
  const [metaData, setMetaData] = React.useState({} as ProgramMetadata);

  useEffect(() => {
    fetch(MetaText)
      .then((r) => r.text())
      .then((rawMeta) => {
        const meta: ProgramMetadata = ProgramMetadata.from("0x" + rawMeta);
        setMetaData(meta);
      });
  }, [MetaText]);

  const { gearApi } = useGearApi();
  if (!gearApi) {
    return <div>loading...</div>;
  }

  // TODO 合约地址。应该从.env或者配置文件中读取该变量
  const programId =
    (process.env.REACT_APP_CONTRACT_ADDRESS as `0x${string}`) ??
    "0xc87e3c70da3745ddef654869da9ae6fda550e7cc01338a3765e438696363a7af";

  console.log("meta is {}", JSON.stringify(metaData));

  const buyShare = async (sharesSubject: `0x${string}`) => {
    if (!gearApi) {
      console.error("gearApi is null");
      return;
    }

    const kering: KeyringPair | null = await getGearWallet();

    // query the price of state，
    const buyPriceAfterFeeResponse = await gearApi.programState.read(
      {
        programId,
        payload: {
          BuyPriceAfterFee: {
            shares_subject: sharesSubject,
            amount: 1
          }
        }
      },
      metaData
    );
    // console.log("meta.getAllTypes() is:{}", meta.getAllTypes());
    const buyPriceAfterFee = buyPriceAfterFeeResponse.toHuman() as any;
    // TODO 该价格为购买好友share的价格，将该值转成bigNumber并设置到购买函数的出价内。
    const buyPrice = buyPriceAfterFee.Price;
    const bigBuyPrice = ethers.parseUnits(buyPrice.replace(/,/g, ""));
    console.log("buyPrice is:", bigBuyPrice);

    try {
      const gas = await gearApi.program.calculateGas.handle(
        sharesSubject, // source id TODO 此次应该设置为用户钱包地址
        programId, // program id
        {
          buyShare: {
            shares_subject: sharesSubject,
            amount: "1"
          }
        }, // payload
        0, // value 将价格设置到此处
        false, // allow other panics
        metaData
      );
      console.log(gas.toHuman());

      const message = {
        destination: programId, // programId
        payload: {
          BuyShare: {
            shares_subject: sharesSubject,
            amount: "1"
          }
        },
        gasLimit: 4_107_353_945, // TODO 此次应该设置为gas
        value: 0 // 将计算出来的价格设置到此处
        // prepaid: true,
        // account: accountId,
        // if you send message with issued voucher
      };

      // const payload = CreateType.create(
      //   "KeeBeeIoKbAction",
      //   {
      //     BuyShare: {
      //       shares_subject: "0xec59e48cf877dfab6e6ba04b24d29349f11cf0bcfa44d04d7b875397225a1b2a",
      //       amount: 1
      //     }
      //   },
      //   rawMeta
      // );
      // console.log("payload is:", payload);
      // In that case payload will be encoded using meta.types.handle.input type
      // test program id :0x1371d9c044ff3f249eb6a647c4807ed5e4f07ef98ea62a7043e9546b547503e5

      const tx = gearApi.message.send(message, metaData);

      const tx_hash = await tx.signAndSend(kering, ({ events }) => {
        events.forEach(({ event }) => console.log(event.toHuman()));
      });
      // console.log("tx_hash is:{}", tx_hash);
      // So if you want to use another type you can specify it
      // extrinsic = gearApi.message.send(message, meta, meta.types.other.input);
    } catch (error) {
      console.error(error);
    }
    // try {
    //   await extrinsic.signAndSend(keyring, (event) => {
    //     console.log(event.toHuman());
    //   });
    // } catch (error) {
    //   console.error(`${error.name}: ${error.message}`);
    // }
  };

  return (
    <button
      onClick={() => buyShare("0x7c7f79efedd289ff243a1cb812ce42ba761796649f6beb69685c534b1221880f")}
    >
      Buy
    </button>
  );
};

export default BuyShare;
