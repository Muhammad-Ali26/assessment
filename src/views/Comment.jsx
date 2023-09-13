import React, { useState, useRef } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { RiSendPlaneFill } from "react-icons/ri";
import { info_toaster } from "../utilities/Toaster";
import { useNavigate } from "react-router-dom";

export default function Comment() {
  const navigate = useNavigate();
  const generateRandomNameWithGender = async () => {
    let res = await fetch("https://randomuser.me/api");
    let { results } = await res.json();
    const randomName = `${results[0]?.name?.first} ${results[0]?.name?.last}`;
    const gender = results[0]?.name?.gender;
    const randomImage = results[0]?.picture?.thumbnail;

    return { name: randomName, gender: gender, image: randomImage };
  };
  const [comment, setComment] = useState("");
  const [reply, setReply] = useState("");
  const [activeReplyIndex, setActiveReplyIndex] = useState(null);
  const replyRef = useRef(null);
  const toggleReply = (index) => {
    setActiveReplyIndex(activeReplyIndex === index ? null : index);
  };
  const [data, setData] = useState([
    {
      id: 1,
      name: "Sarah Wayne",
      gender: "female",
      comment:
        "I was very glad to have you after such a long time. Can you plan a meetup? Maybe this weekend?",
      like: false,
      image: "/images/user1.png",
      reply: [],
    },
    {
      id: 2,
      name: "Alex Hales",
      gender: "male",
      comment:
        "Home sweet home! I'm glad you are back. It's been two year and miss the football matches we have together. A lot has been changed since you left. Let's meet at the ground tomorrow evening? ",
      like: false,
      image: "/images/user2.png",
      reply: [],
    },
    {
      id: 3,
      name: "Patrick Parker",
      gender: "male",
      comment:
        "Hey bud, welcome back to home. It's so long to see you back again. Would love to hear the travelling stories of yours. Your or my place?",
      like: false,
      image: "/images/user4.png",
      reply: [],
    },
  ]);
  const localData = localStorage.getItem("userData");
  const permanentData =
    localData === null || localData === undefined
      ? data
      : JSON.parse(localStorage.getItem("userData"));
  const addComment = async (e) => {
    e.preventDefault();
    if (comment === "") {
      info_toaster("Please enter the comment");
    } else {
      try {
        const randomUserData = await generateRandomNameWithGender();
        const newComment = {
          id: data.length + 1,
          name: randomUserData.name,
          gender: randomUserData.gender,
          comment: comment,
          like: false,
          image: randomUserData.image,
          reply: [],
        };
        const updatedData = [...data, newComment];
        setData(updatedData);
        localStorage.setItem("userData", JSON.stringify(updatedData));
        setComment("");
      } catch (error) {
        console.log("Error in addComment:", error);
      }
    }
  };
  const changeLikeStatus = (id) => {
    const local =
      localData === null || localData === undefined
        ? data
        : JSON.parse(localStorage.getItem("userData"));
    const updatedData = local.map((user) => {
      if (user.id === id) {
        return { ...user, like: !user.like };
      } else {
        return user;
      }
    });
    setData(updatedData);
    localStorage.setItem("userData", JSON.stringify(updatedData));
  };
  const addReply = async (id) => {
    if (reply === "") {
      info_toaster("Please enter the reply");
    } else {
      try {
        const randomUserData = await generateRandomNameWithGender();
        const updatedData = data.map((comment) => {
          if (comment.id === id) {
            const newReply = {
              id: comment.reply.length + 1,
              name: randomUserData.name,
              gender: randomUserData.gender,
              comment: reply,
              image: randomUserData.image,
              like: false,
            };
            return {
              ...comment,
              reply: [...comment.reply, newReply],
            };
          }
          return comment;
        });
        setData(updatedData);
        localStorage.setItem("userData", JSON.stringify(updatedData));
        setActiveReplyIndex(null);
        setReply("");
      } catch (error) {
        console.log("Error in addComment:", error);
      }
    }
  };
  const changeReplyLike = (commentId, replyId) => {
    const local =
      localData === null || localData === undefined
        ? data
        : JSON.parse(localStorage.getItem("userData"));
    const updatedData = local.map((comment) => {
      if (comment.id === commentId) {
        const updatedReplies = comment.reply.map((reply) => {
          if (reply.id === replyId) {
            return { ...reply, like: !reply.like };
          } else {
            return reply;
          }
        });
        return {
          ...comment,
          reply: updatedReplies,
        };
      } else {
        return comment;
      }
    });
    setData(updatedData);
    localStorage.setItem("userData", JSON.stringify(updatedData));
  };
  const removeReply = (commentId, replyIndex) => {
    const local =
      localData === null || localData === undefined
        ? data
        : JSON.parse(localStorage.getItem("userData"));
    const removedReplies = local?.find(
      (reply) => commentId === reply?.id
    )?.reply;
    removedReplies.splice(replyIndex, 1);
    const updatedData = local.map((comment) => {
      if (comment.id === commentId) {
        return {
          ...comment,
          reply: removedReplies,
        };
      } else {
        return comment;
      }
    });
    setData(updatedData);
    localStorage.setItem("userData", JSON.stringify(updatedData));
  };
  const resetDefault = () => {
    localStorage.setItem(
      "userData",
      JSON.stringify([
        {
          id: 1,
          name: "Sarah Wayne",
          gender: "female",
          comment:
            "I was very glad to have you after such a long time. Can you plan a meetup? Maybe this weekend?",
          like: false,
          image: "/images/user1.png",
          reply: [],
        },
        {
          id: 2,
          name: "Alex Hales",
          gender: "male",
          comment:
            "Home sweet home! I'm glad you are back. It's been two year and miss the football matches we have together. A lot has been changed since you left. Let's meet at the ground tomorrow evening? ",
          like: false,
          image: "/images/user2.png",
          reply: [],
        },
        {
          id: 3,
          name: "Patrick Parker",
          gender: "male",
          comment:
            "Hey bud, welcome back to home. It's so long to see you back again. Would love to hear the travelling stories of yours. Your or my place?",
          like: false,
          image: "/images/user4.png",
          reply: [],
        },
      ])
    );
    navigate("/");
  };
  return (
    <section className="font-poppins min-h-screen bg-[#f4f5fa] pt-10">
      <div className="xl:w-2/5 lg:w-3/5 sm:w-4/5 w-10/12 mx-auto space-y-5">
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-xl">Comments</h2>
          <div>
            <button
              onClick={resetDefault}
              className="underline font-medium text-gray-600"
            >
              Reset Default
            </button>
          </div>
        </div>
        <div className="space-y-3">
          {permanentData.map((user, index) => (
            <div className="bg-white p-4 flex gap-x-3" key={index}>
              <div>
                <img
                  src={user?.image}
                  alt="user"
                  className="max-w-[36px] max-h-[36px] rounded-full"
                />
              </div>
              <div className="w-full">
                <h6 className="font-medium text-sm">{user?.name}</h6>
                <p className="font-light text-sm text-[#646464]">
                  {user?.comment}
                </p>
                <div className="flex gap-x-4 items-center mt-2">
                  <button
                    onClick={() => changeLikeStatus(user?.id)}
                    className="flex gap-x-1 items-center"
                  >
                    {user?.like ? (
                      <AiFillHeart size={16} className="text-[#E33E38]" />
                    ) : (
                      <AiOutlineHeart size={16} className="text-[#E33E38]" />
                    )}
                    <span className="font-light text-sm text-[#757575]">
                      {user?.like ? "1" : "0"}
                    </span>
                  </button>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#646464]"></div>
                  <button
                    onClick={() => {
                      toggleReply(index);
                      setTimeout(() => {
                        if (replyRef.current) {
                          replyRef.current.focus();
                        }
                      }, 0);
                    }}
                    className="font-medium text-sm text-[#6590FF]"
                  >
                    Reply
                  </button>
                </div>
                {user?.reply?.length !== 0 &&
                  user?.reply.map((reply, key) => (
                    <div className="bg-white p-4 flex gap-x-3" key={key}>
                      <div>
                        <img
                          src={reply?.image}
                          alt="user"
                          className="max-w-[36px] max-h-[36px] rounded-full"
                        />
                      </div>
                      <div className="w-full">
                        <h6 className="font-medium text-sm">{reply?.name}</h6>
                        <p className="font-light text-sm text-[#646464]">
                          {reply?.comment}
                        </p>
                        <div className="flex gap-x-4 items-center mt-2">
                          <button
                            onClick={() => changeReplyLike(user?.id, reply?.id)}
                            className="flex gap-x-1 items-center"
                          >
                            {reply?.like ? (
                              <AiFillHeart
                                size={16}
                                className="text-[#E33E38]"
                              />
                            ) : (
                              <AiOutlineHeart
                                size={16}
                                className="text-[#E33E38]"
                              />
                            )}
                            <span className="font-light text-sm text-[#757575]">
                              {reply?.like ? "1" : "0"}
                            </span>
                          </button>
                          <div className="w-1.5 h-1.5 rounded-full bg-[#646464]"></div>
                          <button
                            onClick={() => removeReply(user?.id, key)}
                            className="font-medium text-sm text-red-500"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                {activeReplyIndex === index && (
                  <div className="flex gap-x-3 relative mt-5">
                    <input
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          addReply(user?.id);
                        }
                      }}
                      ref={replyRef}
                      type="text"
                      placeholder="Write your reply"
                      className="bg-[#F8F9FB] w-full p-3 font-light text-sm placeholder:text-[#646464]"
                    />
                    <button
                      onClick={() => addReply(user?.id)}
                      className="text-[#6590FF] absolute top-1/2 right-3 -translate-y-1/2"
                    >
                      <RiSendPlaneFill size={20} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          <form
            onSubmit={addComment}
            className="bg-white p-4 flex gap-x-3 relative"
          >
            <input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              type="text"
              placeholder="Write your comment"
              className="bg-[#F8F9FB] w-full p-3 font-light text-sm placeholder:text-[#646464]"
            />
            <button
              type="submit"
              className="text-[#6590FF] absolute top-1/2 right-7 -translate-y-1/2"
            >
              <RiSendPlaneFill size={20} />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
