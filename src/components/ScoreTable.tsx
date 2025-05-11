import React from "react";
import { ScoreTableProps } from "../utils/types";
import { COLUMNS, ROWS } from "../utils/constants";

const ScoreTable: React.FC<ScoreTableProps> = ({
  totals,
  scoreTable,
  currentPlayerIndex,
  handleCellClick,
}) => {
  return (
    <div className="table-container">
      <table className="score-table">
        <thead>
          <tr>
            <th className="no-border"></th>
            {COLUMNS.map((c, i) => (
              <th key={i} className="no-border">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((label, rowIdx) => (
            <tr key={rowIdx} className={label === "" ? "empty-row" : ""}>
              <td className={label === "" ? "" : "no-border label"}>{label}</td>
              {label === ""
                ? COLUMNS.map((_, i) => (
                    <td key={i} className="total">
                      <strong>
                        {rowIdx === 6
                          ? totals[currentPlayerIndex].top[i]
                          : rowIdx === 9
                            ? totals[currentPlayerIndex].mid[i]
                            : rowIdx === 14
                              ? totals[currentPlayerIndex].bottom[i]
                              : ""}
                      </strong>
                    </td>
                  ))
                : COLUMNS.map((_, colIdx) => (
                    <td
                      key={colIdx}
                      className={`clickable ${label === "" ? "no-border" : ""}`}
                      onClick={() => handleCellClick(rowIdx, colIdx)}
                    >
                      {label !== ""
                        ? (scoreTable[currentPlayerIndex][rowIdx][colIdx] ?? "")
                        : ""}
                    </td>
                  ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScoreTable;
