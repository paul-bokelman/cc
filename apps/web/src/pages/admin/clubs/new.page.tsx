import type { NextPageWithConfig } from "~/shared/types";
import type { IconType } from "react-icons";
import { NewClub, newClubSchema } from "cc-common";
import { useState } from "react";
import { useRouter } from "next/router";
import { type FormikHelpers, Formik, Field, Form } from "formik";
import cn from "classnames";
import { toast } from "react-hot-toast";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { TbBrandFacebook, TbBrandInstagram, TbBrandTwitter, TbLink } from "react-icons/tb";
import { useGetTags, useNewClub } from "~/lib/queries";
import { withUser } from "~/shared/utils";
import { handleResponseError, handleFormError } from "~/lib/utils";
import {
  DashboardContainer as Page,
  TextInput,
  InputLabel,
  FieldError,
  OptionSelect,
  Tag,
  Button,
} from "~/shared/components";

type SupportedPlatforms = (typeof supportedPlatforms)[number]; // duplicate code

const supportedPlatforms = ["instagram", "facebook", "twitter", "website"] as const;

export const typeOptions = [
  {
    value: "CLUB",
    description: "Club is a student organization that is not affiliated with a department or school.",
  },
  {
    value: "ORGANIZATION",
    description: "Club is a student organization that is affiliated with a department or school.",
  },
];

export const statusOptions = [
  {
    value: "ACTIVE",
    description: "Club is currently active and accepting new members.",
  },
  {
    value: "INTEREST",
    description: "Club is not active, but is accepting interest forms.",
  },
  {
    value: "INACTIVE",
    description: "Club is not active and is not accepting interest forms.",
  },
];

