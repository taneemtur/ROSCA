import { TezosToolkit } from '@taquito/taquito'
import { useEffect, useState } from 'react'
import {  useEndpoint, useNetwork, useRefresh, useSetRefresh } from '../../contexts/Settings'
import { FaCoins, FaUserTie, FaUsers, FaPauseCircle ,FaPlayCircle } from 'react-icons/fa'
import { ImCross } from 'react-icons/im'
import { BiReset } from 'react-icons/bi'
import { useBeacon, useWalletAddress } from '../../contexts/Beacon'


const CollectingCard = (props:any) => {
    const walletAddress = useWalletAddress()
    const endpoint = useEndpoint()
    const contractAddress = props.contract
    const tezos = new TezosToolkit(endpoint)
    const wallet = useBeacon()
    const network = useNetwork()
    const refresh = useRefresh()
    const setRefresh = useSetRefresh()
    const [control,setControl] = useState(true)

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

    const isParticipant = ()=>{
        let arr:Array<string> = []
        props.participantsArray&& props.participantsArray.map((e:any)=>{
            let address= e.address
            let parsed = address && address.slice(1,address.length-1)
            arr.push(parsed)
        })
        var result = false
        arr&& arr.forEach((e)=>{
            if(e===walletAddress) result = true
        })
        return result
    }

    const joinRosca = async()=>{
        const contract = await tezos.wallet.at(contractAddress)
        wallet && setTezosProvider()  
        wallet && tezos.wallet
        .at(contractAddress)
        .then((wallet) => contract.methods.join().send())
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
            handleRefresh()
            } else {
            console.log('An error has occurred');
            }
        })
        .catch((err) => {
            console.log(err)
            err.message && err.message.slice(0,10) == 'rate limit' && refreshPage()
            err.data&&err.data[1].with&& err.data[1].with.string == "INVALID_STATE" && refreshPage()});
    }
    const startContributing = async()=>{
        const contract = await tezos.wallet.at(contractAddress)
        wallet && setTezosProvider()  
        wallet && tezos.wallet
        .at(contractAddress)
        .then((wallet) => contract.methods.start_contributing().send())
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
            handleRefresh()
            } else {
            console.log('An error has occurred');
            }
        })
        .catch((err) => {
            console.log(err)
            err.message && err.message.slice(0,10) == 'rate limit' && refreshPage()
            err.data&&err.data[1].with&& err.data[1].with.string == "INVALID_STATE" && refreshPage()});
    } 
    const readyToContribute =()=>{ 
        if((1<=props.participants_count.toNumber())&&walletAddress==props.admin){
            setTimeout(()=>{startContributing()},2000)
        }
    }

    useEffect(() => {
     isParticipant()
    }, [walletAddress])
    
    useEffect(() => {
     setTimeout(()=>{setControl(true)},10000)
    }, [control])
    
    useEffect(() => {
        if(control){
            setControl(false)
            readyToContribute()
        }
    }, [props.participants_count])

    const handleReset=()=>{
        alert("Warning! You're about to interrupt the Rosca cycle and start over. If you do not want to do this, please cancel the transaction in the pop-up window.")
        props.emergencyReset()
    }
    const handleRefresh = ()=>{
        refresh?setRefresh(false):setRefresh(true)
    }

    function refreshPage() {
        window.location.reload();
    }
    return (
    <div className='flex'>
        {props.owner && 
        <div className='bg-[#EBEBEB] m-1 w-[380px] h-64  rounded-[48px] border border-black'> 
            <div className='flex flex-row justify-between bg-[#09417D] w-full h-20 pr-6 pl-10 pt-4 rounded-t-[48px]' >
                <div className="text-xl text-white" onClick={props.handleModalOpen}>
                    <p>Rosca: {parseAddress(contractAddress)}</p>
                    {props.paused?<p className='text-start'>Collecting (Paused)</p>:<p className='text-start'>Collecting Applications...</p>}
                </div>
                {props.paused?<div className="bg-gray-400 mt-2 h-10 w-10 rounded-full"></div>:
                <div className="bg-[#24FF00] mt-2 h-10 w-10 rounded-full group">
                    {walletAddress==props.admin&&<div className='bg-red-400 hidden h-10 w-10 pl-2 pt-2 rounded-full group-hover:block' onClick={props.deleteContract}><ImCross color='white' size={'24px'}/></div>}
                </div>}
            </div>
            <div className="flex flex-row justify-between h-32 pr-6 pl-12 pt-6">
                <div className='' onClick={props.handleModalOpen}>
                    <div className='flex flex-row pb-2'> 
                        <div className="pt-1"><FaUserTie/></div>
                        <p className='pl-2'>{props.admin?parseAddress(props.admin):parseAddress(props.owner)}</p>
                    </div>
                    <div className='flex flex-row pb-2'>
                        <div className="pt-1"><FaCoins/></div>
                        <p className='pl-2'>{props.rosca_total} ꜩ</p>
                    </div>
                    <div className='flex flex-row pb-2'>
                        <div className="pt-1"><FaUsers/></div>
                        <p className='pl-2'>{props.participants_count.toNumber()}/{props.max_participants.toNumber()}</p>
                    </div>
                </div>
                <div className="flex flex-col">
                    <div className="flex flex-col h-full justify-between">
                        {walletAddress==props.admin && props.paused?
                        <button onClick={props.resumeRosca}><FaPlayCircle size={'24px'}/></button>: walletAddress==props.admin &&<button onClick={props.pauseRosca}><FaPauseCircle size={'24px'}/></button>}
                        {walletAddress==props.admin && !props.paused && <button className='pb-5 pl-1' onClick={handleReset}><BiReset/></button>}
                    </div>
                </div>
            </div>
            {props.paused?<div className="flex flex-col bg-[#D9D9D9] w-full h-12 pr-6 pl-6 pt-2 rounded-b-[48px] -mt-[2px] border items-center text-xl">Rosca is Paused...</div>:
            <div className="flex flex-col bg-[#D9D9D9] w-full h-12 pr-6 pl-6 pt-2 rounded-b-[48px] -mt-[2px] border items-center">
                {props.admin && walletAddress && walletAddress==props.admin?
                <div className="pr-2 text-xl flex">
                    <button onClick={startContributing}>Start Contributing</button>
                    <div className='w-8'>|</div> 
                    {isParticipant()?
                        <div className="pr-2 text-xl"><button disabled={true}>✔ Joined</button></div>
                        :<div className="pr-2 text-xl"><button onClick={joinRosca}>+ Join Rosca</button></div>
                    }
                </div>:
                <div>
                    {isParticipant()?
                        <div className="pr-2 text-xl"><button disabled={true}>✔ Joined</button></div>
                        :<div className="pr-2 text-xl"><button onClick={joinRosca}>+ Join Rosca</button></div>
                    }
                </div>}
            </div>}
        </div>
        }
    </div>
    )
}
export default CollectingCard