import React, { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import Layout from "../components/Layout";
import Post, { PostProps } from "../components/Post";
import { useSession, getSession } from "next-auth/react";
import prisma from '../lib/prisma'
import { getUserSessionFromCookies } from "./new_session";
import axios from "axios";
import Router, { useRouter } from "next/router";


type Props = {
  drafts: PostProps[];
};

interface Draft {
  [x: string]: any;
  id: number;
  title: string;
  author: {
    name: string;
    email: string;
  } | null;
  content: string;
  hasVideo: Boolean;
  published: boolean;
  videoUrl: string;
}

const Drafts: React.FC<Props> = () => {
  const router = useRouter()
  const session = getUserSessionFromCookies()

  let [drafts, setDrafts] = useState<Draft | null>(null)

  useEffect(() => {
    if (!session) {
      router.push(`/login`);
    }
    const fetchData = async () => {
      const res = await axios.get("/api/drafts");
      console.log(res.data.props);
      setDrafts(res.data.props);
    }
    fetchData().catch(console.error);
  }, []);

  if (!session) {
    return (
      <Layout>
        <h1>My Drafts</h1>
        <div>You need to be authenticated to view this page.</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page">
        <h1>My Drafts</h1>
        <main>
          {drafts ? drafts.map((post: Draft) => (
            <div key={post.id} className="post">
              <Post post={post} />
            </div>
          )) : <div>Loading Drafts...</div>}
        </main>
      </div>
      <style jsx>{`
        .post {
          background: white;
          transition: box-shadow 0.1s ease-in;
        }

        .post:hover {
          box-shadow: 1px 1px 3px #aaa;
        }

        .post + .post {
          margin-top: 2rem;
        }
      `}</style>
    </Layout>
  );
};

export default Drafts;
