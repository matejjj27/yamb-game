import React from "react";
import { DiceRowProps } from "../utils/types";
import { diceDots } from "../utils/constants";

const DiceRow: React.FC<DiceRowProps> = ({
    dice,
    rolls,
    setDice
}) => {
    const handleDiceClick = (id: string) => {
        if (rolls === 0) return;
        setDice((prev) =>
            prev.map((d) => (d.id === id ? { ...d, locked: !d.locked } : d))
        );
    };
    return (
        <div className="dice-row">
            {dice.map((d) => (
                <div
                    key={d.id}
                    className={`die ${d.locked ? "locked" : ""}`}
                    onClick={() => handleDiceClick(d.id)}
                >
                    {[0, 1, 2].map((r) =>
                        [0, 1, 2].map((c) => {
                            const active = diceDots[d.value as keyof typeof diceDots].some(
                                ([dr, dc]) => dr === r && dc === c
                            );
                            return (
                                <div
                                    key={`${r}${c}`}
                                    className={`dot ${active ? "active" : ""}`}
                                />
                            );
                        })
                    )}
                </div>
            ))}
        </div>
    );
};

export default DiceRow;
