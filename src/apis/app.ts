import axios from "axios";
import { Dispatch } from "react";
import { toast } from "react-hot-toast";

export const getUniqueName = (
  setUniqueName: Dispatch<React.SetStateAction<string[]>>
) => {
  axios
    .post(`${import.meta.env.VITE_BACKEND_URL}qupload/get-unique-name/`)
    .then((response) => {
      console.log(response.data);
      setUniqueName((prevNames) => [...prevNames, response.data.response.unique_code]);
    })
    .catch((error) => {
      console.error(error);
    });
};

export const uploadFile = (acceptedFile: File, uniqueName: string) => {
  const formData = new FormData();
  formData.append("file", acceptedFile);
  formData.append("unique_name", uniqueName);
  const loader = toast.loading("Uploading...");
  axios
    .post(`${import.meta.env.VITE_BACKEND_URL}qupload/files/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      console.log(response.data);
      toast.success(response.data.message.general);
    })
    .catch((error) => {
      console.error(error);
      toast.error(error);
    }).finally(() => {
      toast.dismiss(loader);
    });
};
