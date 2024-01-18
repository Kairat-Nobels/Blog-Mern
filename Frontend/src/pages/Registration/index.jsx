import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import axios from '../../axios'
import styles from './Login.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRegister, selectIsAuth } from '../../redux/slices/auth';
import { useForm } from 'react-hook-form';
import { Navigate } from "react-router-dom";
import { Spinner } from '../../components';

export const Registration = () =>
{
  const inputFileRef = React.useRef(null)
  const [imageUrl, setImageUrl] = React.useState('');
  const dispatch = useDispatch()
  const isAuth = useSelector(selectIsAuth)
  const status = useSelector(state => state.auth.status)
  const { register, handleSubmit, formState: { errors, isValid } } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
    },
    mode: 'onBlur'
  })
  const handleChangeFile = async (e) =>
  {
    try {
      const formData = new FormData();
      const file = e.target.files[0];
      formData.append('image', file);
      const { data } = await axios.post('/avatars', formData);
      setImageUrl(data.url);
    } catch (err) {
      console.warn(err)
      alert('Ошибка при загрузке файла!');
    }
  };
  const onSubmit = async (values) =>
  {
    const sendData = { ...values, avatarUrl: imageUrl }
    const data = await dispatch(fetchRegister(sendData))
    if (!data.payload) {
      return alert('Не удалось Зарегистрироваться')
    }
    if ('token' in data.payload) {
      window.localStorage.setItem('token', data.payload.token);
    }
  }
  if (isAuth) {
    return <Navigate to={'/'} />
  }
  if (status === 'loading') return <Spinner />
  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Создание аккаунта
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden />
        <div className={styles.avatar}>
          <Avatar src={imageUrl ? imageUrl : ''} onClick={() => inputFileRef.current.click()} sx={{ width: 100, height: 100 }} />
        </div>
        <TextField
          error={Boolean(errors.fullName?.message)}
          helperText={errors.fullName?.message}
          {...register('fullName', { required: "Укажите полное имя" })}
          className={styles.field}
          label="Полное имя"
          fullWidth />
        <TextField
          type='email'
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          {...register('email', { required: "Укажите почту" })}
          className={styles.field}
          label="E-Mail"
          fullWidth />
        <TextField
          type='password'
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          {...register('password', { required: "Укажите пароль" })}
          className={styles.field}
          label="Пароль"
          fullWidth />
        <Button disabled={!isValid} type='submit' size="large" variant="contained" fullWidth>
          Зарегистрироваться
        </Button>
      </form>
    </Paper>
  );
};
