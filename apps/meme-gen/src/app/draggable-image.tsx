import { useEffect, useRef, useState } from 'react'
import { Image as KonvaImage, Label, Line, Tag, Text, Transformer } from 'react-konva'
import { useCopyToClipboard, useKey } from 'react-use'
import useImage from 'use-image'
import type Konva from 'konva'
import { CanvasImage, useSingleGeneration } from './hooks/use-single-generation'
import { KonvaIdsEnum } from './app'
import { Observable } from '@legendapp/state'
import { useObservable } from '@legendapp/state/react'

export type PasteZoneIdentifier = { id: string; isDuplicated?: boolean }

const CustomLabel = ({ image$ }: { image$: Observable<CanvasImage> }) => {
	const { x, y, width, height, scaleX = 1, scaleY = 1 } = image$.props.get()

	if (!x || !y || !width || !height) {
		return null
	}

	return (
		<Label x={x + (width * scaleX) / 2 - 24} y={y + height * scaleY + 10}>
			<Tag fill={'gray'} stroke={'black'} cornerRadius={16} />

			<Text
				padding={4}
				width={48}
				height={18}
				text={'Product'}
				fontSize={11}
				fill={'black'}
				fontStyle='normal'
				align='center'
			/>
		</Label>
	)
}

type GuideLines = { x: number | null; y: number | null }

interface DraggableImageProps {
	imageData$: Observable<CanvasImage>
	handleImageTransform: (id: string) => void
	onSelect: (id: string) => void
	onContextMenu: (e: PointerEvent) => void
}

