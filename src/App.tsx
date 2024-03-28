import styles from "./App.module.css";
import { FaDownload } from "react-icons/fa";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import AddedFiles from "./components/AddedFiles";
import { downloadFile, getUniqueName, listFile, uploadFile } from "./apis/app";

const App = () => {
  const [files, setFiles] = useState<File[]>([]);
  const onDrop = (acceptedFiles: File[]) => {
    console.log("File dropped");

    if (files.find(file => acceptedFiles.map(afile => afile.name).includes(file.name))) {
      toast.error("File already exists");
      return;
    }
    else {
      setFiles(prevFiles => [...prevFiles, ...acceptedFiles]);
    }

  }

  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  const [, setUniqueName] = useState<string>("");
  const [fileCodes, setFileCodes] = useState<string[]>([]);
  const [code, setCode] = useState<string | undefined>(undefined);


  const onSubmit = async () => {
    if (files.length > 0) {
      if (!code) {
        setCode(await getUniqueName(setUniqueName) as string);
      }
      files.forEach(async (file: File) => {
        if (code) {
          await uploadFile(file, code)
          setFileCodes(prevCodes => [...new Set([...prevCodes, code])]);
          localStorage.setItem("files", JSON.stringify([...new Set([...fileCodes, code])]));
        }
      });
    }
  }

  const handleDownload = async (code: string) => {
    try {
      const links = await listFile(code);
      console.log(links)
      for (const link of links) {
        downloadFile(link);
      }

      toast.success('Files Downloading...');
    }
    catch (err) {
      console.error(err);
      toast.error("Unable to Download");
    }
  };

  useEffect(() => {

    const codes: string[] = JSON.parse(localStorage.getItem("files") || "[]")

    if (codes.length > 0) {
      setFileCodes(prevCodes => [...new Set([...prevCodes, ...codes])]);
    }

  }, [])

  console.log(fileCodes)
  return (
    <>
      <div className={styles.appHeader}>
        <img src="/logo.png" alt="QuickLoad" className={styles.appLogo} />
      </div>
      <div className={styles.mainContainer}>
        <motion.img
          src="unicorn.png" // replace 'unicorn.jpg' with your unicorn image path
          alt="Unicorn"
          style={{
            position: "relative",
            width: "200px", // adjust the size of the unicorn as needed
            height: "200px",
          }}
          animate={{
            y: [0, -20, 0], // adjust the y value to control the levitation height
          }}
          transition={{
            duration: 2, // adjust the duration of the levitation
            repeat: Infinity, // makes the animation repeat indefinitely
            repeatType: "reverse", // reverses the animation after each repeat
          }}
        />

        <div
          {...getRootProps({ className: "dropzone" })}
          className={styles.appBody}
        >
          <input {...getInputProps()} />

          <p className={styles.appText}>Drag and Drop Your Files</p>
          <p className={styles.appOr}>or</p>
          <button className={styles.addButton}>Add Your Files</button>
        </div>
        <div className={styles.appLists}>
          <AddedFiles files={files} setFiles={setFiles} onSubmit={onSubmit} />
          {fileCodes.length > 0 &&
            <div className={styles.appList}>
              {fileCodes.map((code, index) => (
                <div className={styles.appListItem}>
                  <p key={index} className={styles.appURL}>
                    <a href={code} target="_blank" rel="noreferrer" className={styles.ellipsis}>{code}</a>
                  </p>
                  <button className={styles.copyButton} onClick={() => handleDownload(code)}>
                    <FaDownload style={{ marginRight: '8px' }} />
                  </button>
                </div>
              ))}
            </div>
          }


        </div>
      </div >
    </>
  );
};

export default App;
