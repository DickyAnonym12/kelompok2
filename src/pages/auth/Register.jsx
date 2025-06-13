export default function Register() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F8F5F2] to-[#F1E9E2] px-4">
            <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl p-10 w-full max-w-md border border-[#E5D8C4]">
                <h2 className="text-3xl font-semibold text-[#5E493A] mb-8 text-center tracking-wide">
                    Create Your Account ✨
                </h2>

                <form>
                    <div className="mb-6">
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-[#5E493A] mb-2"
                        >
                            Email Address
                        </label>
                        <div className="relative group">
                            <input
                                type="email"
                                id="email"
                                className="w-full px-4 py-3 bg-[#F9F7F4] border border-[#E5D8C4] rounded-lg shadow-sm placeholder-gray-400 transition-all duration-300 focus:ring-2 focus:ring-[#BFA48C] focus:border-[#BFA48C]"
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-[#5E493A] mb-2"
                        >
                            Password
                        </label>
                        <div className="relative group">
                            <input
                                type="password"
                                id="password"
                                className="w-full px-4 py-3 bg-[#F9F7F4] border border-[#E5D8C4] rounded-lg shadow-sm placeholder-gray-400 transition-all duration-300 focus:ring-2 focus:ring-[#BFA48C] focus:border-[#BFA48C]"
                                placeholder="********"
                            />
                        </div>
                    </div>

                    <div className="mb-8">
                        <label
                            htmlFor="confirmPassword"
                            className="block text-sm font-medium text-[#5E493A] mb-2"
                        >
                            Confirm Password
                        </label>
                        <div className="relative group">
                            <input
                                type="password"
                                id="confirmPassword"
                                className="w-full px-4 py-3 bg-[#F9F7F4] border border-[#E5D8C4] rounded-lg shadow-sm placeholder-gray-400 transition-all duration-300 focus:ring-2 focus:ring-[#BFA48C] focus:border-[#BFA48C]"
                                placeholder="********"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#BFA48C] hover:bg-[#A68C76] text-white font-semibold py-3 px-6 rounded-xl transition duration-300 shadow-md"
                    >
                        Register
                    </button>
                </form>
            </div>
        </div>
    )
}
