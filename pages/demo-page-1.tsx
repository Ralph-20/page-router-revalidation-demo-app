import { GetStaticProps } from 'next';

interface DemoPageProps {
  randomNumber: number;
  backgroundColor: string;
  timestamp: string;
}

export default function DemoPage1({ randomNumber, backgroundColor, timestamp }: DemoPageProps) {
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-8"
      style={{ backgroundColor }}
    >
      <div className="bg-white rounded-lg shadow-2xl p-12 max-w-2xl w-full text-center">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Demo Page 1</h1>
        
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <p className="text-sm text-gray-600 mb-2">Random Number</p>
            <p className="text-5xl font-bold text-gray-900">{randomNumber}</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6">
            <p className="text-sm text-gray-600 mb-2">Background Color</p>
            <p className="text-2xl font-mono text-gray-900">{backgroundColor}</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6">
            <p className="text-sm text-gray-600 mb-2">Generated At</p>
            <p className="text-lg text-gray-900">{timestamp}</p>
          </div>
        </div>
        
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            This page uses ISR with manual revalidation. The data above was generated at build time
            and will only change when explicitly revalidated via the API endpoint.
          </p>
        </div>
      </div>
    </div>
  );
}

// ISR with manual revalidation only (revalidate: false)
export const getStaticProps: GetStaticProps<DemoPageProps> = async () => {
  // Generate random data at build time
  const randomNumber = Math.floor(Math.random() * 1000000);
  const backgroundColor = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
  const timestamp = new Date().toISOString();

  return {
    props: {
      randomNumber,
      backgroundColor,
      timestamp,
    },
    // false means no automatic revalidation - only manual via API
    revalidate: false,
  };
};


