import { MouseEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

import { useUpdateAvatarMutation } from "@/app/services/user";
import { useAppSelector } from "@/app/store";
import AvatarUploader from "@/components/AvatarUploader";
import Button from "@/components/styled/Button";
import ProfileBasicEditModal from "./ProfileBasicEditModal";
import RemoveAccountConfirmModal from "./RemoveAccountConfirmModal";
import UpdatePasswordModal from "./UpdatePasswordModal";
import { shallowEqual } from "react-redux";
import useGearApi from "@/hooks/useGearApi";
import { getProgramMetadata } from "@gear-js/api";

type EditField = "name" | "email" | "";
export default function MyAccount() {
  const { gearApi } = useGearApi();
  const { t } = useTranslation("member");
  const { t: ct } = useTranslation();
  const [passwordModal, setPasswordModal] = useState(false);
  const [editModal, setEditModal] = useState<EditField>("");
  const [removeConfirmVisible, setRemoveConfirmVisible] = useState(false);
  const [uploadAvatar, { isSuccess: uploadSuccess }] = useUpdateAvatarMutation();
  const EditModalInfo = {
    name: {
      label: t("username"),
      title: t("change_name"),
      intro: t("change_name_desc")
    },
    email: {
      label: t("email"),
      title: t("change_email"),
      intro: t("change_email_desc")
    }
  };

  const loginUser = useAppSelector(
    (store) => store.users.byId[store.authData.user?.uid || 0],
    shallowEqual
  );

  useEffect(() => {
    if (uploadSuccess) {
      toast.success(ct("tip.update"));
    }
  }, [uploadSuccess]);

  const handleBasicEdit = (evt: MouseEvent<HTMLButtonElement>) => {
    const { edit } = evt.currentTarget.dataset as { edit: EditField };
    setEditModal(edit);
  };

  const closeBasicEditModal = () => {
    setEditModal("");
  };

  const togglePasswordModal = () => {
    setPasswordModal((prev) => !prev);
  };
  const toggleRemoveAccountModalVisible = () => {
    setRemoveConfirmVisible((prev) => !prev);
  };

  const buyShare = async (uid: number) => {
    if (!gearApi) {
      console.error("gearApi is null");
      return;
    }
    try {
      const message = {
        destination: "wss://testnet.vara-network.io", // programId
        payload: {
          shares_subject: "5HEdAMerT8qfRsgVzbAQSNYWBgP4qCaJ1sN7YdJWb7v7qNym",
          amount: 1
        },
        gasLimit: 5,
        value: 1
        // prepaid: true,
        // account: accountId,
        // if you send message with issued voucher
      };
      const meta =
        "000200010000000000010500000001060000000000000001080000000109000000f115440008286b65655f6265655f696f28496e6974436f6e666967000014016070726f746f636f6c5f6665655f64657374696e6174696f6e04011c4163746f72496400015070726f746f636f6c5f6665655f70657263656e741001107531323800014c7375626a6563745f6665655f70657263656e741001107531323800013c6d61785f6665655f70657263656e74100110753132380001286d61785f616d6f756e740c0108753800000410106773746418636f6d6d6f6e287072696d6974697665731c4163746f724964000004000801205b75383b2033325d000008000003200000000c000c00000503001000000507001408286b65655f6265655f696f204b42416374696f6e0001082042757953686172650801387368617265735f7375626a65637404011c4163746f724964000118616d6f756e74100110753132380000002453656c6c53686172650801387368617265735f7375626a65637404011c4163746f724964000118616d6f756e7410011075313238000100001808286b65655f6265655f696f1c4b424576656e7400010414547261646520011874726164657204011c4163746f72496400011c7375626a65637404011c4163746f72496400011869735f6275791c0110626f6f6c00013073686172655f616d6f756e74100110753132380001286574685f616d6f756e741001107531323800014c70726f746f636f6c5f6574685f616d6f756e74100110753132380001487375626a6563745f6574685f616d6f756e7410011075313238000118737570706c7910011075313238000000001c00000500002008286b65655f6265655f696f285374617465517565727900011c145072696365080118737570706c7910011075313238000118616d6f756e74100110753132380000002042757950726963650801387368617265735f7375626a65637404011c4163746f724964000118616d6f756e74100110753132380001002453656c6c50726963650801387368617265735f7375626a65637404011c4163746f724964000118616d6f756e741001107531323800020040427579507269636541667465724665650801387368617265735f7375626a65637404011c4163746f724964000118616d6f756e74100110753132380003004453656c6c507269636541667465724665650801387368617265735f7375626a65637404011c4163746f724964000118616d6f756e7410011075313238000400405375626a65637453686172655573657208011c7375626a65637404011c4163746f7249640001107573657204011c4163746f7249640005002446756c6c5374617465000600002408286b65655f6265655f696f2853746174655265706c7900010c1450726963650400100110753132380000002446756c6c53746174650400280134496f4b656542656553686172650001002c5368617265416d6f756e74040010011075313238000200002808286b65655f6265655f696f34496f4b6565426565536861726500002001387368617265735f62616c616e63652c01905665633c284163746f7249642c205665633c284163746f7249642c2075313238293e293e00013073686172655f737570706c793401505665633c284163746f7249642c2075313238293e00011c6d616e616765723c01505665633c284163746f7249642c20626f6f6c293e00016070726f746f636f6c5f6665655f64657374696e6174696f6e04011c4163746f72496400015070726f746f636f6c5f6665655f70657263656e741001107531323800014c7375626a6563745f6665655f70657263656e741001107531323800013c6d61785f6665655f70657263656e74100110753132380001286d61785f616d6f756e740c0108753800002c0000023000300000040804340034000002380038000004080410003c00000240004000000408041c00";
      // In that case payload will be encoded using meta.types.handle.input type
      let extrinsic = gearApi.message.send(message, meta);
      // So if you want to use another type you can specify it
      extrinsic = gearApi.message.send(message, meta, meta.types.other.input);
    } catch (error) {
      console.error(`${error.name}: ${error.message}`);
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

  if (!loginUser) return null;
  const { uid, avatar, name, email } = loginUser;
  return (
    <>
      <div className="flex flex-col items-start gap-8">
        <div className="md:p-6 flex flex-col items-center w-full md:w-[512px] md:bg-gray-100 md:dark:bg-gray-800 md:rounded-2xl">
          <AvatarUploader url={avatar} name={name} uploadImage={uploadAvatar} />
          <div className="mt-2 mb-16 font-bold text-lg text-gray-800 dark:text-white">
            {name} <span className="font-normal text-gray-500">#{uid}</span>
          </div>
          <div className="w-full flex items-start justify-between mb-6">
            <div className="flex flex-col text-gray-500 dark:text-gray-50">
              <span className="text-xs uppercase  font-semibold">{t("username")}</span>
              <span className="text-sm ">
                {name} <span className="text-gray-600 dark:text-gray-400"> #{uid}</span>
              </span>
            </div>
            <Button data-edit="name" onClick={handleBasicEdit} className="">
              {ct("action.edit")}
            </Button>
          </div>
          <div className="w-full flex items-start justify-between mb-6">
            <div className="flex flex-col text-gray-500 dark:text-gray-50">
              <span className="text-xs uppercase  font-semibold">{t("email")}</span>
              <span className="text-sm">{email}</span>
            </div>
            <Button data-edit="email" onClick={handleBasicEdit}>
              {ct("action.edit")}
            </Button>
          </div>
          <div className="w-full flex items-start justify-between mb-6">
            <div className="flex flex-col text-gray-500 dark:text-gray-50">
              <span className="text-xs uppercase  font-semibold">{t("password")}</span>
              <span className="text-sm">*********</span>
            </div>
            <Button onClick={togglePasswordModal}>{ct("action.edit")}</Button>
          </div>
        </div>
        {/* uid 1 是初始账户，不能删 */}
        {uid != 1 && (
          <Button className="danger" onClick={toggleRemoveAccountModalVisible}>
            {t("delete_account")}
          </Button>
        )}
      </div>
      {editModal && (
        <ProfileBasicEditModal
          type={editModal == "email" ? "email" : "text"}
          valueKey={editModal}
          {...EditModalInfo[editModal]}
          value={eval(editModal)}
          closeModal={closeBasicEditModal}
        />
      )}
      {passwordModal && <UpdatePasswordModal closeModal={togglePasswordModal} />}
      {removeConfirmVisible && (
        <RemoveAccountConfirmModal closeModal={toggleRemoveAccountModalVisible} />
      )}
    </>
  );
}
