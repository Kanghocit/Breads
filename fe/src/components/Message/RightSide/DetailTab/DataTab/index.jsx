import {
  Container,
  Flex,
  Image,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { MESSAGE_PATH, Route } from "../../../../../Breads-Shared/APIConfig";
import { Constants } from "../../../../../Breads-Shared/Constants";
import { POST } from "../../../../../config/API";
import ConversationTabHeader from "../tabHeader";
import FileMsg from "../../Conversation/Body/Message/Files";
import LinkBox from "../../Conversation/Body/Message/Links";

const TABS = {
  MEDIA: "Media",
  FILES: "Files",
  LINKS: "Links",
};

const ConversationDataTab = ({ currentTab, setItemSelected }) => {
  const selectedConversation = useSelector(
    (state) => state.message.selectedConversation
  );
  const [tabData, setTabData] = useState([]);
  const [tabIndex, setTabIndex] = useState(
    Object.values(TABS).findIndex((tabValue) => tabValue === currentTab)
  );

  useEffect(() => {
    if (currentTab && selectedConversation?._id) {
      handleGetDataByTab(currentTab);
      setTabIndex(
        Object.values(TABS).findIndex((tabValue) => tabValue === currentTab)
      );
    }
  }, [currentTab, selectedConversation?._id]);

  const handleTabsChange = async (index) => {
    setTabIndex(index);
    const tab = Object.values(TABS)[index];
    await handleGetDataByTab(tab);
  };

  const handleGetDataByTab = async (tab) => {
    try {
      let data = [];
      const query = (subPath) => {
        return {
          path: Route.MESSAGE + subPath,
          payload: {
            conversationId: selectedConversation?._id,
          },
        };
      };
      switch (tab) {
        case TABS.MEDIA:
          data = await POST(query(MESSAGE_PATH.GET_CONVERSATION_MEDIA));
          break;
        case TABS.FILES:
          data = await POST(query(MESSAGE_PATH.GET_CONVERSATION_FILES));
          break;
        case TABS.LINKS:
          data = await POST(query(MESSAGE_PATH.GET_CONVERSATION_LINKS));
          break;
        default:
          data = [];
          break;
      }
      setTabData(data);
    } catch (err) {
      console.error("handleGetDataByTab: ", err);
    }
  };

  return (
    <Container margin={0} padding={2} height={"70vh"}>
      <ConversationTabHeader setItemSelected={setItemSelected} />
      <Tabs w={"full"} index={tabIndex} onChange={handleTabsChange}>
        <TabList w={"full"}>
          {Object.entries(TABS).map(([key, value]) => (
            <Tab
              flex={1}
              borderBottom={"1.5px solid white"}
              justifyContent={"center"}
              pb={3}
              cursor={"pointer"}
              onClick={() => {
                setItemSelected(value);
              }}
            >
              <Text fontWeight={"bold"} fontSize={"14px"}>
                {value}
              </Text>
            </Tab>
          ))}
        </TabList>

        <TabPanels overflowY={"auto"} maxHeight={"calc(70vh - 120px)"} pr={2}>
          <TabPanel p={0} mt={4}>
            <Flex gap={2} wrap={"wrap"}>
              {tabData?.map((item) => {
                const type = item.type;
                const url = item.url;
                if (type === Constants.MEDIA_TYPE.VIDEO) {
                  return <video src={url} key={url} />;
                } else {
                  return (
                    <Image
                      key={url}
                      src={url}
                      w={"30%"}
                      objectFit={"cover"}
                      cursor={"pointer"}
                    />
                  );
                }
              })}
            </Flex>
          </TabPanel>
          <TabPanel p={0} mt={4}>
            <Flex gap={2} wrap={"wrap"}>
              {tabData?.map((item) => (
                <FileMsg file={item} inMsgTab={true} />
              ))}
            </Flex>
          </TabPanel>
          <TabPanel p={0} mt={4}>
            <Flex gap={2} wrap={"wrap"}>
              {tabData?.map((item) => (
                <LinkBox link={item} />
              ))}
            </Flex>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export default ConversationDataTab;
