import { useState, useEffect } from "react";
import { GearApi } from "@gear-js/api";
import { useAppSelector } from "@/app/store";
import { shallowEqual, useDispatch } from "react-redux";
import { fillGearApi } from "@/app/slices/walletInfo";

const GEAR_TEST_RPC = "wss://testnet.vara-network.io";
// const GEAR_TEST_RPC = "ws://localhost:9944";

export default function useGearApi() {
  const sliceGearApi = useAppSelector((store) => store.walletInfo.gearApi, shallowEqual);
  const [gearApi, setGearApi] = useState<GearApi>();
  const dispatch = useDispatch();

  useEffect(() => {
    // Your code to initialize the gearApi object goes here
    const initializeGearApi = async () => {
      try {
        if (sliceGearApi) {
          console.log("sliceGearApi is:{}", sliceGearApi);
          setGearApi(sliceGearApi);
        } else {
          const gearApi = await GearApi.create({
            providerAddress: GEAR_TEST_RPC
          });
          setGearApi(gearApi);
          dispatch(fillGearApi(gearApi));
          console.log("GearApi initialized");
        }
      } catch (err) {
        console.error("Failed to initialize gearApi");
        console.error(err);
      }
    };

    initializeGearApi();
  }, []);

  return { gearApi };
}
