export const calculateLogisticsCost = (distance: number, weight: number) => {
  // Simple mock logic: $2 per km + $1 per kg
  const baseRate = 2;
  const weightRate = 1;
  return (distance * baseRate) + (weight * weightRate);
};
