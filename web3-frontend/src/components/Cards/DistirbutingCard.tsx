import { TezosToolkit } from '@taquito/taquito'
import React from 'react'
import { useState, useEffect } from 'react'
import {  useEndpoint, useNetwork } from '../../contexts/Settings'
import {FaCoins, FaNapster, FaUserTie, FaUsers} from 'react-icons/fa'
import { BeaconProvider, useBeacon } from '../../contexts/Beacon'

const DistirbutingCard = (props:any) => {
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
    const endDistirbuting= async()=>{
        const contract = await tezos.wallet.at(contractAddress)
        wallet && setTezosProvider()  
        wallet && tezos.wallet
        .at(contractAddress)
        .then((wallet) => contract.methods.disturbute().send())
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
                    <p className='text-start'>Distirbuting...</p>
                </div>
                <div className="bg-[#FFB800] mt-2 h-10 w-10 rounded-full"></div>
            </div>
            <div className="flex flex-col h-32 pr-6 pl-12 pt-6">
                <div className='flex flex-row pb-2'> 
                    <div className="pt-1"><FaUserTie/></div>
                    <p className='pl-2'>{props.admin?parseAddress(props.admin):parseAddress(props.owner)}</p>
                </div>
                <div className='flex flex-row pb-2'>
                    <div className="pt-1"><FaCoins/></div>
                    <p className='pl-2'>{props.pot.toNumber()/1000000} ꜩ</p>
                </div>
                <div className='flex flex-row pb-2'>
                    <div className="pt-1"><FaUsers/></div>
                    <p className='pl-2'>{'👱 '+props.participants_count.toNumber()} / {'🚫 ' +props.banned_count.toNumber()}</p>
                </div>
            </div>
            <div className="flex flex-col bg-[#D9D9D9] w-full h-12 pr-6 pl-6 pt-2 rounded-b-[48px] -mt-[2px] border items-center">
                {props.admin && userAddress && userAddress==props.admin?
                <div className="pr-2 text-xl"><button onClick={endDistirbuting}>Distirbute</button></div>
                :<div className="pr-2 text-xl text-gray-500"><button disabled={true}>x Not Joined</button></div>
                }
            </div>
        </div>}
    </div>
    )
}
export default DistirbutingCard