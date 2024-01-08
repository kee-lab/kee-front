import React, { useEffect } from "react";
import { ProgramMetadata } from "@gear-js/api";
import useGearApi from "@/hooks/useGearApi";
import Keyring from "@polkadot/keyring";
import { getGearWallet } from "@/routes/wallet/index";
import { KeyringPair } from "@polkadot/keyring/types";
import MetaText from "@/assets/gear_friend_share.meta.txt";
import { u8aToHex } from "@polkadot/util/u8a/toHex";
import { useAttendChannelMutation, useOutChannelMutation } from "@/app/services/channel";
import { useLazyGetWalletByUidQuery } from "@/app/services/user";
import { REACT_APP_CONTRACT_ADDRESS } from "@/app/config";
import { color } from "framer-motion";

interface Props {
  subjectUid: number;
}

const SellShare: React.FC<Props> = ({ subjectUid }) => {
  const [metaData, setMetaData] = React.useState({} as ProgramMetadata);
  const [outChannel] = useOutChannelMutation();
  const [getWalletByUid, { data: subject_wallet }] = useLazyGetWalletByUidQuery();

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

  const programId = REACT_APP_CONTRACT_ADDRESS as `0x${string}`;

  const sellShare = async (shareUserId: number) => {
    const keyring = new Keyring();
    let sharesSubjectResult = await getWalletByUid(shareUserId);
    console.log("sharesSubjectResult.data is", sharesSubjectResult.data);
    let sharesSubject = u8aToHex(keyring.decodeAddress(sharesSubjectResult.data));
    console.log("sharesSubject is", sharesSubject);

    if (!gearApi) {
      console.error("gearApi is null");
      return;
    }

    const keyingPair: KeyringPair | null = await getGearWallet();
    // 获取用户的地址
    let address = keyingPair?.address;
    console.log("wallet address is", address);
    let wallet = u8aToHex(keyring.decodeAddress(address));
    console.log("buyerWallet is:{}", wallet);
    // query the price of state，
    const sellPriceAfterFeeResponse = await gearApi.programState.read(
      {
        programId,
        payload: {
          SellPriceAfterFee: {
            shares_subject: sharesSubject,
            amount: 1
          }
        }
      },
      metaData
    );
    console.log("sellPriceAfterFeeResponse is:{}", sellPriceAfterFeeResponse.toHuman());
    const sellPriceAfterFee = sellPriceAfterFeeResponse.toHuman() as any;
    // TODO 该价格为购买好友share的价格，将该值转成bigNumber并设置到购买函数的出价内。
    const sellPrice = sellPriceAfterFee.Price;
    const sellBuyPrice = sellPrice.replace(/,/g, "");

    try {
      const gas = await gearApi.program.calculateGas.handle(
        wallet, // source id TODO 此次应该设置为用户钱包地址
        programId, // program id
        {
          SellShare: {
            shares_subject: sharesSubject,
            amount: 1
          }
        }, // payload
        0, // value 将价格设置到此处
        true, // allow other panics
        metaData
      );
      console.log("gas is.....", gas.toHuman());
      let gasfee = gas.toHuman().min_limit as string;
      let gasLimit = gasfee.replace(/,/g, "");
      console.log("gasLimit is.....", gasLimit);
      const message = {
        destination: programId, // programId
        payload: {
          SellShare: {
            shares_subject: sharesSubject,
            amount: "1"
          }
        },
        gasLimit: gasLimit, // TODO 此次应该设置为gas
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

      const tx_hash = await tx.signAndSend(keyingPair, ({ events }) => {
        events.forEach(({ event }) => console.log(event.toHuman()));
      });
      // join subject group
      outChannel(shareUserId);
      // // TODO join subject group
      // attendChannel(userId);
      // console.log("tx_hash is:{}", tx_hash);
      // So if you want to use another type you can specify it
      // extrinsic = gearApi.message.send(message, meta, meta.types.other.input);
    } catch (error) {
      alert(error);
      console.error("error is:", error);
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
    <button onClick={() => sellShare(subjectUid)}>
      <span style={{ color: "red" }}>Sell</span>
    </button>
  );
};

export default SellShare;
