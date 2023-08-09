import React, { useRef, useState } from 'react'
import { useAdmins } from '../contexts/Contracts'
import { useBeacon, useWalletAddress } from '../contexts/Beacon'
import { useEndpoint, useNetwork, useRefresh, useSetRefresh } from '../contexts/Settings'
import { TezosToolkit } from '@taquito/taquito'
import { Dialog } from '@headlessui/react'
import { RiAdminFill } from 'react-icons/ri'
import { MdDelete } from 'react-icons/md'
import { FaUserCog, FaUserShield} from 'react-icons/fa' 

const TrustedAddresses = (props:any) => {
  const admins = useAdmins()
  admins && console.log(admins)
  const walletAddress = useWalletAddress()
  const endpoint = useEndpoint()
  const tezos = new TezosToolkit(endpoint)
  const wallet = useBeacon()
  const network = useNetwork()
  const refresh = useRefresh()
  const setRefresh = useSetRefresh()
  const deleteRef = useRef()
  
  const [modalOpen, setModalOpen] = useState(false)
  const [address,setAddress] = useState<any>(null)

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
    const contract = await tezos.wallet.at("KT1GMqJdN44bQJJGdZ1YRYqPGKadNSAdSpZm")
    wallet && setTezosProvider()  
    wallet && tezos.wallet
    .at("KT1GMqJdN44bQJJGdZ1YRYqPGKadNSAdSpZm")
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
        refreshPage()
        } else {
        console.log('An error has occurred');
        }
    })
    .catch((err) => {
      console.log(err)
      
      err.data&&err.data[1].with&& err.data[1].with.string == "INVALID_STATE" && refreshPage()});
  }
  const deleteTrustedAddress = async(contractAddress:string)=>{
    const contract = await tezos.wallet.at("KT1GMqJdN44bQJJGdZ1YRYqPGKadNSAdSpZm")
    wallet && setTezosProvider()  
    wallet && tezos.wallet
    .at("KT1GMqJdN44bQJJGdZ1YRYqPGKadNSAdSpZm")
    .then((wallet) => contract.methods.deleteAdmin(contractAddress).send())
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
        refreshPage()
        } else {
        console.log('An error has occurred');
        }
    })
    .catch((err) => {
      console.log(err)
      
      err.data&&err.data[1].with&& err.data[1].with.string == "INVALID_STATE" && refreshPage()});
  }
  const handleDeleteTrusted = (e:any) =>{
    deleteTrustedAddress(e)
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
  const handleRefresh = ()=>{
    refresh?setRefresh(false):setRefresh(true)
  } 
  function refreshPage() {
    window.location.reload();
  }

  return (
    <div className="mt-16">
      <div className="flex flex-col">
          <h1 className="text-xl font-semibold text-gray-900 pb-2">Trusted Addresses</h1>
        <div className='flex justify-between'>
          <p>A list of all Cohorts Issuers.</p>
          {walletAddress && props.owners.includes(walletAddress) && 
          <button onClick={handleModalOpen} className='h-12 bg-blue-600 hover:bg-blue-800 text-white font-semibold py-2 px-4 border border-blue-500 hover:border-transparent rounded-md'>
            Add Trusted Address
          </button>}
        </div>
      </div>
      <div className="bg-white border border-[#8F8F8F] mt-4 width-full h-full rounded ">
        <div className="bg-[#E7E7E7] width-full h-16 rounded-t pl-6 pt-4 text-xl font-semibold">
          Address
        </div>
        {admins.map((e:any,i:number)=>{
          return <div className={`flex h-20 border-[#C0C0C0] ${i+1!=admins.length&&'border-b-4'} border-dashed width-full justify-between pt-4 pb-4 hover:bg-gradient-to-r from-slate-100 to-slate-200`}>
                    <div className="flex pl-6">
                      {props.owners.includes(e)?<FaUserShield size={'40px'}/> :<FaUserCog size={'40px'}/>}
                      <p className='pl-4 pt-2 text-xl'>{e}</p>
                      {props.owners.includes(e)?<span className="inline-flex items-center rounded-md bg-indigo-50 hover:bg-gradient-to-r from-indigo-100 to-indigo-200 px-2 ml-4 font-medium text-indigo-700 ring-1 ring-inset ring-indigo-600/20"><p className='text-2xl mb-1'>•</p>Owner</span>
                      :<span className="inline-flex items-center rounded-md bg-cyan-50 hover:bg-gradient-to-r from-cyan-100 to-cyan-200 px-2 ml-4 font-medium text-cyan-700 ring-1 ring-inset ring-cyan-600/20"><p className='text-2xl mb-1'>•</p>Admin</span>}
                    </div>
                    <div className="flex pr-6 items-center">
                      {(!props.owners.includes(e))&& admins.includes(walletAddress)&&<button onClick={()=>{handleDeleteTrusted(e)}}><MdDelete size={'36px'}/></button>}
                    </div>
                  </div>
          })}
      </div>
{
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
                  <div className={`ml-2 mt-1 mb-1 p-2 ${address? 'bg-green-500 hover:bg-green-600': 'bg-orange-400'} rounded-md`}>
                    {address ? <button onClick={handleAddTrusted} className='text-white font-medium'>Add</button>:
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

export default TrustedAddresses
