
import { TezosToolkit } from '@taquito/taquito'
import React from 'react'
import { useState, useEffect } from 'react'
import { useAppName, useContractAddress, useEndpoint, useNetwork } from '../contexts/Settings'


const RoscaCard = (props:any) => {
    const name = useAppName()
    const network = useNetwork()
    const endpoint = useEndpoint()
    const contractAddress = props.contract
    const [info,setInfo] = useState(false)

    const [{owner,rosca_total,contributing_duration,
        max_participants,participant,paused,pot,participants_count,
        contributors_count,end_time,receiver,admin},setData] = useState<any>(()=>({
        owner:null,
        rosca_total:null,
        contributing_duration:null,
        max_participants:null,
        participant:null,
        paused: null,
        pot:null,
        participants_count:null,
        contributors_count:null,
        end_time:null,
        receiver:null,
        admin:null,      
    }))
    const [storage,setStorage] = useState(null)
    const loadStorage = React.useCallback(async()=>{
        const tezos = new TezosToolkit(endpoint)
        const contract = await tezos.contract.at(contractAddress)
        const contractStorage: any = await contract.storage()
        setData({
        owner: contractStorage.owner,
        rosca_total: contractStorage.rosca_total/1000000, 
        contributing_duration: contractStorage.contributing_duration,
        max_participants: contractStorage.max_participants,
        participant: contractStorage.participant,
        paused: contractStorage.paused,
        pot: contractStorage.pot, 
        participants_count: contractStorage.participants_count,
        contributors_count: contractStorage.contributors_count,
        end_time: contractStorage.end_time,
        receiver: contractStorage.receiver,
        admin: contractStorage.admin,
        }) 
        setStorage(contractStorage)
    },[])    
    useEffect(() => {
        loadStorage()
    }, [])
    
    return (
    <div> 
        <div className='bg-[#EBEBEB] m-16 w-[380px] h-64  rounded-[48px] border border-black'> 
            <div className='flex flex-row justify-between bg-[#09417D] w-full h-20 pr-6 pl-10 pt-4 rounded-t-[48px]'>
                <div className="text-xl text-white">
                    <p>Rosca: {contractAddress.slice(0,6)+ "........" +contractAddress.slice(contractAddress.length-7,contractAddress.length)}</p>
                    <p>Collecting Applications...</p>
                </div>
                <div className="bg-[#24FF00] mt-2 h-10 w-10 rounded-full"></div>
            </div>
            <div className="flex flex-col h-32 pr-6 pl-12 pt-6">
                <div className='flex flex-row pb-2'>
                    
                    <p className='pl-4'>sdfsdfsdf23423fw2fd23d</p>
                </div>
                <div className='flex flex-row'>
                    
                    <p className='pl-4'>sdfsdfsdf23423fw2fd23d</p>
                </div>
                <div className='flex flex-row'>
                    <p className='pl-4'>sdfsdfsdf23423fw2fd23d</p>
                </div>
            </div>
            <div className="bg-[#D9D9D9] w-full h-12 pr-6 pl-10 rounded-b-[48px] -mt-[2px] border">b</div>
        </div>
    </div>
    )
}
export default RoscaCard
