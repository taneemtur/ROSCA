import { useEffect, useState } from 'react';

import { useConnect, useDisconnect, useIsConnected, useWalletAddress} from '../contexts/Beacon';
import { useEndpoint, useNetwork } from '../contexts/Settings';
import { useTezosToolkit } from '../contexts/Taquito';

export const WalletInfo = () => {
    const [balance, setBalance] = useState("...")
    const address = useWalletAddress()
    const endpoint = useEndpoint()
    const network = useNetwork()
    const ttk = useTezosToolkit()
    const connect = useConnect()
    const disconnect = useDisconnect()

    useEffect(() => {
      if (address) ttk.tz.getBalance(address).then(b => {
        setBalance(""+b.dividedBy(1000000).toNumber()+"ꜩ")
      })
    })
        const connected = useIsConnected()
        console.log(connected)
    return(
        <div className="">
            <span
                className="inline-flex items-center px-3 py-0.5 ml-1 rounded-full text-sm truncate font-medium bg-white text-indigo-600">
                <span
                  className={"absolute w-3 h-3 " + (address ? "bg-green-500" : "bg-orange-400") + " border-1 rounded-full animate-pulse"}/>
                <p className="ml-5">{address ? address : "Waiting for Wallet"}</p>
                <p className="ml-5">{address && balance}</p>
              </span>
              <span
                className="inline-flex items-center px-3 py-0.5 ml-1 rounded-full text-sm truncate font-medium bg-white text-indigo-600">
                {address?
                <button onClick={disconnect}>Disconnect</button>
                :<button onClick={connect}>Connect</button>}
              </span>
        </div>
    )
  }