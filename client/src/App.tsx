import { useEffect } from 'react'
import axios from 'axios'
import { SERVER_BASE_API } from './constants/http.constants'

function App() {
    useEffect(() => {
        const getUser = async () => {
            const data = await axios.get(SERVER_BASE_API + '/users')
            console.log('data', data)
        }
        getUser()
    }, [])

    return <div className="bg-green-300">Welcome to Irona</div>
}

export default App
