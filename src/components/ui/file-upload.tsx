/** @format */
'use client';

import { cn } from '@/lib/utils';
import { CloudUpload } from 'lucide-react';
import { motion } from 'motion/react';
import { useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from './button';
import { useIsMobile } from '@/hooks/use-mobile';

const mainVariant = {
	initial: {
		x: 0,
		y: 0,
	},
	animate: {
		x: 20,
		y: -20,
		opacity: 0.9,
	},
};

const secondaryVariant = {
	initial: {
		opacity: 0,
	},
	animate: {
		opacity: 1,
	},
};

export const FileUpload = ({
	onChange,
}: {
	onChange?: (files: File[]) => void;
}) => {
	const [files, setFiles] = useState<File[]>([]);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileChange = (newFiles: File[]) => {
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		onChange && onChange(newFiles);
		setFiles((prevFiles) => [...prevFiles, ...newFiles]);
	};

	const handleClick = () => {
		fileInputRef.current?.click();
	};

	const { getRootProps, isDragActive } = useDropzone({
		multiple: false,
		noClick: true,
		onDrop: handleFileChange,
		onDropRejected: (error) => {
			console.log(error);
		},
	});

	return (
		<div
			className='w-full min-w-40'
			{...getRootProps()}>
			<motion.div
				onClick={handleClick}
				whileHover='animate'
				className='p-10 group/file block rounded-lg cursor-pointer w-full relative overflow-hidden z-10'>
				<input
					ref={fileInputRef}
					id='file-upload-handle'
					accept='.csv'
					type='file'
					onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
					className='hidden'
				/>

				<div className='absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]'>
					<GridPattern />
				</div>

				<div className='relative w-full mt-10 max-w-xl mx-auto'>
					{files.length > 0 &&
						files.map((file, idx) => (
							<motion.div
								key={'file' + idx}
								layoutId={idx === 0 ? 'file-upload' : 'file-upload-' + idx}
								className={cn(
									'relative overflow-hidden z-40 bg-background flex flex-col items-start justify-start md:h-24 p-4 mt-4 w-full mx-auto rounded-md',
									'shadow-sm',
								)}>
								<div className='flex justify-between w-full items-center gap-4'>
									<motion.p
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										layout
										className='text-base text-muted-foreground truncate max-w-xs lowercase'>
										{file.name}
									</motion.p>
									<motion.p
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										layout
										className='rounded-lg px-2 py-1 w-fit shrink-0 text-sm text-foreground shadow-input lowercase bg-secondary'>
										{(file.size / (1024 * 1024)).toFixed(2)} MB
									</motion.p>
								</div>

								<div className='flex text-sm md:flex-row flex-col items-start md:items-center w-full mt-2 justify-between text-muted-foreground'>
									<motion.p
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										layout
										className='px-1 py-0.5 rounded-md bg-secondary '>
										{file.type}
									</motion.p>

									<motion.p
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										layout>
										modified {new Date(file.lastModified).toLocaleDateString()}
									</motion.p>
								</div>
							</motion.div>
						))}
					{!files.length && (
						<motion.div
							layoutId='file-upload'
							variants={mainVariant}
							transition={{
								type: 'spring',
								stiffness: 300,
								damping: 20,
							}}
							className={cn(
								'relative group-hover/file:shadow-2xl z-40 bg-secondary flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md',
								'shadow-[0px_10px_50px_rgba(0,0,0,0.1)]',
							)}>
							{isDragActive ? (
								<motion.p
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									className='text-muted-foreground flex flex-col items-center'>
									Solte aqui
									<CloudUpload className='h-5 w-5 text-muted-foreground' />
								</motion.p>
							) : (
								<CloudUpload className='h-5 w-5 text-muted-foreground' />
							)}
						</motion.div>
					)}

					{!files.length && (
						<motion.div
							variants={secondaryVariant}
							className='absolute opacity-0 border border-dashed border-sky-500 inset-0 z-30 bg-transparent flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md'></motion.div>
					)}
				</div>
			</motion.div>
			<Button
				variant={'outline'}
				type='button'
				className='z-[999999999999999999999999] w-full translate-y-2 mt-1'
				onClick={() => setFiles(Array.from([]))}>
				Resetar
			</Button>
		</div>
	);
};

export function GridPattern() {
	const isMobile = useIsMobile();
	const columns = isMobile ? 13 : 41;
	const rows = isMobile ? 5 : 11;
	return (
		<div className='flex bg-sidebar dark:bg-background shrink-0 flex-wrap justify-center items-center h-full gap-x-px gap-y-px  scale-105'>
			{Array.from({ length: rows }).map((_, row) =>
				Array.from({ length: columns }).map((_, col) => {
					const index = row * columns + col;
					return (
						<div
							key={`${col}-${row}`}
							className={`w-7 h-7 flex shrink-0 rounded-[6px] ${
								index % 2 === 0
									? ' bg-sidebar dark:bg-background'
									: 'bg-secondary/50 shadow-[0px_0px_1px_3px_rgba(220,220,220,.2)_inset] dark:shadow-[0px_0px_1px_2px_rgba(0,0,0,0.1)_inset]'
							}`}
						/>
					);
				}),
			)}
		</div>
	);
}
