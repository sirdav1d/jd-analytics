"use client";

import { cn } from "@/lib/utils";

export type ResponsiveChartTickProps = {
	axis: "x" | "y";
	x?: number | string;
	y?: number | string;
	/** Axis dimensions injected by Recharts; label geometry intentionally ignores them. */
	width?: number | string;
	height?: number | string;
	labelWidth?: number;
	labelHeight?: number;
	offset?: number;
	payload?: { value?: unknown };
	className?: string;
};

export function getMobileCategoricalChartHeight(
	itemCount: number,
	{
		minHeight = 320,
		rowHeight = 44,
		chromeHeight = 56,
	}: { minHeight?: number; rowHeight?: number; chromeHeight?: number } = {},
) {
	return Math.max(minHeight, itemCount * rowHeight + chromeHeight);
}

export function ResponsiveChartTick({
	axis,
	x = 0,
	y = 0,
	labelWidth = axis === "y" ? 104 : 88,
	labelHeight = 24,
	offset = 8,
	payload,
	className,
}: ResponsiveChartTickProps) {
	const label = String(payload?.value ?? "");
	const numericX = Number(x) || 0;
	const numericY = Number(y) || 0;
	const foreignObjectX =
		axis === "y"
			? numericX - labelWidth - offset
			: numericX - labelWidth / 2;
	const foreignObjectY =
		axis === "y" ? numericY - labelHeight / 2 : numericY + offset;

	return (
		<foreignObject
			x={foreignObjectX}
			y={foreignObjectY}
			width={labelWidth}
			height={labelHeight}
		>
			<div
				title={label}
				className={cn(
					"h-full min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-xs text-muted-foreground",
					axis === "y" ? "text-right leading-6" : "text-center leading-5",
					className,
				)}
			>
				{label}
			</div>
		</foreignObject>
	);
}
