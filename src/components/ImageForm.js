import { Container, Form, FormGroup, Input, Label, Row } from "reactstrap";

const ImageForm = ({ handleChange }) => {
  return (
    <Form inline>
      <FormGroup>
        <Container>
          <Row xs="2">
            <Label for="exampleFile">File</Label>
            <Input
              id="exampleFile"
              name="file"
              type="file"
              onChange={handleChange}
            />
          </Row>
        </Container>
      </FormGroup>
    </Form>
  );
};
export default ImageForm;
