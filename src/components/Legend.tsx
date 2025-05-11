import React from "react";

const Legend: React.FC = () => {
    return (
        <section className="info-panel">
            <details className="rules">
                <summary>📜 Game Rules</summary>
                <div className="rules-content">
                    <p>Yamb is a dice game similar to Yahtzee, played with 5 dice and a score sheet. Each player takes turns rolling the dice up to 3 times to achieve combinations and fill in cells in different columns.</p>
                    <ul>
                        <li>🎲 Each turn consists of up to 3 rolls.</li>
                        <li>📝 After rolling, the player must fill in one cell in the column that's currently editable.</li>
                        <li>⭐ The Special column allows writing in it only when the player rolled all 5 dice on the previous roll or after locking in a cell using the lock button also after rolling all 5 dice at once.</li>
                        <li>⬇️ Column must be filled top to bottom, no skipping.</li>
                        <li>⬆️ Column must be filled bottom to top.</li>
                        <li>⬇️⬆️ (Free column) can be filled in any order.</li>
                        <li>Bonus of 30 points if the upper section total reaches 60+.</li>
                        <li>Game ends when all players fill every cell.</li>
                        <li>🏆 Player with the highest total score wins.</li>
                    </ul>
                </div>
            </details>

            <div className="legend">
                <h3>📌 Legend</h3>
                <ul>
                    <li>⬇️: Top to bottom</li>
                    <li>⬆️: Bottom to top</li>
                    <li>⬇️⬆️: Free column</li>
                    <li>⭐: Special column</li>
                    <li>S: Straight</li>
                    <li>F: Full House</li>
                    <li>P: Poker</li>
                    <li>Y: Yamb</li>
                </ul>
            </div>
        </section>
    );
};

export default Legend;
