import { v4 } from 'uuid'

const CLOUD_NAME = 'looply'
const UPLOAD_PRESET = 'oxageyls'

export const uploadFile = (file: File) => {
	console.log('!!!!!!!')
	const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`
	const formData = new FormData()
	formData.append('file', file)
	formData.append('upload_preset', UPLOAD_PRESET)

	return fetch(UPLOAD_URL, {
		method: 'POST',
		body: formData,
	})
		.then((res) => res.json())
		.then((res) => ({
			id: v4(),
			fileName: res.original_filename,
			url: res.secure_url as string,
			createdAt: Date.now(),
		}))
		.catch((err) => {
			throw err
		})
}
