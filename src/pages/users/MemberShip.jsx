import { useEffect, useState } from "react";
import { Button, Card, Modal } from "keep-react";
import useTitle from "../../hooks/useTitle";
import { FaRegCircleCheck } from "react-icons/fa6";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "../../components/PaymentForm";
import { MdOutlinePayment } from "react-icons/md";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const MemberShip = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [clientSecret, setClientSecret] = useState("");
  const [showModal, setShowModal] = useState(false);

  const changeTitle = useTitle();
  changeTitle("MemberShip - DevMingle");

  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);
  const price = 5.99;

  useEffect(() => {
    (async () => {
      const { data } = await axiosSecure.post(
        "/payment/create_intent",
        { price },
        { params: { email: user?.email } }
      );
      setClientSecret(data.clientSecret);
    })();
  }, [axiosSecure, user]);

  const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <>
      <Card className="max-w-sm mx-auto p-6 shadow-md">
        <Card.Title className="text-body-2 font-medium text-primary-500">
          Gold package
        </Card.Title>
        <Card.Title className="flex items-center">
          <span className="text-heading-4 font-bold text-metal-800">$5.99</span>
          <span className="ml-1 text-body-4 font-medium text-metal-400">
            / mth
          </span>
        </Card.Title>
        <Card.Container tag="ul" className="my-2 space-y-3 text-sm">
          <Card.List className="flex items-center gap-1.5">
            <FaRegCircleCheck size={24} color="#1B4DFF" />
            <span className=" text-metal-700">Unlimited post</span>
          </Card.List>
          <Card.List className="flex items-center gap-1.5">
            <FaRegCircleCheck size={24} color="#1B4DFF" />
            <span className=" text-metal-700">
              Exclusive Access to Premium Content
            </span>
          </Card.List>
          <Card.List className="flex items-center gap-1.5">
            <FaRegCircleCheck size={24} color="#1B4DFF" />
            <span className=" text-metal-700">
              Priority Support and Mentorship
            </span>
          </Card.List>
          <Card.List className="flex items-center gap-1.5">
            <FaRegCircleCheck size={24} color="#1B4DFF" />
            <span className=" text-metal-700">
              Early Access to New Features and Updates
            </span>
          </Card.List>
        </Card.Container>
        <Button
          type="primary"
          className="active:focus:scale-95 duration-100"
          width="full"
          onClick={() => setShowModal((l) => !l)}
        >
          Pro Access
        </Button>
      </Card>
      <Modal
        size="md"
        icon={<MdOutlinePayment size={28} color="#1B4DFF" />}
        show={showModal}
        onClose={() => setShowModal((l) => !l)}
        position="center"
      >
        <Modal.Header>Payment</Modal.Header>
        <Modal.Body className="mt-6 p-0">
          {clientSecret && (
            <Elements stripe={stripePromise} options={options}>
              <PaymentForm clientSecret={clientSecret} />
            </Elements>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default MemberShip;
