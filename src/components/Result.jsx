import PropTypes from "prop-types";
import { useEffect, useRef } from "react";

const Result = ({ payouts }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [payouts]);
  const totalPayout = payouts.reduce((total, payout) => total + payout, 0);
  const RTP = payouts.length > 0 ? (totalPayout / payouts.length).toFixed(2) : "0.00";
  

  return (
    <div className="result-container">
      <h2>Win History</h2>
      <div className="scrollable-list" ref={scrollRef}>
        <ul>
          {payouts
            .filter((payout) => payout > 0)
            .map((payout, index) => (
              <li key={index}>
                Win {index + 1}: {payout}
              </li>
            ))}
        </ul>
      </div>
      <h3>RTP: {RTP}</h3>
    </div>
  );
};

Result.propTypes = {
  payouts: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default Result;
