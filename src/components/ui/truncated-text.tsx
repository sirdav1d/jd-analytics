import { cn } from '@/lib/utils';

export function TruncatedText({
	value,
	className,
}: {
	value: string;
	className?: string;
}) {
	return (
		<span
			title={value}
			className={cn('block min-w-0 max-w-full truncate', className)}>
			{value}
		</span>
	);
}
