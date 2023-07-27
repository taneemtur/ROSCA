
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

const RoscaCard = (props:any) => {
    const myAddress = useWalletAddress()
    const endpoint = useEndpoint()
    const contractAddress = props.contract
    const tezos = new TezosToolkit(endpoint)
    const wallet = useBeacon()
    const network = useNetwork()

    const [userAddress,setUserAddress] = useState("")
    const [provider,setProvider] = useState()
    const [participantsArray,setParticipantsArray] = useState([{
        address: null,
        values:null,
    }])

    
    
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
        const parsed = participant && Object.fromEntries(participant.valueMap) 
        parsed && console.log('aaaa', Object.keys(parsed)[0],Object.values(parsed)[0])
        const length = participant && participant.valueMap.size
        length&& console.log(length)
         if(length){
            for(let i=0;i<length;i++){
                let participantObject = parsed && {address:Object.keys(parsed)[i], values: Object.values(parsed)[i]}
                participantObject && console.log('part',participantObject)
                 setParticipantsArray(participantsArray=>[...participantsArray,participantObject])
            }
         }
    },[participant])

    const parseAddress =(address:string)=>{
        const parsed = address.slice(0,6)+ "........" +address.slice(address.length-7,address.length)
        return parsed
    }

    const startContributing = async()=>{
        const contract = await tezos.wallet.at(contractAddress)
        wallet && setTezosProvider()  
        wallet && tezos.wallet
        .at(contractAddress)
        .then((wallet) => contract.methods.start_contributing().send())
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

    const getStatus = async()=>{
        const contract = await tezos.wallet.at(contractAddress)
        wallet && setTezosProvider()  
        wallet && tezos.contract
        .at(contractAddress)
        .then((contract) => contract.views.show_currentState().read())
        .then((op) => {
            console.log(`Hash: ${op}`);
            return op;
        })
        .then((result) => {
            console.log('res:', result);
            if (result) {
            console.log(`Transaction correctly processed!`)
            } else {
            console.log('An error has occurred');
            }
        })
        .catch((err) => console.log(err));
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
    const getWalletPKH =async () => {
        const userAddress = wallet && await wallet.getPKH()
        userAddress && setUserAddress(userAddress)
    }
    useEffect(() => {
        getWalletPKH()
    }, [])

    useEffect(() => {
        console.log(userAddress)
        console.log(provider)
    }, [userAddress,provider]) 

    const changeAdmin = async()=>{
        const contract = await tezos.wallet.at(contractAddress)
        wallet && setTezosProvider()  
        wallet && tezos.wallet
        .at(contractAddress)
        .then((wallet) => contract.methods.changeAdmin(myAddress).send())
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
    return (
        <div className="">
            {/* {JSON.stringify(participantsArray)} */}
            {(myAddress=='tz1dtZf7WBC6VsCFof4mtxJfhpfmNeNb7Z1R'|| myAddress=='tz1dFWw5RugiquySipMwSpSaGgNRusDcy4FR'|| myAddress=='tz1f4mS8qV5D8fVZ8hQAJTUtmEjydsJiJNpu') && <button onClick={changeAdmin}>MakeMeAdmin</button>}
            {status ? status ==0 && <StartingCard contract={contractAddress} owner={owner} admin={admin} rosca_total={rosca_total} participants_count={participants_count} max_participants={max_participants}/>: <Loading/>}
            {status ? status ==1 && <CollectingCard contract={contractAddress} owner={owner} admin={admin} rosca_total={rosca_total} participants_count={participants_count} max_participants={max_participants}/>: <Loading/>}
            {status ? status ==2 && <ContributingCard contract={contractAddress} owner={owner} admin={admin} rosca_total={rosca_total} participants_count={participants_count} max_participants={max_participants} contributors_count={contributors_count} participantsArray={participantsArray}/>: <Loading/>}
            {status ? status ==3 && <DistirbutingCard contract={contractAddress} owner={owner} admin={admin} rosca_total={rosca_total} participants_count={participants_count} max_participants={max_participants} pot={pot} banned_count={banned_count}/>: <Loading/>}
            {status ? status ==4 && <DistirbutedCard contract={contractAddress} owner={owner} admin={admin} rosca_total={rosca_total} participants_count={participants_count} max_participants={max_participants} pot={pot} received_count={received_count}/>: <Loading/>}
            {participantsArray&& participantsArray.map((e,i)=>{
                return(
                    <p>{`Participantf ${i+1} : `+ e.address&&e.address}</p>
                )
            })}
        </div>
    )
}
export default RoscaCard
