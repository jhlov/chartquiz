import classNames from "classnames";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import ChartData from "interfaces/ChartData";
import React, { useEffect, useMemo, useState } from "react";
import { Button, ButtonGroup, Card } from "reactstrap";
import "./Chart.scss";

interface ChartProps {
  isAnswerCheck: boolean;
  chartData: ChartData;
  onClickAnswer: Function;
}

const Chart = ({ isAnswerCheck, chartData, onClickAnswer }: ChartProps) => {
  const [periodSelected, setPeriodSelected] = useState<number>(0);
  const [rSelected, setRSelected] = useState<number | null>(null);

  const periodList: [number, string][] = [
    [0, "1년"],
    [6, "6개월"],
    [9, "3개월"],
    [11, "1개월"]
  ];

  useEffect(() => {
    //console.log(chartData);
  }, []);

  const _onClickAnswer = (answer: number) => {
    setRSelected(answer);
    onClickAnswer(answer);
  };

  /**
   * 정답을 맞췄는지 여부
   */
  const isSuccess: boolean = useMemo(() => {
    if (isAnswerCheck) {
      if (rSelected === 1) {
        // up
        return (
          chartData.close[chartData.close.length - 1] <=
          chartData.add_close[chartData.add_close.length - 1]
        );
      } else {
        return (
          chartData.add_close[chartData.add_close.length - 1] <=
          chartData.close[chartData.close.length - 1]
        );
      }
    }

    return false;
  }, [isAnswerCheck, chartData, rSelected]);

  const chartStartIndex: number = useMemo(() => {
    return (chartData.date.length / 12) * periodSelected;
  }, [chartData, periodSelected]);

  const options: Highcharts.Options = useMemo<Highcharts.Options>(() => {
    return {
      chart: {
        height: 300
      },
      title: {
        text: ""
      },
      legend: {
        enabled: false
      },
      tooltip: {
        enabled: isAnswerCheck,
        crosshairs: isAnswerCheck
      },
      xAxis: {
        categories: [
          ...chartData.date.slice(chartStartIndex),
          ...chartData.add_date
        ],
        labels: {
          enabled: isAnswerCheck
        },
        plotLines: [
          {
            color: "red",
            value: chartData.date.length - chartStartIndex,
            dashStyle: "Dash"
          }
        ]
      },
      yAxis: {
        title: {
          text: null
        },
        labels: {
          enabled: isAnswerCheck
        }
      },
      series: [
        {
          type: "line",
          name: "종가",
          marker: {
            enabled: false
          },
          lineWidth: 1.3,
          states: {
            hover: {
              enabled: isAnswerCheck,
              lineWidth: 1.3
            }
          },
          data: isAnswerCheck
            ? [
                ...chartData.close.slice(chartStartIndex),
                ...chartData.add_close
              ]
            : [
                ...chartData.close.slice(chartStartIndex),
                null,
                null,
                null,
                null,
                null
              ]
        }
      ]
    };
  }, [isAnswerCheck, chartData, chartStartIndex]);

  return (
    <Card className={classNames("mb-5 chart", { success: isSuccess })}>
      {isSuccess && <span className="success-text">정답!!</span>}
      {isAnswerCheck && <h2 className="mt-3 mb-0 ml-4">{chartData.name}</h2>}
      {isAnswerCheck && (
        <h3 className="ml-4">
          {chartData.start_date} ~ {chartData.end_date}
        </h3>
      )}

      <div className="p-3">
        <ButtonGroup className="period-btn" size="sm">
          {periodList.map((e: [number, string]) => (
            <Button
              key={e[0]}
              outline
              color="info"
              onClick={() => setPeriodSelected(e[0])}
              active={periodSelected === e[0]}
            >
              {e[1]}
            </Button>
          ))}
        </ButtonGroup>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
      <ButtonGroup className="answer-btn">
        <Button
          outline
          color="primary"
          onClick={() => _onClickAnswer(1)}
          active={rSelected === 1}
          className={classNames({ "pointer-events-none": isAnswerCheck })}
        >
          UP
        </Button>
        <Button
          outline
          color="primary"
          onClick={() => _onClickAnswer(2)}
          active={rSelected === 2}
          className={classNames({ "pointer-events-none": isAnswerCheck })}
        >
          DOWN
        </Button>
      </ButtonGroup>
    </Card>
  );
};

export default Chart;
