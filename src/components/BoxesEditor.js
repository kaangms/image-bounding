import React, { useCallback, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { Form, Input, ListGroup, ListGroupItem } from "reactstrap";

import {
  boxCreationEnded,
  boxCreationStarted,
  boxCreationUpdated,
  boxCreatTicket,
  boxCreatTicketSaved,
  imageResized,
  writeTextData,
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

  useEffect(() => {
    // console.log("object");
    window.addEventListener("resize", handleImageResize);
    return () => window.removeEventListener("resize", handleImageResize);
  }, [handleImageResize]);

  const handleMouseDown = useCallback(
    (ev) => {
      if (!state.isThereTicket) {
        dispatch(
          boxCreationStarted({
            x: ev.clientX,
            y: ev.clientY,

            id: Date.now().toString(),
          })
        );
      }
    },
    [dispatch, state.isThereTicket]
  );

  const handleMouseMove = useCallback(
    (ev) => {
      const x = ev.clientX;
      const y = ev.clientY;
      if (!state.isEditing) return;
      if (!state.isThereTicket) {
        dispatch(boxCreationUpdated({ x, y }));
      }
    },
    [dispatch, state.isEditing, state.isThereTicket]
  );
  const handleMouseUp = (ev) => {
    if (!state.isEditing) return;
    if (!state.isThereTicket) {
      dispatch(boxCreationEnded());
      onNewBox({
        id: state.id,
        x0: Math.round(Math.min(state.x0, state.x1) / state.scaleRatio),
        y0: Math.round(Math.min(state.y0, state.y1) / state.scaleRatio),
        x1: Math.round(Math.max(state.x0, state.x1) / state.scaleRatio),
        y1: Math.round(Math.max(state.y0, state.y1) / state.scaleRatio),
        ticket: "",
      });
    }
  };

  const inputTextHandler = useCallback(
    (ticket) => (e) => {
      dispatch(boxCreatTicket({ ticket }));

      onNewBox({
        id: state.id,
        x0: Math.round(Math.min(state.x0, state.x1) / state.scaleRatio),
        y0: Math.round(Math.min(state.y0, state.y1) / state.scaleRatio),
        x1: Math.round(Math.max(state.x0, state.x1) / state.scaleRatio),
        y1: Math.round(Math.max(state.y0, state.y1) / state.scaleRatio),
        ticket: state.ticket,
      });
      let data = dataBuild(state);
      // console.log(data);
      dispatch(boxCreatTicketSaved());

      e.preventDefault();
      // }
    },

    [dispatch, onNewBox, state]
  );

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      ref={editorRef}
      className="boxes-editor"
    >
      <span
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
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

        {boxes.map(({ x0, y0, x1, y1, id, ticket }, i) =>
          i >= timelineIdx ? null : (
            <div>
              <h6
                style={{
                  left: x0 * state.scaleRatio,
                  top: y0 * state.scaleRatio - 18,
                  color: "red",
                }}
              >
                X:{cordinatEdit(x0 * state.scaleRatio)} ve y:
                {cordinatEdit(y0 * state.scaleRatio)} {ticket.ticket}
              </h6>
              {!state.isEditing && (
                <div
                  style={{
                    position: "absolute",
                    left: x0 * state.scaleRatio + (x1 - x0) * state.scaleRatio,
                    top: y0 * state.scaleRatio,
                    width: 200,
                  }}
                >
                  <ListGroup>
                    <ListGroupItem
                      action
                      active
                      onClick={inputTextHandler("Cras justo odio")}
                      tag="button"
                    >
                      Cras justo odio
                    </ListGroupItem>
                    <ListGroupItem
                      action
                      onClick={inputTextHandler(" Dapibus ac facilisis in")}
                      tag="button"
                    >
                      Dapibus ac facilisis in
                    </ListGroupItem>
                  </ListGroup>
                </div>
                // <Form>
                //   <Input
                //     placeholder="Lütfen tanımlayınız..."
                //     value={ticket.ticket}
                //     onKeyPress={inputTextHandler}
                //     style={{
                //       position: "absolute",
                //       left:
                //         x0 * state.scaleRatio + (x1 - x0) * state.scaleRatio,
                //       top: y0 * state.scaleRatio,
                //       width: 200,
                //     }}
                //   />{" "}
                // </Form>
              )}
              <div
                className={styles.box}
                style={{
                  height: (y1 - y0) * state.scaleRatio,
                  width: (x1 - x0) * state.scaleRatio,
                  left: x0 * state.scaleRatio,
                  top: y0 * state.scaleRatio,
                }}
                key={`box-${id}`}
              ></div>
            </div>
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
function dataBuild(state) {
  return `${state.ticket.ticket} ${Math.round(
    Math.min(state.x0, state.x1)
  )} ${Math.round(Math.min(state.y0, state.y1))} ${
    Math.round(Math.max(state.x0, state.x1)) -
    Math.round(Math.min(state.x0, state.x1))
  } ${
    Math.round(Math.max(state.y0, state.y1)) -
    Math.round(Math.min(state.y0, state.y1))
  }`;
}

function cordinatEdit(cordinat) {
  var text = cordinat.toString();
  return text.substring(0, text.lastIndexOf("."));
}
