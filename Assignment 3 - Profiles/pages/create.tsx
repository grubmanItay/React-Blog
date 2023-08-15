import React, { useState, useRef, useEffect, ReactEventHandler, ChangeEvent } from "react";
import Layout from "../components/Layout";
import Router from "next/router";
import { useSession } from "next-auth/react";
import { ClipLoader } from "react-spinners";
import { getUserSessionFromStorage } from "./new_session";

const Draft: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [video, setVideo] = useState<File | null>(null);
  // const { data: session, status } = useSession();
  const titleRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const session = getUserSessionFromStorage();

  useEffect(() => {
    if (!session) {
      Router.push(`/login`);
    }
  });

  const handleVideoChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setVideo(event.target.files[0]);
    }
  };

  const handleRemoveVideo = () => {
    setVideo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }


  useEffect(() => {
    if (titleRef.current)
      titleRef.current.focus();
  }, []);

  let email = session?.email;

  const submitData = async (e: React.SyntheticEvent) => {
    setLoading(true);
    e.preventDefault();
    const formData = new FormData();
    try {
      if (video) {
        formData.append('video', video);
      }
      formData.append('title', title)
      formData.append('content', content)
      // formData.append('session', JSON.stringify(session))
      formData.append('email', email)
      const response = await fetch(`/api/post`, {
        method: "POST",
        body: formData,
        headers: { "authorization": `Bearer ${session.token}` }
      });
      setLoading(false);
      await Router.push("/drafts");
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  return (
    <Layout>
      <div>
        <form onSubmit={submitData}>
          <h1>New Draft</h1>
          <div>
            {loading && (
              <div className="spinner">
                <ClipLoader color="#123abc" loading={loading} className='spinner' size={50} />
              </div>
            )}
          </div>
          <input
            ref={titleRef}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            type="text"
            value={title}
          />
          <textarea
            cols={50}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Content"
            rows={8}
            value={content}
          />
          <input type="file" accept="video/*" onChange={handleVideoChange} disabled={video !== null} ref={fileInputRef} />
          <input style={{ visibility: !video ? "hidden" : "visible" }} type="button" value="X" onClick={handleRemoveVideo} />
          <input className="create" disabled={!content || !title} type="submit" value="Create" />
          <a className="back" href="#" onClick={() => Router.push("/")}>
            or Cancel
          </a>
        </form>
      </div>
      <style jsx>{`
        .page {
          background: white;
          padding: 3rem;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        input[type="text"],
        textarea {
          width: 100%;
          padding: 0.5rem;
          margin: 0.5rem 0;
          border-radius: 0.25rem;
          border: 0.125rem solid rgba(0, 0, 0, 0.2);
        }

        input[type="submit"] {
          background: #ececec;
          border: 0;
          padding: 1rem 2rem;
        }

        .create {
          margin-left: 1rem;
        }

        .back {
          margin-left: 1rem;
        }

        .spinner {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      `}</style>
    </Layout>
  );
};

export default Draft;
