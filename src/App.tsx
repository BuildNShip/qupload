import styles from "./App.module.css";
import { FaRegCopy } from "react-icons/fa";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import AddedFiles from "./components/AddedFiles";
import { getUniqueName, listFile, uploadFile } from "./apis/app";

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
  const [fileLinks, setFileLinks] = useState<string[]>([]);

  const onSubmit = () => {
    if (files.length > 0) {
      files.forEach(async (file: File) => {
        console.log(fileLinks, file.name);
        if (fileLinks.some(link => link.includes((file.name)))) {
          toast.error("File Link already exists");
          return;
        }
        const code = await getUniqueName(setUniqueNames);
        if (code) {
          await uploadFile(file, code)
          console.log("File uploaded successfully");
          const link = await listFile(code);
          localStorage.setItem("files", JSON.stringify([...fileLinks, link]));
          setFileLinks(prevLinks => [...prevLinks, link]);
        }
      });
    }
  }

  useEffect(() => {
    if (fileLinks.length != 0) {
      setFileLinks([]);
      JSON.parse(localStorage.getItem("files") || "[]")
        .forEach((link: string) => setFileLinks(prevLinks => [...prevLinks, link]));
    }

  }, [])

  const handleCopy = async (textToCopy: string) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      toast.success('Text copied to clipboard');
    } catch (err) {
      toast.error('Failed to copy text');
    }
  };

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
          <AddedFiles files={files} setFiles={setFiles} onSubmit={onSubmit} />
          {fileLinks.length > 0 &&
            <div className={styles.appList}>
              {fileLinks.map((link, index) => (
                <div className={styles.appListItem}>
                  <p key={index} className={styles.appURL}>
                    <a href={link} target="_blank" rel="noreferrer" className={styles.ellipsis}>{link}</a>
                  </p>
                  <button className={styles.copyButton} onClick={() => handleCopy(link)}>
                    <FaRegCopy style={{ marginRight: '8px' }} />
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
