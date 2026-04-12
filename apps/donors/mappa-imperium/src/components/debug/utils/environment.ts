export const isGoogleCloudRun = (): boolean => {
  return (
    window.location.hostname.includes('.run.app') ||
    window.location.hostname.includes('cloudrun') ||
    window.location.hostname.includes('.goog')
  );
};

export const getEnvironment = (): 'cloud-run' | 'development' => {
  return isGoogleCloudRun() ? 'cloud-run' : 'development';
};