import { Box, Flex, Image, Text } from '@chakra-ui/react'
import { useRef, useState } from 'react'
import { Stage, Layer } from 'react-konva'
import { CheckeredRect } from './checkered-rec'
import { calculateSizeWithAspect } from './utils'
import { DropZone } from './drop-zone'
import { uploadFile } from './cloudinary'
import { For, Show } from '@legendapp/state/react'
import { CanvasImage, useSingleGeneration } from './hooks/use-single-generation'
import { DraggableImage } from './draggable-image'
import { batch, Observable } from '@legendapp/state'

export enum KonvaIdsEnum {
	checkers = 'konvaCheckersLayer',
	transformer = 'konvaTransformer',
}

export function App() {
	const [a, setA] = useState('')
	const stageRef = useRef<any>(null)
	const checkeredLayerRef = useRef<any>(null)
	const parentStageRef = useRef<any>(null)
	const layerRef = useRef<any>(null)
	const { singleGeneration$ } = useSingleGeneration()
	const containerWidth = parentStageRef.current?.offsetWidth
	const containerHeight = parentStageRef.current?.offsetHeight
	const { width, height } = calculateSizeWithAspect({
		aspectRatio: 1,
		offsetWidth: containerWidth || 1500,
		offsetHeight: containerHeight || 1500,
	})

	const handleSelect = (id: string) => {
		singleGeneration$.selectedId.set(id)
	}

	const recalcOptimizeImage = (id: string) => {
		if (!id) {
			return
		}
		const image$ = singleGeneration$.images.find((i) => i.id.peek() === id)
		if (!image$) {
			return
		}
		const imageUrl = image$.url.peek()

		batch(() => {
			image$.url.set(imageUrl)
		})
	}
	// const cloudinary = require('cloudinary').v2
	console.log('images: ', singleGeneration$.images.peek())

	return (
		<Flex
			ref={parentStageRef}
			justifyContent='center'
			alignItems='center'
			w='100%'
			h='100%'
			pos='relative'
			boxSizing='border-box'
		>
			<Box w={`${width}px`} h={`${height}px`} bgColor='white' pos='absolute'>
				<DropZone
					multiple={false}
					onFileUpload={async (file, url, e) => {
						try {
							const image = await uploadFile(file)
							setA(image.url)
							const rect = stageRef.current.content.getBoundingClientRect()
							const canvasImage = {
								url: image.url,
								id: image.id,
								normalizedValues: {
									x: e.clientX - rect.left,
									y: e.clientY - rect.top,
									width: 100,
									height: 100,
								},
								props: { zIndex: 99999999 },
							}
							singleGeneration$.images.push(canvasImage)
						} catch (error) {}
						// handleAddImage(item)
						// handleDeselect(e)
						// canvasFileUploaded$.set({ file: opaqueObject(file), itemId })
					}}
					onDrop={(e) => {
						// const rect = stageRef.current.content.getBoundingClientRect()
						// e.preventDefault()
						// try {
						// 	const data = JSON.parse(
						// 		e.dataTransfer.getData(DRAG_EVENT_KEY)
						// 	) as CanvasItem
						// 	const itemId = v4()
						// 	let item = {
						// 		...data,
						// 		id: itemId,
						// 		props: {
						// 			x: e.clientX - rect.left,
						// 			y: e.clientY - rect.top,
						// 		},
						// 	}
						// 	handleAddImage(item)
						// 	handleDeselect(e)
						// } catch (e) {
						// 	//
						// }
					}}
				>
					<Stage ref={stageRef} width={width} height={height}>
						<Layer ref={checkeredLayerRef} id={KonvaIdsEnum.checkers}>
							<CheckeredRect width={width} height={height} />
						</Layer>

						<Layer ref={layerRef}>
							<For each={singleGeneration$.images}>
								{(image$) => (
									<DraggableImage
										imageData$={image$ as Observable<CanvasImage>}
										handleImageTransform={recalcOptimizeImage}
										onSelect={handleSelect}
										onContextMenu={({ clientX, clientY }) => {
											// setMenuPosition({
											// 	x: clientX,
											// 	y: clientY,
											// })
											// onOpen()
										}}
									/>
								)}
							</For>
						</Layer>
					</Stage>
				</DropZone>
			</Box>
		</Flex>
	)
}

export default App
