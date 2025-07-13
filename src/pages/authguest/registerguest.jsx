function RegisterGuest() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5fcfe] px-4 py-8">
      <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-2xl shadow-md">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-4 sm:mb-6">
          Create Account
        </h2>
        <form className="space-y-4 sm:space-y-5">
          <div>
            <label className="block text-gray-700 mb-2 text-sm sm:text-base">Full Name</label>
            <input
              type="text"
              className="w-full p-2 sm:p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-400 focus:outline-none text-sm sm:text-base"
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2 text-sm sm:text-base">Email</label>
            <input
              type="email"
              className="w-full p-2 sm:p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-400 focus:outline-none text-sm sm:text-base"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2 text-sm sm:text-base">Password</label>
            <input
              type="password"
              className="w-full p-2 sm:p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-400 focus:outline-none text-sm sm:text-base"
              placeholder="Create a password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-500 text-white py-2 sm:py-3 rounded-xl hover:bg-red-600 transition text-sm sm:text-base"
          >
            Register
          </button>
        </form>
        <p className="text-center text-gray-600 mt-4 text-sm sm:text-base">
          Already have an account?{" "}
          <a href="/login" className="text-red-500 hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}

export default Register;
