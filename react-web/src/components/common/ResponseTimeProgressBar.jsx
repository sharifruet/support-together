import React, { useEffect, useState } from 'react';
import moment from 'moment';

const DOT_COUNT = 7;

// Colors from green (first) to red (last 2): nice green → gradual → red
const DOT_COLORS = [
  '#22c55e', // green
  '#4ade80', // light green
  '#a3e635', // lime
  '#facc15', // yellow/amber
  '#f97316', // orange (between 3 and 5)
  '#ef4444', // red
  '#dc2626', // dark red
];

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

  const [filledUpTo, setFilledUpTo] = useState(-1);

  useEffect(() => {
    const calculateProgress = () => {
      const now = moment();
      const createdDate = moment(createdAt);
      const endDate = (responseStatus === 'Closed' || responseStatus === 'Resolved') ? moment(updatedAt) : now;
      const timeTakenToComplete = endDate.diff(createdDate, 'minutes');

      const sslAllowed = sslTimeAllowed[priority] ?? 300;
      const assignedTime = assignedTimeAllowed[priority] ?? 200;
      const totalAllowed = assignedTime + sslAllowed;

      const SIX_HOURS_MINUTES = 6 * 60;
      const TWENTY_FOUR_HOURS_MINUTES = 24 * 60;

      // Threshold-based dots (filledUpTo is 0-based; "show N dots" = filledUpTo === N - 1)
      // User: > totalAllowed+24h → 7 dots; > totalAllowed+6h → 6 dots; > totalAllowed → 5 dots;
      //       > sslAllowed/2 → 1 dot; > sslAllowed → 2 dots; and so on.
      let dotIndex;
      if (timeTakenToComplete > totalAllowed + TWENTY_FOUR_HOURS_MINUTES) {
        dotIndex = 6; // show all 7 dots
      } else if (timeTakenToComplete > totalAllowed + SIX_HOURS_MINUTES) {
        dotIndex = 5; // show 6 dots
      } else if (timeTakenToComplete > totalAllowed) {
        dotIndex = 4; // show 5 dots
      } else if (timeTakenToComplete > sslAllowed + (assignedTime * 3) / 4) {
        dotIndex = 3; // show 4 dots
      } else if (timeTakenToComplete > sslAllowed + assignedTime / 2) {
        dotIndex = 2; // show 3 dots
      } else if (timeTakenToComplete > sslAllowed) {
        dotIndex = 1; // show 2 dots
      } else if (timeTakenToComplete > sslAllowed / 2) {
        dotIndex = 0; // show 1 dot
      } else {
        dotIndex = -1; // show 0 dots (timeTakenToComplete <= sslAllowed/2)
      }

      setFilledUpTo(dotIndex);
    };

    calculateProgress();
  }, [createdAt, updatedAt, priority, responseStatus]);

  return (
    <div
      className="d-flex align-items-center gap-1"
      style={{ marginTop: '4px' }}
      title="Response time progress"
    >
      {Array.from({ length: DOT_COUNT }, (_, i) => {
        const isFilled = i <= filledUpTo;
        const color = DOT_COLORS[i];
        return (
          <span
            key={i}
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: isFilled ? color : '#e5e7eb',
              border: `2px solid ${isFilled ? color : '#d1d5db'}`,
              transition: 'background-color 0.2s, border-color 0.2s',
            }}
            aria-hidden
          />
        );
      })}
    </div>
  );
};

export default ResponseTimeProgressBar;
