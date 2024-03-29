import { useState, useEffect } from "react";
import { LocalData } from "../App";

const RemainingTime = ({
    file,
    removeFile,
}: {
    file: LocalData;
    removeFile: (file: LocalData) => void;
}) => {
    const [remainingTime, setRemainingTime] = useState("");

    useEffect(() => {
        const calculateRemainingTime = () => {
            const expirationDate = new Date(file.uploadTime);
            expirationDate.setDate(expirationDate.getDate() + 2);
            const currentDate = new Date();

            // Calculate time difference in milliseconds
            const timeDifference =
                expirationDate.getTime() - currentDate.getTime();

            if (timeDifference < 0) {
                // If expiration date has passed
                setRemainingTime("Expired");
                removeFile(file);
            } else {
                // Convert time difference to days, hours, minutes, and seconds
                const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
                const hours = Math.floor(
                    (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
                );
                const minutes = Math.floor(
                    (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
                );
                const seconds = Math.floor(
                    (timeDifference % (1000 * 60)) / 1000
                );

                if (days > 0) {
                    setRemainingTime(`${days} days, ${hours} hrs`);
                } else if (hours > 0) {
                    setRemainingTime(`${hours} hrs, ${minutes} mins`);
                } else if (minutes > 0) {
                    setRemainingTime(`${minutes} mins, ${seconds} secs`);
                } else {
                    setRemainingTime(`${seconds} secs`);
                }
            }
        };

        calculateRemainingTime();

        // Update remaining time every second
        const interval = setInterval(calculateRemainingTime, 1000);

        return () => clearInterval(interval);
    }, [file.uploadTime]);

    return <div> {remainingTime}</div>;
};

export default RemainingTime;
