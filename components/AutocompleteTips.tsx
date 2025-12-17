import React from 'react';

export function AutocompleteTips() {
  return (
    <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-slate-700">
      <p className="font-semibold text-blue-900 mb-2">💡 Tips:</p>
      <ul className="list-disc list-inside space-y-1 text-blue-800">
        <li>Use arrow keys to navigate results</li>
        <li>Press Enter to select a result</li>
        <li>Press Escape to close the dropdown</li>
        <li>Selected items are logged to the console</li>
      </ul>
    </div>
  );
}
