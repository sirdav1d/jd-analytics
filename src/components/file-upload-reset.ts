type FileInputValue = { value: string };

export function clearFileSelection(
	input: FileInputValue | null,
	onChange?: (files: File[]) => void,
) {
	if (input) input.value = '';
	onChange?.([]);
}
