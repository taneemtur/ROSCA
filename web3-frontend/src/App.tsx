import './App.css';
import  {useEffect, useState} from 'react';
import { WalletInfo } from './components/WalletInfo';
import RoscaCard from './components/RoscaCard';
import {HiOutlineCollection} from 'react-icons/hi'
import { useBeacon, useWalletAddress } from './contexts/Beacon';
import OriginateRosca from './components/OriginateRosca';
import { useEndpoint, useNetwork } from './contexts/Settings';
import { TezosToolkit } from '@taquito/taquito';
import { useContract } from './contexts/Contracts';
 

function App() {
  const userAddress = useWalletAddress()
  const endpoint = useEndpoint()
  const tezos = new TezosToolkit(endpoint)
  const wallet = useBeacon()
  const network = useNetwork()
  const roscaContracts = useContract()

  // const [roscaContracts, setRoscaContracts] = useState<any>([]) 

  // const [{contracts,contracts_count},setData] = useState<any>(()=>({
  //   contracts:null,
  //   contracts_count:null,      
  // }))

  // const loadContracts=async()=>{
  //   const contract = await tezos.contract.at("KT1QccuR2EPRxcwH6ZaST7n36EtqJcYKR6oT")
  //   const contractStorage: any = await contract.storage()
  //   setData({
  //     contracts:contractStorage.contracts,
  //     contracts_count:contractStorage.contracts_count, 
  //   })
  // }

  // useEffect(() => {
  //   loadContracts()
  // }, [])

  // useEffect(()=>{
  //   const values = contracts && Object.values(contracts)[0]  
  //   const keys = values && Array.from(values.keys())
  //   let cArray: any[] = keys&&[]
  //   keys && keys.forEach((e:any) => { 
  //     cArray.push(e.slice(1,e.length-1))
  //   });
  //   cArray && localStorage.setItem('contracts', JSON.stringify(cArray))
  //   var res = localStorage.getItem('contracts')
  //   res && setRoscaContracts(res)
  //   console.log(roscaContracts)
  // },[contracts])


  function refreshPage() {
    window.location.reload();
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
                <p className="mt-2 text-sm text-gray-700">
                  A list of Cohorts to be participated on.      
                </p>
                <button className='float-right' onClick={refreshPage}>Click to Reload</button>
                    <div
                      className="mt-5 relative block w-full border-2 border-gray-300 border-dashed rounded-lg p-6 text-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ">
                        <OriginateRosca/>
                        {console.log(roscaContracts)} 
                        {roscaContracts && userAddress ? 
                        <div className="flex flex-row flex-wrap">
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
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App;
