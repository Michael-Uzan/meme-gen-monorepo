import { Rect } from 'react-konva'

export const CheckeredRect = ({ width, height }: { width: number; height: number }) => {
	// Define a base cell size (adjust for your needs)
	const baseCellSize = 10

	// Calculate rows and columns dynamically to maintain square cells
	const cols = Math.round(width / baseCellSize)
	const rows = Math.round(height / baseCellSize)

	const cellWidth = width / cols
	const cellHeight = height / rows

	const cells = []
	for (let row = 0; row < rows; row++) {
		for (let col = 0; col < cols; col++) {
			const isColor1 = (row + col) % 2 === 0
			cells.push(
				<Rect
					key={`${row}-${col}`}
					x={col * cellWidth}
					y={row * cellHeight}
					width={cellWidth}
					height={cellHeight}
					fill={isColor1 ? 'white' : '#EBEBEB'}
				/>
			)
		}
	}

	return <>{cells}</>
}
