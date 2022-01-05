import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import * as yup from 'yup';

import { Button } from '../../components/button';
import { FormField } from '../../components/form';
import { useAuth } from '../../context/auth-context';

export const registerSchemaValidation = yup
  .object({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().required(),
    companyName: yup.string().required(),
    companyEmail: yup.string().email().required(),
  })
  .required();

export function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, user: authUser } = useAuth();
  const from = useMemo(() => location.state?.from?.pathname || '/', [location]);
  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchemaValidation),
  });

  useEffect(() => {
    if (authUser) {
      navigate(from);
    }
  }, [authUser]);

  const onSubmit = useCallback(
    async (data) => {
      const user = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      };

      const enterprise = {
        name: data.companyName,
        email: data.companyEmail,
      };

      await register({ user, enterprise });
    },
    [register],
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
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign up</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/sign-in" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign in to your account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <FormField
            type="text"
            placeholder="First name"
            label="First name"
            {...registerField('firstName')}
            error={errors?.firstName}
          />

          <FormField
            type="text"
            placeholder="Last name"
            label="Last name"
            {...registerField('lastName')}
            error={errors?.lastName}
          />

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

          <FormField
            type="text"
            placeholder="Company name"
            label="Company name"
            {...registerField('companyName')}
            error={errors?.companyName}
          />
          <FormField
            type="email"
            placeholder="Company email"
            label="Company email"
            {...registerField('companyEmail')}
            error={errors?.companyEmail}
          />

          <div>
            <Button type="submit">Sign up</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
