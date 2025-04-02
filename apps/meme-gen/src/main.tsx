import { StrictMode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import * as ReactDOM from 'react-dom/client'
import App from './app/app'
import { ChakraProvider } from '@chakra-ui/react'
import { system } from './chakra-system/chakra-system'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
	<StrictMode>
		<BrowserRouter>
			<ChakraProvider value={system}>
				<App />
			</ChakraProvider>
		</BrowserRouter>
	</StrictMode>
)
