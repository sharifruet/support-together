import React, { useState, useRef, useEffect } from 'react';
import moment from 'moment';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const DeadlineLimit = ({ createdAt, deadline }) => {
    const [timeLeft, setTimeLeft] = useState('');
    const [progress, setProgress] = useState(0);
    const [urgency, setUrgency] = useState('low'); // State for urgency
    const [progressBarUrgency, setProgressBarUrgency] = useState('progress-bar-low'); // State for urgency
    const intervalRef = useRef(null);

    useEffect(() => {
        const updateDeadline = () => {
            if (!createdAt || !deadline) return; // Handle missing props

            const now = moment();
            const createdDate = moment(createdAt);
            const deadlineDate = moment(deadline);

            if (!createdDate.isValid() || !deadlineDate.isValid()) return; // Handle invalid dates

            const diff = deadlineDate.diff(now);
            const totalDuration = deadlineDate.diff(createdDate);

            if (diff <= 0) {
                // Deadline passed
                const passedTime = moment.duration(now.diff(deadlineDate));
                const hours = Math.floor(passedTime.asHours());
                const minutes = passedTime.minutes();
                const formattedPassedTime = `${hours > 0 ? `${hours} hour${hours > 1 ? 's' : ''} ` : ''}${minutes > 0 ? `${minutes} minute${minutes > 1 ? 's' : ''}` : ''}` || 'less than a minute';

                setTimeLeft(`Your deadline was ${deadlineDate.format('MMMM Do, YYYY, h:mm a')} and it has passed by ${formattedPassedTime}`);
                setUrgency('high');
                setProgressBarUrgency('progress-bar-high-c')
                return;
            }

            // Calculate remaining time and progress
            const remainingTime = moment.duration(diff);
            const elapsedDuration = moment.duration(now.diff(createdDate));

            const progressValue = elapsedDuration.asMilliseconds() / totalDuration;
            setProgress(progressValue);

            const days = Math.floor(remainingTime.asDays());
            const hours = remainingTime.hours();
            const minutes = remainingTime.minutes();

            const formattedTimeLeft = `${days > 0 ? `${days} day${days > 1 ? 's' : ''} ` : ''}${hours > 0 ? `${hours} hr${hours > 1 ? 's' : ''} ` : ''}${minutes > 0 ? `${minutes} min` : ''}` || 'less than a minute';

            setTimeLeft(formattedTimeLeft || 'You have time remaining to complete the task');

            // Update urgency for time
            if (diff < moment.duration(45, 'minutes')) {
                setUrgency('high');
                setProgressBarUrgency('progress-bar-high-c')
            } else if (diff < moment.duration(30, 'minutes')) {
                setUrgency('medium');
                setProgressBarUrgency('progress-bar-medium-c')
            } else {
                setUrgency('low');
                setProgressBarUrgency('progress-bar-low-c')
            }
        };

        // Initial update and start interval
        updateDeadline();
        intervalRef.current = setInterval(updateDeadline, 1000);

        return () => clearInterval(intervalRef.current); // Cleanup on unmount
    }, [createdAt, deadline]);

    return (
        <OverlayTrigger overlay={<Tooltip>
            <span className={`deadline-limit ${urgency}`}>{timeLeft}</span>
        </Tooltip>}
        >
            <div className="deadline-limit-container">
                {/* <span className={`deadline-limit ${urgency}`}>{timeLeft}</span> */}
                <div className="progress-bar-container">
                    <div className={`${progressBarUrgency}`} style={{ width: `${progress === 0 ? 1 * 100 : progress * 100}%` }}></div>
                </div>
            </div>
        </OverlayTrigger>
    );
};

export default DeadlineLimit;
