import React, { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import ReactMarkdown from "react-markdown";
import Layout from "../../components/Layout";
import Router from "next/router";
import { PostProps } from "../../components/Post";
import prisma from '../../lib/prisma'
import { useSession } from "next-auth/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo } from '@fortawesome/free-solid-svg-icons';
import VideoPlayer from "../../components/VideoPlayer";
import { connect, getVideoMetadataById, disconnect } from '../../lib/mongo'
import { ClipLoader } from 'react-spinners';
import { getUserSessionFromCookies } from "../new_session";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  let props = null
  const post = await prisma.post.findUnique({
    where: {
      id: Number(params?.id) || -1,
    },
    include: {
      author: {
        select: { name: true, email: true },
      },
    },
  });
  if (post) {
    const videoUrl = await getVideoUrlById(post.id);
    console.log(`post id: ${post.id.toString()}  videoUrl found: ${videoUrl}`)
    if (videoUrl) {
      props = {
        id: post.id,
        title: post.title,
        author: post.author,
        content: post.content,
        published: post.published,
        videoUrl: videoUrl,
        hasVideo: post.hasVideo
      }
    }
    else {
      props = {
        id: post.id,
        title: post.title,
        author: post.author,
        content: post.content,
        published: post.published,
        videoUrl: null,
        hasVideo: post.hasVideo
      }
    }

  }
  return {
    props: props ?? { author: { name: "Me" } }
  };
};


async function publishPost(id: number, setLoading: React.Dispatch<React.SetStateAction<boolean>>): Promise<void> {
  setLoading(true);
  await fetch(`/api/publish/${id}`, {
    method: "PUT",
  });
  setLoading(false);
  await Router.push("/")
}

async function deletePost(id: number, setLoading: React.Dispatch<React.SetStateAction<boolean>>): Promise<void> {
  setLoading(true);
  const session = getUserSessionFromCookies();

  await fetch(`/api/post/${id}`, {
    method: "DELETE",
  });
  setLoading(false);
  await Router.push("/")
}

const getVideoUrlById = async (id: number) => {
  try {
    let url = null;
    await connect();
    const res = await getVideoMetadataById(id);
    if (res) {
      url = res.videoLink;
    }
    disconnect();
    return url;
  } catch (error) {
    console.log(error);
  }
};


const Post: React.FC<PostProps> = (props) => {
  // const { data: session, status } = useSession();
  const session = getUserSessionFromCookies();
  const [loading, setLoading] = useState(false);

  const userHasValidSession = Boolean(session);
  const postBelongsToUser = session?.email === props.author?.email;
  let title = props.title;
  if (!props.published) {
    title = `${title} (Draft)`;
  }


  return (
    <Layout>
      <div>
        <div className="title-container">
          <h2 className="post-title">{props.title}</h2>
          {props.hasVideo && <FontAwesomeIcon icon={faVideo} />}
        </div>
        <div>
          {loading && (
            <div className="spinner">
              <ClipLoader color="#123abc" loading={loading} className='spinner' size={50} />
            </div>
          )}
        </div>
        <p>By {props?.author?.name || "Unknown author"}</p>
        <ReactMarkdown children={props.content} />
        {props.videoUrl !== null && <VideoPlayer url={props.videoUrl} />}
        {!props.published && userHasValidSession && postBelongsToUser && (
          <button onClick={() => publishPost(props.id, setLoading)}>Publish</button>
        )}
        {userHasValidSession && postBelongsToUser && (
          <button onClick={() => deletePost(props.id, setLoading)}>Delete</button>
        )}
      </div>
      <style jsx>{`
        .page {
          background: white;
          padding: 2rem;
        }

        .actions {
          margin-top: 2rem;
        }

        button {
          background: #ececec;
          border: 0;
          border-radius: 0.125rem;
          padding: 1rem 2rem;
        }

        button + button {
          margin-left: 1rem;
        }

        .title-container {
          display: flex;
          align-items: center;
        }

        .post-title {
          margin-right: 2rem;
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

export default Post;
