
import { TezosToolkit } from '@taquito/taquito'
import React from 'react'
import { useState, useEffect } from 'react'
import {  useEndpoint, useNetwork } from '../contexts/Settings'
import {FaCoins, FaNapster, FaUserTie, FaUsers} from 'react-icons/fa'
import { BeaconProvider, useBeacon, useWalletAddress } from '../contexts/Beacon'
import ContributingCard from './Cards/ContributingCard'
import StartingCard from './Cards/StartingCard'
import CollectingCard from './Cards/CollectingCard'
import DistirbutingCard from './Cards/DistirbutingCard'
import DistirbutedCard from './Cards/DistirbutedCard'
import { Dialog } from '@headlessui/react'
import { useAdmins } from '../contexts/Contracts'

const RoscaCard = (props:any) => {
    const walletAddress = useWalletAddress()
    const endpoint = useEndpoint()
    const contractAddress = props.contract
    const tezos = new TezosToolkit(endpoint)
    const wallet = useBeacon()
    const network = useNetwork()
    const admins = useAdmins()

    const [modalOpen, setModalOpen] = useState(false)
    const [provider,setProvider] = useState()
    const [participantsArray,setParticipantsArray] = useState([{
        address: null,
        values:null,
    }])
    const [refresh,setRefresh] = useState(0)

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

    useEffect(()=>{
        const keys = participant && Object.values(participant)[0]
        keys&& console.log(keys)
        const keyArr = keys && Array.from(keys.values())
        keyArr && console.log(keyArr[0])

        const values = participant && Object.values(participant)[0]
        const valueArr = values && Array.from(values.keys())
        valueArr && console.log(valueArr)
        valueArr && valueArr.forEach((e:any) => {
            console.log(e.slice(1,e.length-1))
        });
        const length = participant && participant.valueMap.size
         if(length){
            for(let i=0;i<length;i++){
                let participantObject = keyArr&&{address:valueArr[i].slice(1,valueArr[i].length-1), values: keyArr[i]}
                participantObject && console.log('part',participantObject)
                if(participantObject && participantsArray.filter(val=> val==participantObject))console.log("include") 
                else{
                    setParticipantsArray(participantsArray=>[...participantsArray,participantObject])  
                } 
            }
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
            console.log(provider)
        } catch (error) {
            console.log(error)  
        }
        
    }

    const changeAdmin = async()=>{
        const contract = await tezos.wallet.at(contractAddress)
        wallet && setTezosProvider()  
        wallet && tezos.wallet
        .at(contractAddress)
        .then((wallet) => contract.methods.changeAdmin(walletAddress).send())
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
    
    const Loading = ()=>{
        return(
            <div className="m-8 p-8 font-bold font-size-xl">
                Loading...
            </div>
        )
    }    
    const handleModalOpen = ()=>{
        setModalOpen(true) 
    }
    
    return (
        <div className="flex flex-col" onClick={handleModalOpen}>
            {admins && admins.includes(walletAddress) && <button onClick={changeAdmin}>MakeMeAdmin</button>}
            {status ? status ==0 && <StartingCard refresh={refresh} setRefresh={setRefresh} contract={contractAddress} owner={owner} admin={admin} rosca_total={rosca_total} participants_count={participants_count} max_participants={max_participants}/>: <Loading/>}
            {status ? status ==1 && <CollectingCard refresh={refresh} setRefresh={setRefresh} contract={contractAddress} owner={owner} admin={admin} rosca_total={rosca_total} participants_count={participants_count} max_participants={max_participants} participantsArray={participantsArray} />: <Loading/>}
            {status ? status ==2 && <ContributingCard refresh={refresh} setRefresh={setRefresh} contract={contractAddress} owner={owner} admin={admin} rosca_total={rosca_total} participants_count={participants_count} max_participants={max_participants} contributors_count={contributors_count} participantsArray={participantsArray} end_time={end_time}/>: <Loading/>}
            {status ? status ==3 && <DistirbutingCard refresh={refresh} setRefresh={setRefresh} contract={contractAddress} owner={owner} admin={admin} rosca_total={rosca_total} participants_count={participants_count} max_participants={max_participants} pot={pot} banned_count={banned_count} receiver={receiver}/> : <Loading/>}
            {status ? status ==4 && <DistirbutedCard refresh={refresh} setRefresh={setRefresh} contract={contractAddress} owner={owner} admin={admin} rosca_total={rosca_total} participants_count={participants_count} max_participants={max_participants} pot={pot} contributors_count={contributors_count}  received_count={received_count} receiver={receiver}/>: <Loading/>}
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
                    <p>Pot: {pot.toNumber()} ꜩ</p>
                    <p>Participants Count: {participants_count.toNumber()}</p>
                    <p>Contributors Count: {contributors_count.toNumber()}</p>
                    <p>Banned Count: {banned_count.toNumber()}</p>
                    {end_time &&<p>Contribution Ending: {JSON.stringify(end_time)}</p>}
                    <p>Current Receiver: {receiver}</p>
                    <p>Admin: {parseAddress(admin)}</p>
                    {participantsArray && participantsArray.map((e:any,i:number)=>{ 
                        return (
                            <div className="">
                                {e.address ? 
                                <p>{i} - {parseAddress(JSON.stringify(e.address))}</p>
                                :<p>Doesnt have any participants yet</p> }
                            </div>
                        )
                    })}
                    </div>}
                </Dialog.Panel>
            </div>
            </Dialog>
        </div>
    )
}
export default RoscaCard
