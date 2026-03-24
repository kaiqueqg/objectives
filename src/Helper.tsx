export const clamp = (value: number|null|undefined, min: number, max: number, def?: number) => {
  if(value == null || Number.isNaN(value)) return def??min;
  return Math.max(min, Math.min(value, max));
}