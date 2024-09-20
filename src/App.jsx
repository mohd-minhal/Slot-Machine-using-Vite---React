import "./App.css";
import { useState } from "react";
import SlotMachine from "./components/reel";
import Result from "./components/Result";

function App() {
  const [payouts, setPayouts] = useState([]);

  const handlePayoutUpdate = (newPayout) => {
    setPayouts((prevPayouts) => [...prevPayouts, newPayout]);
  };

  const totalPayout = payouts.reduce((total, payout) => total + payout, 0);
  const totalJackpot = payouts.filter(payout => payout === 500).length;

  return (
    <div>
      <h1>Slot Machine</h1>
      <div className="flex-container">
        <SlotMachine onPayoutChange={handlePayoutUpdate} />
        <Result payouts={payouts} />
      </div>
      <h2>Total Payout: {totalPayout}$</h2>
      <h2>Total Jackpot: {totalJackpot}</h2>

    </div>
  );
}

export default App;
