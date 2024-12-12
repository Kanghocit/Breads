import {
  Fragment,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateHasMoreData } from "../../store/UtilSlice";

const InfiniteScroll = ({
  queryFc,
  data,
  cpnFc,
  deps = [],
  condition = true,
  skeletonCpn,
  reloadPageDeps = null,
  preloadIndex = 5,
  reverseScroll = false,
  elementId = null,
  prefixId = "",
  updatePageValue = null,
}) => {
  const dispatch = useDispatch();
  const hasMoreData = useSelector((state) => state.util.hasMoreData);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [currentScrollY, setCurrentScrollY] = useState(null);
  const [updatePageWithoutLoad, setUpdatePageWithoutLoad] = useState(false);
  const observer = useRef();

  const lastUserElementRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMoreData && !reverseScroll) {
          setPage((prevPage) => prevPage + 1);
          // setIsLoading(true);
        }
      });
      if (node) observer.current.observe(node);
    },
    [hasMoreData]
  );

  useEffect(
    () => {
      if (condition && !updatePageWithoutLoad) {
        queryFc && queryFc(page);
      }
      setIsLoading(false);
      setUpdatePageWithoutLoad(false);
      if (reverseScroll) {
        const containerEle = document.getElementById(elementId);
        if (containerEle) {
          const listenScroll = () => {
            if (containerEle.scrollTop === 0) {
              setPage((prev) => prev + 1);
              setCurrentScrollY(containerEle.scrollHeight);
            }
          };
          containerEle.addEventListener("scroll", listenScroll);
          return () => {
            containerEle.removeEventListener("scroll", listenScroll);
          };
        }
      }
    },
    deps ? [...deps, page] : [page]
  );

  useEffect(
    () => {
      if (!!reloadPageDeps && reloadPageDeps?.length > 0) {
        if (page !== 1) {
          setIsLoading(true);
          setPage(1);
          dispatch(updateHasMoreData(true));
        }
      }
    },
    reloadPageDeps ? reloadPageDeps : []
  );

  useEffect(() => {
    if (reverseScroll && currentScrollY) {
      const containerEle = document.getElementById(elementId);
      containerEle.scrollTo({
        top: containerEle.scrollHeight - currentScrollY,
      });
      setCurrentScrollY(null);
    }
  }, [data]);

  useEffect(() => {
    if (!!updatePageValue && updatePageValue !== page) {
      setPage(updatePageValue);
      setUpdatePageWithoutLoad(true);
    }
  }, [updatePageValue]);

  return (
    <>
      {isLoading ? (
        <>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
            <div>{skeletonCpn}</div>
          ))}
        </>
      ) : (
        <>
          {data?.map((ele, index) => {
            if (
              (data.length >= preloadIndex
                ? index === data.length - preloadIndex
                : index === data.length - 1) &&
              !reverseScroll
            ) {
              return <div ref={lastUserElementRef}>{cpnFc(ele)}</div>;
            } else if (index === data.length - 1) {
              return (
                <Fragment>
                  {cpnFc(ele)}
                  {hasMoreData && !reverseScroll && (
                    <>
                      {[1, 2, 3, 4, 5].map((num) => (
                        <div>{skeletonCpn}</div>
                      ))}
                    </>
                  )}
                </Fragment>
              );
            } else {
              return <Fragment>{cpnFc(ele)}</Fragment>;
            }
          })}
        </>
      )}
    </>
  );
};

export default memo(InfiniteScroll);
