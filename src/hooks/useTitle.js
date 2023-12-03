// import { useEffect, useRef } from "react";

// const useChangeTitle = (inputTitle) => {
//   const documentDefined = typeof document !== "undefined";
//   const originalTitle = useRef(documentDefined ? document.title : null);
//   useEffect(() => {
//     if (!documentDefined) return;
//     if (document.title !== inputTitle) document.title = inputTitle;
//     const title = originalTitle.current;
//     return () => {
//       document.title = title;
//     };
//   }, [inputTitle, documentDefined]);
// };

const useTitle = () => {
  return (inputTitle) => {
    document.title = inputTitle || "DevMingle - A MERN stack forum";
  };
};

export default useTitle;
