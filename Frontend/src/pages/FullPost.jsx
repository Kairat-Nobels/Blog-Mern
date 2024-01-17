import React, { useEffect, useState } from "react";

import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import { useParams } from "react-router-dom";
import axios from '../axios';
import ReactMarkdown from "react-markdown";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuthMe, selectIsAuth } from "../redux/slices/auth";

export const FullPost = () =>
{
  const [data, setData] = useState()
  const [isLoading, setLoading] = useState(true)
  const { id } = useParams()
  const [authorizedUser, setAuthorizedUser] = React.useState('');
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);
  const updateComments = (newComment) =>
  {
    setData(prevData => ({
      ...prevData,
      comments: [...prevData.comments, newComment]
    }));
  };
  useEffect(() =>
  {
    axios.get(`/posts/${id}`).then((res) =>
    {
      setData(res.data);
      setLoading(false)
    }).catch((err) =>
    {
      console.log(err);
      alert("Ошибка при получении сатьи")
    })
  }, [id])

  React.useEffect(() =>
  {
    const fetchAuthData = async () =>
    {
      try {
        const action = await dispatch(fetchAuthMe());
        const authData = action.payload;

        if (Boolean(authData)) {
          setAuthorizedUser(authData);
        }

      } catch (error) {
        console.log('Error:', error);
      }
    };
    fetchAuthData();

  }, [dispatch]);
  if (isLoading) {
    return <Post isLoading={isLoading} />
  }
  return (
    <>
      <Post
        id={data._id}
        title={data.title}
        imageUrl={data.imageUrl}
        // imageUrl="https://res.cloudinary.com/practicaldev/image/fetch/s--UnAfrEG8--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/icohm5g0axh9wjmu4oc3.png"
        user={data.user}
        createdAt={data.createdAt}
        viewsCount={data.viewsCount}
        commentsCount={data.comments ? data.comments.length : 0}
        tags={data.tags}
        isFullPost
      >
        <ReactMarkdown children={data.text} />
      </Post>
      <CommentsBlock
        items={data.comments}
        isLoading={false}
      >
        <Index
          updateComments={updateComments}
          isAuth={isAuth}
          dbComments={data.comments}
          authorizedUser={authorizedUser.fullName}
          id={id}
          avatar={authorizedUser.avatarUrl}
        />
      </CommentsBlock>
    </>
  );
};
