import { Container, Flex, Text } from "@chakra-ui/react";
import LineGraph from "../AnalyticsGraph/LineGraph";
import BarGraph from "../AnalyticsGraph/BarGraph";
import MapGraph from "../AnalyticsGraph/MapGraph";
import DoughnutGraph from "../AnalyticsGraph/DonutGraph";

const ReportSnapshot = () => {
  return (
    <Container
      id="report-snapshot"
      maxWidth={"100vw"}
      width={"100%"}
      m={0}
      p={6}
    >
      <Flex
        width={"100%"}
        height={"fit-content"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Text>Report snapshot</Text>
      </Flex>
      <Flex width={"100%"} gap={6}>
        <div
          style={{
            flex: 1,
          }}
        >
          <LineGraph />
        </div>
        <div
          style={{
            flex: 1,
          }}
        >
          <BarGraph />
        </div>
      </Flex>
      <MapGraph />
      <DoughnutGraph />
    </Container>
  );
};

export default ReportSnapshot;
