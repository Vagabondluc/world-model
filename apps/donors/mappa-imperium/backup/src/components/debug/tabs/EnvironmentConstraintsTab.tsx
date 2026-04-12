import React from 'react';
import { useEnvironmentConstraints } from '../hooks/useEnvironmentConstraints';

interface EnvironmentConstraintsTabProps {
    hook: ReturnType<typeof useEnvironmentConstraints>;
}

const EnvironmentConstraintsTab: React.FC<EnvironmentConstraintsTabProps> = ({ hook }) => {
  const { constraints, isRunning, runAllTests } = hook;

  const getStatusIcon = (status: string) => ({'safe': '✅', 'risky': '⚠️', 'forbidden': '❌', 'error': '💥', 'testing': '🔄', 'pending': '⏳'}[status] || '⏳');
  const getStatusColor = (status: string) => ({'safe': 'text-green-900 bg-green-50 border-green-200', 'risky': 'text-yellow-900 bg-yellow-50 border-yellow-200', 'forbidden': 'text-red-900 bg-red-50 border-red-200', 'error': 'text-purple-900 bg-purple-50 border-purple-200', 'testing': 'text-blue-900 bg-blue-50 border-blue-200', 'pending': 'text-gray-900 bg-gray-50 border-gray-200'}[status] || '');

  return (
    <div className="space-y-6 text-gray-900">
      <div className="text-center">
        <button onClick={() => runAllTests()} disabled={isRunning} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
          {isRunning ? '🔄 Running Tests...' : '🔍 Run All Environment Tests'}
        </button>
      </div>
      <div className="space-y-3">
        {constraints.tests.map((test, index) => (
          <div key={index} className={`border rounded-lg p-4 ${getStatusColor(test.status)}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2"><span className="text-xl">{getStatusIcon(test.status)}</span><span className="font-semibold">{test.name}</span></div>
              <span className="text-sm opacity-75 capitalize">{test.status}</span>
            </div>
            <p className="text-sm mb-2">{test.description}</p>
            {test.result && <div className="text-sm"><strong>Result:</strong> {test.result}</div>}
          </div>
        ))}
      </div>
    </div>
  );
};
export default EnvironmentConstraintsTab;