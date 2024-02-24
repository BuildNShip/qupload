import styles from "./App.module.css";
import { FaRegCopy } from "react-icons/fa";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";

const App = () => {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();
  const files = acceptedFiles.map((file) => (
    <li key={file.name}>
      {file.name} - {file.size} bytes
    </li>
  ));

  console.log(files);

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
          <button className={styles.addButton}>Add Your Files</button>
        </div>
        <div className={styles.appLists}>
          <div className={styles.appList}>
            <p className={styles.appURL}>
              <a href="https://www.google.com">https://www.google.com</a>
            </p>
            <button className={styles.copyButton}>
              <FaRegCopy size={15} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
