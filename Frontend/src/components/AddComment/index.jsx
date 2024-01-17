import React, { useRef, useState } from "react";
import styles from "./AddComment.module.scss";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";
import instance from "../../axios";
import { useNavigate } from "react-router-dom";

export const Index = ({ updateComments, isAuth, dbComments, authorizedUser, id, avatar }) =>
{
  const [comments, setComments] = useState(dbComments);
  const formRef = useRef(null)
  const navigate = useNavigate();
  const token = localStorage.getItem('token')

  const {
    register,
    handleSubmit,
  } = useForm({ mode: 'all' });

  const onSubmit = async (text) =>
  {

    try {
      const headers = { token }
      const newComment = {
        user: { fullName: authorizedUser, avatarUrl: avatar },
        ...text,
      }
      console.log('new: ', newComment, '\ncomments: ', comments);
      setComments([...comments, newComment]);
      updateComments(newComment)
      const payload = { comments: [...comments, newComment] };

      const { data } = await instance.put(`/posts/${id}/comments`, payload, { headers });
      console.log(data);
      navigate(`/posts/${id}`);
      formRef.current.reset()
    }
    catch (e) { console.log(e); }
  }

  return (
    <>
      <div className={styles.root}>
        <Avatar
          classes={{ root: styles.avatar }}
          src={avatar || '/noavatar.png'}
        />
        <div className={styles.form}>

          <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
            <TextField
              label={isAuth ? "Написать комментарий" : "Пожалуйста аторизуйтесь чтобы написать комментарий"}
              variant="outlined"
              maxRows={10}
              multiline
              fullWidth
              onChange={e => console.log(e.target)}
              InputProps={{ readOnly: !isAuth }}
              {...register('text', { required: 'Enter email!', })}
            />

            <Button variant="contained" type='submit' disabled={!isAuth}>
              Отправить
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};
