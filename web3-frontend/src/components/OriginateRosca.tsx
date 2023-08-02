import React from 'react'
import {  BeaconWallet } from '@taquito/beacon-wallet';
import { TezosToolkit } from '@taquito/taquito';
import { useEndpoint, useNetwork } from '../contexts/Settings';
import { useBeacon, useWalletAddress } from '../contexts/Beacon';
import { code, getStorage } from '../contract';

const network = { type: "jakartanet" }


const OriginateRosca = () => {
    const myAddress = useWalletAddress()
    const endpoint = useEndpoint()
    const tezos = new TezosToolkit(endpoint)
    const wallet = useBeacon()
    const network = useNetwork()

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
      const contract = await tezos.wallet.at("KT1QccuR2EPRxcwH6ZaST7n36EtqJcYKR6oT")
      wallet && setTezosProvider()  
      wallet && tezos.wallet
      .at("KT1QccuR2EPRxcwH6ZaST7n36EtqJcYKR6oT")
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
          } else {
          console.log('An error has occurred');
          }
      })
      .catch((err) => console.log(err));
  }

    const originate = async () =>{
        wallet && await wallet.requestPermissions({ network: {type:network} })
        tezos.setWalletProvider(wallet)
        tezos.wallet.originate({
        code: code,
        init: getStorage(
          myAddress,2000000,60,2)
      }).send().then(op => {
        console.log(`Waiting for confirmation of origination...`);
        return op.contract()
      }).then (contract => {
        console.log(`Origination completed for ${contract.address}.`);
        console.log(`Contract deployed at: https://better-call.dev/${network}/${contract.address}`)
        addContract(contract.address)
      }).catch(error => console.log(`Error: ${JSON.stringify(error, null, 2)}`));
    }

  return (
    <div>
      <button onClick={originate}> Add Rosca </button> 
    </div>
  )
}

export default OriginateRosca
