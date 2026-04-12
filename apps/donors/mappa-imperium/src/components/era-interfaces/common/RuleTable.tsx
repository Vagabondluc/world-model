import React from 'react';

interface RuleTableProps {
    headers: string[];
    rows: (string | number)[][];
}

const RuleTable = ({ headers, rows }: RuleTableProps) => {
    return (
        <div className="table-container">
            <table className="table-base">
                <thead className="table-header">
                    <tr>
                        {headers.map((header, index) => (
                            <th key={index} className="table-th">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="table-body">
                    {rows.map((row, rowIndex) => (
                        <tr key={rowIndex} className="table-row">
                            {row.map((cell, cellIndex) => (
                                <td key={cellIndex} className="table-td whitespace-nowrap">
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RuleTable;
