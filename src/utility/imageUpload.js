import axios from "axios";
import Swal from "sweetalert2";

export default async function imageUpload(imageData) {
  try {
    const formData = new FormData();
    formData.set("key", import.meta.env.VITE_IMGBB_API);
    formData.append("image", imageData);

    const {
      data: {
        data: { url },
      },
    } = await axios.post("https://api.imgbb.com/1/upload", formData);

    return url;
  } catch {
    Swal.fire({
      icon: "error",
      text: "An error occurred",
    });
    return false;
  }
}
