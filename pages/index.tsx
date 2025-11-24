import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-2xl p-12 max-w-2xl w-full text-center border border-gray-700/50">
        <h1 className="text-4xl font-bold mb-10 text-white leading-tight">
          This is a demo page router app. Click one of the two following paths below:
        </h1>
        
        <div className="flex flex-col gap-5 items-center mt-10">
          <Link
            href="/demo-page-1"
            className="w-full max-w-sm rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-5 px-8 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform"
          >
            <span className="text-lg">Demo Page 1</span>
          </Link>
          
          <Link
            href="/demo-page-2"
            className="w-full max-w-sm rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold py-5 px-8 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform"
          >
            <span className="text-lg">Demo Page 2</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
