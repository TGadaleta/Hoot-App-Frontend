// src/components/CommentForm/CommentForm.jsx

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as hootService from "../../services/hootService";

const CommentForm = (props) => {
  const [formData, setFormData] = useState({ text: "" });
  const { hootId, commentId } = useParams();
  const navigate = useNavigate()
  const handleChange = (evt) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (hootId && commentId) {
      hootService.updateComment(hootId, commentId, formData);
      navigate(`/hoots/${hootId}`);
    } else {
      props.handleAddComment(formData);
    }
    setFormData({ text: '' });
  };

  useEffect(() => {
    const fetchHoot = async () => {
      const hootData = await hootService.show(hootId);
      // Find comment in fetched hoot data
      setFormData(
        hootData.comments.find((comment) => comment._id === commentId)
      );
    };
    if (hootId && commentId) fetchHoot();
  }, [hootId, commentId]);

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="text-input">Your comment:</label>
      <textarea
        required
        type="text"
        name="text"
        id="text-input"
        value={formData.text}
        onChange={handleChange}
      />
      <button type="submit">SUBMIT COMMENT</button>
    </form>
  );
};

export default CommentForm;
