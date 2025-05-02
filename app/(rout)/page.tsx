import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { dummyInterviews } from '@/constants'
import InterviewCard from '@/components/InterviewCard'
import { getCurrentUser } from '@/lib/actions/auth.action'
import { getInterviewsByUserId, getLatestInterviews } from '@/lib/actions/general.action'
const page = async() => {
  const useer = await getCurrentUser();

  const [userInterviews,latestInterviews] = await Promise.all([
    await getInterviewsByUserId(useer?.id!),
    await getLatestInterviews({userId:useer?.id!})
  ])
  

  const hasPasInterviews = userInterviews?.length! > 0 ;
  const hasUpcamingInterviews = latestInterviews?.length! > 0 
  return (
    <div>
      <>
        <section className='card-cta'>
          <div className='flex flex-col gap-6 max-w-lg '>
            <h2>Get interview ready with practice and feedback</h2>
            <p className='text-lg'>Practice on real interview question and feedback</p>
            <Button asChild className='btn-primary max-sm:w-full'>
              <Link href='/interview'>
              Start an interview
              </Link>
            </Button>
          </div>

          <Image src='/robot.png' alt='robo--dude' width={400} height={400} className='max-sm:hidden'></Image>

        </section>
        <section className='flex flex-col gap-6 mt-8'>
          <h2>your interview</h2>

          <div className='interviews-section'>
            {hasPasInterviews ? (
              userInterviews?.map((interview)=>(
                <InterviewCard {...interview} key={interview.id}/>

              ))):
              (<p>you havent taken any interview yet</p>)
              }
          </div>
        </section>
        <section className='flex flex-col gap-6 mt-8'>
          <h2>take an interview</h2>
          <div className='interviews-section'>
          {hasUpcamingInterviews ? (
              latestInterviews?.map((interview)=>(
                <InterviewCard {...interview} key={interview.id}/>

              ))):
              (<p>there are no new intervierw availebal</p>)
              }
          </div>
        </section>
      </>
    </div>
  )
}

export default page