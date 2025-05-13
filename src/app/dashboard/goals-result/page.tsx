/** @format */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/format-currency';
import { PieStore } from './_components/charts/pie-store';
import { Revenue } from './_components/charts/revenue';
import SellerComparison from './_components/charts/seller-comparison-desktop';
import SellerRevenue from './_components/charts/seller-revenue';
import SalesmanList from './_components/salesman-list';
import Filter from './_components/filter';
import { FetchGoalTrackingData } from '@/services/data-services/get-goal-tracking';
import SellerComparisonMobile from './_components/charts/seller-comparison-mobile';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function GoalResultPage(props: {
	searchParams: SearchParams;
}) {
	const storeData = {
		name: 'JD INFO CENTRO NITEROI',
		meta: 408000,
		realizado: 211760.93,
		percentual: 52,
	};

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

	const dataGoal = await FetchGoalTrackingData(
		String(startDate),
		String(endDate),
	);

	if (!dataGoal.ok) {
		console.log(dataGoal.error);
		return <div>Nenhum dado foi encontrado</div>;
	}
	console.log(dataGoal.companySummary.meta);

	return (
		<div className='w-full mx-auto space-y-5 pb-5'>
			<Filter />
			<div className='grid grid-cols-1  xl:grid-cols-3 w-full my-5 gap-y-5 xl:gap-5 md:items-center'>
				<Card className='col-span-full aspect-auto xl:col-span-1 h-full'>
					<CardHeader>
						<CardTitle className='text-base text-balance md:text-xl 2xl:text-2xl'>
							{storeData.name}
						</CardTitle>
						<p className='text-sm text-muted-foreground'>
							Meta:{' '}
							{dataGoal.companySummary.meta &&
								formatCurrency(dataGoal.companySummary.meta)}
						</p>
					</CardHeader>
					<CardContent className='2xl:scale-110 w-full translate-y-12'>
						<PieStore companySummary={dataGoal.companySummary} />
					</CardContent>
				</Card>
				<Card className='w-full col-span-2 h-full'>
					<CardHeader>
						<CardTitle className='text-base text-balance md:text-2xl'>
							Faturamento por vendedor
						</CardTitle>
					</CardHeader>
					<CardContent>
						<SellerRevenue sellerData={dataGoal.overview} />
					</CardContent>
				</Card>
			</div>
			<div className='grid grid-cols-1 gap-5'>
				<Card>
					<CardHeader>
						<CardTitle className='text-base text-balance md:text-2xl'>
							Performance por vendedor
						</CardTitle>
					</CardHeader>
					<CardContent>
						<SellerComparison sellerData={dataGoal.overview} />
						<SellerComparisonMobile sellerData={dataGoal.overview} />
					</CardContent>
				</Card>
				<SalesmanList sellerData={dataGoal.overview} />
			</div>
			<div className='grid grid-cols-1 gap-6 my-5'>
				<Card>
					<CardHeader>
						<CardTitle className='text-base text-balance md:text-2xl'>
							Faturamento ao Longo do Tempo
						</CardTitle>
					</CardHeader>
					<CardContent>
						<Revenue revanueData={dataGoal.timeSeries} />
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
