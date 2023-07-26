import './App.css';
import {useEffect, useState, Fragment} from 'react';
import {InputTypes} from "./components/InputModal";
import LoadingScreen from "./components/LoadingScreen";
import ContractSection from "./components/ContractSection";
import ProposalCard, {ProposalState, ProposalType} from "./components/ProposalCard";
import {CollectionIcon} from "@heroicons/react/outline";
import {Menu, Transition} from '@headlessui/react'
import {ChevronDownIcon} from '@heroicons/react/solid'
<<<<<<< HEAD
import { WalletInfo } from './components/WalletInfo';
import { useAppName, useContractAddress, useEndpoint, useNetwork } from './contexts/Settings';
import { TezosToolkit } from '@taquito/taquito';
import React from 'react';
import RoscaCard from './components/RoscaCard';
=======
import { ConnectionSection } from './components/ConnectionSection';
>>>>>>> main

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

function App() {
  const [account, setAccount] = useState<string>("");
  const [balance, setBalance] = useState<string>("");
  const [statekeepers, setStatekeepers] = useState<string[]>(["No Statekeepers defined yet."]);
  const [trustedIssuers, setTrustedIssuers] = useState<string[]>(["No Trusted Issuers defined yet."]);
  const [proposals, setProposals] = useState<[]>([]);
  const [loading, setLoading] = useState(false);
<<<<<<< HEAD
  const [contracts, setContracts] = useState(["KT1SWzzbD7YzrtZmJSGeGGmLhUFZnJcMYB4i","KT1Edr28YEyZCq3N9d4Gq14eJFNbWHdQa5cg"])

  async function addTrustedIssuer(address: string) {
    if (0) {

=======

  async function addTrustedIssuer(address: string) {
    if (0) {
      // try {
      //   setLoading(true);
      //   await contract.methods.addTrustedIssuer(address).send({from: account});
      //   setLoading(false);
      //   const trustedIssuers = await contract.methods.getTrustedIssuers().call()
      //   setTrustedIssuers(trustedIssuers);
      // } catch (err) {
      //   console.log(err);
      //   setLoading(false);
      // }
>>>>>>> main
    }else setTrustedIssuers([])
  }

  async function removeTrustedIssuer(did: string) {
    if (0) {
<<<<<<< HEAD

=======
      // try {
      //   setLoading(true);
      //   await contract.methods.removeTrustedIssuer(did).send({from: account});
      //   const trustedIssuers = await contract.methods.getTrustedIssuers().call()
      //   setTrustedIssuers(trustedIssuers);
      //   setLoading(false);
      // } catch (err) {
      //   console.log(err);
      //   setLoading(false);
      // }
>>>>>>> main
    }else setTrustedIssuers([])
  }

  async function proposeStatekeeperAddition(address: string) {
    if (0) {
<<<<<<< HEAD

=======
      // try {
      //   setLoading(true);
      //   await contract.methods.createProposal(ProposalType.ADD_STATEKEEPER, address, 0, 0).send({from: account});
      //   setLoading(false);
      //   const proposals = await contract.methods.getProposals().call()
      //   setProposals(proposals);
      // } catch (err) {
      //   console.log(err);
      //   setLoading(false);
      // }
>>>>>>> main
    }else setProposals(proposals)
  }

  async function proposeStatekeeperDeletion(address: string) {
    if (0) {
<<<<<<< HEAD

    } else setProposals(proposals)
  }
=======
      // try {
      //   setLoading(true);
      //   await contract.methods.createProposal(ProposalType.REMOVE_STATEKEEPER, address, 0, 0).send({from: account});
      //   setLoading(false);
      //   const proposals = await contract.methods.getProposals().call()
      //   setProposals(proposals);
      // } catch (err) {
      //   console.log(err);
      //   setLoading(false);
      // }
    } else setProposals(proposals)
  }

>>>>>>> main
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
<<<<<<< HEAD
              <WalletInfo/>
=======
              <span
                className="inline-flex items-center px-3 py-0.5 ml-1 rounded-full text-sm truncate font-medium bg-white text-indigo-600">
                <span
                  className={"absolute w-3 h-3 " + (account ? "bg-green-500" : "bg-orange-400") + " border-1 rounded-full animate-pulse"}/>
                <p className="ml-5">{account ? account : "Waiting for Wallet"}</p>
                <p className="ml-5">{balance}</p>
              </span>
              {!(account&&balance)&&<span
                className="inline-flex items-center px-3 py-0.5 ml-1 rounded-full text-sm truncate font-medium bg-white text-indigo-600">
                <ConnectionSection setAccount={setAccount} setBalance={setBalance}/>
              </span>}
>>>>>>> main
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
<<<<<<< HEAD
                    <div>
                      {contracts.map((c)=>{
                      return <RoscaCard contract={c}/>
                      })}
                    </div>
=======
>>>>>>> main
                    <div
                      className="mt-5 relative block w-full border-2 border-gray-300 border-dashed rounded-lg p-12 text-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      <CollectionIcon className="mx-auto h-12 w-12 text-gray-400 stroke-1"/>
                      <span
                        className="mt-2 block text-sm font-medium text-gray-900"> No open cohorts to participate on. </span>
                    </div>
              </div>
            </div>
          </div>
          {/* <ContractSection title={"Participants"}
                           description={"A list of all the participants."}
                           buttonText="Add Participant" deleteText={"Propose Deletion"} entries={statekeepers}
                           modalTitle={"Create a proposal for a new statekeeper."}
                           modalExampleInput={"0x00000..."} modalButtonText={"Propose Address"}
                           addAction={proposeStatekeeperAddition} removeAction={proposeStatekeeperDeletion}/>
          <ContractSection title={"Trusted Leaders"}
                           description={"A list of all Cohorts Issuers"}
                           buttonText="Add Cohort Leader" deleteText={"Delete"} entries={trustedIssuers}
                           modalTitle={"Enter a new DID of a Trusted Issuer"}
                           modalExampleInput={"did:ethr:..."} modalButtonText={"Add DID"} addAction={addTrustedIssuer}
                           removeAction={removeTrustedIssuer}/> */}
        </div>
      </main>
    </div>
  )
}

export default App;
