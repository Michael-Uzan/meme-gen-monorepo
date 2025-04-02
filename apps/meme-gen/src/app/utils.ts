import { DropEvent } from 'react-dropzone'

export const calculateSizeWithAspect = ({
	aspectRatio,
	offsetHeight,
	offsetWidth,
}: {
	offsetWidth: number
	offsetHeight: number
	aspectRatio: number
}) => {
	const containerWidth = offsetWidth
	const containerHeight = offsetHeight
	let width = containerWidth
	let height = width / aspectRatio

	// If height is too big, adjust width instead
	if (height > containerHeight) {
		height = containerHeight
		width = height * aspectRatio
	}

	// Make sure it does not exceed the container's width
	if (width > containerWidth) {
		width = containerWidth
		height = width / aspectRatio
	}
	return { width, height }
}

export const readFileAsDataUrl = ({
	file,
	event,
	onFileLoaded,
}: {
	file: File
	event: React.DragEvent<HTMLDivElement> | React.ChangeEvent<HTMLInputElement> | DropEvent
	onFileLoaded?: (file: File, url: string, event: React.DragEvent<HTMLDivElement>) => void
}) => {
	const reader = new FileReader()
	reader.onload = () => {
		onFileLoaded?.(file, reader.result as string, event as React.DragEvent<HTMLDivElement>)
	}
	reader.readAsDataURL(file)
}
