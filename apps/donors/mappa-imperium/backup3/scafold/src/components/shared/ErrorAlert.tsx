import React from 'react';

interface ErrorAlertProps {
    title: string;
    message: string;
}

const ErrorAlert = ({ title, message }: ErrorAlertProps) => (
    <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-800 rounded-md">
        <h3 className="font-bold">{title}</h3>
        <p>{message}</p>
    </div>
);

export default ErrorAlert;
