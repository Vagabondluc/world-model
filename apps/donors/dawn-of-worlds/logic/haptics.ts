export type HapticType = 'tap' | 'confirm' | 'reject' | 'turn';

export function triggerHaptic(type: HapticType) {
  if (!("vibrate" in navigator)) return;

  switch (type) {
    case 'tap':
      navigator.vibrate(10);
      break;
    case 'confirm':
      navigator.vibrate([20, 30, 20]);
      break;
    case 'reject':
      navigator.vibrate([40, 40, 40]);
      break;
    case 'turn':
      navigator.vibrate([10, 10, 10, 10]);
      break;
  }
}