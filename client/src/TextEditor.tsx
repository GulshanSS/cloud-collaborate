import Quill from "quill";
import "quill/dist/quill.snow.css";
import { useCallback } from "react";

const TextEditor = () => {
  const wrapperRef = useCallback((wrapper: HTMLDivElement) => {
    if (wrapper === null) return;
    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);
    new Quill(editor, { theme: "snow" });
  }, []);

  return (
    <>
      <div ref={wrapperRef}></div>
    </>
  );
};

export default TextEditor;
