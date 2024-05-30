import { truncateToTwoDecimalPlaces } from "@/lib/helpers";
import { SummaryInfo } from "@/types/global";
import React from "react";
import { BarChart } from "react-native-chart-kit";
import { ColorTokens } from "tamagui";

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
      withHorizontalLabels={false}
      showValuesOnTopOfBars={true}
      chartConfig={{
        backgroundColor: "$8ecae6",
        backgroundGradientFrom: "#219ebc",
        backgroundGradientTo: "#219ebc",
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
