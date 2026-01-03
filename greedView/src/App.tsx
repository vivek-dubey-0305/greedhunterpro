import React, { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';

function App() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center"><div className="text-[#00ff88]">Loading...</div></div>}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;
