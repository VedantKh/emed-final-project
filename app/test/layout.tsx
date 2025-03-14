export const metadata = {
  title: 'API Tests',
  description: 'Test page for API endpoints',
};

export default function TestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <div className="bg-blue-800 text-white p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl font-bold">Test Environment</h1>
          <p className="text-sm opacity-80">This page is for testing purposes only</p>
        </div>
      </div>
      {children}
    </div>
  );
} 