import React, { ReactNode } from "react";
import Header from "./Header";

type Props = {
  children: ReactNode;
};

const Layout: React.FC<Props> = (props) => (
  <div>
    <Header />
    <div className="layout">{props.children}</div>
    <style jsx global>{`
      html {
        box-sizing: border-box;
      }

      *,
      *:before,
      *:after {
        box-sizing: inherit;
      }

      body {
        margin: 0;
        padding: 0;
        font-size: 16px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
          Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
          "Segoe UI Symbol";
        background: rgba(0, 0, 0, 0.05);
      }

      input,
      textarea {
        font-size: 16px;
      }

      button {
        cursor: pointer;
      }

      .pagination {
        display: inline-block;
      }
      
      .pagination a {
        color: black;
        float: left;
        padding: 8px 16px;
        text-decoration: none;
        border-radius: 5px;
        transition: background-color .3s;
      
      }

      .pagination a.active {
        color: white;
        background-color: #4CAF50;
       }
      
      .pagination a.disabled {background-color: #ccc;}
      .pagination a:hover:not(.disabled, .active) {background-color: #ddd;}

      .sizing a {
        display: inline-block;
        color: black;
        padding: 2px 4px;
        text-decoration: none;
        border-radius: 5px;
        transition: background-color .3s;
      }

      .sizing a.active {
        color: white;
        background-color: #4CAF50;
       }
       .sizing a:hover:not(.active, .text) {background-color: #ddd;}

    `}</style>
    <style jsx>{`
      .layout {
        padding: 0 2rem;
      }
    `}</style>
  </div>
);

export default Layout;
