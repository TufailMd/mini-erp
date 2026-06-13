import StitchConversion from './StitchConversion'
import { ErpProvider } from './context/ErpContext'

function App() {
  return (
    <ErpProvider>
      <StitchConversion />
    </ErpProvider>
  )
}

export default App
