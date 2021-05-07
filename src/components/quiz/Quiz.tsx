import axios from "axios";
import Chart from "components/chart/Chart";
import ChartData from "interfaces/ChartData";
import React, { useEffect, useMemo, useState } from "react";
import { Button } from "reactstrap";

const Quiz = () => {
  const QUIZ_COUNT = 3;

  const [isAnswerCheck, setIsAnswerCheck] = useState<boolean>(false);
  const [chartDataList, setChartDataList] = useState<ChartData[]>([]);
  const [answerList, setAnswerList] = useState<number[]>(
    Array(QUIZ_COUNT).fill(0)
  );

  // mounted
  useEffect(() => {
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
    onScrollToTop();
  };

  return (
    <div>
      <h1 className="mt-5 mb-4">차트속에 답이 있다!?</h1>
      {chartDataList.map((e, index) => (
        <Chart
          key={index}
          isAnswerCheck={isAnswerCheck}
          chartData={e}
          onClickAnswer={(answer: number) => onClickAnswer(index, answer)}
        ></Chart>
      ))}
      {isFinish && (
        <Button className="mb-5" onClick={onClickAnswerCheck}>
          정답 확인
        </Button>
      )}
    </div>
  );
};

export default Quiz;
