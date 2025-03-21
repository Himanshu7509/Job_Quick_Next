import ViewApplicants from '@/components/jobHoster/pages/myjobs/applicants/ViewApplicants'
import React from 'react'

export default function viewapplicants({params}) {
  return (
    <div><ViewApplicants jobId={params.id}/></div>
  )
}