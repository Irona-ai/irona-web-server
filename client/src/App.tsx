import { useEffect, useState } from 'react'
import axios from 'axios'
import { SERVER_BASE_API } from './constants/http.constants'
import { useUser } from '@clerk/clerk-react'
import Navbar from './containers/Navbar'

function App() {
    const [apiToken, setApiToken] = useState('')
    const { isSignedIn, user } = useUser()
    console.log('[USER]: ', user)

    const getUser = async () => {
        const data = await axios.get(SERVER_BASE_API + '/users')
        console.log('data', data)
    }

    const getApiTokens = async () => {
        const { data } = await axios.get(SERVER_BASE_API + '/api-tokens')
        console.log('getApiTokens', data)
    }

    const createApiToken = async () => {
        const { data } = await axios.post(SERVER_BASE_API + '/api-tokens', {
            name: 'test',
        })
        console.log('createApiToken', data)
    }

    const deleteApiToken = async () => {
        const { data } = await axios.delete(
            SERVER_BASE_API + `/api-tokens/${apiToken}`
        )
        console.log('deleteApiToken', data)
    }

    const validateApiToken = async () => {
        const { data } = await axios.post(
            SERVER_BASE_API + `/api-tokens/validate`,
            {
                apiKey: apiToken,
            }
        )
        console.log('validateApiToken', data)
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
                <div className="flex flex-col gap-4">
                    <button onClick={getApiTokens}>Get API Tokens</button>
                    <button onClick={createApiToken}>Create API Tokens</button>
                    <input
                        type="text"
                        placeholder="API Token id"
                        value={apiToken}
                        onChange={(e) => setApiToken(e.target.value)}
                    />
                    <button onClick={deleteApiToken}>delete API Tokens</button>
                    {/* validate */}
                    <button onClick={validateApiToken}>
                        validate API Tokens
                    </button>
                </div>
            </main>
        </section>
    )
}

export default App
