import HistoryData from "interfaces/HistoryData";
import React, { useEffect, useMemo, useState } from "react";
import { Button, Table } from "reactstrap";

const History = () => {
  const [history, setHistory] = useState<HistoryData[]>([]);

  useEffect(() => {
    setHistory(
      localStorage.getItem("history")
        ? JSON.parse(localStorage.getItem("history") as string)
        : []
    );
  }, []);

  const avgScore = useMemo(() => {
    const history100 = history.slice(0, 30);
    if (history100.length === 0) {
      return 0;
    }

    return Math.round(
      history100.reduce((a: number, c: HistoryData) => a + c.score, 0) /
        history100.length
    );
  }, [history]);

  const initHistory = () => {
    if (window.confirm("정말 초기화하시겠습니까?")) {
      localStorage.removeItem("history");
      setHistory([]);
    }
  };

  return (
    <div className="my-4">
      <p>최근 30게임 평균 점수: {avgScore}</p>
      <Table size="sm" className="mb-5">
        <thead>
          <tr>
            <th>#</th>
            <th>날짜</th>
            <th>점수</th>
          </tr>
        </thead>
        <tbody>
          {history.map((e: { date: string; score: number }, index: number) => (
            <tr key={index}>
              <th>{index + 1}</th>
              <td>{e.date}</td>
              <td>{e.score}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      {0 < history.length && <Button onClick={initHistory}>초기화</Button>}
    </div>
  );
};

export default History;
