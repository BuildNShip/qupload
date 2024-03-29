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
    const [, setUniqueName] = useState<string>("");
    const [fileCodes, setFileCodes] = useState<string[]>([]);
    const [code, setCode] = useState<string | undefined>(undefined);

    const onDrop = (acceptedFiles: File[]) => {
        if (
            files.find((file) =>
                acceptedFiles.map((afile) => afile.name).includes(file.name)
            )
        ) {
            toast.error("File already exists");
            return;
        } else {
            setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
        }
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    useEffect(() => {
        files.forEach(async (file: File) => {
            if (code) {
                await uploadFile(file, code);
                setFileCodes((prevCodes) => [...new Set([...prevCodes, code])]);
                localStorage.setItem(
                    "files",
                    JSON.stringify([...new Set([...fileCodes, code])])
                );
            }
        });

        setFiles([]);
    }, [code]);

    const onSubmit = async () => {
        if (files.length > 0) {
            if (!code) {
                setCode((await getUniqueName(setUniqueName)) as string);
            }
        }
    };

    const handleDownload = async (code: string) => {
        try {
            const links = await listFile(code);

            for (const link of links) {
                downloadFile(link);
            }

            toast.success("Files Downloading...");
        } catch (error: any) {
            toast.error(
                error.response.data.message.general[0] || "Unable to Download"
            );
        }
    };

    useEffect(() => {
        const codes: string[] = JSON.parse(
            localStorage.getItem("files") || "[]"
        );

        if (codes.length > 0) {
            setFileCodes((prevCodes) => [...new Set([...prevCodes, ...codes])]);
        }
    }, []);

    console.log(fileCodes);
    return (
        <>
            <div className={styles.appHeader}>
                <img
                    src="/logo.png"
                    alt="QuickLoad"
                    className={styles.appLogo}
                />
            </div>
            <div className={styles.mainContainer}>
                <motion.img
                    src="unicorn.png"
                    alt="Unicorn"
                    style={{
                        position: "relative",
                        width: "200px",
                        height: "200px",
                    }}
                    animate={{
                        y: [0, -20, 0],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse",
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
                    <AddedFiles
                        files={files}
                        setFiles={setFiles}
                        onSubmit={onSubmit}
                    />
                    {fileCodes.length > 0 && (
                        <div className={styles.appList}>
                            {fileCodes.map((code, index) => (
                                <div className={styles.appListItem}>
                                    <p key={index} className={styles.appURL}>
                                        <a
                                            href={code}
                                            target="_blank"
                                            rel="noreferrer"
                                            className={styles.ellipsis}
                                        >
                                            {code}
                                        </a>
                                    </p>
                                    <button
                                        className={styles.copyButton}
                                        onClick={() => handleDownload(code)}
                                    >
                                        <FaDownload />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default App;
