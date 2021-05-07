import axios from "axios";
import Chart from "components/chart/Chart";
import ChartData from "interfaces/ChartData";
import React, { useEffect, useState } from "react";

const Quiz = () => {
  const [isHidden, setIsHidden] = useState<boolean>(true);
  const [chartDataList, setChartDataList] = useState<ChartData[]>([]);

  // mounted
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const response: { data: ChartData } = await axios.get(
      "https://2m6uj3aph2.execute-api.ap-northeast-2.amazonaws.com/default/stockquiz"
    );

    setChartDataList([...chartDataList, response.data]);
  };

  return (
    <div>
      <h1 className="mt-3">타이틀</h1>
      {chartDataList.map((e, index) => (
        <Chart
          key={index}
          index={index}
          isHidden={isHidden}
          chartData={e}
        ></Chart>
      ))}
    </div>
  );
};

export default Quiz;
