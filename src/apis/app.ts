import axios from "axios";
import { Dispatch } from "react";
import { toast } from "react-hot-toast";

export const getUniqueName = (
  setUniqueNames: Dispatch<React.SetStateAction<string>>
): Promise<string | undefined> => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}qupload/get-unique-name/`)
      .then((response) => {
        console.log(response.data);
        setUniqueNames(response.data.response.unique_code);
        resolve(response.data.response.unique_code);
      })
      .catch((error) => {
        console.error(error);
        reject(error);
      })
  }
  )
};

export const uploadFile = (acceptedFile: File, uniqueName: string): Promise<void> => {
  return new Promise((resolve, reject) => {
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
        resolve();
      })
      .catch((error) => {
        console.error(error);
        toast.error(error);
        reject(error);
      })
      .finally(() => {
        toast.dismiss(loader);
      });
  });
};

export const listFile = (uniqueName: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}qupload/files/${uniqueName}`)
      .then((response) => {
        resolve(response.data.response.files);
      })
      .catch((error) => {
        reject(error);
      });
  })
}

export const downloadFile = (link: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    fetch(link, { mode: 'no-cors', method: 'GET' })
      .then(async (response) => {
        const url = URL.createObjectURL(await response.blob());
        const a = document.createElement("a");
        a.href = url;
        a.download = link.substring(link.lastIndexOf("/") + 1);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  })
}