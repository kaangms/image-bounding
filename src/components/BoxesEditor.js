import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { ListGroup, ListGroupItem } from "reactstrap";
import TicketService from "../services/ticketService";

import {
  boxCreationEnded,
  boxCreationStarted,
  boxCreationUpdated,
  boxCreatTicket,
  boxCreatTicketSaved,
  imageResized,
} from "../store/actions/boxEditorAction";

import styles from "./BoxesEditor.module.css";

export default function BoxesEditor({ onNewBox, imgSrc, boxes }) {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.boxEditorReducer);
  const editorRef = useRef(null);
  const imgRef = useRef(null);
  const wrapperRef = useRef(null);
  const [tickets, setTickets] = useState([]);
  useEffect(() => {
    let ticektService = new TicketService();
    ticektService
      .getTickets()
      // .then((response) => console.log(response))
      .then((response) => setTickets(response.data))
      .catch((error) => console.error(error));
  }, []);

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
    }
  };

  const inputTextHandler = useCallback(
    (ticket) => (e) => {
      // console.log(ticket);
      dispatch(boxCreatTicket({ ticket }));
      const id = state.id;
      const x0 = Math.round(Math.min(state.x0, state.x1) / state.scaleRatio);
      const y0 = Math.round(Math.min(state.y0, state.y1) / state.scaleRatio);
      const x1 = Math.round(Math.max(state.x0, state.x1) / state.scaleRatio);
      const y1 = Math.round(Math.max(state.y0, state.y1) / state.scaleRatio);
      const boxWith = x1 - x0;
      const boxHeight = y1 - y0;
      onNewBox({
        id: id,
        x0: x0,
        y0: y0,
        x1: x1,
        y1: y1,
        ticket: ticket,
      });
      var ticketService = new TicketService();
      ticketService.addBoxTickets({
        boxStateId: id.toString(),
        imgUrl: imgSrc.toString(),
        ticketName: ticket.toString(),
        cordinateX: x0.toString(),
        cordinateY: y0.toString(),
        boxWith: boxWith.toString(),
        boxHeight: boxHeight.toString(),
      });

      dispatch(boxCreatTicketSaved());

      e.preventDefault();
      // }
    },

    [
      dispatch,
      imgSrc,
      onNewBox,
      state.id,
      state.scaleRatio,
      state.x0,
      state.x1,
      state.y0,
      state.y1,
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

        {boxes.map(({ x0, y0, x1, y1, id, ticket }) => (
          <div key={id}>
            <h6
              style={{
                fontSize: "8px",
                left: x0 * state.scaleRatio,
                top: y0 * state.scaleRatio - 14,
                color: "red",
              }}
            >
              X:{x0} - Y:{y0} - {ticket}
            </h6>

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
        ))}

        {state.isEditing && (
          <div
            className={styles.activeBox}
            style={{
              height: Math.abs(state.y0 - state.y1),
              width: Math.abs(state.x0 - state.x1),
              left: Math.min(state.x0, state.x1),
              top: Math.min(state.y0, state.y1),
            }}
          >
            {state.isThereTicket && (
              <div
                style={{
                  position: "absolute",
                }}
              >
                {choseTicket(inputTextHandler, tickets)}
              </div>
            )}
          </div>
        )}
      </span>
    </div>
  );
}
function choseTicket(inputTextHandler, tickets) {
  return (
    <ListGroup>
      {tickets.map((ticket) => (
        <ListGroupItem
          key={ticket.id}
          action
          onClick={inputTextHandler(ticket.ticketName)}
          tag="button"
        >
          {ticket.ticketName}
        </ListGroupItem>
      ))}

      {tickets.length === 0 && (
        <ListGroupItem color="danger" action tag="button">
          Servis Kontrol
        </ListGroupItem>
      )}
    </ListGroup>
  );
}
