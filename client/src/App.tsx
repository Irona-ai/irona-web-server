import { useEffect } from 'react'
import axios from 'axios'
import { SERVER_BASE_API } from './constants/http.constants'
import { useUser } from '@clerk/clerk-react'
import Navbar from './containers/Navbar'

function App() {
    const { isSignedIn, user } = useUser()
    console.log('[USER]: ', user)

    const getUser = async () => {
        const data = await axios.get(SERVER_BASE_API + '/users')
        console.log('data', data)
    }

    useEffect(() => {
        if (isSignedIn) {
            getUser()
        }
    }, [isSignedIn])

    return (
        <section>
            <Navbar />
            <main className="p-4">
                {isSignedIn ? (
                    <h1 className="text-2xl">Hey👋 {user.fullName}</h1>
                ) : null}
            </main>
            <button onClick={getUser}>refresh</button>
        </section>
    )
}

export default App
