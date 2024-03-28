
import styles from './AddedFiles.module.css'
import { FaFile, FaTrash } from 'react-icons/fa'
type Props = {
    files: File[],
    setFiles: React.Dispatch<React.SetStateAction<File[]>>,
    onSubmit: () => void
}

const AddedFiles = ({ files, setFiles, onSubmit }: Props) => {
    return (
        <>
            {files.length > 0 && (
                <div className={styles.appFiles}>
                    <p>Added Files:</p>
                    <ul className={styles.fileListStyles}>
                        {files.map((file, index) => (
                            <li key={index} className={styles.fileItemStyles}>
                                <FaFile style={{ marginRight: '8px' }} />
                                {file.name}
                                <button className={styles.closeIcon} onClick={() => setFiles(prevFiles => prevFiles.filter((_, i) => i !== index))}>
                                    <FaTrash />
                                </button>
                            </li>

                        ))}
                    </ul>
                    <button className={styles.confirmButton} onClick={onSubmit}>Confirm</button>
                </div>
            )}
        </>
    )
}

export default AddedFiles