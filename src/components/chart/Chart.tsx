import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import ChartData from "interfaces/ChartData";
import React, { useEffect, useMemo, useState } from "react";
import { Button, ButtonGroup, Card } from "reactstrap";

interface ChartProps {
  index: number;
  isHidden: boolean;
  chartData: ChartData;
}

const Chart = ({ index, isHidden, chartData }: ChartProps) => {
  const [rSelected, setRSelected] = useState<number | null>(null);

  useEffect(() => {
    //console.log(chartData);
  }, []);

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
        visible: !isHidden
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
    <Card>
      <HighchartsReact highcharts={Highcharts} options={options} />
      <ButtonGroup>
        <Button
          outline
          color="primary"
          onClick={() => setRSelected(1)}
          active={rSelected === 1}
        >
          UP
        </Button>
        <Button
          outline
          color="primary"
          onClick={() => setRSelected(2)}
          active={rSelected === 2}
        >
          DOWN
        </Button>
      </ButtonGroup>
    </Card>
  );
};

export default Chart;
