
import { useState, useCallback } from 'react';
import { z } from 'zod';

type FormErrors<T> = Partial<Record<keyof T, string>>;

interface UseZodFormOptions<T> {
    schema: z.ZodType<T>;
    initialValues: T;
}

interface UseZodFormReturn<T> {
    values: T;
    errors: FormErrors<T>;
    isDirty: boolean;
    isValid: boolean;
    handleChange: (field: keyof T, value: any) => void;
    setValue: (field: keyof T, value: any) => void;
    setValues: (values: Partial<T>) => void;
    validate: () => boolean;
    reset: () => void;
}

export const useZodForm = <T extends Record<string, any>>({ 
    schema, 
    initialValues 
}: UseZodFormOptions<T>): UseZodFormReturn<T> => {
    const [values, setValuesState] = useState<T>(initialValues);
    const [errors, setErrors] = useState<FormErrors<T>>({});
    const [isDirty, setIsDirty] = useState(false);

    const validate = useCallback(() => {
        const result = schema.safeParse(values);
        if (result.success) {
            setErrors({});
            return true;
        } else {
            const newErrors: FormErrors<T> = {};
            result.error.issues.forEach((issue) => {
                // Simple mapping for top-level keys. Nested keys might need more complex path handling later.
                const key = issue.path[0] as keyof T;
                if (key) {
                    newErrors[key] = issue.message;
                }
            });
            setErrors(newErrors);
            return false;
        }
    }, [schema, values]);

    const handleChange = useCallback((field: keyof T, value: any) => {
        setValuesState((prev) => ({ ...prev, [field]: value }));
        setIsDirty(true);
        
        // Real-time validation for the changed field
        // We parse the *future* state to get immediate feedback
        const futureValues = { ...values, [field]: value };
        const result = schema.safeParse(futureValues);
        
        if (result.success) {
             setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        } else {
             // Extract error just for this field if it exists
             const fieldError = result.error.issues.find(issue => issue.path[0] === field);
             setErrors((prev) => ({
                 ...prev,
                 [field]: fieldError ? fieldError.message : undefined
             }));
        }
    }, [schema, values]);

    const setValue = useCallback((field: keyof T, value: any) => {
        handleChange(field, value);
    }, [handleChange]);

    const setValues = useCallback((newValues: Partial<T>) => {
        setValuesState((prev) => ({ ...prev, ...newValues }));
        setIsDirty(true);
    }, []);

    const reset = useCallback(() => {
        setValuesState(initialValues);
        setErrors({});
        setIsDirty(false);
    }, [initialValues]);

    // Check basic validity without triggering full re-render with error messages
    const isValid = schema.safeParse(values).success;

    return {
        values,
        errors,
        isDirty,
        isValid,
        handleChange,
        setValue,
        setValues,
        validate,
        reset
    };
};
