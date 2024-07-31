import {
    SignedIn,
    SignedOut,
    SignInButton,
    UserButton,
} from '@clerk/clerk-react'

const NavBar = () => {
    return (
        <nav className="flex px-3 py-4 justify-between items-center">
            <a
                href="https://www.irona.ai"
                target="_blank"
                rel="noopener noreferrer"
                className={`text-black underline`}
            >
                Irona AI
            </a>
            <SignedOut>
                <div className="p-2 px-4 bg-slate-800 shadow-md hover:bg-slate-600 rounded-md text-white cursor-pointer">
                    <SignInButton mode="modal" />
                </div>
            </SignedOut>

            <SignedIn>
                <UserButton />
            </SignedIn>
        </nav>
    )
}
export default NavBar
