import { TezosToolkit } from '@taquito/taquito'
import React from 'react'
import { useState, useEffect } from 'react'
import {  useEndpoint, useNetwork } from '../../contexts/Settings'
import {FaCoins, FaUserTie, FaUsers} from 'react-icons/fa'
import { useBeacon } from '../../contexts/Beacon'

const ContributingCard = (props:any) => {
    const endpoint = useEndpoint()
    const contractAddress = props.contract
    const tezos = new TezosToolkit(endpoint)
    const wallet = useBeacon()
    const network = useNetwork()
    const [userAddress,setUserAddress] = useState("") 

    const parseAddress =(address:string)=>{
        const parsed = address.slice(0,6)+ "........" +address.slice(address.length-7,address.length)
        return parsed
    }  

    const setTezosProvider =async() => {
        try {
            wallet && wallet.requestPermissions({ network: { type: network } })
            const provider = wallet && await tezos.setWalletProvider(wallet) 
            console.log(provider)
        } catch (error) {
            console.log(error)  
        }
        
    }
    const getWalletPKH =async () => {
        const userAddress = wallet && await wallet.getPKH()
        userAddress && setUserAddress(userAddress)
    }
    useEffect(() => {
      getWalletPKH()
     
    }, [])

    const isParticipant = ()=>{
        let arr:Array<string> = []
        props.participantsArray&& props.participantsArray.map((e:any)=>{
            let address= e.address
            let parsed = address && address.slice(1,address.length-1)
            console.log(parsed)
            arr.push(parsed)
        })
        var result = false
        arr&& arr.forEach((e)=>{
            if(e===userAddress) result = true
            else result = false
        })
        return result
    }
    const isContributed = ()=>{

    }
    const startDistirbuting= async()=>{
        const contract = await tezos.wallet.at(contractAddress)
        wallet && setTezosProvider()  
        wallet && tezos.wallet
        .at(contractAddress)
        .then((wallet) => contract.methods.end_contributing().send())
        .then((op) => {
            console.log(`Hash: ${op.opHash}`);
            return op.confirmation();
        })
        .then((result) => {
            console.log(result);
            if (result&&result.completed) {
            console.log(`Transaction correctly processed!
            Block: ${result.block.header.level}
            Chain ID: ${result.block.chain_id}`);
            } else {
            console.log('An error has occurred');
            }
        })
        .catch((err) => console.log(err));
    } 
    const calculateAmount=()=>{
       var amount = props.rosca_total /props.participants_count.toNumber()
       console.log(amount)
       return amount
    }
    
    const contributeRosca= async()=>{
        const contract = await tezos.wallet.at(contractAddress)
        wallet && setTezosProvider()  
        wallet && tezos.wallet
        .at(contractAddress)
        .then((wallet) => contract.methods.contribute().send({ amount: calculateAmount() }))
        .then((op) => {
            console.log(`Hash: ${op.opHash}`);
            return op.confirmation();
        })
        .then((result) => {
            console.log(result);
            if (result&&result.completed) {
            console.log(`Transaction correctly processed!
            Block: ${result.block.header.level}
            Chain ID: ${result.block.chain_id}`);
            } else {
            console.log('An error has occurred');
            }
        })
        .catch((err) => console.log(err));
    } 
    

    return (
    <div className='flex'>
        {props.owner && <div className='bg-[#EBEBEB] m-1 w-[380px] h-64  rounded-[48px] border border-black'> 
           <div className='flex flex-row justify-between bg-[#09417D] w-full h-20 pr-6 pl-10 pt-4 rounded-t-[48px]'>
                <div className="text-xl text-white">
                    <p>Rosca: {parseAddress(contractAddress)}</p>
                    <p className='text-start'>Contributing..</p>
                </div>
                <div className="bg-[#FAFF00] mt-2 h-10 w-10 rounded-full"></div>
            </div>
            <div className="flex flex-col h-32 pr-6 pl-12 pt-6">
                <div className='flex flex-row pb-2'> 
                    <div className="pt-1"><FaUserTie/></div>
                    <p className='pl-2'>{props.admin?parseAddress(props.admin):parseAddress(props.owner)}</p>
                </div>
                <div className='flex flex-row pb-2'>
                    <div className="pt-1"><FaCoins/></div>
                    <p className='pl-2'>{props.rosca_total} ꜩ</p>
                </div>
                <div className='flex flex-row pb-2 justify-between'>
                    <div className="flex">
                        <div className="pt-1"><FaUsers/></div>
                        {/* <p className='pl-2'>{props.participants_count.toNumber()}/{props.max_participants.toNumber()}</p> */}
                        <p className='pl-2'>{props.contributors_count.toNumber()}/{props.participants_count.toNumber()}</p>
                    </div>
                    <div className="">
                        <p>⌛ 2:43</p>
                    </div>
                </div>
            </div>
            <div className="flex flex-col bg-[#D9D9D9] w-full h-12 pr-6 pl-6 pt-2 rounded-b-[48px] -mt-[2px] border items-center">
                {props.admin && userAddress && userAddress==props.admin?
                <div className="pr-2 text-xl flex">
                    <button onClick={startDistirbuting}>Start Distirbuting</button>
                     <div className='w-8'>|</div> 
                     {isParticipant()?<div className="pr-2 text-xl"><button onClick={contributeRosca}>ꜩ Contribute</button></div>:<div className="pr-2 text-xl"><button onClick={contributeRosca}>X Not Joined</button></div>}
                </div>
                :isParticipant()?<div className="pr-2 text-xl"><button>Already Contributed</button></div>:<div className="pr-2 text-xl"><button onClick={contributeRosca}>ꜩ Contribute</button></div>
                }
            </div>
        </div>}
    </div>
    )
}
export default ContributingCard