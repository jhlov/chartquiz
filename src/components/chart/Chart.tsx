import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import ChartData from "interfaces/ChartData";
import React, { useEffect, useMemo, useState } from "react";
import { Button, ButtonGroup, Card } from "reactstrap";
import "./Chart.scss";

interface ChartProps {
  isHidden: boolean;
  chartData: ChartData;
  onClickAnswer: Function;
}

const Chart = ({ isHidden, chartData, onClickAnswer }: ChartProps) => {
  const [rSelected, setRSelected] = useState<number | null>(null);

  useEffect(() => {
    //console.log(chartData);
  }, []);

  const _onClickAnswer = (answer: number) => {
    setRSelected(answer);
    onClickAnswer(answer);
  };

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
      xAxis: {
        categories: [...chartData.date, ...chartData.add_date],
        labels: {
          enabled: !isHidden
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
          enabled: !isHidden
        }
      },
      series: [
        {
          type: "line",
          name: "종가",
          data: [...chartData?.close, null, null, null, null, null]
        }
      ]
    };
  }, [isHidden, chartData]);

  return (
    <Card className="mb-5 chart">
      <div className="p-3">
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
      <ButtonGroup>
        <Button
          outline
          color="primary"
          onClick={() => _onClickAnswer(1)}
          active={rSelected === 1}
        >
          UP
        </Button>
        <Button
          outline
          color="primary"
          onClick={() => _onClickAnswer(2)}
          active={rSelected === 2}
        >
          DOWN
        </Button>
      </ButtonGroup>
    </Card>
  );
};

export default Chart;
