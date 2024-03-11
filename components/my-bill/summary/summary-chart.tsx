import React from "react";
import { BarChart } from "react-native-chart-kit";

interface Props {
  members: { amountPaid: number; txnCount: number; userid: string }[];
  scaledHeight: number;
  scaledWidth: number;
}

const SummaryChart: React.FC<Props> = ({
  members,
  scaledHeight,
  scaledWidth,
}) => {
  const labelsMembers = members.map((member) => member.userid.slice(0, 4));
  const datasetMembers = members.map((member) => member.amountPaid);

  return (
    <BarChart
      style={{
        marginVertical: 3,
        borderRadius: 16,
      }}
      data={{
        labels: labelsMembers,
        datasets: [
          {
            data: datasetMembers,
          },
        ],
      }}
      width={scaledWidth}
      height={scaledHeight}
      yAxisLabel="$ "
      yAxisSuffix=""
      chartConfig={{
        backgroundColor: "#e26a00",
        backgroundGradientFrom: "#fb8c00",
        backgroundGradientTo: "#ffa726",
        decimalPlaces: 0, // optional, defaults to 2dp
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        style: {
          borderRadius: 16,
        },
        propsForDots: {
          r: "6",
          strokeWidth: "2",
          stroke: "#ffa726",
        },
      }}
      verticalLabelRotation={0}
      fromZero
      withInnerLines={true}
    />
  );
};

export default SummaryChart;
