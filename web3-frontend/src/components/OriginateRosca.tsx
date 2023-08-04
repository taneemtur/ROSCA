import {useEffect, useState } from 'react'
import { TezosToolkit } from '@taquito/taquito';
import { useEndpoint, useNetwork } from '../contexts/Settings';
import { useBeacon, useWalletAddress } from '../contexts/Beacon';
import { code, getStorage } from '../contract';
import { Dialog } from '@headlessui/react';

const OriginateRosca = () => {
    const myAddress = useWalletAddress()
    const endpoint = useEndpoint()
    const tezos = new TezosToolkit(endpoint)
    const wallet = useBeacon()
    const network = useNetwork()
    const [modalOpen, setModalOpen] = useState(false)
    const [roscaParameters,setRoscaParameters] = useState<any>({
      totalRosca:null,
      maxParticipants:null
    })
    const [roscaDuration, setRoscaDuration] = useState<any>({
      days:null,
      hours:null,
      minutes:null
    })

    const setTezosProvider =async() => {
      try {
          wallet && wallet.requestPermissions({ network: { type: network } })
          const provider = wallet && await tezos.setWalletProvider(wallet) 
          console.log(provider)
      } catch (error) {
          console.log(error)  
      }
    }
    const addContract = async(contractAddress:string)=>{
      const contract = await tezos.wallet.at("KT1PSVEroWzAqeEvQ3eWR9dYqWsHAuDRCj8y")
      wallet && setTezosProvider()  
      wallet && tezos.wallet
      .at("KT1PSVEroWzAqeEvQ3eWR9dYqWsHAuDRCj8y")
      .then((wallet) => contract.methods.addContract(contractAddress).send())
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
          setTimeout(()=>{refreshPage()},3000)
          } else {
          console.log('An error has occurred');
          }
      })
      .catch((err) => console.log(err));
    }


    const originate = async (totalRosca:number,duration:number,maxP:number) =>{
        wallet && await wallet.requestPermissions({ network: {type:network} })
        tezos.setWalletProvider(wallet)
        tezos.wallet.originate({
        code: code,
        init: getStorage(
          myAddress,(totalRosca*1000000),duration,maxP)
      }).send().then(op => {
        console.log(`Waiting for confirmation of origination...`);
        return op.contract()
      }).then (contract => {
        console.log(`Origination completed for ${contract.address}.`);
        console.log(`Contract deployed at: https://better-call.dev/${network}/${contract.address}`)
        addContract(contract.address)
      }).catch(error => console.log(`Error: ${JSON.stringify(error, null, 2)}`));
    }

    const handleAddRosca =() =>{
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
        originate(roscaParameters.totalRosca,(roscaDuration.minutes*60+roscaDuration.hours*3600+roscaDuration.days*86400),roscaParameters.maxParticipants)
      }
    }

    const handleModalOpen = ()=>{
      setModalOpen(true) 
    }
    function refreshPage() {
      window.location.reload();
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
    
  return (
    <div>
      <button onClick={handleModalOpen} className='bg-blue-600 hover:bg-blue-800 text-white font-semibold py-2 px-4 border border-blue-500 hover:border-transparent rounded-md'> Add Rosca </button>
      <Dialog 
            open={modalOpen?modalOpen:false} 
            onClose={() => setModalOpen(false)}
            className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className='p-4 rounded-lg bg-blue-100 '>
                   <div className="flex flex-col ">
                      <div className='flex flex-col items-center pb-6'>
                        <p className='font-bold text-2xl'>Add New Rosca</p>
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
                        <button onClick={handleAddRosca} className='w-full text-white font-medium'> Add Rosca </button> 
                      </div>
                      {/* {JSON.stringify(roscaParameters)}
                      <br />
                      {JSON.stringify(roscaDuration)} */}
                   </div>
                </Dialog.Panel>
            </div>
      </Dialog>
    </div>
  )
}

export default OriginateRosca
