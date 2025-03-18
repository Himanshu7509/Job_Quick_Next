import JobDetails from '@/components/jobSeeker/pages/jobs/job_components/JobDetails'
import React from 'react'

const JobDetailPage = ({ params }) => {
    return (
      <>
          <JobDetails jobId={params.id} />
      </>
    )
  }
  

export default JobDetailPage