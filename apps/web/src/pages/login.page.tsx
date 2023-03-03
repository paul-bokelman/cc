import type { NextPageWithConfig } from '~/shared/types';
import type { Login } from '@/cc';
import { useRouter } from 'next/router';
import { useMutation, useQueryClient } from 'react-query';
import { type FormikHelpers, Formik, Form, Field } from 'formik';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { type Error, api } from '~/lib/api';
import { handleServerValidationErrors, isValidationError } from '~/shared/utils';
import { Button, FieldError, InputLabel, TextInput } from '~/shared/components';

const LoginPage: NextPageWithConfig = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const loginMutation = useMutation<Login['payload'], Error, Login['args']>(api.auth.login, {
    onSuccess: async (d) => {
      // set cookie on browser >:(
      await queryClient.invalidateQueries(['user']);
      await router.push('/admin/clubs'); // pushing to clubs instead of index bc it doesn't exist
      toast.success('Successfully logged in');
    },
    onError: (e) => {
      // if (!isValidationError(e)) toast.error('Failed to login');
    },
  });

  const handleSubmit = async (
    values: Login['args']['body'],
    { setFieldError }: FormikHelpers<Login['args']['body']>
  ): Promise<void> => {
    try {
      await loginMutation.mutateAsync({ body: values });
    } catch (e) {
      handleServerValidationErrors(e, setFieldError);
    }
  };

  const loginValidation = z.object({ username: z.string(), password: z.string() });

  return (
    <div className="mt-20 w-full flex justify-center items-center">
      <div className="flex flex-col justify-center gap-8 w-[30rem] items-start">
        <div className="flex flex-col gap-4">
          <h1 className="font-semibold text-2xl ">Login</h1>
          <p className="text-black-60 text-sm">Welcome back! Enter your details to see and manage your clubs.</p>
          <p className="text-red-500 text-xs italic">Note: Phase 1 of CC only allows ASB to have accounts.</p>
        </div>
        <Formik<Login['args']['body']>
          initialValues={{
            username: '',
            password: '',
          }} // track type state through formik?
          onSubmit={handleSubmit}
          validationSchema={toFormikValidationSchema(loginValidation)}
        >
          {({ isSubmitting, isValid, dirty }) => (
            <Form className="flex flex-col gap-4 w-full">
              <InputLabel value="Username">
                <Field name="username" component={TextInput} placeholder="Jennifer27" />
              </InputLabel>
              <InputLabel value="Password">
                <Field type="password" name="password" component={TextInput} placeholder="••••••••••••••" />
              </InputLabel>
              {loginMutation.error?.response.data.code === 401 ? (
                <FieldError touched error={loginMutation.error?.response.data.message} />
              ) : null}
              <Button
                type="submit"
                loading={isSubmitting}
                disabled={!dirty || !isValid || isSubmitting}
                variant="primary"
                style={{ marginTop: '6px' }}
              >
                {isSubmitting ? 'Logging in' : 'Login'}
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

LoginPage.layout = { view: 'standard', config: {} };

export default LoginPage;
