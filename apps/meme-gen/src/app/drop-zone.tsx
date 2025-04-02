import { Flex, FlexProps } from '@chakra-ui/react'
import React, { ReactNode, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import type { DropEvent, FileRejection } from 'react-dropzone'
import { readFileAsDataUrl } from './utils'

type DropZoneProps = {
	onFileUpload?: (file: File, url: string, event: React.DragEvent<HTMLDivElement>) => void
	onDrop?: (e: React.DragEvent<HTMLDivElement>) => void
	multiple: boolean
	children: ReactNode
}

export const DropZone = ({
	onFileUpload,
	onDrop,
	children,
	multiple,
	...props
}: DropZoneProps & FlexProps) => {
	const handleDeviceDrop = (
		acceptedFiles: File[],
		fileRejections: FileRejection[],
		event: DropEvent
	) => {
		for (const file of acceptedFiles) {
			if (file && file.type.startsWith('image/')) {
				readFileAsDataUrl({
					file,
					event,
					onFileLoaded: onFileUpload,
				})
			}
		}

		fileRejections.forEach(() => {
			alert('failed')
		})
	}

	const [dragActive, setDragActive] = useState(false)

	const { getRootProps, getInputProps } = useDropzone({
		onDrop: handleDeviceDrop,
		accept: {
			'image/jpeg': ['.jpeg', '.jpg'],
			'image/png': ['.png'],
			'image/webp': ['.webp'],
			'image/avif': ['.avif'],
		},
		multiple,
		noClick: true,
	})

	const { onDrop: dropzoneOnDrop, ...rootProps } = getRootProps()

	return (
		<Flex
			{...rootProps}
			{...{
				onDragEnter: () => {
					setDragActive(true)
				},
				onDragLeave: (e: React.DragEvent<HTMLDivElement>) => {
					const related = e.relatedTarget as HTMLElement | null
					if (!related || !e.currentTarget.contains(related)) {
						setDragActive(false) // Remove highlight only if truly leaving
					}
				},
				onDragOver: (e) => {
					e.preventDefault()
				},
			}}
			shadow={dragActive ? 'outline' : 'none'}
			transition='border 0.2s'
			flex={1}
			w='100%'
			h='100%'
			{...props}
			onDrop={(e: React.DragEvent<HTMLDivElement>) => {
				e.preventDefault()
				if (e.dataTransfer.files.length > 0) {
					dropzoneOnDrop?.(e)
				} else {
					onDrop?.(e)
				}
				setDragActive(false)
			}}
		>
			<input {...getInputProps()} />

			{children}
		</Flex>
	)
}
