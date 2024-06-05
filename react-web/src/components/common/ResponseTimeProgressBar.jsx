import React, { useEffect, useState } from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';
import moment from 'moment';

const ResponseTimeProgressBar = ({ createdAt, updatedAt, priority, responseStatus }) => {
    const sslTimeAllowed = {
        P1: 180,
        P2: 220,
        P3: 260,
        P4: 310,
        P5: 400,
    };

    const assignedTimeAllowed = {
        P1: 120,
        P2: 160,
        P3: 200,
        P4: 220,
        P5: 350,
    };

    const [progress, setProgress] = useState({
        assignedProgress: 0,
        sslProgress: 0,
        overageProgress: 0
    });

    useEffect(() => {
        const calculateProgress = () => {
            const now = moment();
            const createdDate = moment(createdAt);
            const endDate = (responseStatus === "Closed" || responseStatus === "Resolved") ? moment(updatedAt) : now;
            const timeTakenToComplete = endDate.diff(createdDate, 'minutes');

            const sslAllowedTime = sslTimeAllowed[priority];
            const assignedTime = assignedTimeAllowed[priority];
            const totalAllowedTime = assignedTime + sslAllowedTime;

            // Determine the segments for the progress bar
            const withinAssignedTime = Math.min(timeTakenToComplete, assignedTime);
            const withinSslTime = Math.min(Math.max(0, timeTakenToComplete - assignedTime), sslAllowedTime);
            const overageTime = Math.max(0, timeTakenToComplete - totalAllowedTime);

            // Calculate the percentages for the progress bar
            const assignedProgress = (withinAssignedTime / totalAllowedTime) * 100;
            const sslProgress = (withinSslTime / totalAllowedTime) * 100;
            const overageProgress = (overageTime / totalAllowedTime) * 100;

            setProgress({
                assignedProgress,
                sslProgress,
                overageProgress
            });
        };

        calculateProgress();
    }, [createdAt, updatedAt, priority, responseStatus]);

    return (
        <ProgressBar>
            <ProgressBar striped variant="success" now={progress.assignedProgress} key={1} />
            <ProgressBar striped variant="warning" now={progress.sslProgress} key={2} />
            <ProgressBar striped variant="danger" now={progress.overageProgress} key={3} />
        </ProgressBar>
    );
};

export default ResponseTimeProgressBar;