const AdminDashboardNewClub: NextPageWithConfig = () => {
  const router = useRouter();
  const [selectedPlatforms, setSelectedPlatforms] = useState<Array<SupportedPlatforms>>(["website"]);

  const newClubMutation = useNewClub({
    onSuccess: () => {
      toast.success("Club created successfully");
    },
  });

  const tagsQuery = useGetTags(
    { body: undefined, params: undefined, query: undefined },
    { onError: (e) => handleResponseError(e, "Unable to get tags") }
  );

  const handleSubmit = async (values: NewClub["body"], { setFieldError }: FormikHelpers<NewClub["body"]>) => {
    try {
      await newClubMutation.mutateAsync({ body: values, params: undefined, query: undefined });
      await router.push("/admin/clubs");
    } catch (e) {
      handleFormError(e, { toast: "Unable to create club", setFieldError });
    }
  };

  const socialMediaOptions: {
    [key in SupportedPlatforms]: { icon: IconType };
  } = {
    instagram: { icon: TbBrandInstagram },
    facebook: { icon: TbBrandFacebook },
    twitter: { icon: TbBrandTwitter },
    website: { icon: TbLink },
  };

  return (
    <Page state="success">
      <Page.Header title="New Club" description="Fill out all the information below to create a new club" />
      <Formik<NewClub["body"]>
        initialValues={{
          name: "",
          description: "",
          type: "CLUB",
          status: "INTEREST",
          applicationLink: null,
          tags: [],
          meetingFrequency: "",
          meetingTime: "",
          meetingDays: "",
          meetingLocation: "",
          contactEmail: "",
          instagram: null,
          facebook: null,
          twitter: null,
          website: null,
          president: "",
          vicePresident: "",
          secretary: "",
          treasurer: "",
          advisor: "",
        }} // track type state through formik?
        onSubmit={handleSubmit}
        validationSchema={toFormikValidationSchema(newClubSchema.shape.body)}
      >
        {({ values, touched, errors, dirty, isValid, isSubmitting, setFieldValue, setFieldTouched }) => (
          <Form placeholder="new club" className="grid w-full grid-cols-1 gap-10 lg:grid-cols-2">
            <Page.Section
              title="General Club Information"
              description="Basic and required information for the club"
              childClass="flex flex-col gap-4"
            >
              {/* -------------------------------- CLUB NAME -------------------------------  */}
              <InputLabel value="Club Name" required>
                <Field name="name" component={TextInput} placeholder="Engineering" />
              </InputLabel>

              {/* -------------------------------- DESCRIPTION -------------------------------  */}
              <InputLabel value="Description" required>
                <Field
                  name="description"
                  textArea
                  component={TextInput}
                  placeholder="To identify a real-world problem and develop a solution to it. Equips students to become tech entrepreneurs and leaders."
                />
              </InputLabel>

              {/* -------------------------------- TYPE -------------------------------  */}
              <InputLabel value="Type" required>
                <OptionSelect
                  name="type"
                  options={typeOptions}
                  selected={values.type}
                  touched={touched?.type}
                  errors={errors?.type}
                  setFieldValue={setFieldValue}
                  setFieldTouched={setFieldTouched}
                />
              </InputLabel>

              {/* -------------------------------- STATUS -------------------------------  */}
              <InputLabel value="Status" required>
                <OptionSelect
                  name="status"
                  options={statusOptions}
                  selected={values.status}
                  touched={touched?.status}
                  errors={errors?.status}
                  setFieldValue={setFieldValue}
                  setFieldTouched={setFieldTouched}
                />
              </InputLabel>

              <InputLabel value="Application Link">
                <Field name="applicationLink" component={TextInput} placeholder="https://docs.google.com/forms/..." />
              </InputLabel>

              {/* -------------------------------- TAGS -------------------------------  */}
              <InputLabel value={`Tags (${values.tags?.length ?? 0}/3)`} required>
                <div className="flex w-full flex-wrap items-center gap-2">
                  {tagsQuery.data?.map(({ name: tag }) => (
                    <Tag
                      key={tag}
                      name={tag}
                      active={values.tags.includes(tag)}
                      variant="inline"
                      size="lg"
                      onClick={() => {
                        if (!touched?.tags) {
                          setFieldTouched("tags", true);
                        }
                        if (values.tags.length >= 3 && !values.tags.includes(tag)) return;
                        if (values.tags.includes(tag)) {
                          setFieldValue(
                            "tags",
                            values.tags.filter((t) => t !== tag)
                          );
                        } else {
                          setFieldValue("tags", [...values.tags, tag]);
                        }
                      }}
                    />
                  ))}
                </div>
                <FieldError touched={touched?.tags} error={errors?.tags} />
              </InputLabel>
            </Page.Section>
            <div className="flex flex-col">
              <Page.Section
                title="Contact and Meeting Information"
                description="Relevant information for users to find and reference club"
                childClass="flex flex-col gap-4"
              >
                {/* MEETING DATE AND INFORMATION */}
                <InputLabel value="Meeting Location">
                  <Field name="meetingLocation" component={TextInput} placeholder="A101" />
                </InputLabel>
                <InputLabel value="Meeting Date and Time">
                  <div className="flex items-start gap-2">
                    <InputLabel value="Days">
                      <Field name="meetingDays" component={TextInput} placeholder="Tuesday, Thursday" />
                    </InputLabel>
                    <InputLabel value="Frequency">
                      <Field name="meetingFrequency" component={TextInput} placeholder="Weekly" />
                    </InputLabel>
                    <InputLabel value="Time">
                      <Field name="meetingTime" component={TextInput} placeholder="7-8:30 PM" />
                    </InputLabel>
                  </div>
                </InputLabel>
                <InputLabel value="Contact Email" required>
                  <Field name="contactEmail" component={TextInput} placeholder="dhns.engineering@gmail.com" />
                </InputLabel>
                <InputLabel value="Social Media Links">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      {supportedPlatforms.map((platform) => {
                        const Icon = socialMediaOptions[platform].icon;
                        const isActive = selectedPlatforms.includes(platform);
                        return (
                          <div
                            key={platform}
                            className={cn(
                              {
                                "border-blue-70 bg-blue-10": isActive,
                                "border-black-20 hover:bg-black-10": !isActive,
                              },
                              "flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border transition-colors"
                            )}
                            onClick={() => {
                              if (isActive) {
                                setSelectedPlatforms(selectedPlatforms.filter((p) => p !== platform));
                              } else {
                                setSelectedPlatforms([...selectedPlatforms, platform]);
                              }
                            }}
                          >
                            <Icon className={cn({ "text-blue-70": isActive }, "text-lg")} />
                          </div>
                        );
                      })}
                    </div>
                    {selectedPlatforms.length !== 0 ? (
                      selectedPlatforms.map((platform) => (
                        <Field
                          key={platform}
                          name={platform}
                          component={TextInput}
                          placeholder={`${
                            platform === "website" ? "https://www.school-engineering.com/" : "school-engineering"
                          }`}
                          accessory={socialMediaOptions[platform].icon}
                        />
                      ))
                    ) : (
                      <p>No social media platforms selected.</p>
                    )}
                  </div>
                </InputLabel>
              </Page.Section>
              <Page.Section
                title="Leadership Information"
                description="Members in leadership positions for the club"
                childClass="flex flex-col gap-4"
              >
                <InputLabel value="Leadership" required>
                  <Field name="advisor" required component={TextInput} placeholder="First Last" accessory="Advisor" />
                  <Field
                    name="president"
                    required
                    component={TextInput}
                    placeholder="First Last"
                    accessory="President"
                  />
                  <Field
                    name="vicePresident"
                    component={TextInput}
                    placeholder="First Last"
                    accessory="Vice President"
                  />
                  <Field name="secretary" component={TextInput} placeholder="First Last" accessory="Secretary" />
                  <Field name="treasurer" component={TextInput} placeholder="First Last" accessory="Treasurer" />
                </InputLabel>
              </Page.Section>
            </div>
            <div className="col-span-1 flex w-full flex-col lg:col-span-2">
              <div className="mb-8 h-[1px] w-full bg-black-20" />
              <div className="flex items-center gap-2">
                <Button type="button" variant="secondary" onClick={() => router.push("/admin/clubs")}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={isSubmitting}
                  disabled={!dirty || !isValid || isSubmitting}
                  variant="primary"
                >
                  {isSubmitting ? "Creating Club" : "Create Club"}
                </Button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </Page>
  );
};

AdminDashboardNewClub.layout = {
  view: "dashboard",
  config: {},
};

export const getServerSideProps = withUser({ role: "ADMIN" });

export default AdminDashboardNewClub;
