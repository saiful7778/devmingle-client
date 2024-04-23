import { Suspense } from "react";
import PropTypes from "prop-types";
import Loading from "@/components/Loading";

const SuspenseProvider = ({ children }) => {
  return <Suspense fallback={<Loading />}>{children}</Suspense>;
};

SuspenseProvider.propTypes = {
  children: PropTypes.node,
};

export default SuspenseProvider;
