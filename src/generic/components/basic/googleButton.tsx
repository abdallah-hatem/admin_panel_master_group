import { GoogleLogin } from '@react-oauth/google';

export default function GoogleButton() {
  return (
    <GoogleLogin
      onSuccess={(credentialResponse: any) => {
        console.log(credentialResponse);
      }}
      onError={() => {
        console.log('Login Failed');
      }}
      width="100%"
    />
  );
}
