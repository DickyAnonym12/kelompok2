export default function Register() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-blue-100">
            <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md">
                <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                    ✨ Create Your Account
                </h2>

                <form>
                    <div className="mb-6">
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-600 mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <input
                                type="email"
                                id="email"
                                className="w-full px-12 py-3 bg-gray-50 border border-gray-300 rounded-2xl shadow-inner focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300"
                                placeholder="you@example.com"
                            />
                            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                📧
                            </span>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-semibold text-gray-600 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type="password"
                                id="password"
                                className="w-full px-12 py-3 bg-gray-50 border border-gray-300 rounded-2xl shadow-inner focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300"
                                placeholder="********"
                            />
                            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                🔒
                            </span>
                        </div>
                    </div>

                    <div className="mb-8">
                        <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-600 mb-2">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                                type="password"
                                id="confirmPassword"
                                className="w-full px-12 py-3 bg-gray-50 border border-gray-300 rounded-2xl shadow-inner focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300"
                                placeholder="********"
                            />
                            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                🔒
                            </span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-pink-400 to-blue-400 hover:from-pink-500 hover:to-blue-500 text-white font-semibold py-3 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300"
                    >
                        🚀 Register
                    </button>
                </form>
            </div>
        </div>
    );
}
