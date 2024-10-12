import { useCallback, useEffect, useRef, useState } from "react";

const InfiniteScroll = ({
  queryFc,
  data,
  cpnFc,
  deps = [],
  condition = true,
  skeletonCpn,
  canScrollMore = true,
}) => {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const observer = useRef();

  const lastUserElementRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [hasMore]
  );

  useEffect(
    () => {
      if (condition) {
        queryFc && queryFc(page, setHasMore);
      }
      setIsLoading(false);
    },
    deps ? [...deps, page] : [page]
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
            if (index === data.length - 5) {
              return <div ref={lastUserElementRef}>{cpnFc(ele)}</div>;
            } else if (index === data.length - 1) {
              return (
                <>
                  {cpnFc(ele)}
                  {canScrollMore && (
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

export default InfiniteScroll;
