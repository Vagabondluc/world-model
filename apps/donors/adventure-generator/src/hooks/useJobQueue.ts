
import { useState, useCallback, useEffect, useRef } from 'react';
import { useBackendStore } from '../stores/backendStore';
import { httpFetch as fetch } from '../utils/httpUtils';

export enum JobStatus {
    QUEUED = "queued",
    PROCESSING = "processing",
    COMPLETED = "completed",
    FAILED = "failed",
    CANCELLED = "cancelled"
}

export enum JobPriority {
    CRITICAL = 0,
    HIGH = 1,
    LOW = 2
}

interface JobResponse {
    job_id: string;
    status: string;
    position?: number;
}

export interface JobStatusResponse {
    job_id: string;
    status: JobStatus;
    result?: any;
    error?: string;
    progress: number;
    created_at: string;
    started_at?: string;
    completed_at?: string;
}

export const useJobQueue = () => {
    const { baseUrl, apiKey } = useBackendStore();
    const [jobId, setJobId] = useState<string | null>(null);
    const [status, setStatus] = useState<JobStatus | null>(null);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState<number>(0);
    const [position, setPosition] = useState<number | null>(null);

    const pollIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isPollingRef = useRef(false);

    const getHeaders = useCallback(() => {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json'
        };
        if (apiKey) {
            headers['X-API-Key'] = apiKey;
        }
        return headers;
    }, [apiKey]);

    const submitJob = useCallback(async (type: string, payload: any, priority: JobPriority = JobPriority.HIGH) => {
        setIsLoading(true);
        setError(null);
        setResult(null);
        setStatus(JobStatus.QUEUED);
        try {
            const response = await fetch(`${baseUrl}/queue/submit`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ type, payload, priority })
            });

            if (!response.ok) {
                throw new Error(`Submit failed: ${response.statusText}`);
            }

            const data: JobResponse = await response.json();
            setJobId(data.job_id);
            if (data.position !== undefined) setPosition(data.position);

            // Start polling immediately
            startPolling(data.job_id);

            return data.job_id;
        } catch (err: any) {
            setError(err.message);
            setStatus(JobStatus.FAILED);
            setIsLoading(false);
            return null;
        }
    }, [baseUrl, getHeaders]);

    const stopPolling = useCallback(() => {
        if (pollIntervalRef.current) {
            clearTimeout(pollIntervalRef.current);
            pollIntervalRef.current = null;
        }
        isPollingRef.current = false;
    }, []);

    const startPolling = useCallback((id: string) => {
        if (isPollingRef.current) return;
        isPollingRef.current = true;

        const poll = async () => {
            if (!isPollingRef.current) return;

            try {
                const response = await fetch(`${baseUrl}/queue/status/${id}`, {
                    headers: getHeaders()
                });

                if (response.ok) {
                    const data: JobStatusResponse = await response.json();
                    setStatus(data.status);
                    setProgress(data.progress);

                    if (data.status === JobStatus.COMPLETED) {
                        setResult(data.result);
                        setIsLoading(false);
                        stopPolling();
                    } else if (data.status === JobStatus.FAILED) {
                        setError(data.error || "Job failed");
                        setIsLoading(false);
                        stopPolling();
                    } else if (data.status === JobStatus.CANCELLED) {
                        setIsLoading(false);
                        stopPolling();
                    } else {
                        // Keep polling
                        pollIntervalRef.current = setTimeout(poll, 1000); // 1s interval
                    }
                } else {
                    // 404 or other network error
                    console.error("Poll failed", response.status);
                    pollIntervalRef.current = setTimeout(poll, 2000); // Backoff
                }
            } catch (e) {
                console.error("Poll error", e);
                pollIntervalRef.current = setTimeout(poll, 2000);
            }
        };

        poll();
    }, [baseUrl, getHeaders, stopPolling]);

    const cancelJob = useCallback(async () => {
        if (!jobId) return;
        try {
            await fetch(`${baseUrl}/queue/cancel/${jobId}`, {
                method: 'POST',
                headers: getHeaders()
            });
            setStatus(JobStatus.CANCELLED);
            stopPolling();
        } catch (e) {
            console.error("Cancel failed", e);
        }
    }, [jobId, baseUrl, getHeaders, stopPolling]);

    const reset = useCallback(() => {
        stopPolling();
        setJobId(null);
        setStatus(null);
        setResult(null);
        setError(null);
        setProgress(0);
        setPosition(null);
    }, [stopPolling]);

    // Cleanup on unmount
    useEffect(() => {
        return () => stopPolling();
    }, [stopPolling]);

    const [isLoading, setIsLoading] = useState(false);

    return {
        jobId,
        status,
        result,
        error,
        isLoading,
        progress,
        position,
        submitJob,
        cancelJob,
        reset
    };
};
