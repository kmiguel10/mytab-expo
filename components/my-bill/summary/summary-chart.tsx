import { View, Text, Dimensions } from "react-native";
import React from "react";
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from "react-native-chart-kit";

interface Props {
  members: { amountPaid: number; txnCount: number; userid: string }[];
}

const SummaryChart: React.FC<Props> = ({ members }) => {
  const labelsMembers = members.map((member) => member.userid.slice(0, 4));
  const datasetMembers = members.map((member) => member.amountPaid);
  const data = {
    labels: labelsMembers,
    datasets: datasetMembers,
  };
  return (
    <BarChart
      style={{
        marginVertical: 8,
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
      width={Dimensions.get("window").width}
      height={220}
      yAxisLabel="$"
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
      verticalLabelRotation={30}
    />
  );
};

export default SummaryChart;
