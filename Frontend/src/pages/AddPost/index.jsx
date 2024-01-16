import React from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';

import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';
import { useSelector } from 'react-redux';
import { selectIsAuth } from '../../redux/slices/auth'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import axios from '../../axios'
import { PostSkeleton } from '../../components/Post/Skeleton';
export const AddPost = () =>
{
  const { id } = useParams()
  const navigate = useNavigate()
  const isAuth = useSelector(selectIsAuth);
  const [isLoading, setLoading] = React.useState(false);
  const [imageUrl, setImageUrl] = React.useState('');
  const [text, setText] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [tags, setTags] = React.useState('');
  const inputFileRef = React.useRef(null)

  const isEditing = Boolean(id)
  const handleChangeFile = async (e) =>
  {
    try {
      const formData = new FormData();
      const file = e.target.files[0];
      console.log(file);
      formData.append('image', file);
      const { data } = await axios.post('/upload', formData);
      setImageUrl(data.url);
    } catch (err) {
      console.warn(err)
      alert('Ошибка при загрузке файла!');
    }
  };

  const onClickRemoveImage = () =>
  {
    setImageUrl('')
  };

  const onChange = React.useCallback((value) =>
  {
    setText(value);
  }, []);

  const onSubmit = async () =>
  {
    try {
      setLoading(true);
      const fields = {
        title,
        imageUrl,
        tags: tags.split(',').map(tag => tag.trim()).join(','),
        text
      }
      const { data } = isEditing ? await axios.patch(`/posts/${id}`, fields) : await axios.post('/posts', fields);
      const _id = isEditing ? id : data._id;

      navigate(`/posts/${_id}`);
    } catch (err) {
      console.warn(err)
      alert('Ошибка при создании статьи!');
    }
  }

  React.useEffect(() =>
  {
    if (id) {
      axios.get(`/posts/${id}`).then(({ data }) =>
      {
        setTitle(data.title)
        setText(data.text)
        setImageUrl(data.imageUrl)
        setTags(data.tags)
      })
        .catch(err =>
        {
          console.log(err);
          alert('Ошибка при получении статьи!')
        })
    }
  }, [id])
  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Введите текст...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    [],
  );

  if (!window.localStorage.getItem('token') && !isAuth) {
    return <Navigate to={'/'} />
  }
  if (isLoading) return <div><PostSkeleton /></div>
  return (
    <Paper style={{ padding: 30 }}>
      <Button onClick={() => inputFileRef.current.click()} variant="outlined" size="large">
        Загрузить превью
      </Button>
      <input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden />
      {imageUrl && (
        <>
          <Button variant="contained" color="error" onClick={onClickRemoveImage}>
            Удалить
          </Button>
          <img className={styles.image} src={`http://localhost:4000${imageUrl}`} alt="Uploaded" />
        </>
      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Заголовок статьи..."
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        fullWidth
      />
      <TextField value={tags} onChange={e => setTags(e.target.value)} classes={{ root: styles.tags }} variant="standard" placeholder="Тэги" fullWidth />
      <SimpleMDE className={styles.editor} value={text} onChange={onChange} options={options} />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          {isEditing ? "Сохранить" : "Опубликовать"}
        </Button>
        <Link to="/">
          <Button size="large">Отмена</Button>
        </Link>
      </div>
    </Paper>
  );
};
