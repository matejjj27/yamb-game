import React from "react";
import { ScoreTableProps } from "../utils/types";
import { COLUMNS, ROWS } from "../utils/constants";

const ScoreTable: React.FC<ScoreTableProps> = ({
  totals,
  scoreTable,
  currentPlayerIndex,
  lockedStarCell,
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
                ? COLUMNS.map((_, colIdx) => (
                    <td key={colIdx} className="total">
                      <strong>
                        {rowIdx === 6
                          ? totals[currentPlayerIndex].top[colIdx]
                          : rowIdx === 9
                            ? totals[currentPlayerIndex].mid[colIdx]
                            : rowIdx === 14
                              ? totals[currentPlayerIndex].bottom[colIdx]
                              : ""}
                      </strong>
                    </td>
                  ))
                : COLUMNS.map((_, colIdx) => {
                    const isLocked =
                      lockedStarCell?.rowId === rowIdx &&
                      lockedStarCell?.colId === colIdx;
                    return (
                      <td
                        key={colIdx}
                        className={`clickable ${label === "" ? "no-border" : ""}`}
                        onClick={() => handleCellClick(rowIdx, colIdx)}
                        style={{
                          backgroundColor: isLocked ? "#8BC34A" : "",
                        }}
                      >
                        {label !== ""
                          ? (scoreTable[currentPlayerIndex][rowIdx][colIdx] ??
                            "")
                          : ""}
                      </td>
                    );
                  })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScoreTable;
