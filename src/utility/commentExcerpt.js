export default function commentExcerpt(comment) {
  const commentLength = comment.split(" ");
  if (commentLength.length > 8) {
    return [true, commentLength.slice(0, 9).join(" ")];
  }
  return [false, comment];
}
