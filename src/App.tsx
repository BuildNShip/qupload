import styles from "./App.module.css";
import { FaFile, FaRegCopy } from "react-icons/fa";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { getUniqueName, uploadFile } from "./apis/app";

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
  const [uniqueNames, setUniqueNames] = useState<string[]>([]);

  useEffect(() => {
    if (files.length <= uniqueNames.length) return;
    getUniqueName(setUniqueNames);
    console.log(uniqueNames);

  }, [files]);

  const onSubmit = () => {
    if (uniqueNames.length > 0) {
      files.forEach((file: File, index: number) => {
        uploadFile(file, uniqueNames[index])
      });
    }
    setFiles([]);
    setUniqueNames([]);
  }

  console.log(files, uniqueNames);


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
          {files.length > 0 && (
            <div className={styles.appFiles}>
              <p>Added Files:</p>
              <ul className={styles.fileListStyles}>
                {files.map((file, index) => (
                  <li key={index} className={styles.fileItemStyles}>
                    <FaFile style={{ marginRight: '8px' }} /> {/* File icon */}
                    {file.name}
                  </li>
                ))}
              </ul>
              <button className={styles.confirmButton} onClick={onSubmit}>Confirm</button>
            </div>
          )}

          <div className={styles.appList}>
            <p className={styles.appURL}>
              <a href="https://www.google.com">https://www.google.com</a>
            </p>
            <button className={styles.copyButton}>
              <FaRegCopy size={15} />
            </button>
          </div>
        </div>
      </div >
    </>
  );
};

export default App;
