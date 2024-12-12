import { useDispatch, useSelector } from "react-redux";
import { Constants } from "../../Breads-Shared/Constants";
import { useEffect, useMemo } from "react";
import { changePage } from "../../store/UtilSlice/asyncThunk";
import PageConstant from "../../Breads-Shared/Constants/PageConstants";
import OverviewPage from "./OverView.Page";
import PostsCmsPage from "./PostsCmsPage";
import UsersCmsPage from "./UsersCmsPage";
import { Container } from "@chakra-ui/react";
import { LeftSideBarWidth } from "../../Layout";
import PostsValidationPage from "./PostsValidationPage";

const AdminPage = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.userInfo);
  const isAdmin = userInfo?.role === Constants.USER_ROLE.ADMIN;
  const currentPage = useSelector((state) => state.util.currentPage);
  let pathname = window.location.pathname;
  pathname = pathname.slice(1, pathname?.length);
  const { DEFAULT, POSTS, USERS, POSTS_VALIDATION } = PageConstant.ADMIN;

  useEffect(() => {
    dispatch(changePage({ nextPage: pathname }));
  }, []);

  if (!isAdmin) {
    return <>Invalid Access</>;
  }

  const wrapPageContent = useMemo(() => {
    switch (currentPage) {
      case DEFAULT:
        return <OverviewPage />;
      case POSTS:
        return <PostsCmsPage />;
      case USERS:
        return <UsersCmsPage />;
      case POSTS_VALIDATION:
        return <PostsValidationPage />;
      default:
        return <></>;
    }
  }, [currentPage]);

  return (
    <Container
      m={0}
      p={0}
      width={`calc(100vw - ${LeftSideBarWidth + 8}px)`}
      maxW={`calc(100vw - ${LeftSideBarWidth + 8}px)`}
      height="fit-content"
      minH={"100vh"}
      pos={"relative"}
      left={`${LeftSideBarWidth}px`}
    >
      {wrapPageContent}
    </Container>
  );
};

export default AdminPage;
