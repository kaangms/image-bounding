import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "reactstrap";
// import ImageCard from "./ImageCard";
import ImageForm from "./ImageForm";
import { imageBoxCreated, imagesReceived } from "../store/actions/imageAction";
import BoxesEditor from "./BoxesEditor";

function Dashboard() {
  const dispatch = useDispatch();

  const [imgUrl, setimgUrl] = useState("https://picsum.photos/256/186");
  const handleChange = (e) => {
    setimgUrl(URL.createObjectURL(e.target.files[0]));
  };
  const images = useSelector((state) => state.imageReducer.images);
  useEffect(() => {
    dispatch(imagesReceived([imgUrl]));
  }, [dispatch, imgUrl]);

  const handleNewBox = useCallback(
    (payload) => dispatch(imageBoxCreated(payload)),
    [dispatch]
  );
  return (
    <div className="layout-1">
      <Container>
        <div
          style={{ width: "500px", marginBottom: "20px", marginTop: "20px" }}
        >
          <ImageForm handleChange={handleChange} />
        </div>

        {Object.keys(images).length === 0 ? (
          <div>Something went wrong. No Images!</div>
        ) : (
          <div className="box-editor">
            <BoxesEditor
              onNewBox={handleNewBox}
              imgSrc={imgUrl}
              {...images[imgUrl]}
            />
          </div>
        )}
      </Container>
    </div>
  );
}

export default Dashboard;
