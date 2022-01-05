import React from 'react';

import { FullPageSpinner } from '../components/full-page-spinner';
import { useAsync } from '../hook';
import { getToken, logout as logoutApi, me, signIn, signUp } from '../libs/api';
import { queryClient } from '../libs/react-query';

async function bootstrapAppData() {
  let user = null;

  const token = await getToken();
  if (token) {
    const res = await me();

    user = { ...res.data };
  }

  return user;
}

const AuthContext = React.createContext();
AuthContext.displayName = 'AuthContext';

function AuthProvider(props) {
  const { data: user, status, error, isLoading, isIdle, isError, isSuccess, run, setData } = useAsync();

  React.useEffect(() => {
    const appDataPromise = bootstrapAppData();
    run(appDataPromise);
  }, [run]);

  const login = React.useCallback((form) => signIn(form).then(() => run(bootstrapAppData())), [run]);
  const register = React.useCallback((form) => signUp(form).then(() => run(bootstrapAppData())), [run]);
  const logout = React.useCallback(async () => {
    await logoutApi();
    setData(null);
    queryClient.clear();
  }, [setData]);

  const value = React.useMemo(() => ({ user, login, logout, register }), [login, logout, register, user]);

  if (isLoading || isIdle) {
    return <FullPageSpinner />;
  }

  if (isError) {
    return <div>Error: {error?.message}</div>;
  }

  if (isSuccess) {
    return <AuthContext.Provider value={value} {...props} />;
  }

  throw new Error(`Unhandled status: ${status}`);
}

function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error(`useAuth must be used within a AuthProvider`);
  }
  return context;
}

export { AuthProvider, useAuth };
