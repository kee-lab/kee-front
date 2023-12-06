import { useState, useEffect } from "react";
import { GearApi } from "@gear-js/api";

const GEAR_TEST_RPC = "wss://testnet.vara-network.io";

export default function useGearApi() {
  const [gearApi, setGearApi] = useState<GearApi>();

  useEffect(() => {
    // Your code to initialize the gearApi object goes here
    const initializeGearApi = async () => {
      // Example code to fetch the gearApi object from an API
      const gearApi = await GearApi.create({
        providerAddress: GEAR_TEST_RPC
      });
      setGearApi(gearApi);
    };

    initializeGearApi();
  }, []);

  return { gearApi };
}
