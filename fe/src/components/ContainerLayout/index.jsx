import { Container, Flex } from "@chakra-ui/react";

const ContainerLayout = ({ children }) => {
  return (
    <Flex
      justifyContent={"center"}
      width={"calc(100vw-12px)"}
      margin={"0"}
      mt={6}
    >
      <Container
        bg="white"
        height={"100vh"}
        mt={6}
        borderRadius={"2xl"}
        width={"640px"}
        maxWidth={"640px"}
        margin={"0"}
        paddingTop={"16px"}
        boxShadow={"0px 0px 8px -3px rgba(0,0,0,0.53)"}
      >
        {children}
      </Container>
    </Flex>
  );
};

export default ContainerLayout;
