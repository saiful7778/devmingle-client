const getPostTime = (inputTime) => {
  const postTime = new Date(inputTime);
  return postTime.toLocaleTimeString("en-US", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
};
export default getPostTime;
