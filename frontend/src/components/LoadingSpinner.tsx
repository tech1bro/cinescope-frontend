// src/components/LoadingSpinner.tsx
import React from 'react';

const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-6">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600" />
  </div>
);

export default LoadingSpinner;