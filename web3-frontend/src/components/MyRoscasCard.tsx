
import { TezosToolkit } from '@taquito/taquito'
import React from 'react'
import { useState, useEffect } from 'react'
import {  useEndpoint, useNetwork, useRefresh, useSetRefresh } from '../contexts/Settings'
import { useBeacon, useWalletAddress } from '../contexts/Beacon'
import ContributingCard from './Cards/ContributingCard'
import StartingCard from './Cards/StartingCard'
import CollectingCard from './Cards/CollectingCard'
import DistirbutingCard from './Cards/DistirbutingCard'
import DistirbutedCard from './Cards/DistirbutedCard'
import { Dialog } from '@headlessui/react'
import { useAdmins } from '../contexts/Contracts'

const MyRoscasCard = (props:any) => {
    const walletAddress:any = useWalletAddress()
    const endpoint = useEndpoint()
    const contractAddress = props.contract
    const tezos = new TezosToolkit(endpoint)
    const wallet = useBeacon()
    const network = useNetwork()
    const admins = useAdmins()
    const refresh = useRefresh()
    const setRefresh = useSetRefresh()
    const [control,setControl] = useState(true)

    const [modalOpen, setModalOpen] = useState(false)
    const [provider,setProvider] = useState()
    const [participantsArray,setParticipantsArray] = useState([{
        address: null,
        values:null,
    }])
    const [participantsAddresses,setParticipantsAddresses] = useState([null])

    const [{owner,rosca_total,contributing_duration,
        max_participants,status,participant,paused,pot,participants_count,
        contributors_count,banned_count,received_count,end_time,receiver,admin},setData] = useState<any>(()=>({
        owner:null,
        rosca_total:null,
        contributing_duration:null,
        max_participants:null,
        status:null,
        participant:null,
        paused: null,
        pot:null,
        participants_count:null,
        contributors_count:null,
        banned_count:null,
        received_count:null,
        end_time:null,
        receiver:null,
        admin:null,      
    }))
    const [storage,setStorage] = useState(null)
    const loadStorage = React.useCallback(async()=>{
        const contract = await tezos.contract.at(contractAddress)
        const contractStorage: any = await contract.storage()
        setData({
        owner: contractStorage.owner,
        rosca_total: contractStorage.rosca_total/1000000, 
        contributing_duration: contractStorage.contributing_duration,
        max_participants: contractStorage.max_participants,
        status:contractStorage._state,
        participant: contractStorage.participant,
        paused: contractStorage.paused,
        pot: contractStorage.pot, 
        participants_count: contractStorage.participants_count,
        contributors_count: contractStorage.contributors_count,
        banned_count: contractStorage.banned_count,
        received_count: contractStorage.received_count,
        end_time: contractStorage.end_time,
        receiver: contractStorage.receiver,
        admin: contractStorage.admin,
        }) 
        setStorage(contractStorage)
    },[])

    useEffect(() => {
        loadStorage()
    }, [])
    const handleLoad =()=>{
        loadStorage()
    }
    useEffect(() => {
      loadStorage()
    }, [refresh])
    

    useEffect(()=>{
        const keys = participant && Object.values(participant)[0]
        const keyArr = keys && Array.from(keys.values())

        const values = participant && Object.values(participant)[0]
        const valueArr = values && Array.from(values.keys())
        const length = participant && participant.valueMap.size
        const myArr = participant&& []
        const addresses = participant && []
         if(length){    
            for(let i=0;i<length;i++){  
                addresses.push(valueArr[i].slice(1,valueArr[i].length-1))
                let participantObject = {address:valueArr[i].slice(1,valueArr[i].length-1), values: keyArr[i]}
                myArr.push(participantObject)
            }
            setParticipantsAddresses(addresses)
            myArr&& setParticipantsArray(myArr)
         }
    },[participant])

    const parseAddress =(address:string)=>{
        const parsed = address.slice(0,6)+ "........" +address.slice(address.length-7,address.length)
        return parsed
    }    

    const setTezosProvider =async() => {
        try {
            wallet && wallet.requestPermissions({ network: { type: network } })
            const provider = wallet && await tezos.setWalletProvider(wallet) 
            provider && setProvider(provider)
        } catch (error) {
            console.log(error)  
        }
    }
    const changeAdmin = async(adminAddress:any)=>{
        const contract = await tezos.wallet.at(contractAddress)
        wallet && setTezosProvider()  
        wallet && tezos.wallet
        .at(contractAddress)
        .then((wallet) => contract.methods.changeAdmin(adminAddress).send())
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
            handleRefresh()
            } else {
            console.log('An error has occurred');
            }
        })
        .catch((err) => {
            console.log(err)
            err.data&&err.data[1].with&& err.data[1].with.string == "INVALID_STATE" && refreshPage()});
    }
    const deleteContract = async()=>{
        const contract = await tezos.wallet.at("KT1GMqJdN44bQJJGdZ1YRYqPGKadNSAdSpZm")
        wallet && setTezosProvider()  
        wallet && tezos.wallet
        .at("KT1GMqJdN44bQJJGdZ1YRYqPGKadNSAdSpZm")
        .then((wallet) => contract.methods.deleteContract(contractAddress).send())
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
            handleRefresh()
            refreshPage()
            refreshPage()
            } else {
            console.log('An error has occurred');
            }
        })
        .catch((err) => {
            console.log(err)
            err.data&&err.data[1].with&& err.data[1].with.string == "INVALID_STATE" && refreshPage()});
    }
    const pauseRosca = async()=>{
        const contract = await tezos.wallet.at(contractAddress)
        wallet && setTezosProvider()  
        wallet && tezos.wallet
        .at(contractAddress)
        .then((wallet) => contract.methods.pause().send())
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
            handleRefresh()
            } else {
            console.log('An error has occurred');
            }
        })
        .catch((err) => {
            console.log(err)
            err.data&&err.data[1].with&& err.data[1].with.string == "INVALID_STATE" && refreshPage()});
    } 
    const resumeRosca = async()=>{
        const contract = await tezos.wallet.at(contractAddress)
        wallet && setTezosProvider()  
        wallet && tezos.wallet
        .at(contractAddress)
        .then((wallet) => contract.methods.unpause().send())
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
            handleRefresh()
            } else {
            console.log('An error has occurred');
            }
        })
        .catch((err) => {
            console.log(err)
            err.data&&err.data[1].with&& err.data[1].with.string == "INVALID_STATE" && refreshPage()});
    } 
    const emergencyReset = async()=>{
        const contract = await tezos.wallet.at(contractAddress)
        wallet && setTezosProvider()  
        wallet && tezos.wallet
        .at(contractAddress)
        .then((wallet) => contract.methods.emergency_reset().send())
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
            handleRefresh()
            } else {
            console.log('An error has occurred');
            }
        })
        .catch((err) => {
            console.log(err)
            err.data&&err.data[1].with&& err.data[1].with.string == "INVALID_STATE" && refreshPage()});
    } 
    function formatEndtime(end_time:any) {
    let oo = new Date(end_time.Some)
    let getDate =  oo.getTime()
    let timezone = new Date().getTimezoneOffset()
    let datebyTimezone = getDate - (timezone*60000)
    let date = new Date(datebyTimezone)
    let stringDate = JSON.stringify(date) 
    let formatted = (stringDate.slice(6,8) + '/' + stringDate.slice(9,11) + '/' + stringDate.slice(1,5) + ' ' +  stringDate.slice(12,20))
    return JSON.stringify(formatted) 
    }
     
    const Loading = ()=>{
        return(
            <div className="m-8 p-8 font-bold font-size-xl">
                Loading...
            </div>
        )
    }
    const handleRefresh = ()=>{
        refresh?setRefresh(false):setRefresh(true)
    }    
    const handleModalOpen = ()=>{
        setModalOpen(true) 
    }
    function refreshPage() {
        window.location.reload();
    }
    useEffect(() => {
        if(!participantsAddresses.includes(walletAddress)){
          props.setMyRoscas(true)
        } 
    }, [status]) 

    return (
        <div className="">
            {participantsAddresses && participantsAddresses.includes(walletAddress)&&
            <div className="flex flex-col my-2 mx-0" >
                {<div>
                    { status ==0 && 
                    <StartingCard handleModalOpen={handleModalOpen} loadStorage={loadStorage} setRefresh={setRefresh} pauseRosca={pauseRosca} resumeRosca={resumeRosca} 
                    contract={contractAddress} owner={owner} admin={admin} rosca_total={rosca_total} participants_count={participants_count} max_participants={max_participants} 
                    paused={paused} deleteContract={deleteContract} owners={props.owners} id={props.id}/>}

                    {status ==1 && 
                    <CollectingCard handleModalOpen={handleModalOpen} loadStorage={loadStorage} setRefresh={setRefresh} pauseRosca={pauseRosca} resumeRosca={resumeRosca} 
                    contract={contractAddress} owner={owner} admin={admin} rosca_total={rosca_total} participants_count={participants_count} max_participants={max_participants} 
                    participantsArray={participantsArray} paused={paused} deleteContract={deleteContract} emergencyReset={emergencyReset} changeAdmin={changeAdmin} owners={props.owners}
                    id={props.id}/>}

                    {status ==2 && 
                    <ContributingCard handleModalOpen={handleModalOpen} loadStorage={loadStorage} setRefresh={setRefresh} pauseRosca={pauseRosca} resumeRosca={resumeRosca} 
                    contract={contractAddress} owner={owner} admin={admin} rosca_total={rosca_total} participants_count={participants_count} max_participants={max_participants} 
                    contributors_count={contributors_count} participantsArray={participantsArray} end_time={end_time} paused={paused} deleteContract={deleteContract} emergencyReset={emergencyReset}
                    owners={props.owners} id={props.id}/>}
                    
                    {status ==3 && 
                    <DistirbutingCard handleModalOpen={handleModalOpen} loadStorage={loadStorage} setRefresh={setRefresh} pauseRosca={pauseRosca} resumeRosca={resumeRosca} 
                    contract={contractAddress} owner={owner} admin={admin} rosca_total={rosca_total} participants_count={participants_count} max_participants={max_participants} 
                    pot={pot} banned_count={banned_count} receiver={receiver} paused={paused} deleteContract={deleteContract} emergencyReset={emergencyReset} owners={props.owners} id={props.id}/>}
                    
                    {status ==4 && 
                    <DistirbutedCard handleModalOpen={handleModalOpen} loadStorage={loadStorage} setRefresh={setRefresh} pauseRosca={pauseRosca} resumeRosca={resumeRosca} 
                    contract={contractAddress} owner={owner} admin={admin} rosca_total={rosca_total} participants_count={participants_count} max_participants={max_participants} 
                    pot={pot} contributors_count={contributors_count} received_count={received_count} receiver={receiver} paused={paused} deleteContract={deleteContract} emergencyReset={emergencyReset}
                    owners={props.owners} id={props.id}/>}
                </div>}
                <Dialog 
                open={modalOpen?modalOpen:false} 
                onClose={() => setModalOpen(false)}
                className="relative z-50">
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className='p-4 rounded-lg bg-blue-100 '>
                        {owner && <div className="">
                        <p className='text-center text-2xl'>Rosca: {parseAddress(contractAddress)}</p>
                        <p>Owner: {parseAddress(owner)}</p>
                        <p>Total Rosca Amount: {rosca_total} ꜩ</p>
                        <p>Duration: {contributing_duration.toNumber()} seconds</p>
                        <p>Max Participants: {max_participants.toNumber()}</p>
                        <p>Status: {(status.toNumber() ==0 && "Starting")  || 
                        status.toNumber() ==1 && "Collecting Applications" || 
                        status.toNumber() ==2 && "Contributing" || 
                        status.toNumber() ==3 && "Distirbuting" || 
                        status.toNumber() ==4 && "Distirbuted"}</p>
                        <p>Paused: {JSON.stringify(paused)}</p>
                        <p>Pot: {pot.toNumber()/1000000} ꜩ</p>
                        <p>Participants Count: {participants_count.toNumber()}</p>
                        <p>Contributors Count: {contributors_count.toNumber()}</p>
                        <p>Banned Count: {banned_count.toNumber()}</p>
                        {end_time &&<p>Contribution Ending: {formatEndtime(end_time)}</p>}
                        {receiver&&<p>Current Receiver: {parseAddress(receiver.Some)}</p> }
                        <p>Admin: {parseAddress(admin)}</p>
                        <p className='font-bold'>Participants</p>
                        {participantsArray && participantsArray.map((e:any,i:number)=>{
                            console.log(e.address)
                            return (
                                <div className="">
                                    {participants_count > 0 ? 
                                    <p>{i} - {parseAddress(JSON.stringify(e.address))}</p>
                                    :<p>Doesnt have any participants yet</p> }
                                </div>
                            )
                        })}
                        </div>}
                    </Dialog.Panel>
                </div>
                </Dialog>
            </div>}
        </div>
    )
}
export default MyRoscasCard
