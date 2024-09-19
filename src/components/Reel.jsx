import { useState, useEffect, useRef } from "react";

const symbolFrequencies = {
  "🍒": 5,
  "🍋": 4,
  "🍊": 3,
  "🍉": 3,
  "🍇": 2,
  "⭐": 1,
};

const symbolValues = {
  "🍒": 10,
  "🍋": 20,
  "🍊": 30,
  "🍉": 40,
  "🍇": 50,
  "⭐": 100,
};

const transitionDelay = 300;

const SlotMachine = () => {
  const [spun, setSpun] = useState(false);
  const [spinAmount, setSpinAmount] = useState("");
  const slotsRef = useRef([]);

  useEffect(() => {
    generate();
  }, []);

  const createSymbolElement = (symbol) => {
    const div = document.createElement("div");
    div.className = "symbol";
    div.textContent = symbol;
    return div;
  };

  const getRandomSymbol = () => {
    const symbols = Object.keys(symbolFrequencies);
    const weights = symbols.map((symbol) => symbolFrequencies[symbol]);
    const totalWeight = weights.reduce((acc, weight) => acc + weight, 0);
    let random = Math.random() * totalWeight;

    for (let i = 0; i < symbols.length; i++) {
      if (random < weights[i]) return symbols[i];
      random -= weights[i];
    }
  };

  const generate = () => {
    slotsRef.current.forEach((slot, index) => {
      const symbols = slot.querySelector(".symbols");
      symbols.innerHTML = "";
      for (let i = 0; i < 6; i++) {
        symbols.appendChild(createSymbolElement(getRandomSymbol()));
      }
      symbols.style.transitionDelay = `${transitionDelay * index}ms`;
    });
  };

  const spin = () => {
    return new Promise((resolve) => {
      if (spun) {
        reset();
      }
      let completedSlots = 0;

      const handleTransitionEnd = () => {
        completedSlots++;
        if (completedSlots === slotsRef.current.length) {
          checkWin();
          setSpun(true);
          resolve();
        }
      };

      slotsRef.current.forEach((slot) => {
        const symbols = slot.querySelector(".symbols");
        const symbolHeight = symbols.querySelector(".symbol")?.clientHeight;
        const symbolCount = symbols.childElementCount;

        if (!symbolHeight) return;
        const randomOffset = -(symbolCount - 3) * symbolHeight;
        symbols.style.top = `${randomOffset}px`;

        symbols.addEventListener("transitionend", handleTransitionEnd, {
          once: true,
        });
      });
    });
  };

  const reset = () => {
    slotsRef.current.forEach((slot) => {
      const symbols = slot.querySelector(".symbols");
      symbols.style.transition = "none";
      symbols.style.top = "0";
      symbols.offsetHeight; // Trigger reflow
      symbols.style.transition = "";
    });
    generate();
  };

  const autoSpin = async () => {
    const amount = parseInt(spinAmount, 10);
    if (amount) {
      setSpun(false);
      for (let i = 0; i < amount; i++) {
        await spin();
        await new Promise((resolve) =>
          setTimeout(resolve, transitionDelay * slotsRef.current.length)
        );
      }
    } else {
      alert("Please enter a valid number");
    }
  };

  const checkWin = () => {
    const displayedSymbols = [[], [], []];

    slotsRef.current.forEach((slot, index) => {
      const symbols = slot.querySelector(".symbols");
      const symbolArray = Array.from(symbols.textContent);
      displayedSymbols[index] = symbolArray.slice(-3);
    });

    const middleRowSymbols = [
      displayedSymbols[0][1],
      displayedSymbols[1][1],
      displayedSymbols[2][1],
    ];

    if (middleRowSymbols.every((symbol) => symbol === "⭐")) {
      // Jackpot win
    } else if (middleRowSymbols.every((symbol) => symbol === middleRowSymbols[0])) {
      const winningSymbol = middleRowSymbols[0];
      const symbolValue = symbolValues[winningSymbol];
      const payout = symbolValue;
    }
  };

  return (
    <div className="container">
      <div className="slot-container">
        {Array.from({ length: 3 }, (_, index) => (
          <div
            className="slot"
            key={index}
            ref={(el) => (slotsRef.current[index] = el)}
          >
            <div className="symbols" id={`slot${index + 1}Symbols`}></div>
            <div className="lever-container">
              <div className="lever-tip"></div>
              <div className="lever"></div>
            </div>
          </div>
        ))}
        <div className="controls">
          <button onClick={spin}>Spin</button>
          <button onClick={reset}>Reset</button>
          <hr className="divider-hr" />
          <input
            className="spin-amount"
            type="number"
            value={spinAmount}
            onChange={(e) => setSpinAmount(e.target.value)}
            placeholder="e.g. 25"
          />
          <button onClick={autoSpin}>Auto</button>
        </div>
      </div>
    </div>
  );
};

export default SlotMachine;
