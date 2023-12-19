import type { NextPageWithConfig } from "~/shared/types";
import { Login, loginSchema } from "cc-common";
import { useRouter } from "next/router";
import { useQueryClient } from "react-query";
import { type FormikHelpers, Formik, Form, Field } from "formik";
import { toast } from "react-hot-toast";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { useLogin } from "~/lib/queries";
import { handleFormError } from "~/shared/utils";
import { Button, FieldError, InputLabel, TextInput, Logo, ClubCompassLogo } from "~/shared/components";

const LoginPage: NextPageWithConfig = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const loginMutation = useLogin({
    onSuccess: async () => {
      // set cookie on browser >:(
      await queryClient.invalidateQueries({ queryKey: ["user"] });
      await router.push("/admin/clubs"); // pushing to clubs instead of index bc it doesn't exist
      toast.success("Successfully logged in");
    },
  });

  const handleSubmit = async (
    values: Login["body"],
    { setFieldError }: FormikHelpers<Login["body"]>
  ): Promise<void> => {
    try {
      await loginMutation.mutateAsync({ body: values, params: undefined, query: undefined });
    } catch (e) {
      handleFormError(e, { toast: "Login failed", setFieldError });
    }
  };

  return (
    <div className="h-screen w-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="flex w-full justify-center items-center">
        <div className="w-[30rem] grid grid-rows-[180px_1fr_1fr] py-8 h-screen">
          <div className="flex items-center">
            <Logo withText />
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <h1 className="font-semibold text-3xl">Login</h1>
              <p className="text-black-60 text-sm">Welcome back! Enter your details to see and manage your clubs.</p>
            </div>
            <Formik<Login["body"]>
              initialValues={{ username: "", password: "" }} // track type state through formik?
              onSubmit={handleSubmit}
              validationSchema={toFormikValidationSchema(loginSchema.shape.body)}
            >
              {({ isSubmitting, isValid, dirty }) => (
                <Form className="flex flex-col gap-4 w-full">
                  <InputLabel value="Username">
                    <Field name="username" component={TextInput} placeholder="Jennifer27" />
                  </InputLabel>
                  <InputLabel value="Password">
                    <Field type="password" name="password" component={TextInput} placeholder="••••••••••••" />
                  </InputLabel>
                  {loginMutation.error?.response?.data.code === 401 ? (
                    <FieldError touched error={loginMutation.error?.response.data.message} />
                  ) : null}
                  <Button
                    type="submit"
                    loading={isSubmitting}
                    disabled={!dirty || !isValid || isSubmitting}
                    variant="primary"
                    style={{ marginTop: "6px" }}
                  >
                    {isSubmitting ? "Logging in" : "Login"}
                  </Button>
                  <p className="text-red-500 text-xs italic">Note: Phase 1 of CC only allows ASB to have accounts.</p>
                </Form>
              )}
            </Formik>
          </div>
          {/* <p className="flex items-end mb-4 text-xs text-black-70">© 2021 Club Compass. All Rights Reserved.</p> */}
        </div>
      </div>
      <div className="hidden lg:flex h-full w-full bg-gradient-to-bl from-blue-70 to-blue-50 justify-center items-center">
        <div className="flex flex-col gap-4 text-white justify-center items-center">
          <ClubCompassLogo white className="w-14 h-14 mb-2" />
          <h2 className="font-bold text-4xl uppercase tracking-wide">Club Compass</h2>
          <p className="uppercase font-semibold text-sm">Redefining club discovery</p>
        </div>
      </div>
    </div>
  );
};

LoginPage.layout = { view: "none" };

export default LoginPage;
