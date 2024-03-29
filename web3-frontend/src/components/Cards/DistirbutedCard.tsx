import { TezosToolkit } from '@taquito/taquito'
import React from 'react'
import { useState, useEffect } from 'react'
import {  useEndpoint, useNetwork, useRefresh, useSetRefresh } from '../../contexts/Settings'
import {FaCoins, FaUserTie, FaRecycle, FaPauseCircle ,FaPlayCircle, FaUserPlus} from 'react-icons/fa'
import {VscDebugContinue} from 'react-icons/vsc'
import { ImCross } from 'react-icons/im'
import { BiReset } from 'react-icons/bi'
import { useBeacon, useWalletAddress } from '../../contexts/Beacon'
import { MdRefresh } from 'react-icons/md'
import { Dialog } from '@headlessui/react'


const DistirbutedCard = (props:any) => {
    const walletAddress = useWalletAddress()
    const endpoint = useEndpoint()
    const contractAddress = props.contract
    const tezos = new TezosToolkit(endpoint)
    const wallet = useBeacon()
    const network = useNetwork()
    const refresh = useRefresh()
    const setRefresh = useSetRefresh()
    const [modalOpen, setModalOpen] = useState(false)
    const [admin,setAdmin] = useState<any>(null)
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

    const restartRosca= async()=>{
        const contract = await tezos.wallet.at(contractAddress)
        wallet && setTezosProvider()  
        wallet && tezos.wallet
        .at(contractAddress)
        .then((wallet) => contract.methods.reset().send())
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
            err.data&&err.data[1].with&& err.data[1].with.string == "INVALID_STATE" && refreshPage()});
    }
    const continueRosca= async()=>{
        console.log('me')
        const contract = await tezos.wallet.at(contractAddress)
        wallet && setTezosProvider()  
        wallet && tezos.wallet
        .at(contractAddress)
        .then((wallet) => contract.methods.continue().send())
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
            err.data&&err.data[1].with&& err.data[1].with.string == "INVALID_STATE" && refreshPage()});
    }
    const readyToContinue =()=>{
        if((props.participants_count.toNumber()>props.received_count.toNumber())&&walletAddress==props.admin){
            setTimeout(()=>{continueRosca()},5000)
        }
        // else if((props.participants_count.toNumber()==props.received_count.toNumber())&&walletAddress==props.admin){
        //     setTimeout(()=>{restartRosca()},5000)
        // }
    }
    function refreshPage() {
        window.location.reload();
    }
    const handleRefresh = ()=>{
        refresh?setRefresh(false):setRefresh(true)
    }
    const handleReset=()=>{
        alert("Warning! You're about to interrupt the Rosca cycle and start over. If you do not want to do this, please cancel the transaction in the pop-up window.")
        props.emergencyReset()
    }

    useEffect(() => {
        setTimeout(()=>{setControl(true)},10000)
       }, [control])
    useEffect(() => {
        if(control){
            setControl(false)
            readyToContinue()
        }
    }, [props.received_count])
    const handleChangeAdmin = ()=>{
        props.changeAdmin(admin)
    }
    const handleModalOpen = ()=>{
        setModalOpen(true) 
    }

    
    return (
    <div className='flex'>
        {props.owner && 
        <div className='bg-[#EBEBEB] m-1 w-[380px] h-64  rounded-[48px] border border-black'> 
           <div className='flex flex-row justify-between bg-[#09417D] w-full h-20 pr-6 pl-10 pt-4 rounded-t-[48px]' onClick={props.handleModalOpen}>
                <div className="text-xl text-white">
                    <p className='font-bold text-start'>Rosca: - {props.id}</p>
                    {props.paused?<p className='text-start'>Distirbuted (Paused)</p>:<p className='text-start'>Distirbuted</p>}
                </div>
                {props.paused?<div className="bg-gray-400 mt-2 h-10 w-10 rounded-full"></div>:
                <div className="bg-[#FF0000] mt-2 h-10 w-10 rounded-full group">
                    {walletAddress==props.admin&&<div className='bg-red-400 hidden h-10 w-10 pl-2 pt-2 rounded-full group-hover:block' onClick={props.deleteContract}><ImCross color='white' size={'24px'}/></div>}
                </div>}
            </div>
            <div className="flex flex-row justify-between h-32 pr-6 pl-12 pt-6 ">
                <div className="">
                <div className={`flex flex-row mb-2 pr-2 rounded ${props.owners.includes(walletAddress) && 'hover:bg-slate-50'}`} onClick={handleModalOpen}>                         <div className="pt-1"><FaUserTie/></div>
                        <p className={`pl-2 ${walletAddress==props.admin && 'font-medium'}`}>{props.admin?parseAddress(props.admin):parseAddress(props.owner)}</p>
                    </div>
                    <div className='flex flex-row pb-2'>
                        <div className="pt-1"><FaCoins/></div>
                        <p className='pl-2'>{props.pot.toNumber()/1000000} ꜩ</p>
                    </div>
                    <div className='flex flex-row pb-2 justify-between'>
                        <div className="flex">
                            <div className="pt-1 pr-2"><FaRecycle/></div>
                            {((props.contributors_count - props.received_count)>0)?<p>{`${props.contributors_count - props.received_count} Rosca cycles left`}</p>:
                            <p>{`Rosca is ended`}</p>}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col justify-between">
                    {walletAddress==props.admin && props.paused?
                    <button onClick={props.resumeRosca}><FaPlayCircle size={'24px'}/></button>: walletAddress==props.admin &&<button onClick={props.pauseRosca}><FaPauseCircle size={'24px'}/></button>}
                    {walletAddress==props.admin && !props.paused && (props.participants_count.toNumber()!=props.received_count.toNumber())&& <button className='pb-5 pl-1' onClick={handleReset}><BiReset/></button>}
                </div>
            </div>
            {props.paused?<div className="flex flex-col bg-[#D9D9D9] w-full h-12 pr-6 pl-6 pt-2 rounded-b-[48px] -mt-[2px] border items-center text-xl">Rosca is Paused...</div>:
            <div className="flex flex-col bg-[#D9D9D9] w-full h-12 pr-6 pl-6 pt-2 rounded-b-[48px] -mt-[2px] border items-center">
                {props.admin && walletAddress && walletAddress==props.admin?
                    (props.participants_count.toNumber()==props.received_count.toNumber())? 
                    <div className="pr-2 text-xl flex"><div className='pt-1 pr-1'><MdRefresh/></div><button onClick={restartRosca}>Restart Rosca</button></div>
                    :<div className="pr-2 text-xl flex"><div className='pt-1 pr-1'><VscDebugContinue/></div><button onClick={continueRosca}>Continue Rosca</button></div>
                :<div className="pr-2 text-xl text-gray-500"><button disabled={true}>x Not Joined</button></div> 
                }
            </div>}
        </div>}
        {props.owners.includes(walletAddress)&&
    <Dialog 
        open={modalOpen?modalOpen:false} 
        onClose={() => setModalOpen(false)}
        className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className='p-4 rounded-lg bg-blue-100 '>
                <div className="flex flex-col">
                <div className="">
                  <p className='text-center text-xl font-bold pb-4'>Change Admin</p>
                </div>
                <div className="flex flex-row">
                <div className='flex flex-wrap mr-4 width-full'><button className='' onClick={()=>{setAdmin(walletAddress)}}>
                <FaUserPlus size={'40px'}/></button></div> 
                  <input className='w-96' placeholder='tz0xxx.........xxx' onChange={(e)=>setAdmin(e.target.value)} id='admin-input' value={admin} type="text" />
                  <div className={`ml-2 mt-1 mb-1 p-2 ${admin? 'bg-green-500 hover:bg-green-600': 'bg-orange-400'} rounded-md`}>
                    {admin ? <button onClick={handleChangeAdmin} className='text-white font-medium'>Add</button>:
                    <button disabled={true} className='text-white font-medium'>Add</button>}
                  </div>
                </div>
                </div>
            </Dialog.Panel>
        </div>
      </Dialog>}
    </div>
    )
}
export default DistirbutedCard