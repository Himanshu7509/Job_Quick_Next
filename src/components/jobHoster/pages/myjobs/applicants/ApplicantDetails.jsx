"use client"

import { viewappicantAPI } from '@/components/utils/hosterApi/HosterApi'
import React, { useState,useEffect } from 'react'

const ApplicantDetails = ({jobId}) => {
  const [data,setData] = useState([])

  const get = async() =>{
    const response = await viewappicantAPI(jobId)
    console.log(response);
    
  }

  useEffect(() => {
    get()
  }, [])
  return (
    <div>ApplicantDetails</div>
  )
}

export default ApplicantDetails