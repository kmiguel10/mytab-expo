import { truncateToTwoDecimalPlaces } from "@/lib/helpers";
import { SummaryInfo } from "@/types/global";
import React, { useEffect, useState } from "react";
import { BarChart } from "react-native-chart-kit";
import { ScrollView, SizableText, View } from "tamagui";

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
  const truncateString = (str: string): string => {
    return str.slice(0, 7);
  };
  const [chartWidth, setChartWidth] = useState(scaledWidth);
  const labelsMembers = members.map((member) =>
    truncateString(member?.displayName)
  );
  const datasetMembers = members.map((member) =>
    truncateToTwoDecimalPlaces(member.amountPaid)
  );

  /** useEffect to adjust chart width based on number of members */
  useEffect(() => {
    const membersLength = labelsMembers.length;
    const scaleFactor = membersLength <= 6 ? 1 : membersLength <= 9 ? 1.4 : 1.8;
    setChartWidth(scaledWidth * scaleFactor || scaledWidth); // Default to scaledWidth if scaleFactor calculation fails
  }, [labelsMembers, scaledWidth]);

  return (
    <View height={scaledHeight}>
      <ScrollView horizontal showsVerticalScrollIndicator={false}>
        <BarChart
          style={{
            marginVertical: 3,
            borderRadius: 12,
            marginLeft: -60,
          }}
          data={{
            labels: labelsMembers,
            datasets: [
              {
                data: datasetMembers,
              },
            ],
          }}
          width={chartWidth}
          height={scaledHeight}
          yAxisLabel="$ "
          yAxisSuffix=""
          withHorizontalLabels={false}
          horizontalLabelRotation={0}
          showValuesOnTopOfBars={true}
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 0, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(0, 122, 241, 1)`, // Solid bar color (blue)
            labelColor: (opacity = 1) => `rgba(0, 122, 241, 1)`, // Label color (blue)
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
      </ScrollView>
    </View>
  );
};

export default SummaryChart;
