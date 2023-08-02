import React, { useState } from 'react'
import { useAdmins } from '../contexts/Contracts'
import { useBeacon, useWalletAddress } from '../contexts/Beacon'
import { useEndpoint, useNetwork } from '../contexts/Settings'
import { TezosToolkit } from '@taquito/taquito'
import { Dialog } from '@headlessui/react'

const TrustedAddresses = () => {
  const admins = useAdmins()
  admins && console.log(admins)
  const myAddress = useWalletAddress()
  const endpoint = useEndpoint()
  const tezos = new TezosToolkit(endpoint)
  const wallet = useBeacon()
  const network = useNetwork()
  const [modalOpen, setModalOpen] = useState(false)
  const [address,setAddress] = useState<any>(null)
  const moderators = ["tz1f4mS8qV5D8fVZ8hQAJTUtmEjydsJiJNpu","tz1dFWw5RugiquySipMwSpSaGgNRusDcy4FR"]

  const setTezosProvider =async() => {
    try {
        wallet && wallet.requestPermissions({ network: { type: network } })
        const provider = wallet && await tezos.setWalletProvider(wallet) 
        console.log(provider)
    } catch (error) {
        console.log(error)  
    }
  }
  const addTrustedAddress = async(contractAddress:string)=>{
    const contract = await tezos.wallet.at("KT1PSVEroWzAqeEvQ3eWR9dYqWsHAuDRCj8y")
    wallet && setTezosProvider()  
    wallet && tezos.wallet
    .at("KT1PSVEroWzAqeEvQ3eWR9dYqWsHAuDRCj8y")
    .then((wallet) => contract.methods.addAdmin(contractAddress).send())
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
        setInterval(()=>{refreshPage()},2000)
        } else {
        console.log('An error has occurred');
        }
    })
    .catch((err) => console.log(err));
    return 0 
  }
  const handleAddTrusted = ()=>{
    if(address.length<36){
      alert("Please enter a valid address")
    }else{ 
      setAddress('')
      addTrustedAddress(address)
    }
    
  }
  const handleModalOpen = ()=>{
    setModalOpen(true) 
  }
  function refreshPage() {
    window.location.reload();
  }

  return (
    <div className="mt-8">
      <div className="flex flex-row justify-between">
      <h1 className="text-xl font-semibold text-gray-900">Trusted Addresses</h1>
      {myAddress && moderators.includes(myAddress) && <button onClick={handleModalOpen}>Add Trusted Address</button>}
      </div>
      <div className='mt-5 relative block w-full border-2 border-gray-300 border-dashed rounded-lg p-6 text-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 '>
        {admins.map((e:any,i:number)=>{
          return <p>{i} - {e}</p>
        })}
      </div>
      <Dialog 
            open={modalOpen?modalOpen:false} 
            onClose={() => setModalOpen(false)}
            className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className='p-4 rounded-lg bg-blue-100 '>
                   <div className="flex flex-col">
                    <div className="">
                      <p className='text-center text-xl font-bold pb-4'>Add Trusted Address</p>
                    </div>
                    <div className="flex flex-row">
                      <input className='w-96' placeholder='tz0xxx.........xxx' onChange={(e)=>setAddress(e.target.value)} value={address} type="text" />
                      <div className={`ml-2 mt-1 mb-1 p-2 ${address? 'bg-green-300': 'bg-yellow-600'} rounded-md`}>
                        {address ? <button onClick={handleAddTrusted}>Add</button>:<button disabled={true}>Add</button>}
                      </div>
                    </div>
                   </div>
                </Dialog.Panel>
            </div>
      </Dialog>
    </div>
  )
}

export default TrustedAddresses
