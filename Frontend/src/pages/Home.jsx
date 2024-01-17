import React, { useEffect, useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts, fetchTags } from '../redux/slices/posts';

export const Home = () =>
{
  const dispatch = useDispatch();
  const userData = useSelector(state => state.auth.data)
  const { posts, tags } = useSelector(state => state.posts)
  const isPostsLoading = posts.status === 'loading';
  const isTagsLoading = tags.status === 'loading';
  const [activeTab, setActiveTab] = useState(0);
  const [commentsItem, setCommentsItem] = useState([]);
  const handleChangeTab = (event, newValue) =>
  {
    setActiveTab(newValue);
  };
  useEffect(() =>
  {
    if (activeTab === 0) {
      dispatch(fetchPosts(''));
    } else {
      dispatch(fetchPosts('popular'));
    }
    dispatch(fetchTags());
  }, [dispatch, activeTab]);
  useEffect(() =>
  {
    if (posts.items.length > 0) {
      const allComments = posts.items
        .map(item => item.comments && item.comments.length > 0 ? item.comments : [])
        .filter(comments => comments.length > 0)
        .flat()
        .slice(0, 15);
      setCommentsItem(allComments);
    }
  }, [posts]);
  return (
    <>
      <Tabs value={activeTab} onChange={handleChangeTab} style={{ marginBottom: 15 }} aria-label="basic tabs example">
        <Tab label="Новые" />
        <Tab label="Популярные" />
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {(isPostsLoading ? [...Array(5)] : posts.items).map((obj, index) => isPostsLoading ? <Post key={index} isLoading={true} /> :
            <Post
              key={obj._id}
              id={obj._id}
              title={obj.title}
              imageUrl={obj.imageUrl}
              // imageUrl="https://res.cloudinary.com/practicaldev/image/fetch/s--UnAfrEG8--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/icohm5g0axh9wjmu4oc3.png"
              user={obj.user}
              createdAt={obj.createdAt}
              viewsCount={obj.viewsCount}
              commentsCount={obj.comments ? obj.comments.length : 0}
              tags={obj.tags}
              isEditable={userData?._id === obj.user._id}
            />
          )}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock items={tags.items} isLoading={isTagsLoading} />
          <CommentsBlock
            items={commentsItem}
            home={<p style={{ fontSize: '32px', padding: '0 0 25px 0', margin: 0, lineHeight: '10px' }}>.........</p>}
            isLoading={false}
          />
        </Grid>
      </Grid>
    </>
  );
};
