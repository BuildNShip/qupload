import axios from "axios";
import { Dispatch } from "react";

export const getUniqueName = (
  setUniqueName: Dispatch<React.SetStateAction<string>>
) => {
  axios
    .post(`${import.meta.env.VITE_BACKEND_URL}qupload/get-unique-name/`)
    .then((response) => {
      console.log(response.data);
      setUniqueName(response.data.response);
    })
    .catch((error) => {
      console.error(error);
    });
};

export const uploadFile = (acceptedFile: File, uniqueName: string) => {
  const formData = new FormData();
  formData.append("file", acceptedFile);
  formData.append("unique_name", uniqueName);
  axios
    .post(`${import.meta.env.VITE_BACKEND_URL}qupload/files/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
};
