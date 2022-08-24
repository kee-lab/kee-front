import styled from "styled-components";

const StyledSignInLink = styled.p`
  text-align: center;
  margin: 24px 0 8px;
  > span {
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: #667085;
    margin-right: 4px;
  }

  > a {
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    color: #22d3ee;
    cursor: pointer;
  }
`;

export default function SignInLink() {
  const handleSignIn = () => {
    location.href = "/#/login";
  };
  return (
    <StyledSignInLink>
      <span>Have an account?</span>
      <a onClick={handleSignIn}>Sign In</a>
    </StyledSignInLink>
  );
}
