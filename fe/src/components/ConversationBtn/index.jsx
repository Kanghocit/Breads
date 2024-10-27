import { Button } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { POST } from "../../../src/config/API";
import { MESSAGE_PATH, Route } from "../../Breads-Shared/APIConfig";
import PageConstant from "../../Breads-Shared/Constants/PageConstants";
import { selectConversation } from "../../store/MessageSlice";
import { changePage } from "../../store/UtilSlice/asyncThunk";

const ConversationBtn = ({ user }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.user.userInfo);
  const handleClickChat = async () => {
    try {
      const data = await POST({
        path: Route.MESSAGE + MESSAGE_PATH.GET_CONVERSATION_BY_USERS_ID,
        payload: {
          userId: userInfo?._id,
          anotherId: user?._id,
        },
      });
      if (!!data) {
        history.pushState(null, "", `/chat/${data._id}`);
        navigate(`/chat/${data._id}`);
        dispatch(changePage({ nextPage: PageConstant.CHAT }));
        dispatch(selectConversation(data));
      }
    } catch (err) {
      console.log("handleClickChat: ", err);
    }
  };

  return (
    <Button size={"md"} flex={1} onClick={() => handleClickChat()}>
      Chat
    </Button>
  );
};

export default ConversationBtn;
