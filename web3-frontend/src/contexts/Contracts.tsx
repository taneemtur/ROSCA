// contract deployed at ==> https://www.better-call.dev/ghostnet/KT1PSVEroWzAqeEvQ3eWR9dYqWsHAuDRCj8y

import { useEffect, useState } from "react"
import { useEndpoint} from "./Settings"
import { TezosToolkit } from "@taquito/taquito"
import constate from "constate";

export const [
    ContractsProvider,
    useContract,
    useAdmins,
]= constate(
    SetContracts,
    (v) => v.roscaContracts,
    (v) => v.trustedAddresses
)

function SetContracts(){
    const endpoint = useEndpoint()
    const tezos = new TezosToolkit(endpoint)

    const [roscaContracts, setRoscaContracts] = useState<any>([]) 
    const [trustedAddresses, setTrustedAddresses] = useState<any>([]) 


    const [{contracts,admins},setData] = useState<any>(()=>({
        contracts:null,   
        admins:null,   
    }))
    
    const loadContracts=async()=>{
        const contract = await tezos.contract.at("KT1PSVEroWzAqeEvQ3eWR9dYqWsHAuDRCj8y")
        const contractStorage: any = await contract.storage()
        setData({
        contracts:contractStorage.contracts,
        admins:contractStorage.admins,
        })
    }
    
    useEffect(() => {
      loadContracts()
    }, [])
    
    useEffect(() => {
        if(localStorage.getItem('contracts')) {
            let raw = localStorage.getItem('contracts')
            raw && setRoscaContracts(JSON.parse(raw))
        }
    }, [])

    useEffect(() => {
        if(localStorage.getItem('admins')) {
            let raw = localStorage.getItem('contracts')
            raw && setRoscaContracts(JSON.parse(raw))
        }
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

    useEffect(()=>{

        const values = admins && Object.values(admins)
        values && console.log(values)
        let aArray: any[] = values&&[]
        values && values.forEach((e:any) => { 
          aArray.push(e)
        });
        aArray && localStorage.setItem('admins', JSON.stringify(aArray))
        let res = localStorage.getItem('admins')
        let parsed = res && JSON.parse(res)
        parsed && setTrustedAddresses(parsed)
        parsed && console.log(parsed)
    },[admins])
    return {roscaContracts,trustedAddresses}
}