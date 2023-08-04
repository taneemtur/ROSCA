import { NetworkType } from "@airgap/beacon-sdk";
import constate from "constate";
import { useState } from 'react';

export const [
  SettingsProvider,
  useAppName,
  useEndpoint,
  useContractAddress,
  useNetwork,
  useRefresh,
  useSetRefresh
] = constate(
  () => {
    const [settingState, setState] = useState({
      app_name        : 'ROSCA',
      endpoint        : 'https://ghostnet.tezos.marigold.dev/',
      contract        : 'KT1F2PhjjBmKKECZULkWFNB1D2iGp4nGRwsp',
      ipfs_browser    : 'https://gateway.pinata.cloud/ipfs/',
      network         :  NetworkType.GHOSTNET,
    });
    const [refresh,setRefresh] = useState(false)
    const Refresh = ()=>{
      setRefresh(true)
    }
    return { settingState, setState, refresh, setRefresh};
  },
  v => v.settingState.app_name,
  v => v.settingState.endpoint,
  v => v.settingState.contract,
  v => v.settingState.network,
  v=> v.refresh,
  v=> v.setRefresh
);