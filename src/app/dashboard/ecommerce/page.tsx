/** @format */

import { Skeleton } from '@/components/ui/skeleton';
import { FetchGoalsCurrentData } from '@/services/data-services/get-goals-current';
import { FetchAnalyticsData } from '@/services/google-services/get-analytics-data';
import { Suspense } from 'react';
import GoalsHomeProgress from '../_components/goals-home-progress';
import SectionAnalytics from '../marketing/_components/section-analytics';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function EcommercePage(props: {
  searchParams: SearchParams;
}) {
  function formattedEndDate() {
    const date = new Date();
    const endDate = date.toISOString().split('T')[0];
    return endDate;
  }
  function formattedStartDate() {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    const startDate = date.toISOString().split('T')[0];
    return startDate;
  }
  const searchParams = await props.searchParams;
  const startDate = searchParams.startDate || formattedStartDate();
  const endDate = searchParams.endDate || formattedEndDate();
  const responseAnalytics = FetchAnalyticsData(
    String(startDate),
    String(endDate),
  );

  const goalsCurrent = FetchGoalsCurrentData('products');
  // const botData = FetchBotConversaData();

  return (
    <div className='w-full grid mx-auto h-full pb-5'>
      <Suspense fallback={<Skeleton className='h-6 w-full' />}>
        <GoalsHomeProgress
          canShowComercial={false}
          canShowMarketing={true}
          data={goalsCurrent}
        />
      </Suspense>
      <Suspense
        fallback={
          <div className=' w-full grid gap-5 mt-5'>
            <div className='flex flex-col lg:flex-row gap-5'>
              <Skeleton className='h-12 w-full md:w-[240px]'></Skeleton>
              <Skeleton className='h-12 w-full md:w-[240px]'></Skeleton>
              <Skeleton className='h-12 w-full md:w-[240px]'></Skeleton>
              <Skeleton className='h-12 w-full md:w-[240px]'></Skeleton>
            </div>
            <div className='h-full w-full flex flex-col lg:flex-row gap-5'>
              <Skeleton className='h-80 w-full' />
              <Skeleton className='h-80 w-full' />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
              <Skeleton className='h-28 w-full'></Skeleton>
              <Skeleton className='h-28 w-full'></Skeleton>
              <Skeleton className='h-28 w-full'></Skeleton>
              <Skeleton className='h-28 w-full'></Skeleton>
              <Skeleton className='h-28 w-full'></Skeleton>
              <Skeleton className='h-28 w-full'></Skeleton>
              <Skeleton className='h-28 w-full'></Skeleton>
              <Skeleton className='h-28 w-full'></Skeleton>
              <Skeleton className='h-28 w-full'></Skeleton>
            </div>
          </div>
        }>
        <SectionAnalytics data={responseAnalytics} />
      </Suspense>    
    </div>
  );
}
