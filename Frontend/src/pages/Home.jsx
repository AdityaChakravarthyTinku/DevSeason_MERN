const HomePage = () => {
    return (
      <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 flex items-center justify-center">
        <div className="bg-white p-8 rounded shadow-md w-full sm:w-96">
          <h1 className="text-3xl font-bold mb-4 text-center text-primary-dark">Welcome to My Online Judge</h1>
          <p className="text-center text-gray-700">Please <a href="/login">login</a> or <a href="/signup">Register</a> to continue.</p>
        </div>
      </div>
    );
  }
  
  export default HomePage;
  