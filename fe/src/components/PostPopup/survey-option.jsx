import { Input } from "@chakra-ui/react";
import useDebounce from "../../hooks/useDebounce";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { updatePostInfo } from "../../store/PostSlice";

const SurveyOption = ({ option, index }) => {
  const dispatch = useDispatch();
  const postInfo = useSelector((state) => state.post.postInfo);
  const [optionContent, setOptionContent] = useState("");
  const debounceValue = useDebounce(optionContent, 500);

  useEffect(() => {
    if (debounceValue) {
      handleOptionContent(debounceValue);
    }
  }, [debounceValue]);

  const handleOptionContent = (value) => {
    const survey = JSON.parse(JSON.stringify(postInfo.survey));
    survey[index] = {
      ...option,
      value: value,
    };
    dispatch(
      updatePostInfo({
        ...postInfo,
        survey: survey,
      })
    );
  };

  return (
    <Input
      border={"1px solid gray"}
      margin={"6px 0"}
      color={"gray"}
      outline={"1px solid gray"}
      _placeholder={{
        color: "gray",
      }}
      placeholder={option.placeholder}
      value={optionContent}
      onChange={(e) => setOptionContent(e.target.value)}
    />
  );
};

export default SurveyOption;
