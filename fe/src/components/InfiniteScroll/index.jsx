import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

const InfiniteScroll = ({
  queryFc,
  data,
  cpnFc,
  deps = [],
  condition = true,
  skeletonCpn,
  reloadPageDeps = null,
}) => {
  const hasMoreData = useSelector((state) => state.util.hasMoreData);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const observer = useRef();

  const lastUserElementRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMoreData) {
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
            <div key={`skeleton-${num}`}>{skeletonCpn}</div>
          ))}
        </>
      ) : (
        <>
          {data?.map((ele, index) => {
            if (
              data.length >= 5
                ? index === data.length - 5
                : index === data.length - 1
            ) {
              return <div ref={lastUserElementRef}>{cpnFc(ele)}</div>;
            } else if (index === data.length - 1) {
              return (
                <>
                  {cpnFc(ele)}
                  {hasMoreData && (
                    <>
                      {[1, 2, 3, 4, 5].map((num) => (
                        <div key={`skeleton-${num}`}>{skeletonCpn}</div>
                      ))}
                    </>
                  )}
                </>
              );
            } else {
              return <>{cpnFc(ele)}</>;
            }
          })}
        </>
      )}
    </>
  );
};

export default memo(InfiniteScroll);
