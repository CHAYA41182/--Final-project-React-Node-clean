import './edit-forum.css';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, Navigate, useParams } from 'react-router-dom';

import CircularProgress from '@mui/material/CircularProgress';
import { useGetForumsQuery, useUpdateForumMutation } from '../forumApiSlice';

function EditForum() {
  const [forum, setForum] = useState({});
  const {
    data: forums, isError, error, isLoading, isSuccess,
  } = useGetForumsQuery();
  const [updateForum, {
    data, isError: updateError, error: updateErrorData, isLoading: updateLoading, isSuccess: updateSuccess,
  }] = useUpdateForumMutation();
  const forumId = useParams().id;
  const [changed, setChanged] = useState(false);

  const nameRef = useRef(forum?forum.name:null);
  const descriptionRef = useRef(forum?forum.description:null);
  const publicRef = useRef(forum?forum.public:null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) {
      const forum = forums.find((forum) => forum.id === forumId);
      setForum(forum);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (updateSuccess) {
      navigate('/dash/forums');
    }
  }, [updateSuccess]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      id: forumId,
      name: nameRef.current.value,
      description: descriptionRef.current.value,
      public: publicRef.current.checked,
    };
    updateForum(data);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    console.error('An error occurred while update forum:', error);
    return <div>{JSON.stringify(error)}</div>;
  }
  return (
    <div className="edit-forum-container">
      <form className="edit-forum-form">
        <input type="text" placeholder="שם הפורום" className="edit-forum-input" required name="name" defaultValue={forum?forum.name:''} ref={nameRef} onChange={() => setChanged(true)} />
        <textarea placeholder="תיאור הפורום" className="edit-forum-textarea" required name="description" defaultValue={forum?forum.description:''} ref={descriptionRef} onChange={() => setChanged(true)} />
        <div className="edit-forum-checkbox">
          <input type="checkbox" name="public" id="public" ref={publicRef} defaultChecked={forum?forum.public:''} onChange={() => setChanged(true)} />
          <label htmlFor="public"> ציבורי</label>
        </div>
        <button className={`${changed ? 'edit-forum-submit' : 'edit-forum-submit-disabled'}`} disabled={!changed} onClick={handleSubmit}>
          {updateLoading && <CircularProgress size={20} color="inherit" />}
          עדכן פורום
          {' '}
        </button>
      </form>
    </div>
  );
}

export default EditForum;
