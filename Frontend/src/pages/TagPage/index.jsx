import React, { useEffect } from "react";
import { useParams } from 'react-router-dom';
import styles from './TagPage.module.css';
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, fetchTags } from "../../redux/slices/posts";
import Grid from "@mui/material/Grid";
import { Post } from "../../components";

export const TagPage = () =>
{
    let { tag } = useParams();
    tag = tag.trim();
    const dispatch = useDispatch();
    const { posts } = useSelector(state => state.posts);
    const userData = useSelector((state) => state.auth.data);
    const arePostsLoading = posts.status === 'loading';
    let filteredPosts = [];


    useEffect(() =>
    {
        try {
            dispatch(fetchPosts(''));
            dispatch(fetchTags());
        } catch (err) {
            alert(err);
        }
    }, [dispatch]);


    if (posts.status === 'loaded') {
        try {
            filteredPosts = posts.items
                .filter((post) => post.tags
                    .some((i) => i.trim() === tag)
                );
        } catch (e) {
            alert("CAUGHT ERROR: " + e)
        }
    }

    return (
        <>
            <div>
                <h1 className={styles.tagStyle}># {tag}</h1>
            </div>

            <Grid container spacing={4}>

                <Grid xs={12} item>
                    {
                        (arePostsLoading ? [...Array(5)] : filteredPosts).map((obj, index) => arePostsLoading
                            ? (<Post key={index} isLoading={true} />)
                            : (

                                <Post
                                    key={obj._id}
                                    id={obj._id}
                                    title={obj.title}
                                    imageUrl={obj.imageUrl ? obj.imageUrl : ''}
                                    user={obj.user}
                                    createdAt={obj.createdAt}
                                    viewsCount={obj.viewsCount}
                                    commentsCount={obj.comments ? obj.comments.length : 0}
                                    tags={obj.tags}
                                    isEditable={userData?._id === obj.user._id}
                                />
                            )
                        )
                    }
                </Grid>


            </Grid>
        </>
    )
};
