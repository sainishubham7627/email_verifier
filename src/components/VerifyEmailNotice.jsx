import { Link } from "react-router-dom";

const VerifyEmailNotice = () => {
  return (
    <div>
      <h2>Verification Email Sent</h2>
      <p>Please check your inbox and click the verification link to activate your account.</p>
      <p>If you didn't receive the email, check your spam folder.</p>
      <Link to="/login">Back to Login</Link>
    </div>
  );
};

export default VerifyEmailNotice;
