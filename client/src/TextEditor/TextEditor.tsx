import Quill, { Sources } from "quill";
import "quill/dist/quill.snow.css";
import { useCallback, useEffect, useState } from "react";
import "./style.css";

import { Socket, io } from "socket.io-client";
import { useParams } from "react-router-dom";

const SERVER_URL = import.meta.env.VITE_SERVER_URL as string;

const SAVE_TIME_MS: number = 2000;
const TOOLBAR_OPTIONS = [
  ["bold", "italic", "underline", "strike"], // toggled buttons
  ["image", "blockquote", "code-block"],
  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: "ordered" }, { list: "bullet" }],
  [{ script: "sub" }, { script: "super" }], // superscript/subscript
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  [{ direction: "rtl" }], // text direction
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],

  ["clean"], // remove formatting button
];

const TextEditor = () => {
  const { id: documentId } = useParams();

  const [socket, setSocket] = useState<Socket>();
  const [quill, setQuill] = useState<Quill>();

  useEffect(() => {
    const s = io(SERVER_URL);
    setSocket(s);
    return () => {
      s.disconnect();
    };
  }, []);

  const wrapperRef = useCallback((wrapper: HTMLDivElement) => {
    if (wrapper === null) return;
    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);
    const q = new Quill(editor, {
      theme: "snow",
      modules: {
        toolbar: TOOLBAR_OPTIONS,
      },
    });
    q.disable();
    q.setText("Loading...");
    setQuill(q);
  }, []);

  useEffect(() => {
    if (socket == null || quill == null) return;
    const handler = (delta: any, _: any, source: Sources) => {
      if (source !== "user") return;
      socket.emit("send-changes", delta);
    };
    quill.on("text-change", handler);

    return () => {
      quill.off("text-change", handler);
    };
  }, [socket, quill]);

  useEffect(() => {
    if (socket == null || quill == null) return;
    const handler = (delta: any) => {
      quill.updateContents(delta);
    };
    socket.on("receive-changes", handler);

    return () => {
      socket.off("receive-changes", handler);
    };
  }, [socket, quill]);

  useEffect(() => {
    if (socket == null || quill == null) return;
    socket.once("load-document", (document) => {
      quill.setContents(document);
      quill.enable();
    });
    socket.emit("get-document", documentId);
  }, [socket, quill, documentId]);

  useEffect(() => {
    if (socket == null || quill == null) return;
    const interval = setInterval(() => {
      socket.emit("save-changes", quill.getContents());
    }, SAVE_TIME_MS);

    return () => {
      clearInterval(interval);
    };
  }, [socket, quill, documentId]);

  return (
    <>
      <div className="container" ref={wrapperRef}></div>
    </>
  );
};

export default TextEditor;
