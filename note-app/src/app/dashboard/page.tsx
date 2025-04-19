import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import  CreateNoteDialog  from '@/components/CreateNoteDialog'
import { ArrowLeft } from 'lucide-react';
import { UserButton } from '@clerk/nextjs';
import { Separator } from '@radix-ui/react-separator';

type Props = {}

const DashboardPage
 = (props: Props) => {
  return (
   <>
   <div className="grainy min-h-screen flex  justify-center">
      <div className='max-w-7xl mx-auto p-10 text-center'>
        <div className='h-14'> </div>
          <div className='flex justify-between items-center md:flex-row flex-col'>
            <div className='flex items-center'>
              <Link href="/">
              <Button className="bg-green-600  " size="sm">
                <ArrowLeft className="mr-1 w-4 h-4" />
                Back</Button>
              </Link>
              <div className='w-4'></div>
              <h1 className='text-3xl front-bold text-gray-900'>My Notes</h1>
              <div className='w-4'></div>
              <UserButton/>
            </div>
         
        </div>
        <div className="h-8"></div>
        <Separator/>
        <div className="h-8"></div>
        {/* list all the notes */}
        {/* TODO conditionally rendered */}
        <div className="text-centre">
          <h2 className='text-x1 text-gray-500'>You have no notes yet</h2>
        </div>

        {/* display all notes here */}
        <div className="grid sm:grid-cols-3 md:grid-cols-5 grid-cols-1 gap-3">
          <CreateNoteDialog/>
        </div>
      </div>
   </div>
   </>
  )
}

export default DashboardPage
