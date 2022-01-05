import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import * as yup from 'yup';

import { Button } from '../../components/button';
import { FormField } from '../../components/form';
import { useAuth } from '../../context/auth-context';

export const loginSchemaValidation = yup
  .object({
    email: yup.string().email().required(),
    password: yup.string().required(),
  })
  .required();

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user } = useAuth();
  const from = useMemo(() => location.state?.from?.pathname || '/', [location]);
  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchemaValidation),
  });

  useEffect(() => {
    if (user) {
      navigate(from);
    }
  }, [user]);

  const onSubmit = useCallback(
    async ({ email, password }) => {
      await login({ email, password });
    },
    [login],
  );

  return (
    <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <img
            className="mx-auto h-12 w-auto"
            src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
            alt="Workflow"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/sign-up" className="font-medium text-indigo-600 hover:text-indigo-500">
              start your FREE Account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <FormField
            type="email"
            placeholder="Email address"
            label="Email address"
            autoComplete="email"
            {...registerField('email')}
            error={errors?.email}
          />

          <FormField
            type="Password"
            autoComplete="current-password"
            placeholder="Password"
            label="Password"
            {...registerField('password')}
            error={errors?.password}
          />

          <div>
            <Button type="submit">Sign in</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
