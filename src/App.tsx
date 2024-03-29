import styles from "./App.module.css";
import { FaDownload, FaGithub, FaInstagram, FaTelegram, FaTwitter } from "react-icons/fa";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import AddedFiles from "./components/AddedFiles";
import { downloadFiles, getUniqueName, listFile, uploadFile } from "./apis/app";
import RemainingTime from "./components/RemainingTime";

export type LocalData = {
    code: string;
    totalFiles: number;
    uploadTime: Date;
};

const App = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [, setUniqueName] = useState<string>("");
    const [fileCodes, setFileCodes] = useState<LocalData[]>([]);
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

    const removeFile = (file: LocalData) => {
        const newFiles = fileCodes.filter((f) => f.code !== file.code);
        setFileCodes(newFiles);
        localStorage.setItem("files", JSON.stringify(newFiles));
    };

    useEffect(() => {
        files.forEach(async (file: File) => {
            if (code) {
                await uploadFile(file, code);
            }
        });

        if (!code) return;

        let localData = {
            code: code,
            totalFiles: files.length,
            uploadTime: new Date(),
        };

        setFileCodes((prevCodes) => [...new Set([...prevCodes, localData])]);

        localStorage.setItem(
            "files",
            JSON.stringify([...new Set([...fileCodes, localData])])
        );

        setFiles([]);
        setCode(undefined);
    }, [code]);

    const onSubmit = async () => {
        if (files.length > 0) {
            if (!code) {
                setCode((await getUniqueName(setUniqueName)) as string);
            }
        } else {
            toast.error("Please select a file to upload");
        }
    };

    const handleDownload = async (code: string) => {
        try {
            const links = await listFile(code);

            for (const link of links) {
                downloadFiles(link);
            }

            toast.success("Files Downloading...");
        } catch (error: any) {
            toast.error(
                error.response.data.message.general[0] || "Unable to Download"
            );
        }
    };

    useEffect(() => {
        const codes: LocalData[] = JSON.parse(
            localStorage.getItem("files") || "[]"
        );

        setFileCodes(codes);
    }, []);

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
                    <p className={styles.appTagline}>
                        We only files for duration of 2 days, kindly make sure
                        that your usecase is within the limit
                    </p>
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
                            {fileCodes.map((file, index) => (
                                <div className={styles.appListItem}>
                                    <p key={index} className={styles.appURL}>
                                        <a
                                            href={file.code}
                                            target="_blank"
                                            rel="noreferrer"
                                            className={styles.ellipsis}
                                        >
                                            {file.code}
                                        </a>
                                    </p>

                                    <div className={styles.actions}>
                                        <p className={styles.totalFiles}>
                                            {file.totalFiles} Files
                                        </p>

                                        <p className={styles.timeLeft}>
                                            <RemainingTime
                                                file={file}
                                                removeFile={removeFile}
                                            />
                                        </p>

                                        <button
                                            className={styles.copyButton}
                                            onClick={() =>
                                                handleDownload(file.code)
                                            }
                                        >
                                            <FaDownload />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div className={styles.footer}>
                <a href="https://buildnship.in/">
                    <img src="/buildnship.png" alt="logo" />
                </a>
                <div className={styles.social_container}>
                    <a href="https://twitter.com/buildnship/">
                        <FaTwitter size={25} color="#8095ff" />
                    </a>
                    <a href="https://instagram.com/buildnship?igshid=YmMyMTA2M2Y=">
                        <FaInstagram size={25} color="#8095ff" />
                    </a>
                    <a href="https://github.com/BuildNShip">
                        <FaGithub size={25} color="#8095ff" />
                    </a>
                    <a href="https://t.me/buildnship">
                        <FaTelegram size={25} color="#8095ff" />
                    </a>
                </div>
            </div>
        </>
    );
};

export default App;
