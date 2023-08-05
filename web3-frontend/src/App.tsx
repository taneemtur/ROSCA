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


  function refreshPage() {
    window.location.reload();
  }
  const handleRefresh = ()=>{
    refresh?setRefresh(false):setRefresh(true)
  }

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
                  <p className="mt-2 text-sm text-gray-700">A list of Cohorts to be participated on.</p>
                  {admins && admins.includes(walletAddress) && 
                      <OriginateRosca/>
                  }
                </div>
                    <div
                      className="mt-5 relative block w-full border-2 border-gray-300 border-dashed rounded-lg p-6 text-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 "> 
                        <div className='text-right'><button onClick={refreshPage}><GrRefresh size={'24px'}/></button></div>
                        {roscaContracts && roscaContracts.length>0 && walletAddress ? 
                        <div className="flex flex-row flex-wrap">
                          {roscaContracts&& console.log(roscaContracts)}
                          {roscaContracts.map((c:any)=>{
                          return <RoscaCard contract={c}/>
                          })}
                        </div>:
                        <div className="">
                          <div className="flex flex-col items-center"><HiOutlineCollection size={'48px'}/></div>
                          <span className="mt-2 block text-sm font-medium text-gray-900"> No open cohorts to participate on. </span>
                        </div>
                        }
                    </div>
                    <TrustedAddresses/>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App;
