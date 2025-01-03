import React from "react";
import { Box, Text, Progress, VStack, Heading } from "@chakra-ui/react";

function DetailStatisticTable() {
  const countries = [
    { name: "United States", users: 21 },
    { name: "India", users: 9 },
    { name: "Canada", users: 3 },
    { name: "Egypt", users: 2 },
    { name: "Germany", users: 2 },
  ];

  return (
    <Box width="sm" borderWidth="1px" borderRadius="lg" overflow="hidden" p={4}>
      <Heading size="md" mb={4}>
        ACTIVE USERS IN LAST 30 MINUTES
      </Heading>
      <Text fontSize="3xl" fontWeight="bold">
        56
      </Text>

      <Text mt={4} mb={2} fontSize="lg" fontWeight="semibold">
        ACTIVE USERS PER MINUTE
      </Text>
      <Progress value={70} size="sm" colorScheme="blue" />

      <VStack spacing={4} align="stretch" mt={4}>
        <Text fontSize="lg" fontWeight="semibold">
          TOP COUNTRIES
        </Text>
        {countries.map((country, index) => (
          <Box key={index}>
            <Text fontWeight="semibold">{country.name}</Text>
            <Progress
              value={(country.users / 21) * 100}
              size="sm"
              colorScheme="blue"
            />
          </Box>
        ))}
      </VStack>
    </Box>
  );
}

export default DetailStatisticTable;
