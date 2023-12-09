import type { NextPageWithConfig } from "~/shared/types";
import type { IconType } from "react-icons";
import type { NewClub, GetTags } from "cc-common";
import { useState } from "react";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "react-query";
import { type FormikHelpers, Formik, Field, Form } from "formik";
import { z } from "zod";
import cn from "classnames";
import { toast } from "react-hot-toast";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { TbBrandFacebook, TbBrandInstagram, TbBrandTwitter, TbCheck, TbLink } from "react-icons/tb";
import { type Error, api } from "~/lib/api";
import { handleServerValidationErrors, isValidationError, withUser } from "~/shared/utils";
import { DashboardContainer as Page, TextInput, InputLabel, FieldError, Tag, Button } from "~/shared/components";

type SupportedPlatforms = (typeof supportedPlatforms)[number]; // duplicate code

const supportedPlatforms = ["instagram", "facebook", "twitter", "website"] as const;

const AdminDashboardNewClub: NextPageWithConfig = () => {
  const router = useRouter();
  const [selectedPlatforms, setSelectedPlatforms] = useState<Array<SupportedPlatforms>>(["website"]);

  const newClubMutation = useMutation<NewClub["payload"], Error, NewClub["args"]>(api.clubs.new, {
    onSuccess: (data) => {
      toast.success("Club created successfully");
    },
    onError: (e) => {
      if (!isValidationError(e)) toast.error("Failed to create club");
    },
  });
  const tagsQuery = useQuery<GetTags["payload"], Error>("tags", async () => await api.tags.all());

  const handleSubmit = async (
    values: NewClub["args"]["body"],
    { setFieldError }: FormikHelpers<NewClub["args"]["body"]>
  ): Promise<void> => {
    console.log(values);
    try {
      await newClubMutation.mutateAsync({ body: values });
      await router.push("/admin/clubs");
    } catch (e) {
      handleServerValidationErrors(e, setFieldError);
    }
  };

  const newClubValidation = z
    .object({
      name: z
        .string()
        .max(50, "Club name cannot be longer than 50 characters")
        .min(3, "Club name must be at least 3 characters"),
      description: z.string().min(10, "Club description must be at least 10 characters"),
      availability: z.enum(["OPEN", "APPLICATION", "CLOSED"]),
      applicationLink: z.string().optional().nullable(),
      tags: z.string().array().max(3, "You can only select up to 3 tags").min(1, "You must select at least 1 tag"),

      meetingFrequency: z.string(),
      meetingTime: z.string(),
      meetingDays: z.string(), // should be array of days
      meetingLocation: z.string(),

      contactEmail: z.string().email(),
      instagram: z.string().optional().nullable(),
      facebook: z.string().optional().nullable(),
      twitter: z.string().optional().nullable(),
      website: z.string().optional().nullable(),

      president: z.string(),
      vicePresident: z.string(),
      secretary: z.string(),
      treasurer: z.string(),
      advisor: z.string(),
    })
    .superRefine((input, ctx) => {
      if (input.availability === "APPLICATION" && !input.applicationLink) {
        ctx.addIssue({
          path: ["applicationLink"],
          code: z.ZodIssueCode.custom,
          message: "Required if the club requires an application",
        });
      }
    });

  const availabilityOptions = [
    {
      value: "OPEN",
      description:
        "An open availability for a club means that the club is open to anyone who wants to join. There are no requirements or restrictions on who can join.",
    },
    {
      value: "APPLICATION",
      description:
        "An application availability for a club means interested users must fill out an application then be invited by the club president through their ccid.",
    },
    {
      value: "CLOSED",
      description:
        "A closed availability for a club means that the club is not currently accepting new  This could be because the club is full, or because it is not currently active.",
    },
  ];

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
      <Formik<NewClub["args"]["body"]>
        initialValues={{
          name: "",
          description: "",
          availability: "OPEN",
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
        validationSchema={toFormikValidationSchema(newClubValidation)}
      >
        {({ values, touched, errors, dirty, isValid, isSubmitting, resetForm, setFieldValue, setFieldTouched }) => (
          <Form className="grid w-full grid-cols-1 gap-10 lg:grid-cols-2">
            <Page.Section
              title="General Club Information"
              description="Basic and required information for the club"
              childClass="flex flex-col gap-4"
            >
              <InputLabel value="Club Name" required>
                <Field name="name" component={TextInput} placeholder="Engineering" />
              </InputLabel>
              <InputLabel value="Description" required>
                <Field
                  name="description"
                  textArea
                  component={TextInput}
                  placeholder="To identify a real-world problem and develop a solution to it. Equips students to become tech entrepreneurs and leaders."
                />
              </InputLabel>
              <InputLabel value="Availability" required>
                {availabilityOptions.map(({ value: option, description }) => {
                  const isActive = values.availability === option;
                  return (
                    <div
                      key={option}
                      className={cn("box-border flex cursor-pointer flex-col gap-4 rounded-lg p-6 pr-24", {
                        "border border-black-20": !isActive,
                        "border-[2px] border-blue-70": isActive,
                      })}
                      onClick={() => {
                        if (!touched?.availability) {
                          setFieldTouched("availability", true);
                        }
                        setFieldValue("availability", option);
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={cn("flex h-6 w-6 items-center justify-center rounded-md", {
                            "bg-black-20": !isActive,
                            "bg-blue-70": isActive,
                          })}
                        >
                          {isActive ? <TbCheck className="stroke-[3px] text-sm text-white" /> : null}
                        </div>
                        <div className="font-medium capitalize">{option.toLowerCase()}</div>
                      </div>
                      <p className="text-sm text-black-70">{description}</p>
                    </div>
                  );
                })}
                <FieldError touched={touched?.availability} error={errors?.availability} />
              </InputLabel>
              {values.availability === "APPLICATION" ? (
                <InputLabel value="Application Link" required>
                  <Field name="applicationLink" component={TextInput} placeholder="https://docs.google.com/forms/..." />
                </InputLabel>
              ) : null}
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
                <InputLabel value="Meeting Location" required>
                  <Field name="meetingLocation" component={TextInput} placeholder="A101" />
                </InputLabel>
                <InputLabel value="Meeting Date and Time" required>
                  <div className="flex items-start gap-2">
                    <InputLabel value="Days">
                      <Field name="meetingDays" component={TextInput} placeholder="Tuesday, Thursday" />
                    </InputLabel>
                    <InputLabel value="Frequency" required>
                      <Field name="meetingFrequency" component={TextInput} placeholder="Weekly" />
                    </InputLabel>
                    <InputLabel value="Time" required>
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
                            platform === "website" ? "https://www.dnhsengineering.com/" : "dnhsengineering"
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
                title="Leadership and Members"
                description="All members of the club and their roles"
                childClass="flex flex-col gap-4"
              >
                <InputLabel value="Leadership" required>
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
