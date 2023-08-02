import React from 'react'
import { useAdmins } from '../contexts/Contracts'

const TrustedAddresses = () => {
  const admins = useAdmins()
  admins && console.log(admins)
  return (
    <div className="mt-8">
      <h1 className="text-xl font-semibold text-gray-900">Trusted Addresses</h1>
      <div className='mt-5 relative block w-full border-2 border-gray-300 border-dashed rounded-lg p-6 text-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 '>
        {admins.map((e:any,i:number)=>{
          return <p>{i} - {e}</p>
        })}
      </div>
    </div>
  )
}

export default TrustedAddresses
