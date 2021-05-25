import axios from "axios";
import Chart from "components/chart/Chart";
import ChartData from "interfaces/ChartData";
import HistoryData from "interfaces/HistoryData";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { Button } from "reactstrap";
import "./Quiz.scss";

const Quiz = () => {
  const QUIZ_COUNT = 5;

  // 정답확인 버튼을 눌렀는지
  const [isAnswerCheck, setIsAnswerCheck] = useState<boolean>(false);

  const [chartDataList, setChartDataList] = useState<ChartData[]>([]);
  const [answerList, setAnswerList] = useState<number[]>(
    Array(QUIZ_COUNT).fill(0)
  );

  // mounted
  useEffect(() => {
    console.log('mounted');
    fetchData();
  }, []);

  const fetchData = async () => {
    const response: { data: ChartData } = await axios.get(
      "https://2m6uj3aph2.execute-api.ap-northeast-2.amazonaws.com/default/stockquiz"
    );

    setChartDataList([...chartDataList, response.data]);
    onScrollToBottom();
  };

  const onScrollToTop = () => {
    window.scrollTo({
      left: 0,
      top: 0,
      behavior: "smooth"
    });
  };

  const onScrollToBottom = () => {
    window.scrollTo({
      left: 0,
      top: document.body.scrollHeight,
      behavior: "smooth"
    });
  };

  const onClickAnswer = (index: number, answer: number) => {
    const oldValue = answerList[index];

    const newArr = [...answerList];
    newArr[index] = answer;
    setAnswerList(newArr);

    if (oldValue === 0 && index === chartDataList.length - 1) {
      if (chartDataList.length < QUIZ_COUNT) {
        fetchData();
      } else {
        // 정답 확인 버튼 출력 되고 스크롤 아래로
        setTimeout(() => {
          onScrollToBottom();
        }, 100);
      }
    }
  };

  const isFinish: boolean = useMemo(() => {
    return answerList.every(e => e > 0);
  }, [answerList]);

  const onClickAnswerCheck = () => {
    console.log("onClickAnswerCheck");
    setIsAnswerCheck(true);
    saveHistory();
    onScrollToTop();
  };

  const score = useMemo(() => {
    return (
      answerList.filter((e, index) => {
        const chartData = chartDataList[index];
        if (chartData) {
          if (e === 1) {
            // up
            return (
              chartData.close[chartData.close.length - 1] <=
              chartData.add_close[chartData.add_close.length - 1]
            );
          } else {
            // down
            return (
              chartData.add_close[chartData.add_close.length - 1] <=
              chartData.close[chartData.close.length - 1]
            );
          }
        }

        return false;
      }).length *
      (100 / QUIZ_COUNT)
    );
  }, [chartDataList, answerList]);

  const saveHistory = () => {
    let history: HistoryData[] = localStorage.getItem("history")
      ? JSON.parse(localStorage.getItem("history") as string)
      : [];

    history.unshift({
      date: moment().format("YYYY-MM-DD HH:mm:ss"),
      score: score
    });

    localStorage.setItem("history", JSON.stringify(history));
  };

  return (
    <div className="quiz my-4">
      <p>
        1년간의 차트를 분석해서 일주일 후의 가격을 예측해보세요
        <br />
        (대상: KOSPI 상위종목, 기간: 최근 3년중 랜덤, 총 {QUIZ_COUNT}문제)
      </p>
      {chartDataList.length === 0 && <p>loading...</p>}

      {isAnswerCheck && <p className="score">SCORE: {score}</p>}

      {chartDataList.map((e, index) => (
        <Chart
          key={index}
          isAnswerCheck={isAnswerCheck}
          chartData={e}
          onClickAnswer={(answer: number) => onClickAnswer(index, answer)}
        ></Chart>
      ))}

      {isFinish && !isAnswerCheck && (
        <Button className="mb-5" onClick={onClickAnswerCheck}>
          정답 확인
        </Button>
      )}

      {isFinish && isAnswerCheck && (
        <Button onClick={() => window.location.reload()}>다시 하기</Button>
      )}
    </div>
  );
};

export default Quiz;
