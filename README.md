# 🎲 Yamb Game

A modern, offline **Yamb** (Yamb Game / Yahtzee variant) made with **React** and **TypeScript**.

Minimalistic, mobile-friendly, and fun to play with friends (pass & play style)!

---

## 🚀 Live Demo

> [Coming Soon...](#)

---

## 🛠 Tech Stack

- React
- TypeScript
- Context API
- Vite
- CSS (Custom Modern Styling)

---

## 🎮 How to Play

✅ Each player rolls the dice up to **3 times** per turn.

✅ After rolling, a player must choose:
- **Which dice to keep ("lock")** and roll the rest again.
- Or **lock in** a value into a free cell in the table.

✅ You can **only lock a cell** if:
- You **just rolled all 5 dice at once** in the previous roll.
- Or after your **last roll** (0 rolls left) if **all dice are rolled**.

✅ The 4th column (⭐ column) is **special**: you can only fill it if you rolled all 5 dice at once.

✅ Sections:
- Upper Section (Ones, Twos, Threes, Fours, Fives, Sixes)
- Middle Section (Max, Min, Straight, Full House)
- Lower Section (Poker, Yamb)

✅ Try to maximize your total score!

---

## 📋 Game Rules (Full)

<details>
<summary>Click to expand</summary>

- **Rolling**: Each player rolls the dice up to **three times**.
- **Locking Dice**: After each roll, players may **lock dice** to keep their current value and roll the remaining dice again.
- **Scoring**: After their turn, players must **lock a score into a free cell**.
- **Columns**:
  - Column 1: Must be filled **top-to-bottom**.
  - Column 2: Must be filled **bottom-to-top**.
  - Column 3: Fill in **any order**.
  - Column 4 (⭐): Special – only fill if you rolled **all 5 dice at once**.
- **Bonuses**:
  - If the sum of Upper Section scores exceeds a threshold, bonus points are awarded.
  - "Yamb" (Five of a kind) yields high points!
- **End of Game**: When all cells are filled, the player with the highest total wins.
</details>

---

## 📸 Screenshots

> _Coming soon..._

---

## ⚙️ Installation

1. Clone the repository
   ```bash
   git clone https://github.com/matejjj27/yamb-game.git
   cd yamb-game

2. Install dependencies
    ```bash
   npm install

3. Run the app locally
    ```bash
   npm run dev


📈 Roadmap

✅ Minimalistic modern design

✅ Special ⭐ column logic

-  Save game state in local storage

-  Multiplayer over network (future!)

-  Sound effects and animations (future!)


💬 Feedback

Got ideas or suggestions?
Feel free to open an issue or a pull request!

👨‍💻 Author

    GitHub: matejjj27


⭐ Star this project if you like it! ⭐