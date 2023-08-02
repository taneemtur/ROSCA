import { useEffect, useState } from "react"
import { useBeacon, useWalletAddress } from "./Beacon"
import { useEndpoint, useNetwork } from "./Settings"
import { TezosToolkit } from "@taquito/taquito"
import constate from "constate";

export const [
    ContractsProvider,
    useContract
]= constate(
    SetContracts,
    (v) => v.roscaContracts
)

function SetContracts(){
    const endpoint = useEndpoint()
    const tezos = new TezosToolkit(endpoint)

    const [roscaContracts, setRoscaContracts] = useState<any>([]) 


    const [{contracts},setData] = useState<any>(()=>({
        contracts:null,   
    }))
    
    const loadContracts=async()=>{
        const contract = await tezos.contract.at("KT1QccuR2EPRxcwH6ZaST7n36EtqJcYKR6oT")
        const contractStorage: any = await contract.storage()
        setData({
        contracts:contractStorage.contracts,
        contracts_count:contractStorage.contracts_count, 
        })
    }
    
    useEffect(() => {
        if(localStorage.getItem('contracts')) {
            let raw = localStorage.getItem('contracts')
            raw && setRoscaContracts(JSON.parse(raw))
        }
        loadContracts()
    }, [])

    useEffect(()=>{

        const values = contracts && Object.values(contracts)[0]  
        const keys = values && Array.from(values.keys())
        let cArray: any[] = keys&&[]
        keys && keys.forEach((e:any) => { 
          cArray.push(e.slice(1,e.length-1))
        });
        cArray && localStorage.setItem('contracts', JSON.stringify(cArray))
        let res = localStorage.getItem('contracts')
        let parsed = res && JSON.parse(res)
        parsed && setRoscaContracts(parsed)
        parsed && console.log(parsed)
    },[contracts])
    return {roscaContracts}
}