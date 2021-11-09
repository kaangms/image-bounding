import React, { useCallback, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  boxCreationEnded,
  boxCreationStarted,
  boxCreationUpdated,
  imageResized,
} from "../store/actions/boxEditorAction";

import styles from "./BoxesEditor.module.css";

export default function BoxesEditor({ timelineIdx, onNewBox, imgSrc, boxes }) {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.boxEditorReducer);
  const editorRef = useRef(null);
  const imgRef = useRef(null);
  const wrapperRef = useRef(null);

  const handleImageResize = useCallback(() => {
    const editorDimensions = editorRef.current.getBoundingClientRect();
    const editorRatio = editorDimensions.width / editorDimensions.height;
    const imgElement = imgRef.current;
    const imgRatio = imgElement.naturalWidth / imgElement.naturalHeight;

    wrapperRef.current.style.width =
      imgRatio > editorRatio
        ? editorDimensions.width + "px"
        : editorDimensions.height * imgRatio + "px";

    const finalImgDimensions = wrapperRef.current.getBoundingClientRect();
    dispatch(
      imageResized({
        scaleRatio: finalImgDimensions.width / imgElement.naturalWidth,
        offsetX0: finalImgDimensions.x,
        offsetY0: finalImgDimensions.y,
        offsetX1: finalImgDimensions.x + finalImgDimensions.width,
        offsetY1: finalImgDimensions.y + finalImgDimensions.height,
      })
    );
  }, [dispatch]);

  // When browser viewport is resized we need to recalculate max image size
  // and adjust offsets to redraw all boxes.
  useEffect(() => {
    window.addEventListener("resize", handleImageResize);
    return () => window.removeEventListener("resize", handleImageResize);
  }, [handleImageResize]);

  const handleMouseDown = useCallback(
    (ev) => {
      dispatch(
        boxCreationStarted({
          x: ev.clientX,
          y: ev.clientY,
          // Use box creation timestamp as id
          id: Date.now().toString(),
        })
      );
    },
    [dispatch]
  );

  const handleMouseMove = useCallback(
    (ev) => {
      const x = ev.clientX;
      const y = ev.clientY;
      if (!state.isEditing) return;
      dispatch(boxCreationUpdated({ x, y }));
    },
    [dispatch, state.isEditing]
  );

  const handleMouseUp = useCallback(
    (ev) => {
      if (!state.isEditing) return;
      dispatch(boxCreationEnded());
      onNewBox({
        id: state.id,
        x0: Math.round(Math.min(state.x0, state.x1) / state.scaleRatio),
        y0: Math.round(Math.min(state.y0, state.y1) / state.scaleRatio),
        x1: Math.round(Math.max(state.x0, state.x1) / state.scaleRatio),
        y1: Math.round(Math.max(state.y0, state.y1) / state.scaleRatio),
      });
    },
    [
      onNewBox,
      state.id,
      state.isEditing,
      state.scaleRatio,
      state.x0,
      state.y0,
      state.x1,
      state.y1,
      dispatch,
    ]
  );

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      ref={editorRef}
      className="boxes-editor"
    >
      <span
        onMouseDown={handleMouseDown}
        className={styles.wrapper}
        ref={wrapperRef}
      >
        <img
          className={styles.img}
          onLoad={handleImageResize}
          src={imgSrc}
          ref={imgRef}
          alt=""
        />

        {boxes.map(({ x0, y0, x1, y1, id }, i) =>
          i >= timelineIdx ? null : (
            <div
              className={styles.box}
              style={{
                height: (y1 - y0) * state.scaleRatio,
                width: (x1 - x0) * state.scaleRatio,
                left: x0 * state.scaleRatio,
                top: y0 * state.scaleRatio,
              }}
              key={`box-${id}`}
            />
          )
        )}

        {state.isEditing && (
          <div
            className={styles.activeBox}
            style={{
              height: Math.abs(state.y0 - state.y1),
              width: Math.abs(state.x0 - state.x1),
              left: Math.min(state.x0, state.x1),
              top: Math.min(state.y0, state.y1),
            }}
          />
        )}
      </span>
    </div>
  );
}
