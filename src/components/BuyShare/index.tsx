import React from "react";
import { ProgramMetadata } from "@gear-js/api";
import useGearApi from "@/hooks/useGearApi";
import Keyring from "@polkadot/keyring";
import { mnemonicGenerate } from "@polkadot/util-crypto";
import { KeyringPair } from "@polkadot/keyring/types";

const BuyShare: React.FC = () => {
  const { gearApi } = useGearApi();

  const buyShare = async () => {
    if (!gearApi) {
      console.error("gearApi is null");
      return;
    }

    const keyring = new Keyring({ type: "sr25519" });
    const mnemonic = mnemonicGenerate();
    const normalWallet: KeyringPair = keyring.addFromUri(mnemonic, { name: "User Default" });

    try {
      const account = "0xec59e48cf877dfab6e6ba04b24d29349f11cf0bcfa44d04d7b875397225a1b2a";
      const message = {
        destination:
          "0x1371d9c044ff3f249eb6a647c4807ed5e4f07ef98ea62a7043e9546b547503e5" as `0x${string}`, // programId
        payload: {
          shares_subject: "0xec59e48cf877dfab6e6ba04b24d29349f11cf0bcfa44d04d7b875397225a1b2a",
          amount: 1
        },
        gasLimit: 2_000_000_000,
        value: 0
        // prepaid: true,
        // account: accountId,
        // if you send message with issued voucher
      };
      const rawMeta =
        "000200010000000000010500000001060000000000000001080000000109000000f115440008286b65655f6265655f696f28496e6974436f6e666967000014016070726f746f636f6c5f6665655f64657374696e6174696f6e04011c4163746f72496400015070726f746f636f6c5f6665655f70657263656e741001107531323800014c7375626a6563745f6665655f70657263656e741001107531323800013c6d61785f6665655f70657263656e74100110753132380001286d61785f616d6f756e740c0108753800000410106773746418636f6d6d6f6e287072696d6974697665731c4163746f724964000004000801205b75383b2033325d000008000003200000000c000c00000503001000000507001408286b65655f6265655f696f204b42416374696f6e0001082042757953686172650801387368617265735f7375626a65637404011c4163746f724964000118616d6f756e74100110753132380000002453656c6c53686172650801387368617265735f7375626a65637404011c4163746f724964000118616d6f756e7410011075313238000100001808286b65655f6265655f696f1c4b424576656e7400010414547261646520011874726164657204011c4163746f72496400011c7375626a65637404011c4163746f72496400011869735f6275791c0110626f6f6c00013073686172655f616d6f756e74100110753132380001286574685f616d6f756e741001107531323800014c70726f746f636f6c5f6574685f616d6f756e74100110753132380001487375626a6563745f6574685f616d6f756e7410011075313238000118737570706c7910011075313238000000001c00000500002008286b65655f6265655f696f285374617465517565727900011c145072696365080118737570706c7910011075313238000118616d6f756e74100110753132380000002042757950726963650801387368617265735f7375626a65637404011c4163746f724964000118616d6f756e74100110753132380001002453656c6c50726963650801387368617265735f7375626a65637404011c4163746f724964000118616d6f756e741001107531323800020040427579507269636541667465724665650801387368617265735f7375626a65637404011c4163746f724964000118616d6f756e74100110753132380003004453656c6c507269636541667465724665650801387368617265735f7375626a65637404011c4163746f724964000118616d6f756e7410011075313238000400405375626a65637453686172655573657208011c7375626a65637404011c4163746f7249640001107573657204011c4163746f7249640005002446756c6c5374617465000600002408286b65655f6265655f696f2853746174655265706c7900010c1450726963650400100110753132380000002446756c6c53746174650400280134496f4b656542656553686172650001002c5368617265416d6f756e74040010011075313238000200002808286b65655f6265655f696f34496f4b6565426565536861726500002001387368617265735f62616c616e63652c01905665633c284163746f7249642c205665633c284163746f7249642c2075313238293e293e00013073686172655f737570706c793401505665633c284163746f7249642c2075313238293e00011c6d616e616765723c01505665633c284163746f7249642c20626f6f6c293e00016070726f746f636f6c5f6665655f64657374696e6174696f6e04011c4163746f72496400015070726f746f636f6c5f6665655f70657263656e741001107531323800014c7375626a6563745f6665655f70657263656e741001107531323800013c6d61785f6665655f70657263656e74100110753132380001286d61785f616d6f756e740c0108753800002c0000023000300000040804340034000002380038000004080410003c00000240004000000408041c00";
      const meta: ProgramMetadata = ProgramMetadata.from(rawMeta);
      console.log("meta is {}", JSON.stringify(meta));
      // In that case payload will be encoded using meta.types.handle.input type
      const tx = gearApi.message.send(message, meta, 0);
      tx.signAndSend(normalWallet, ({ events }) => {
        events.forEach(({ event }) => console.log(event.toHuman()));
      });
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

  return <button onClick={buyShare}>Buy</button>;
};

export default BuyShare;