export const DraggableImage = ({
	imageData$,
	handleImageTransform,
	onSelect,
	onContextMenu,
}: DraggableImageProps) => {
	const [image] = useImage(imageData$.url.peek(), 'anonymous')

	const transformerRef = useRef<Konva.Transformer>(null)
	const imageRef = useRef<Konva.Image>(null)
	// const { stageRef } = useImagineProjectContext()
	const { singleGeneration$ } = useSingleGeneration()
	// const { stageSize$ } = useCanvasHandlers()
	const [guideLines, setGuideLines] = useState<GuideLines>({ x: null, y: null })
	const isSelected$ = useObservable(
		() => singleGeneration$.selectedId.get() === imageData$.id.get()
	)

	// handle case of reused image with different screen size
	// const { width: stageWidth, height: stageHeight } = stageSize$.get()
	// const { width: stageWidth, height: stageHeight } = { width: 100, height: 100 }

	// useEffect(() => {
	// 	const normalizedOnce = singleGeneration$.normalizedImages
	// 		.get()
	// 		.find((n$) => n$.id === imageData$.id.peek())?.normalizedOnce

	// 	const normalizedValues = imageData$.normalizedValues.get()
	// 	const imageDataProps = imageData$.props.peek()
	// 	if (!normalizedValues || normalizedOnce || !image || !stageWidth || !stageHeight) {
	// 		return
	// 	}

	// 	imageData$.props.set({
	// 		...imageDataProps,
	// 		x: normalizedValues.x * stageWidth,
	// 		y: normalizedValues.y * stageHeight,
	// 		width: normalizedValues.width * stageWidth,
	// 		height: normalizedValues.height * stageHeight,
	// 	})
	// 	imageData$.initialized.set(true)

	// 	const id = imageData$.id.peek()
	// 	singleGeneration$.normalizedImages.push({
	// 		normalizedOnce: true,
	// 		id,
	// 	})
	// 	handleImageTransform(id)
	// }, [image, imageData$, singleGeneration$.normalizedImages, stageHeight, stageWidth])

	// useEffect(() => {
	// 	const imageDataProps = imageData$.props.peek()
	// 	const initialized = imageData$.initialized.get()

	// 	if (initialized || !image || !imageDataProps) {
	// 		return
	// 	}

	// 	const scaleFactor =
	// 		0.4 * Math.min(stageWidth / (image?.width ?? 1), stageHeight / (image?.height ?? 1))
	// 	const width =
	// 		(image?.width ?? imageDataProps.width ?? 0) *
	// 			scaleFactor *
	// 			(imageDataProps.scaleX ?? 1) || 0
	// 	const height =
	// 		(image?.height ?? imageDataProps.height ?? 0) *
	// 			scaleFactor *
	// 			(imageDataProps.scaleY ?? 1) || 0

	// 	imageData$.props.set({
	// 		...imageDataProps,
	// 		x: (imageDataProps.x ?? 0) - width / 2,
	// 		y: (imageDataProps.y ?? 0) - height / 2,
	// 		width,
	// 		height,
	// 	})
	// 	imageData$.initialized.set(true)

	// 	handleImageTransform(imageData$.id.peek())
	// }, [imageData$, image, stageWidth, stageHeight])

	const [_, copyToClipboard] = useCopyToClipboard()
	useKey(
		(e) => (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c',
		async (e) => {
			const isSelected = isSelected$.peek()
			const id = imageData$.id.peek()
			if (!isSelected || !id) {
				return
			}
			try {
				e.preventDefault()
				const identifiers: PasteZoneIdentifier = { id: id, isDuplicated: true }
				const customIdentifier = JSON.stringify(identifiers)
				copyToClipboard(customIdentifier)
			} catch (err) {
				console.error('Failed to copy image:', err)
			}
		},
		{},
		[]
	)

	useEffect(() => {
		if (!transformerRef.current || !imageRef.current || !image) {
			return
		}
		transformerRef.current.nodes(imageRef.current ? [imageRef.current] : [])
		transformerRef.current.getLayer()?.batchDraw()
	}, [image, imageRef.current, transformerRef.current])

	useEffect(() => {
		const url = imageData$.url.get()
		if (!image || !url) {
			return
		}
		image.src = url
	}, [image, imageData$.url])

	const handleSelect = () => {
		onSelect(imageData$.id.peek() || '')
	}

	const setProps = () => {
		if (imageRef.current) {
			imageData$.props.set({ ...imageData$.props.peek(), ...imageRef.current.attrs })
		}
	}
	console.log('image: ', image)

	return (
		<>
			{isSelected$.get() ? <CustomLabel image$={imageData$} /> : null}

			<KonvaImage
				ref={imageRef}
				{...((imageData$.props.get() || {}) as any)}
				draggable
				image={image}
				onPointerDown={handleSelect}
				onTap={handleSelect}
				onContextMenu={(e) => {
					e.evt.preventDefault()
					onContextMenu(e.evt)
				}}
				onDragMove={(e) => {
					// const node = e.target
					// // Get the transformed bounding box of the element (including scale/rotation)
					// const box = node.getClientRect()
					// const stage = stageRef.current
					// const nodeCenterX = box.x + box.width / 2
					// const nodeCenterY = box.y + box.height / 2
					// const stageWidth = stage?.width() || window.innerWidth
					// const stageHeight = stage?.height() || window.innerHeight
					// // Calculate center of stage
					// const centerX = stageWidth / 2
					// const centerY = stageHeight / 2
					// let newGuides: GuideLines = { x: null, y: null }
					// // Snap to center horizontally (with a tolerance)
					// if (Math.abs(nodeCenterX - centerX) < 10) {
					// 	newGuides.x = centerX
					// 	// Re-position element to snap to the center
					// 	const newX = centerX - box.width / 2 - (box.x - node.x())
					// 	node.x(newX)
					// }
					// // Snap to center vertically (with a tolerance)
					// if (Math.abs(nodeCenterY - centerY) < 10) {
					// 	newGuides.y = centerY
					// 	const newY = centerY - box.height / 2 - (box.y - node.y())
					// 	node.y(newY)
					// }
					// setGuideLines(newGuides)
					// setProps()
				}}
				onDragStart={(e) => {
					if (imageRef.current) {
						setGuideLines({ x: imageRef.current.x(), y: imageRef.current.y() })
					}
				}}
				onDragEnd={(e) => {
					if (imageRef.current) {
						setProps()
						handleImageTransform(imageData$.id.peek() || '')
					}
					setGuideLines({ x: null, y: null })
				}}
				onTransformEnd={(e) => {
					if (imageRef.current) {
						setProps()
						handleImageTransform(imageData$.id.peek() || '')
					}
				}}
				onTransform={setProps}
			/>
			<Transformer
				ref={transformerRef}
				visible={isSelected$.get()}
				id={KonvaIdsEnum.transformer}
				keepRatio={true}
				borderStrokeWidth={1}
				enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
				anchorFill='rgba(255, 255, 255, 1)'
				anchorStroke='rgba(151, 71, 255, 1)'
				borderStroke='rgba(151, 71, 255, 1)'
				anchorCornerRadius={5}
				useSingleNodeRotation={false}
			/>

			{guideLines.x && (
				<Line
					points={[guideLines.x, 0, guideLines.x, window.innerHeight]}
					stroke='purple'
					strokeWidth={1}
					dash={[2, 2]}
				/>
			)}
			{guideLines.y && (
				<Line
					points={[0, guideLines.y, window.innerWidth, guideLines.y]}
					stroke='purple'
					strokeWidth={1}
					dash={[2, 2]}
				/>
			)}
		</>
	)
}
