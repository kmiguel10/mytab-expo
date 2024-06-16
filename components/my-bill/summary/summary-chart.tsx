import { truncateToTwoDecimalPlaces } from "@/lib/helpers";
import { SummaryInfo } from "@/types/global";
import React from "react";
import { BarChart } from "react-native-chart-kit";

interface Props {
  members: SummaryInfo[];
  scaledHeight: number;
  scaledWidth: number;
}

const SummaryChart: React.FC<Props> = ({
  members,
  scaledHeight,
  scaledWidth,
}) => {
  const labelsMembers = members.map((member) => member.displayName);
  const datasetMembers = members.map((member) =>
    truncateToTwoDecimalPlaces(member.amountPaid)
  );

  return (
    <BarChart
      style={{
        marginVertical: 3,
        borderRadius: 12,
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
      withHorizontalLabels={false}
      showValuesOnTopOfBars={true}
      chartConfig={{
        backgroundColor: "$ffffff",
        backgroundGradientFrom: "#ffffff",
        backgroundGradientTo: "#ffffff",
        decimalPlaces: 0, // optional, defaults to 2dp
        color: (opacity = 1) => `rgba(0, 0, 280, ${opacity})`, // Text color blue
        labelColor: (opacity = 1) => `rgba(0, 0, 260, ${opacity})`, // Label color blue
        style: {
          borderRadius: 16,
        },
        propsForDots: {
          r: "2",
          strokeWidth: "2",
          stroke: "#ffa726",
        },
      }}
      verticalLabelRotation={0}
      fromZero
      withInnerLines={false}
    />
  );
};

export default SummaryChart;
