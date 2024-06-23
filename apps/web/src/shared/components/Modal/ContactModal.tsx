import type { BaseModalProps } from "."; // should be on base modal
import { Inquiry, inquirySchema } from "cc-common";
import * as React from "react";
import { toast } from "react-hot-toast";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { TbX } from "react-icons/tb";
import { Dialog, Transition } from "@headlessui/react";
import { type FormikHelpers, Field, Form, Formik } from "formik";
import { useNewInquiry } from "~/lib/queries";
import { Button, InputLabel, TextInput } from "~/shared/components";
import { handleFormError } from "~/lib/utils";

type ContactModalProps = BaseModalProps;
type ContactFormValues = Inquiry["body"];

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, closeModal }) => {
  const newInquiryMutation = useNewInquiry({
    onSuccess: () => {
      toast.success("Thanks for reaching out! We'll get back to you soon");
    },
    onError: () => {
      toast.error("Failed to submit inquiry, please try again later");
    },
  });

  const handleSubmit = async (
    values: ContactFormValues,
    { setFieldError }: FormikHelpers<ContactFormValues>
  ): Promise<void> => {
    try {
      await newInquiryMutation.mutateAsync({ params: undefined, query: undefined, body: values });
      closeModal();
    } catch (e) {
      handleFormError(e, { toast: false, setFieldError });
    }
  };

  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-40" onClose={closeModal}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto mx-4">
          <div className="flex min-h-full items-center justify-center text-center">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="flex w-2xl transform flex-col gap-4 overflow-hidden rounded-2xl bg-white py-6 text-left align-middle shadow-xl transition-all">
                <div className="border-b border-gray-200 w-full grid grid-cols-3 pb-3 px-8">
                  <div className="cursor-pointer flex box-content w-fit items-center p-[7px] rounded-full border border-transparent hover:border-black-60/50 transition-colors">
                    <TbX className="text-lg" onClick={closeModal} />
                  </div>
                  <p className="font-semibold w-full flex justify-center items-center">Contact Us</p>
                </div>
                <div className="flex flex-col gap-8 overflow-y-scroll px-8">
                  <Formik
                    initialValues={{
                      firstName: "",
                      lastName: "",
                      email: "",
                      message: "",
                    }}
                    onSubmit={handleSubmit}
                    validationSchema={toFormikValidationSchema(inquirySchema.shape.body)}
                  >
                    {({ isSubmitting, dirty, isValid }) => (
                      <Form placeholder="edit club" className="flex flex-col gap-2">
                        <div className="grid grid-cols-2 gap-2">
                          {/* ------------------------------- FIRST NAME ------------------------------- */}
                          <InputLabel value="First Name" required>
                            <Field name="firstName" component={TextInput} placeholder="John" />
                          </InputLabel>
                          {/* -------------------------------- LAST NAME ------------------------------- */}
                          <InputLabel value="Last Name" required>
                            <Field name="lastName" component={TextInput} placeholder="Doe" />
                          </InputLabel>
                        </div>

                        {/* ---------------------------------- EMAIL --------------------------------- */}
                        <InputLabel value="Email" required>
                          <Field name="email" component={TextInput} placeholder="example@gmail.com" />
                        </InputLabel>

                        {/* ---------------------------------- MESSAGE --------------------------------- */}
                        <InputLabel value="Message" required>
                          <Field name="message" component={TextInput} placeholder="Your message" textArea />
                        </InputLabel>

                        <div className="mt-3 w-full flex justify-end">
                          <Button
                            type="submit"
                            loading={isSubmitting}
                            disabled={!dirty || !isValid || isSubmitting}
                            variant="primary"
                            style={{ width: "fit-content" }}
                          >
                            {isSubmitting ? "Submitting" : "Submit"}
                          </Button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
