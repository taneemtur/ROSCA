import './App.css';
import  {useEffect, useState} from 'react';
import { WalletInfo } from './components/WalletInfo';
import RoscaCard from './components/RoscaCard';
import {HiOutlineCollection} from 'react-icons/hi'
import {GrRefresh} from 'react-icons/gr'
import { useBeacon, useWalletAddress } from './contexts/Beacon';
import OriginateRosca from './components/OriginateRosca';
import { useEndpoint, useNetwork, useRefresh, useSetRefresh } from './contexts/Settings';
import { TezosToolkit } from '@taquito/taquito';
import { useAdmins, useContract } from './contexts/Contracts';
import TrustedAddresses from './components/TrustedAddresses';
import LateRoscasCard from './components/Contributing';
import MyRoscasCard from './components/MyRoscasCard';
import React from 'react';
import Starting from './components/Starting';
import Collecting from './components/Collecting';
import Contributing from './components/Contributing';
import Distirbuting from './components/Distirbuting';
import Distirbuted from './components/Distirbuted';
 

function App() {
  const walletAddress = useWalletAddress()
  const endpoint = useEndpoint()
  const tezos = new TezosToolkit(endpoint)
  const wallet = useBeacon()
  const network = useNetwork()
  const roscaContracts = useContract()
  const admins = useAdmins()
  const refresh = useRefresh()
  const setRefresh:any = useSetRefresh()
  const owners = ["tz1f4mS8qV5D8fVZ8hQAJTUtmEjydsJiJNpu","tz1dFWw5RugiquySipMwSpSaGgNRusDcy4FR"]
  const [startingContracts,setStartingContracts] = useState<any>([])
  const [collectingContracts,setCollectingContracts] = useState<any>([])
  const [contributingContracts,setContributingContracts] = useState<any>([])
  const [distirbutingContracts,setDistirbutingContracts] = useState<any>([])
  const [distirbutedContracts,setDistirbutedContracts] = useState<any>([])

  const [haveMyRoscas,setHaveMyRoscas] = useState(true)
  const [haveStarting,setHaveStarting] = useState(false)
  const [haveCollecting,setHaveCollecting] = useState(false)
  const [haveContributing,setHaveContributing] = useState(false)
  const [haveDistirbuting,setHaveDistirbuting] = useState(false)
  const [haveDistirbuted,setHaveDistirbuted] = useState(false)
  const [id,setId] = useState(0)


  function refreshPage() {
    window.location.reload();
  }
  const handleRefresh = ()=>{
    refresh?setRefresh(false):setRefresh(true)
  }
  const loadContractStatus = React.useCallback(async(address:any)=> {
    const contract = await tezos.contract.at(address)
    const contractStorage: any = await contract.storage()
    const status = contractStorage && contractStorage._state.toNumber()
    if(status ==0){
      setStartingContracts((startingContracts: any)=>[...startingContracts,status]) 
    }else if(status == 1){
      setCollectingContracts([...collectingContracts,status]) 
    }else if(status == 2){
      setContributingContracts([...contributingContracts,status])
    }else if(status == 3){
      setDistirbutingContracts([...distirbutingContracts,status])
    }else if(status == 3){
      setDistirbutedContracts([...distirbutedContracts,status])
    } 
  },[]) 

  // useEffect(() => { 
  //   roscaContracts.map((e:any)=>{
  //     loadContractStatus(e)
  //   })
  //   console.log(startingContracts)
  // }, [])  
   
  return (
    <div className="flex-col flex">
      <header className="bg-[#09427d]">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
          <div className="w-full py-6 flex items-center justify-between border-b border-indigo-500 lg:border-none">
            <div className="flex items-center">
              <a href="#">
                <img
                  className="h-9 w-auto"
                  src="https://images.squarespace-cdn.com/content/v1/611d0b2d86e03a029cd4c0dc/c3ea2a92-79a5-4bfe-bed6-64529221c00c/OCI+Full+Icon2.png?format=1500w"
                  alt=""
                />
              </a>
            </div>

            <div className="flex items-center space-x-4">
              <WalletInfo/> 
            </div>
          </div>
        </nav>
      </header>
      <main>
        <div className="py-6">
          <div>
            <h2>

            </h2>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex">
            <h1 className="text-2xl font-semibold text-gray-900">ROSCA trusted Cohorts</h1>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-12">
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto">
                <h1 className="text-xl font-semibold text-gray-900">Cohorts</h1>
                <div className='flex justify-between'>
                  {startingContracts}
                  <p className="mt-2 text-sm text-gray-700">A list of Cohorts to be participated on.</p>
                  {admins && admins.includes(walletAddress) && 
                      <OriginateRosca/>
                  }
                </div>
                    <div
                      className="mt-5 relative block w-full border-2 border-gray-300 border-dashed rounded-lg p-6 text-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 "> 
                        <div className='text-right'><button onClick={refreshPage}><GrRefresh size={'24px'}/></button></div>
                        {roscaContracts && roscaContracts.length>0 && walletAddress ? 
                        <div className="">
                          <div className="">
                            <p className='font-bold text-2xl mb-4'>My Roscas</p>
                            <div className="flex flex-row flex-wrap">
                              {roscaContracts.map((c:any,i:number)=>{
                              return <MyRoscasCard contract={c} owners={owners} id={i} setMyRoscas={setHaveMyRoscas}/>
                              })}
                            </div>
                            {!haveMyRoscas&& 
                              <div className="my-8">
                                <div className="flex flex-col items-center"><HiOutlineCollection size={'48px'}/></div>
                                <span className="mt-2 block text-sm font-medium text-gray-900"> You haven't joined any roscas yet. </span>
                              </div>}
                          </div>
                          <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700 "></hr>
                          <div className="">
                            {haveStarting && <p className='font-bold text-2xl mb-4'>Starting </p>}
                            <div className="flex flex-row flex-wrap">
                              {roscaContracts.map((c:any,i:number)=>{
                              return <Starting contract={c} owners={owners} id={i} setStarting={setHaveStarting}/>
                              })}
                            </div>
                          </div> 
                          <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700 "></hr>
                          <div className="">
                            {haveCollecting && <p className='font-bold text-2xl mb-4'>Collecting</p>}
                            <div className="flex flex-row flex-wrap">
                              {roscaContracts.map((c:any,i:number)=>{
                              return <Collecting contract={c} owners={owners} id={i} setCollecting={setHaveCollecting}/>
                              })}
                            </div>
                          </div> 
                          <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700 "></hr>
                          <div className="">
                            {haveDistirbuting && <p className='font-bold text-2xl mb-4'>Contributing</p>}
                            <div className="flex flex-row flex-wrap">
                              {roscaContracts.map((c:any,i:number)=>{
                              return <Contributing contract={c} owners={owners} id={i} setContributing={setHaveContributing}/>
                              })}
                            </div>
                          </div> 
                          <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700 "></hr>
                          <div className="">
                            {haveDistirbuting && <p className='font-bold text-2xl mb-4'>Distirbuting </p>}
                            <div className="flex flex-row flex-wrap">
                              {roscaContracts.map((c:any,i:number)=>{
                              return <Distirbuting contract={c} owners={owners} id={i} setDistirbuting={setHaveDistirbuting}/>
                              })}
                            </div>
                          </div> 
                          <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700 "></hr>
                          <div className="">
                            {haveDistirbuted && <p className='font-bold text-2xl mb-4'>Distirbuted </p>}
                            <div className="flex flex-row flex-wrap">
                              {roscaContracts.map((c:any,i:number)=>{
                                return <Distirbuted contract={c} owners={owners} id={i} setDistirbuted={setHaveDistirbuted}/>
                                })}
                            </div>
                          </div> 
                         {/* <div className="">
                            <p className='font-bold text-lg'>-Starting-</p>
                            <div className="flex flex-row flex-wrap">
                              {startingContracts.map((c:any,i:number)=>{
                                setId(id+1)
                              return <RoscaCard contract={c} owners={owners} id={id}/>
                              })}
                            </div>
                          </div>   */}
                          {/* <div className="">
                            <p className='font-bold text-lg'>-Collecting-</p>
                            <div className="flex flex-row flex-wrap">
                              {collectingContracts.map((c:any,i:number)=>{
                                setId(id+1)
                              return <RoscaCard contract={c} owners={owners} id={id}/>
                              })}
                            </div>
                          </div>
                          <div className="">
                            <p className='font-bold text-lg'>--Contributing</p>
                            <div className="flex flex-row flex-wrap">
                              {contributingContracts.map((c:any,i:number)=>{
                                setId(id+1)
                              return <RoscaCard contract={c} owners={owners} id={id}/>
                              })}
                            </div>
                          </div>
                          <div className="">
                            <p className='font-bold text-lg'>-Distirbuting-</p>
                            <div className="flex flex-row flex-wrap">
                              {distirbutingContracts.map((c:any,i:number)=>{
                                setId(id+1)
                              return <RoscaCard contract={c} owners={owners} id={id}/>
                              })}
                            </div>
                          </div>
                          <div className="">
                            <p className='font-bold text-lg'>-Distirbuted-</p>
                            <div className="flex flex-row flex-wrap">
                              {distirbutedContracts.map((c:any,i:number)=>{
                                setId(id+1)
                              return <RoscaCard contract={c} owners={owners} id={id}/>
                              })}
                            </div>
                          </div> */}
                        </div>:
                        <div className="">
                          <div className="flex flex-col items-center"><HiOutlineCollection size={'48px'}/></div>
                          <span className="mt-2 block text-sm font-medium text-gray-900"> No open cohorts to participate on. </span>
                        </div>
                        }
                    </div>
                    <TrustedAddresses owners={owners}/>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App;
