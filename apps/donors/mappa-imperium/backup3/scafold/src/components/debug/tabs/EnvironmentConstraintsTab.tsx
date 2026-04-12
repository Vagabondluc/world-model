// src/components/debug/tabs/EnvironmentConstraintsTab.tsx
import React, { useState } from 'react';
import { useEnvironmentConstraints } from '../hooks/useEnvironmentConstraints';

interface EnvironmentConstraintsTabProps {
    hook: ReturnType<typeof useEnvironmentConstraints>;
}

const EnvironmentConstraintsTab: React.FC<EnvironmentConstraintsTabProps> = ({ hook }) => {
  const { constraints, isRunning, runAllTests, getEnvironmentRecommendations } = hook;
  const [includePermissionChecks, setIncludePermissionChecks] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'safe': return '✅'; case 'risky': return '⚠️';
      case 'forbidden': return '❌'; case 'error': return '💥';
      case 'testing': return '🔄'; default: return '⏳';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe': return 'text-green-900 bg-green-50 border-green-200';
      case 'risky': return 'text-yellow-900 bg-yellow-50 border-yellow-200';
      case 'forbidden': return 'text-red-900 bg-red-50 border-red-200';
      case 'error': return 'text-purple-900 bg-purple-50 border-purple-200';
      case 'testing': return 'text-blue-900 bg-blue-50 border-blue-200';
      default: return 'text-gray-900 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6 text-gray-900">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          Environment: {constraints.environment}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
          <div className="bg-green-100 rounded p-2"><div className="text-2xl font-bold text-green-600">{constraints.summary.safe}</div><div className="text-sm text-green-600">Safe</div></div>
          <div className="bg-yellow-100 rounded p-2"><div className="text-2xl font-bold text-yellow-600">{constraints.summary.risky}</div><div className="text-sm text-yellow-600">Risky</div></div>
          <div className="bg-red-100 rounded p-2"><div className="text-2xl font-bold text-red-600">{constraints.summary.forbidden}</div><div className="text-sm text-red-600">Forbidden</div></div>
          <div className="bg-purple-100 rounded p-2"><div className="text-2xl font-bold text-purple-600">{constraints.summary.error}</div><div className="text-sm text-purple-600">Errors</div></div>
          <div className="bg-gray-100 rounded p-2"><div className="text-2xl font-bold text-gray-600">{constraints.summary.untested}</div><div className="text-sm text-gray-600">Untested</div></div>
        </div>
      </div>

      <div className="text-center space-y-3">
        <button onClick={() => runAllTests({ includePermissions: includePermissionChecks })} disabled={isRunning} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
          {isRunning ? '🔄 Running Tests...' : '🔍 Run All Environment Tests'}
        </button>
        <div className="flex items-center justify-center">
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                    type="checkbox"
                    checked={includePermissionChecks}
                    onChange={(e) => setIncludePermissionChecks(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Include Webcam & Microphone Tests (will prompt for permission)
            </label>
        </div>
      </div>
      
      {constraints.isCompletelyTested && getEnvironmentRecommendations && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-amber-900 mb-2">📋 Environment Recommendations</h3>
          <ul className="space-y-1">{getEnvironmentRecommendations().map((rec, index) => <li key={index} className="text-amber-800">{rec}</li>)}</ul>
        </div>
      )}

      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">Constraint Test Results</h3>
        {constraints.tests.map((test, index) => (
          <div key={index} className={`border rounded-lg p-4 ${getStatusColor(test.status)}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2"><span className="text-xl">{getStatusIcon(test.status)}</span><span className="font-semibold">{test.name}</span></div>
              <span className="text-sm opacity-75 capitalize">{test.status}</span>
            </div>
            <p className="text-sm mb-2">{test.description}</p>
            {test.result && <div className="text-sm"><strong>Result:</strong> {test.result}</div>}
            {test.recommendation && <div className="text-sm mt-1"><strong>Recommendation:</strong> {test.recommendation}</div>}
            {test.errorDetails && <div className="text-sm mt-1 font-mono bg-red-100 p-2 rounded"><strong>Error:</strong> {test.errorDetails}</div>}
            {test.lastTested && <div className="text-xs opacity-50 mt-2">Last tested: {test.lastTested.toLocaleString()}</div>}
          </div>
        ))}
      </div>
      
       {constraints.isCompletelyTested && (
        <>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-green-900 mb-2">✅ What you CAN do safely</h3>
              <ul className="space-y-1 text-green-800 list-disc list-inside">
                {constraints.tests.filter(t => t.status === 'safe').map((t, i) => <li key={i}><strong>{t.name}:</strong> {t.recommendation}</li>)}
              </ul>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-red-900 mb-2">❌ What will LIKELY CRASH this environment</h3>
                 <ul className="space-y-1 text-red-800 list-disc list-inside">
                    {constraints.tests.filter(t => t.status === 'forbidden').map((t, i) => <li key={i}><strong>{t.name}:</strong> {t.recommendation}</li>)}
                </ul>
            </div>
        </>
      )}
    </div>
  );
};

export default EnvironmentConstraintsTab;
