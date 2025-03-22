import ApplicantDetails from '@/components/jobHoster/pages/myjobs/applicants/ApplicantDetails'
import React from 'react'

const ApplicantDetailPage = ({params}) => {
  return (
    <div><ApplicantDetails jobId={params.id} /></div>
  )
}

export default ApplicantDetailPage