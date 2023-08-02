import React from 'react'
import { useAdmins } from '../contexts/Contracts'
import { useBeacon, useWalletAddress } from '../contexts/Beacon'
import { useEndpoint, useNetwork } from '../contexts/Settings'
import { TezosToolkit } from '@taquito/taquito'

const TrustedAddresses = () => {
  const admins = useAdmins()
  admins && console.log(admins)
  const myAddress = useWalletAddress()
  const endpoint = useEndpoint()
  const tezos = new TezosToolkit(endpoint)
  const wallet = useBeacon()
  const network = useNetwork()
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
    addTrustedAddress("")
  }

  function refreshPage() {
    window.location.reload();
  }

  return (
    <div className="mt-8">
      <div className="flex flex-row justify-between">
      <h1 className="text-xl font-semibold text-gray-900">Trusted Addresses</h1>
      {myAddress && moderators.includes(myAddress) && <button onClick={handleAddTrusted}>Add Trusted Address</button>}
      </div>
      <div className='mt-5 relative block w-full border-2 border-gray-300 border-dashed rounded-lg p-6 text-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 '>
        {admins.map((e:any,i:number)=>{
          return <p>{i} - {e}</p>
        })}
      </div>
    </div>
  )
}

export default TrustedAddresses
