import { SearchIcon } from "@chakra-ui/icons";
import { Button, Flex, Input, Text, useColorModeValue } from "@chakra-ui/react";
import Conversations from "./Conversations";
import { useState } from "react";
import { useTranslation } from 'react-i18next'; 

const LeftSideBarMsg = () => {
  const [searchValue, setSearchValue] = useState("");
  const { t } = useTranslation();
  return (
    <Flex
      gap={4}
      flexDirection={{
        base: "column",
        md: "row",
      }}
      maxW={{
        sm: "480px",
        md: "full",
      }}
      pr={3}
      mx={"auto"}
      maxHeight={`85vh`}
      overflowY={"scroll"}
    >
      <Flex
        flex={30}
        gap={3}
        flexDirection={"column"}
        maxW={{
          sm: "280px",
          mx: "auto",
        }}
        mx={"auto"}
      >
        <Text
          fontWeight={700}
          color={useColorModeValue("gray.600", "gray.400")}
        >
          {" "}
        {t('Yourconversations')}
        </Text>
        <form>
          <Flex alignItems={"center"} gap={2}>
            <Input
              placeholder={t('Searchforuser')}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <Button size={"sm"}>
              {" "}
              <SearchIcon />{" "}
            </Button>
          </Flex>
        </form>
        <Conversations
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />
      </Flex>
    </Flex>
  );
};

export default LeftSideBarMsg;
