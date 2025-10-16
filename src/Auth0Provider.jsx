import React from 'react';
import { Auth0Provider } from '@auth0/auth0-react';

const Auth0ProviderWrapper = ({ children }) => {
  return (
    <Auth0Provider
      domain="dev-123456.us.auth0.com"
      clientId="your-client-id"
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: "https://api.nocodesecrets.com"
      }}
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWrapper;