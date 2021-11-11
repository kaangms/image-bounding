import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Container } from "reactstrap";
import ImageForm from "./ImageForm";
import {
  imageBoxCreated,
  imageChanged,
  imagesReceived,
} from "../store/actions/imageAction";
import BoxesEditor from "./BoxesEditor";

function Dashboard() {
  const dispatch = useDispatch();
  //TODO:url adresi kaldırılacak
  const [imgUrl, setimgUrl] = useState("https://picsum.photos/256/186");

  const handleChange = useCallback(
    (ev) => {
      setimgUrl(URL.createObjectURL(ev.target.files[0]));
      dispatch(imageChanged(imgUrl));
    },
    [dispatch, imgUrl]
  );
  const state = useSelector((state) => state.imageReducer);
  useEffect(() => {
    dispatch(imagesReceived([imgUrl]));
  }, [dispatch, imgUrl]);

  const handleNewBox = useCallback(
    (payload) => {
      // console.log(payload);
      dispatch(imageBoxCreated(payload));
    },
    [dispatch]
  );

  return (
    <div className="layout-1">
      <Container>
        <div style={{ width: "600px", marginBottom: "5px", marginTop: "20px" }}>
          <ImageForm handleChange={handleChange} />
          {/* //TODO:Alert gizlenecek */}
          <Alert color="warning">
            Etiketleme işlemi için lütfen enter tuşuna basınız..
          </Alert>
        </div>

        {imgUrl === undefined ? (
          <div>Lütfen resim yükleyiniz...</div>
        ) : Object.keys(state.images).length === 0 ? (
          <div>Something went wrong. No Images!</div>
        ) : (
          <div className="box-editor">
            <BoxesEditor
              onNewBox={handleNewBox}
              imgSrc={state.selectedImg}
              {...state.images[state.selectedImg]}
            />
          </div>
        )}
      </Container>
    </div>
  );
}

export default Dashboard;
