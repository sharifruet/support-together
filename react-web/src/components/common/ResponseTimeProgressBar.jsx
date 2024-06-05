import React from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';

const ResponseTimeProgressBar = ({ createdAt, assignedTime, priority }) => {
    const sslTimeAllowed = {
        P1: 30,
        P2: 60,
        P3: 90,
        P4: 120,
        P5: 150,
    }
    return (

        <>
            <ProgressBar>
                <ProgressBar striped variant="success" now={35} key={1} />
                <ProgressBar variant="warning" now={20} key={2} />
                <ProgressBar striped variant="danger" now={10} key={3} />
            </ProgressBar>
        </>
    )
}

export default ResponseTimeProgressBar;
