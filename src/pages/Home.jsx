import { Modal } from "keep-react";
import { Button } from "keep-react";
import { useState } from "react";

const Home = () => {
  const [showModalX, setShowModalX] = useState(false);
  const onClickTwo = () => {
    setShowModalX(!showModalX);
  };
  return (
    <>
      <Button onClick={onClickTwo} type="primary">
        Modal With Cross
      </Button>
      <Modal icon={"x"} size="md" show={showModalX} onClose={onClickTwo}>
        <Modal.Header>Do you want to upload this file?</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <p className="text-body-5 md:text-body-4 leading-relaxed text-metal-500">
              Contrary to popular belief, Lorem Ipsum is not simply random text.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button type="outlineGray" onClick={onClickTwo}>
            Cancel
          </Button>
          <Button type="primary" onClick={onClickTwo}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Home;
