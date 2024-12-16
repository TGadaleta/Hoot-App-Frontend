import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthedUserContext } from "../../App";
import CommentForm from "../CommentForm/CommentForm";
import * as hootService from "../../services/hootService";

const HootDetails = (props) => {
  const user = useContext(AuthedUserContext);
  const { hootId } = useParams();
  const [hoot, setHoot] = useState();

  useEffect(() => {
    const fetchHoot = async () => {
      const hoot = await hootService.show(hootId);
      setHoot(hoot);
    };
    fetchHoot();
  }, [hootId]);

  const handleAddComment = async (commentFormData) => {
    const newComment = await hootService.createComment(hootId, commentFormData);
    setHoot({ ...hoot, comments: [...hoot.comments, newComment] });
  };

  return (
    <>
      {!hoot ? (
        <main>Loading...</main>
      ) : (
        <main>
          <header>
            <p>{hoot.category.toUpperCase()}</p>
            <h1>{hoot.title}</h1>
            <p>
              {hoot.author.username} posted on{" "}
              {new Date(hoot.createdAt).toLocaleDateString()}
            </p>
          </header>
          <p>{hoot.text}</p>
          <section>
            <h2>Comments</h2>
            <CommentForm handleAddComment={handleAddComment} />
            {!hoot.comments.length && <p>There are no comments.</p>}

            {hoot.comments.map((comment) => (
              <article key={comment._id}>
                <header>
                  <p>
                    {comment.author.username} posted on{" "}
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </p>
                </header>
                <p>{comment.text}</p>
              </article>
            ))}
          </section>
          {hoot.author._id === user._id && (
            <>
              <Link to={`/hoots/${hootId}/edit`}>Edit</Link>
              <button
                onClick={() => {
                  props.handleDeleteHoot(hootId);
                }}
              >
                Delete
              </button>
            </>
          )}
        </main>
      )}
    </>
  );
};

export default HootDetails;
