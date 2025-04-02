import { observable, observe } from '@legendapp/state'
import type Konva from 'konva'

export type CanvasImage = {
	id: string
	url: string
	normalizedValues?: { x: number; y: number; width: number; height: number }
	props: Partial<Konva.ImageConfig> & { zIndex: number }
	initialized?: boolean
}
type SingleGeneration = {
	images: CanvasImage[]
	selectedId: string | null
	mediaUploading: boolean
	aspectRatio: { w: number; h: number }
	normalizedImages: { id: string; normalizedOnce: boolean }[]
}

// a global state to use between the routes
const singleGeneration$ = observable<SingleGeneration>({
	images: [],
	selectedId: '',
	mediaUploading: false,
	aspectRatio: { w: 1, h: 1 },
	normalizedImages: [],
})

export const useSingleGeneration = () => {
	// const singleGeneration$ = useGlobal$(singleGeneration$_)
	// const navigate = useNavigate()
	// const { getComfyOutpaining } = useFetchComfyOutpainting()
	// const { currentTask$ } = useGenerations()
	// const { useFindMany } = useSystemMedia()
	// const { items } = useFindMany({
	// 	filterVariables: {
	// 		byondId: unique(fixDictOrUndefined(currentTask$).usedAssets.propIds.get() || []),
	// 		tableName: TableNamesEnum.PropsKit,
	// 	},
	// 	skip: !fixDictOrUndefined(currentTask$).usedAssets.propIds.get()?.length,
	// })

	// const reImagine = useHandler(async () => {
	// 	const task = currentTask$.peek()
	// 	if (!task) {
	// 		return
	// 	}
	// 	singleGeneration$.normalizedImages.set([])
	// 	singleGeneration$.positivePrompt.set(task.positive)
	// 	singleGeneration$.negativePrompt.set(task.negative)
	// 	singleGeneration$.aspectRatio.set(task.aspectRatio)
	// 	if (task.jobs.length) {
	// 		const outpaintingJob = task.jobs.find((j) => j.type === TaskTypeEnum.ComfyOutpainting)
	// 		if (outpaintingJob) {
	// 			const outpaintingSettings = await getComfyOutpaining(
	// 				outpaintingJob.byondId,
	// 				task.organization
	// 			)
	// 			singleGeneration$.imageStyleId.set(outpaintingSettings?.settings.styleMediaId || '')
	// 		} else {
	// 			singleGeneration$.imageStyleId.set('')
	// 		}
	// 	}

	// 	const { attrs, children } = task.inputKonvaJson as Konva.Stage
	// 	const { width: stageWidth, height: stageHeight } = attrs
	// 	const _importedKonvaImages: CanvasItem[] = children[0].children
	// 		.filter((c) => c.className === 'Image')
	// 		.map((c) => {
	// 			const normalizedValues = {
	// 				x: c.attrs.x / stageWidth,
	// 				y: c.attrs.y / stageHeight,
	// 				width: c.attrs.width / stageWidth,
	// 				height: c.attrs.height / stageHeight,
	// 			}

	// 			const { id, mediaId, isProp, initialized, ...props } = c.attrs

	// 			const url = isProp
	// 				? items.find((item) => item.byondId === c.attrs.mediaId)?.url
	// 				: c.attrs.url

	// 			return {
	// 				id: c.attrs.id,
	// 				props,
	// 				normalizedValues,
	// 				mediaId,
	// 				url,
	// 				isProp,
	// 			}
	// 		})

	// 	singleGeneration$.images.set(_importedKonvaImages)
	// 	navigate('../')
	// })
	return {
		singleGeneration$,
		// reImagine,
	}
}
