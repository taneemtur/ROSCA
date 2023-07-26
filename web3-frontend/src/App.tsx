import './App.css';
import  {useState} from 'react';
import { WalletInfo } from './components/WalletInfo';
import RoscaCard from './components/RoscaCard';
import {HiOutlineCollection} from 'react-icons/hi'

function App() {

  const [contracts, setContracts] = useState(["KT1SWzzbD7YzrtZmJSGeGGmLhUFZnJcMYB4i","KT1Edr28YEyZCq3N9d4Gq14eJFNbWHdQa5cg"])

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
                    <div>
                      {contracts.map((c)=>{
                      return <RoscaCard contract={c}/>
                      })}
                    </div>
                    <div
                      className="mt-5 relative block w-full border-2 border-gray-300 border-dashed rounded-lg p-12 text-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <div className="flex flex-col items-center"><HiOutlineCollection size={'48px'}/></div>
                      <span
                        className="mt-2 block text-sm font-medium text-gray-900"> No open cohorts to participate on. </span>
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
