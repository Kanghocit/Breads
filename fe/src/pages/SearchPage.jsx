import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import ContainerLayout from "../components/MainBoxLayout";
import UserFollowBox from "../components/UserFollowBox";
import { GET } from "../config/API";
import { Route, USER_PATH } from "../Breads-Shared/APIConfig";

const SearchPage = () => {
  const userInfo = useSelector((state) => state.user.userInfo);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  useEffect(() => {
    if (userInfo._id) {
      handleGetUsers();
    }
  }, [userInfo._id, page]);

  const handleGetUsers = async () => {
    try {
      setLoading(true);
      const data = await GET({
        path: Route.USER + USER_PATH.USERS_FOLLOW,
        params: {
          userId: userInfo._id,
          page: page,
          limit: 20,
        },
      });
      if (data.length > 0) {
        setUsers([...users, ...data]);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const lastUserElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  return (
    <>
      <ContainerLayout>
        {users?.map((user, index) => {
          if (index + 1 < users.length) {
            return <UserFollowBox key={user._id} userInfo={user} />;
          } else {
            return (
              <div key={user._id} ref={lastUserElementRef}>
                <UserFollowBox userInfo={user} />
              </div>
            );
          }
        })}
      </ContainerLayout>
    </>
  );
};

export default SearchPage;
