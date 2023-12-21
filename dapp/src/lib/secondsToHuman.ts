function secondsToFormattedTime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const dayString = days === 1 ? "day" : "days";
  const formattedTime = `${days} ${dayString}, ${hours} h ${minutes} min ${remainingSeconds} sec`;
  return formattedTime;
}
export default secondsToFormattedTime;
