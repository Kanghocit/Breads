import {
  Fragment,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSelector } from "react-redux";

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
}) => {
  const hasMoreData = useSelector((state) => state.util.hasMoreData);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
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
      if (condition) {
        queryFc && queryFc(page);
      }
      setIsLoading(false);
      if (reverseScroll) {
        const containerEle = document.getElementById(elementId);
        if (containerEle) {
          let needLoadMore = true;
          const listenScroll = () => {
            if (containerEle.scrollTop === 0) {
              setPage((prev) => prev + 1);
              needLoadMore = false;
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
      if (!!reloadPageDeps) {
        if (page !== 1) {
          setPage(1);
          setIsLoading(true);
        }
      }
    },
    reloadPageDeps ? reloadPageDeps : []
  );

  return (
    <>
      {isLoading ? (
        <>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
            <div key={`skeleton-loading-${num}`}>{skeletonCpn}</div>
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
              return (
                <div ref={lastUserElementRef} key={ele?._id + index}>
                  {cpnFc(ele)}
                </div>
              );
            } else if (index === data.length - 1) {
              return (
                <Fragment key={ele?._id + index}>
                  {cpnFc(ele)}
                  {hasMoreData && !reverseScroll && (
                    <>
                      {[1, 2, 3, 4, 5].map((num) => (
                        <div key={`skeleton-${num}`}>{skeletonCpn}</div>
                      ))}
                    </>
                  )}
                </Fragment>
              );
            } else {
              return <Fragment key={ele?._id + index}>{cpnFc(ele)}</Fragment>;
            }
          })}
        </>
      )}
    </>
  );
};

export default memo(InfiniteScroll);
