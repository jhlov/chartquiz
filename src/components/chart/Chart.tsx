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
  const [rSelected, setRSelected] = useState<number | null>(null);

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
  }, [isAnswerCheck, chartData]);

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
        categories: [...chartData.date, ...chartData.add_date],
        labels: {
          enabled: isAnswerCheck
        },
        plotLines: [
          {
            color: "red",
            value: chartData.date.length,
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
          data: isAnswerCheck
            ? [...chartData.close, ...chartData.add_close]
            : [...chartData?.close, null, null, null, null, null]
        }
      ]
    };
  }, [isAnswerCheck, chartData]);

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
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
      <ButtonGroup>
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
