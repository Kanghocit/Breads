import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changePage } from "../store/UtilSlice";
import PageConstant from "../Breads-Shared/Constants/PageConstants";
import ContainerLayout from "../components/MainBoxLayout";

const ActivityPage = () => {
  const dispatch = useDispatch();
  const currentPage = useSelector((state) => state.util.currentPage);
  useEffect(() => {
    dispatch(
      changePage({
        nextPage: PageConstant.ACTIVITY,
        currentPage: currentPage,
      })
    );
  }, []);

  return (
    <>
      <ContainerLayout></ContainerLayout>
    </>
  );
};

export default ActivityPage;
