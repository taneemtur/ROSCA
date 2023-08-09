import { TezosToolkit } from '@taquito/taquito'
import { useEndpoint, useNetwork, useRefresh, useSetRefresh } from '../../contexts/Settings'
import { FaUserTie, FaPauseCircle ,FaPlayCircle,FaUserPlus } from 'react-icons/fa'
import { ImCross } from 'react-icons/im'
import { useBeacon, useWalletAddress } from '../../contexts/Beacon'
import { Dialog } from '@headlessui/react'
import { useEffect, useState } from 'react'

const StartingCard = (props:any) => {
    const walletAddress = useWalletAddress()
    const endpoint = useEndpoint()
    const contractAddress = props.contract
    const tezos = new TezosToolkit(endpoint)
    const wallet = useBeacon()
    const network = useNetwork()
    const refresh = useRefresh()
    const setRefresh = useSetRefresh()

    const [modalOpen, setModalOpen] = useState(false)
    const [adminModalOpen, setAdminModalOpen] = useState(false)
    const [admin,setAdmin] = useState<any>(null)
    const [roscaParameters,setRoscaParameters] = useState<any>({
      totalRosca:null,
      maxParticipants:null
    })
    const [roscaDuration, setRoscaDuration] = useState<any>({
      days:null,
      hours:null,
      minutes:null
    })

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

    const startRosca = async(totalRosca:number,duration:number,maxP:number)=>{
        const contract = await tezos.wallet.at(contractAddress)
        wallet && setTezosProvider()  
        wallet && tezos.wallet
        .at(contractAddress)
        .then((wallet) => contract.methods.start((totalRosca*1000000),duration,maxP).send())
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
    const handleStartRosca =() =>{
        if(!roscaParameters.totalRosca || (roscaParameters.totalRosca <= 0)){
          alert("Please Enter a vaild Total Rosca Amount")
        }else if(!roscaParameters.maxParticipants || (roscaParameters.maxParticipants <= 0)){
          alert("Please Enter a vaild Maximum Participants Value")
        }else if((!roscaDuration.minutes||!roscaDuration.hours||!roscaDuration.days)||
        ((roscaDuration.minutes<=0)&&(roscaDuration.hours<=0)&&(roscaDuration.days<=0))||
        (0>=(roscaDuration.minutes*60+roscaDuration.hours*3600+roscaDuration.days*86400))){
          alert("Please Enter a vaild Rosca Duration")
        }else{
          console.log(roscaParameters.totalRosca,(roscaDuration.minutes*60+roscaDuration.hours*3600+roscaDuration.days*86400),roscaParameters.maxParticipants)
          startRosca(roscaParameters.totalRosca,(roscaDuration.minutes*60+roscaDuration.hours*3600+roscaDuration.days*86400),roscaParameters.maxParticipants)
        }
      }
      const handleModalOpen = ()=>{
        setModalOpen(true) 
      }
      useEffect(() => {
        if(!modalOpen){
          setRoscaParameters({
            totalRosca:null,
            maxParticipants:null
          })
          setRoscaDuration({
            days:null,
            hours:null,
            minutes:null
          })
        }
      }, [modalOpen])

    const handleRefresh = ()=>{
        refresh?setRefresh(false):setRefresh(true)
    }
    function refreshPage() {
        window.location.reload();
    }
    const handleChangeAdmin = ()=>{
      props.changeAdmin(admin)
    }
    const handleAdminModalOpen = ()=>{
        setAdminModalOpen(true) 
    }
        
    return (
    <div className='flex'>
        {props.owner && <div className='bg-[#EBEBEB] m-1 w-[380px] h-64  rounded-[48px] border border-black'> 
           <div className='flex flex-row justify-between bg-[#09417D] w-full h-20 pr-6 pl-10 pt-4 rounded-t-[48px]' onClick={props.handleModalOpen}>
                <div className="text-xl text-white">
                    <p className='font-bold text-start'>Rosca: - {props.id}</p>
                    <p className='text-start'>Starting...</p>
                </div>
                {props.paused?<div className="bg-gray-400 mt-2 h-10 w-10 rounded-full"></div>:
                <div className="bg-[#00FFA3] mt-2 h-10 w-10 rounded-full group">
                    {walletAddress==props.admin&&<div className='bg-red-400 hidden h-10 w-10 pl-2 pt-2 rounded-full group-hover:block' onClick={props.deleteContract}><ImCross color='white' size={'24px'}/></div>}
                </div>}
            </div>
            <div className="flex flex-col h-32 pr-6 pl-12 pt-6">
                <div className='flex justify-between'>
                    <div className={`flex flex-row mb-2 pr-2 rounded ${props.owners.includes(walletAddress) && 'hover:bg-slate-50'}`} onClick={handleAdminModalOpen}> 
                        <div className="pt-1"><FaUserTie/></div>
                        <p className={`pl-2 ${walletAddress==props.admin && 'font-medium'}`}>{props.admin?parseAddress(props.admin):parseAddress(props.owner)}</p>
                    </div>
                    <div className=''>
                        {walletAddress==props.admin && props.paused?
                        <button onClick={props.resumeRosca}><FaPlayCircle size={'24px'}/></button>
                        :walletAddress==props.admin &&<button onClick={props.pauseRosca}><FaPauseCircle size={'24px'}/></button>}
                    </div>
                </div>
                <div className="">
                    <p className='text-2xl'>Waiting for Start Rosca...</p>
                </div>
                
            </div>
            <div className="flex flex-col bg-[#D9D9D9] w-full h-12 pr-6 pl-6 pt-2 rounded-b-[48px] -mt-[2px] border items-center">
                {props.admin && walletAddress && walletAddress==props.admin?
                <div className="pr-2 text-xl"><button onClick={handleModalOpen}>▷ Start Rosca</button></div>
                :<div className="pr-2 text-xl text-gray-500"><button disabled={true}>Please wait...</button></div>
                }
            </div>
        </div>}
        <Dialog 
            open={modalOpen?modalOpen:false} 
            onClose={() => setModalOpen(false)}
            className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className='p-4 rounded-lg bg-blue-100 '>
                   <div className="flex flex-col ">
                      <div className='flex flex-col items-center pb-6'>
                        <p className='font-bold text-2xl'>Start Rosca</p>
                      </div>
                      <div className="flex flex-col ">
                          <div className="flex flex-col mb-6 items-center">
                            <p className='font-bold pb-2'>Contributing Duration</p>
                            <div className='flex justify-between'>
                              Days:
                              <input type="number" min="0" onChange={(e)=>{setRoscaDuration({...roscaDuration, days: e.target.value})}} className='w-20 h-8 ml-2 mr-4'/>
                              Hours:
                              <input type="number" min="0" onChange={(e)=>{setRoscaDuration({...roscaDuration, hours: e.target.value})}} className='w-20 h-8 ml-2 mr-4'/>
                              Minutes:
                              <input type="number" min="0" onChange={(e)=>{setRoscaDuration({...roscaDuration, minutes: e.target.value})}} className='w-20 h-8 ml-2'/>
                            </div>
                          </div>
                          <div className="flex flex-col items-center justify-between mb-4">
                            <div className="flex w-full justify-between mb-4">
                              <p className='font-bold'>Maximum Participants </p>
                              <input type="number" min="0" onChange={(e)=>{setRoscaParameters({...roscaParameters, maxParticipants: e.target.value})}} className='w-20 h-8 ml-4'/>
                            </div>
                            <div className='flex w-full justify-between'>
                              <p className='font-bold'>Total Rosca Amount (ꜩ) </p>
                              <input type="number" min="0" onChange={(e)=>{setRoscaParameters({...roscaParameters, totalRosca: e.target.value})}} className='w-20 h-8 ml-4'/>
                            </div>
                          </div>
                      </div>                 
                      <div className={`ml-2 mt-1 mb-1 p-2 rounded-md ${roscaParameters.maxParticipants && roscaParameters.totalRosca && (0<(roscaDuration.minutes*60+roscaDuration.hours*3600+roscaDuration.days*86400)) ?
                        'bg-green-500 hover:bg-green-600': 'bg-orange-400'} flex flex-col items-center`}>
                        <button onClick={handleStartRosca} className='w-full text-white font-medium'> Start Rosca </button> 
                      </div>
                   </div>
                </Dialog.Panel>
            </div>
      </Dialog>
      {props.owners.includes(walletAddress)&&
    <Dialog 
        open={adminModalOpen?adminModalOpen:false} 
        onClose={() => setAdminModalOpen(false)}
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
export default StartingCard