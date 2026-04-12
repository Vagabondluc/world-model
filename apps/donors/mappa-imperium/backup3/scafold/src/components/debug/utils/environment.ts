export const isGoogleCloudRun = (): boolean => {
  return (
    window.location.hostname.includes('.run.app') ||
    window.location.hostname.includes('cloudrun') ||
    window.location.hostname.includes('.goog') ||
    (typeof process !== 'undefined' && process.env.PORT && process.env.PORT !== '3000') ||
    (typeof process !== 'undefined' && process.env.NODE_ENV === 'production')
  );
};

export const getEnvironment = (): 'cloud-run' | 'development' => {
  return isGoogleCloudRun() ? 'cloud-run' : 'development';
};