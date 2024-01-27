import type { NextPageWithConfig } from "~/shared/types";
import type { IconType } from "react-icons";
import { type EditClub, editClubSchema } from "cc-common";
import { useState } from "react";
import { useRouter } from "next/router";
import { type FormikHelpers, Formik, Field, Form } from "formik";
import cn from "classnames";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { toast } from "react-hot-toast";
import { TbBrandFacebook, TbBrandInstagram, TbBrandTwitter, TbCheck, TbLink } from "react-icons/tb";
import { queryClient, useGetTags, useEditClub, useDeleteClub } from "~/lib/queries";
import { withUser } from "~/shared/utils";
import { handleFormError, handleResponseError } from "~/lib/utils";
import {
  DashboardContainer as Page,
  TextInput,
  InputLabel,
  FieldError,
  OptionSelect,
  Tag,
  Button,
} from "~/shared/components";
import { useGetClub } from "~/lib/queries";
import { statusOptions, typeOptions } from "./new.page";

type SupportedPlatforms = (typeof supportedPlatforms)[number];

const supportedPlatforms = ["instagram", "facebook", "twitter", "website"] as const;

const AdminDashboardClub: NextPageWithConfig = () => {
  const router = useRouter();

  const cq = useGetClub(
    { query: { method: "id" }, params: { identifier: router.query.clubId as string }, body: undefined },
    { enabled: !!router.query.clubId, onError: (e) => handleResponseError(e, "Unable to fetch club") }
  );

  const tagsQuery = useGetTags(
    { body: undefined, params: undefined, query: undefined },
    { onError: (e) => handleResponseError(e, "Unable to get tags") }
  );

  const editClubMutation = useEditClub({
    onSuccess: async ({ id }) => {
      await queryClient.invalidateQueries(["club", { id }]);
      toast.success("Club updated successfully");
    },
  });

  const deleteClubMutation = useDeleteClub({
    onSuccess: async () => {
      await router.push("/admin/clubs");
      toast.success("Club deleted successfully");
    },
    onError: (e) => handleResponseError(e, { toast: "Failed to delete club" }),
  });

  const [selectedPlatforms, setSelectedPlatforms] = useState<Array<SupportedPlatforms>>([
    "website",
    "instagram",
    "facebook",
    "twitter",
  ] as Array<SupportedPlatforms>);

  const club = cq.data; // geez...

  //
  const initialValues: EditClub["body"] = {
    // type will be club
    name: club?.name,
    tags: club?.tags.map((tag) => tag.name),
    status: club?.status,
    applicationLink: club?.applicationLink,
    description: club?.description ?? undefined,

    president: club?.president,
    vicePresident: club?.vicePresident ?? undefined,
    secretary: club?.secretary ?? undefined,
    treasurer: club?.treasurer ?? undefined,
    advisor: club?.advisor,

    meetingFrequency: club?.meetingFrequency ?? undefined,
    meetingTime: club?.meetingTime ?? undefined,
    meetingDays: club?.meetingDays ?? undefined,
    meetingLocation: club?.meetingLocation ?? undefined,

    contactEmail: club?.contactEmail,
    website: club?.website ?? undefined,
    instagram: club?.instagram ?? undefined,
    facebook: club?.facebook ?? undefined,
    twitter: club?.twitter ?? undefined,
  };

  const handleSubmit = async (
    values: EditClub["body"],
    { setFieldError }: FormikHelpers<EditClub["body"]>
  ): Promise<void> => {
    if (!cq.isSuccess) {
      toast.error("Club data is invalid, please try again later");
      return;
    }
    try {
      const filteredValues = Object.entries(values).reduce((acc, [key, value]) => {
        if (initialValues[key as keyof EditClub["body"]] !== (value as EditClub["body"][keyof EditClub["body"]])) {
          acc[key as keyof Partial<EditClub["body"]>] = value as any; // any shouldn't be used here...
        }
        return acc;
      }, {} as Partial<EditClub["body"]>);

      await editClubMutation.mutateAsync({
        params: { identifier: cq.data.id },
        query: { method: "id" },
        body: filteredValues,
      });

      await router.push("/admin/clubs"); // should push?
    } catch (e) {
      handleFormError(e, { toast: "Failed to update club", setFieldError });
    }
  };

  const handleDeleteClub = async () => {
    if (!cq.isSuccess) {
      toast.error("Club data is invalid, please try again later");
      return;
    }
    await deleteClubMutation.mutateAsync({
      query: { method: "id" },
      params: { identifier: cq.data.id },
      body: undefined,
    });
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
    <Page state={cq.status}>
      <Page.Header
        title={`Manage ${club?.name}`} // conditional name
        description={`Edit and get an overview of the ${club?.name} club`}
      />
      <Page.Navigation
        links={[
          { label: "Manage", query: "manage", active: true },
          { label: "Metrics", query: "metrics", disabled: true },
        ]}
      />
      <Formik<EditClub["body"]>
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={toFormikValidationSchema(editClubSchema.shape.body)}
        enableReinitialize
      >
        {({ values, initialValues, touched, errors, dirty, isValid, isSubmitting, setFieldValue, setFieldTouched }) => (
          <Form placeholder="edit club" className="grid w-full grid-cols-1 gap-10 lg:grid-cols-2">
            <Page.Section
              title="General Club Information"
              description="Basic and required information for the club"
              childClass="flex flex-col gap-4"
            >
              {/* -------------------------------- CLUB NAME -------------------------------  */}

              <InputLabel value="Club Name" edited={initialValues.name !== values.name}>
                <Field name="name" component={TextInput} placeholder="Engineering" />
              </InputLabel>

              {/* -------------------------------- DESCRIPTION -------------------------------  */}

              <InputLabel value="Description" edited={initialValues.description !== values.description}>
                <Field
                  name="description"
                  textArea
                  component={TextInput}
                  placeholder="To identify a real-world problem and develop a solution to it. Equips students to become tech entrepreneurs and leaders."
                />
              </InputLabel>

              {/* -------------------------------- CLUB TYPE -------------------------------  */}

              <InputLabel value="Type">
                <OptionSelect
                  name="type"
                  options={typeOptions}
                  selected="CLUB"
                  touched={false}
                  errors={undefined}
                  disabled
                  setFieldValue={() => {}}
                  setFieldTouched={() => {}}
                />
              </InputLabel>

              {/* -------------------------------- STATUS -------------------------------  */}

              <InputLabel value="Status" edited={initialValues.status !== values.status}>
                <OptionSelect
                  name="status"
                  options={statusOptions}
                  selected={values.status as string}
                  touched={touched?.status}
                  errors={errors?.status}
                  setFieldValue={setFieldValue}
                  setFieldTouched={setFieldTouched}
                />
              </InputLabel>

              {/* -------------------------------- APPLICATION LINK -------------------------------  */}
              <InputLabel value="Application Link" edited={initialValues.applicationLink !== values.applicationLink}>
                <Field name="applicationLink" component={TextInput} placeholder="https://docs.google.com/forms/..." />
              </InputLabel>

              {/* had to declare value.tags as defined like 6 times... fix... */}
              {values.tags !== undefined ? (
                <InputLabel
                  value={`Tags (${values.tags.length}/3)`}
                  edited={JSON.stringify(initialValues.tags) !== JSON.stringify(values.tags)}
                >
                  <div className="flex w-full flex-wrap items-center gap-2">
                    {tagsQuery.data?.map(({ name: tag }) =>
                      values.tags ? (
                        <Tag
                          key={tag}
                          name={tag}
                          active={values.tags.includes(tag)}
                          variant="inline"
                          size="lg"
                          onClick={() => {
                            if (values.tags === undefined) return;
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
                      ) : null
                    )}
                  </div>
                  <FieldError touched={touched?.tags} error={errors?.tags} />
                </InputLabel>
              ) : null}
            </Page.Section>
            <div className="flex flex-col">
              <Page.Section
                title="Contact and Meeting Information"
                description="Relevant information for users to find and reference club"
                childClass="flex flex-col gap-4"
              >
                {/* MEETING DATE AND INFORMATION */}
                <InputLabel value="Meeting Location" edited={initialValues.meetingLocation !== values.meetingLocation}>
                  <Field name="meetingLocation" component={TextInput} placeholder="A101" />
                </InputLabel>
                <InputLabel value="Meeting Date and Time">
                  <div className="flex items-start gap-2">
                    <InputLabel value="Days" edited={initialValues.meetingDays !== values.meetingDays}>
                      <Field name="meetingDays" component={TextInput} placeholder="Tuesday, Thursday" />
                    </InputLabel>
                    <InputLabel value="Frequency" edited={initialValues.meetingFrequency !== values.meetingFrequency}>
                      <Field name="meetingFrequency" component={TextInput} placeholder="Weekly" />
                    </InputLabel>
                    <InputLabel value="Time" edited={initialValues.meetingTime !== values.meetingTime}>
                      <Field name="meetingTime" component={TextInput} placeholder="7-8:30 PM" />
                    </InputLabel>
                  </div>
                </InputLabel>
                <InputLabel value="Contact Email" edited={initialValues.contactEmail !== values.contactEmail}>
                  <Field name="contactEmail" component={TextInput} placeholder="dhns.engineering@gmail.com" />
                </InputLabel>
                <InputLabel
                  value="Social Media Links"
                  edited={
                    initialValues.instagram !== values.instagram ||
                    initialValues.facebook !== values.facebook ||
                    initialValues.twitter !== values.twitter ||
                    initialValues.website !== values.website
                  }
                >
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
                                setFieldValue(`${platform}`, null);
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
                <InputLabel
                  value="Leadership"
                  edited={
                    initialValues.president !== values.president ||
                    initialValues.vicePresident !== values.vicePresident ||
                    initialValues.secretary !== values.secretary ||
                    initialValues.treasurer !== values.treasurer ||
                    initialValues.advisor !== values.advisor
                  }
                >
                  <Field name="president" component={TextInput} placeholder="First Last" accessory="President" />
                  <Field
                    name="vicePresident"
                    component={TextInput}
                    placeholder="First Last"
                    accessory="Vice President"
                  />
                  <Field name="secretary" component={TextInput} placeholder="First Last" accessory="Secretary" />
                  <Field name="treasurer" component={TextInput} placeholder="First Last" accessory="Treasurer" />
                  <Field name="advisor" component={TextInput} placeholder="First Last" accessory="Advisor" />
                </InputLabel>
              </Page.Section>
            </div>
            <div className="col-span-1 flex w-full flex-col lg:col-span-2">
              <div className="mb-8 h-[1px] w-full bg-black-20" />
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button type="button" variant="secondary" onClick={() => router.push("/admin/clubs")}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    loading={isSubmitting}
                    disabled={!dirty || !isValid || initialValues === values || isSubmitting}
                    variant="primary"
                  >
                    {isSubmitting ? "Saving Changes..." : "Save Changes"}
                  </Button>
                </div>
                <Button type="button" variant="danger" onClick={handleDeleteClub}>
                  Delete Club
                </Button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </Page>
  );
};

AdminDashboardClub.layout = {
  view: "dashboard",
  config: {},
};

export const getServerSideProps = withUser({ role: "ADMIN" });

export default AdminDashboardClub;
