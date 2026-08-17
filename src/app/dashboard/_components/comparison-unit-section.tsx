import ComparisonUnit from './comparison-unit';
import { getOrganizationSeries } from './organization-series';

type ComparisonUnitSectionProps = {
	data: Promise<unknown>;
};

export default async function ComparisonUnitSection({
	data,
}: ComparisonUnitSectionProps) {
	const response = await data;

	if (getOrganizationSeries(response).length <= 1) return null;

	return (
		<div className='grid grid-cols-1 xl:grid-cols-3 gap-5 w-full'>
			<ComparisonUnit
				key='revenue'
				type='revenue'
				data={data}
				title='Faturamento por unidade'
			/>
			<ComparisonUnit
				key='salesCount'
				type='salesCount'
				data={data}
				title='Total de vendas por unidade'
			/>
			<ComparisonUnit
				key='newCustomers'
				type='newCustomers'
				data={data}
				title='Novos Clientes'
			/>
		</div>
	);
}
