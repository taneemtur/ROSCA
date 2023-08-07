import { TezosToolkit } from '@taquito/taquito'
import { useState, useEffect } from 'react'
import {  useEndpoint, useNetwork, useRefresh, useSetRefresh } from '../../contexts/Settings'
import { FaCoins, FaUserTie, FaUsers, FaPauseCircle ,FaPlayCircle, FaUserPlus } from 'react-icons/fa'
import { ImCross } from 'react-icons/im'
import { BiReset } from 'react-icons/bi'
import { useBeacon, useWalletAddress } from '../../contexts/Beacon'
import CountdownTimer from '../CountdownTimer'
import { Dialog } from '@headlessui/react'

const ContributingCard = (props:any) => {
    const walletAddress = useWalletAddress()
    const endpoint = useEndpoint()
    const contractAddress = props.contract
    const tezos = new TezosToolkit(endpoint)
    const wallet = useBeacon()
    const network = useNetwork()
    const refresh = useRefresh()
    const [modalOpen, setModalOpen] = useState(false)
    const [admin,setAdmin] = useState<any>(null)
    const setRefresh = useSetRefresh()

    const [control,setControl] = useState(true)
    const [expired,setExpired] = useState(false)
    const [countdown, setCountdown] = useState<any>(null)

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
        arr&& arr.forEach((e,i)=>{
             result = true
        })
        return result
    }

    const isContributed = ()=>{
        let arr:Array<any> = []
        props.participantsArray&& props.participantsArray.map((e:any)=>{
            let value= e.values
            value && arr.push(value)
        })
        var result = false
        arr&& arr.forEach((e)=>{ 
            if(e===walletAddress && e.contributed) result = true
        })
        return result
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

    const calculateAmount=()=>{
       var amount = props.rosca_total /props.participants_count.toNumber()
       console.log(amount)
       return amount
    }
 
    function formatEndtime() {
        let formatted = props.end_time && (props.end_time.Some.slice(5,7) + '/' + props.end_time.Some.slice(8,10) + '/' + props.end_time.Some.slice(0,4) + ' ' + props.end_time.Some.slice(11,19))
        let date1 =  new Date(formatted)
        let getDate =  date1.getTime()
        let timezone = new Date().getTimezoneOffset()
        let datebyTimezone = getDate - (timezone*60000) 
        setCountdown(datebyTimezone)   
        return datebyTimezone
    }
    const readyToDistirbute =()=>{ 
        if(expired&&walletAddress==props.admin&&(props.contributors_count>0)){
            alert(`You will skip distirbuting stage on Rosca ${contractAddress}`)
            setTimeout(()=>{startDistirbuting()},2000)
        }
    }
    useEffect(() => {
        setTimeout(()=>{setControl(true)},10000)
       }, [control])
       
       useEffect(() => {
           if(control){
               setControl(false)
               readyToDistirbute()
           }
       }, [expired])

    function refreshPage() {
        window.location.reload();
    }
    const handleRefresh = ()=>{
        refresh?setRefresh(false):setRefresh(true)
    }
    const handleReset=()=>{
        props.emergencyReset()
    }
    useEffect(() => {
        console.log("endtime: ", formatEndtime()) 
    }, [])
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
                    {props.paused?<p className='text-start'>Contributing (Paused)</p>:<p className='text-start'>Contributing...</p>}
                </div>
                {props.paused?<div className="bg-gray-400 mt-2 h-10 w-10 rounded-full"></div>:
                <div className="bg-[#FAFF00] mt-2 h-10 w-10 rounded-full group">
                    {walletAddress==props.admin&&<div className='bg-red-400 hidden h-10 w-10 pl-2 pt-2 rounded-full group-hover:block' onClick={props.deleteContract}><ImCross color='white' size={'24px'}/></div>}
                </div>}
            </div>
            <div className="flex flex-row h-32 pr-6 pl-12 pt-6 justify-between" >
                <div>
                    <div className={`flex flex-row mb-2 pr-2 rounded ${props.owners.includes(walletAddress) && 'hover:bg-slate-50'}`} onClick={handleModalOpen}> 
                        <div className="pt-1"><FaUserTie/></div>
                        <p className={`pl-2 ${walletAddress==props.admin && 'font-medium'}`}>{props.admin?parseAddress(props.admin):parseAddress(props.owner)}</p>
                    </div>
                    <div className='flex flex-row pb-2 justify-between'>
                        <div className='flex'>
                            <div className="pt-1"><FaCoins/></div>
                            <p className='pl-2'>{props.rosca_total} ꜩ</p>
                        </div>
                        <div className="flex pl-4">
                            <div className="pt-1"><FaUsers/></div>
                            <p className='pl-2'>{props.contributors_count.toNumber()}/{props.participants_count.toNumber()}</p>
                        </div>
                    </div>
                    <div className='flex flex-row pb-2 justify-between'>
                        <div className="flex flex-row"> 
                            <p>⌛ </p> 
                            {countdown && <CountdownTimer setExpired={setExpired} targetDate={countdown}/>}
                        </div>
                    </div>
                </div> 
                <div>
                    {props.contributors_count == 0&&<div className="flex flex-col h-full">
                        {walletAddress==props.admin && props.paused?
                        <button onClick={props.resumeRosca}><FaPlayCircle size={'24px'}/></button>: walletAddress==props.admin &&<button onClick={props.pauseRosca}><FaPauseCircle size={'24px'}/></button>}
                        {walletAddress==props.admin && !props.paused && <button className='pt-5 pl-1' onClick={handleReset}><BiReset/></button>}
                    </div>}
                </div>
            </div>
            {props.paused?<div className="flex flex-col bg-[#D9D9D9] w-full h-12 pr-6 pl-6 pt-2 rounded-b-[48px] -mt-[2px] border items-center text-xl">Rosca is Paused...</div>:
            <div className="flex flex-col bg-[#D9D9D9] w-full h-12 pr-6 pl-6 pt-2 rounded-b-[48px] -mt-[2px] border items-center">
                {props.admin && walletAddress && walletAddress==props.admin?

                <div className="pr-2 text-xl flex">
                    <button onClick={startDistirbuting}>Start Distirbuting</button>
                     <div className='w-8'>|</div> 
                     {isParticipant()?
                        isContributed()?
                        <div className="pr-2 text-xl"><button disabled={true}>✔ Contributed</button></div>
                        :(props.contributors_count.toNumber()==props.participants_count.toNumber())?<div className="pr-2 text-md text-gray-500"><button disabled={true}>Rosca is full</button></div>:
                        expired?<div className="pr-2 text-md text-gray-500"><button disabled={true}>Time's over</button></div>:<div className="pr-2 text-xl"><button onClick={contributeRosca}>Contribute {calculateAmount()}ꜩ</button></div>
                    :<div className="pr-2 text-xl text-gray-500"><button disabled={true} >x Not Joined</button></div>}
                </div>
                
                :isParticipant()?
                    isContributed()?
                    <div className="pr-2 text-xl"><button disabled={true}>✔ Contributed</button></div>
                    :(props.contributors_count.toNumber()==props.participants_count.toNumber())?<div className="pr-2 text-xl text-gray-500"><button disabled={true}>Rosca is full</button></div>:
                    expired?<div className="pr-2 text-xl text-gray-500"><button disabled={true}>Contribution ended</button></div>:<div className="pr-2 text-xl"><button onClick={contributeRosca}>Contribute {calculateAmount()}ꜩ</button></div>
                :<div className="pr-2 text-xl text-gray-500"><button disabled={true} >x Not Joined</button></div>
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
                <div className="flex flex-row bg-white hover:bg-slate-50">
                    <div className='flex '><button onClick={()=>{setAdmin(walletAddress)}}>
                    <FaUserPlus size={'40px'}/></button>
                    </div> 
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
export default ContributingCard