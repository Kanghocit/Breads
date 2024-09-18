import { Input } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useDebounce from "../../hooks/useDebounce";
import { surveyTemplate, updatePostInfo } from "../../store/PostSlice";
import { replaceEmojis } from "../../util";

const SurveyOption = ({ option, index }) => {
  const dispatch = useDispatch();
  const postInfo = useSelector((state) => state.post.postInfo);
  const [optionContent, setOptionContent] = useState("");
  const debounceValue = useDebounce(optionContent, 500);
  const isInit = useRef(true);

  useEffect(() => {
    if (!isInit.current) {
      handleOptionContent(debounceValue);
    } else {
      isInit.current = false;
    }
  }, [debounceValue]);

  const handleOptionContent = (value) => {
    const survey = JSON.parse(JSON.stringify(postInfo.survey));
    if (option.placeholder === "More option" && !value && survey.length > 3) {
      survey.splice(index, 1);
    } else {
      survey[index] = {
        ...option,
        value: replaceEmojis(value),
      };
    }
    if (index === survey.length - 1 && !!value) {
      survey.push(
        surveyTemplate({
          placeholder: "More option",
          value: "",
        })
      );
    }
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
      color={"black"}
      fontWeight={600}
      outline={"1px solid gray"}
      _placeholder={{
        color: "gray",
      }}
      placeholder={option.placeholder}
      value={optionContent}
      onChange={(e) => setOptionContent(replaceEmojis(e.target.value))}
    />
  );
};

export default SurveyOption;
