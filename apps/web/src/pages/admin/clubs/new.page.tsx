import type { NextPageWithConfig } from '~/shared/types';
import type { IconType } from 'react-icons';
import { useState } from 'react';
import { type FormikHelpers, Formik, Field, Form } from 'formik';
import { z } from 'zod';
import cn from 'classnames';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import {
  TbBrandFacebook,
  TbBrandInstagram,
  TbBrandTwitter,
  TbCheck,
  TbLink,
} from 'react-icons/tb';
import {
  tagNames,
  DashboardContainer as Page,
  TextInput,
  InputLabel,
  FieldError,
  Tag,
  Button,
} from '~/shared/components';

// type NewClubValues = {
//   general: {
//     name: string;
//     description: string;
//     availability: "open" | "application" | "closed";
//     applicationLink?: string;
//     tags: Array<typeof tagNames[number]>; // could use TagNames but lets be honest that's another import
//   };

//   meetingInformation: {
//     frequency: string;
//     time: string;
//     days: string;
//     location: string;
//   };

//   contactInformation: {
//     email: string;
//     media: { [key in SupportedPlatforms]: string };
//   };

//   members: {
//     president: string;
//     vicePresident: string;
//     secretary: string;
//     treasurer: string;
//     advisor: string;
//   };
// };

type SupportedPlatforms = (typeof supportedPlatforms)[number];

const supportedPlatforms = [
  'instagram',
  'facebook',
  'twitter',
  'website',
] as const;

const AdminDashboardNewClub: NextPageWithConfig = () => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<
    Array<SupportedPlatforms>
  >(['website']);

  type NewClubValues = z.infer<typeof newClubValidation>;

  const handleSubmit = async (
    values: NewClubValues,
    { resetForm, setFieldError }: FormikHelpers<NewClubValues>
  ): Promise<void> => {
    try {
      // event
    } catch (error) {
      // server side validation
    }
  };

  const newClubValidation = z.object({
    general: z
      .object({
        name: z
          .string()
          .max(50, 'Club name cannot be longer than 50 characters')
          .min(3, 'Club name must be at least 3 characters'),
        description: z
          .string()
          .min(10, 'Club description must be at least 10 characters'),
        availability: z.enum(['open', 'application', 'closed']),
        applicationLink: z.string().optional(),
        tags: z
          .enum(tagNames)
          .array()
          .max(3, 'You can only select up to 3 tags')
          .min(1, 'You must select at least 1 tag'),
      })
      .superRefine((input, ctx) => {
        console.log(input.applicationLink);
        if (input.availability === 'application' && !input.applicationLink) {
          ctx.addIssue({
            path: ['applicationLink'],
            code: z.ZodIssueCode.custom,
            message: 'Required if the club requires an application',
          });
        }
      }),

    meetingInformation: z.object({
      frequency: z.string(),
      time: z.string(),
      days: z.string(), // should be array of days
      location: z.string(),
    }),

    contactInformation: z.object({
      email: z.string().email(),
      media: z
        .object({
          instagram: z.string().optional(),
          facebook: z.string().optional(),
          twitter: z.string().optional(),
          website: z.string().optional(),
        })
        .superRefine((input, ctx) => {
          supportedPlatforms.map((platform) => {
            if (selectedPlatforms.includes(platform) && !input[platform]) {
              ctx.addIssue({
                path: [`${platform}`],
                message: 'A value is required to include this platform',
                code: z.ZodIssueCode.custom,
              });
            }
          });
        }),
    }),

    members: z.object({
      president: z.string(),
      vicePresident: z.string(),
      secretary: z.string(),
      treasurer: z.string(),
      advisor: z.string(),
    }),
  });

  const availabilityOptions = [
    {
      value: 'open',
      description:
        'An open availability for a club means that the club is open to anyone who wants to join. There are no requirements or restrictions on who can join.',
    },
    {
      value: 'application',
      description:
        'An application availability for a club means interested users must fill out an application then be invited by the club president through their ccid.',
    },
    {
      value: 'closed',
      description:
        'A closed availability for a club means that the club is not currently accepting new members. This could be because the club is full, or because it is not currently active.',
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
      <Page.Header
        title="New Club"
        description="Fill out all the information below to create a new club"
      />
      <Formik<NewClubValues>
        initialValues={{
          general: {
            name: '',
            description: '',
            availability: 'open',
            applicationLink: undefined,
            tags: [],
          },

          meetingInformation: {
            frequency: '',
            time: '',
            days: '',
            location: '',
          },

          contactInformation: {
            email: '',
            media: {
              instagram: '',
              facebook: '',
              twitter: '',
              website: '',
            },
          },

          members: {
            president: '',
            vicePresident: '',
            secretary: '',
            treasurer: '',
            advisor: '',
          },
        }} // track type state through formik?
        onSubmit={handleSubmit}
        validationSchema={toFormikValidationSchema(newClubValidation)}
      >
        {({
          values,
          touched,
          errors,
          dirty,
          isValid,
          isSubmitting,
          resetForm,
          setFieldValue,
          setFieldTouched,
        }) => (
          <Form className="grid w-full grid-cols-1 gap-10 lg:grid-cols-2">
            <Page.Section
              title="General Club Information"
              description="Basic and required information for the club"
              childClass="flex flex-col gap-4"
            >
              <InputLabel value="Club Name" required>
                <Field
                  name="general.name"
                  component={TextInput}
                  placeholder="Engineering"
                />
              </InputLabel>
              <InputLabel value="Description" required>
                <Field
                  name="general.description"
                  textArea
                  component={TextInput}
                  placeholder="To identify a real-world problem and develop a solution to it. Equips students to become tech entrepreneurs and leaders."
                />
              </InputLabel>
              <InputLabel value="Availability" required>
                {availabilityOptions.map(({ value: option, description }) => {
                  const isActive = values.general.availability === option;
                  return (
                    <div
                      key={option}
                      className={cn(
                        'box-border flex cursor-pointer flex-col gap-4 rounded-lg p-6 pr-24',
                        {
                          'border border-black-20': !isActive,
                          'border-[2px] border-blue-70': isActive,
                        }
                      )}
                      onClick={() => {
                        if (!touched.general?.availability) {
                          setFieldTouched('general.availability', true);
                        }
                        setFieldValue('general.availability', option);
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            'flex h-6 w-6 items-center justify-center rounded-md',
                            { 'bg-black-20': !isActive, 'bg-blue-70': isActive }
                          )}
                        >
                          {isActive ? (
                            <TbCheck className="stroke-[3px] text-sm text-white" />
                          ) : null}
                        </div>
                        <div className="font-medium capitalize">{option}</div>
                      </div>
                      <p className="text-sm text-black-70">{description}</p>
                    </div>
                  );
                })}
                <FieldError
                  touched={touched.general?.availability}
                  error={errors.general?.availability}
                />
              </InputLabel>
              {values.general.availability === 'application' ? (
                <InputLabel value="Application Link" required>
                  <Field
                    name="general.applicationLink"
                    component={TextInput}
                    placeholder="https://docs.google.com/forms/..."
                  />
                </InputLabel>
              ) : null}
              <InputLabel
                value={`Tags (${values.general.tags.length}/3`}
                required
              >
                <div className="flex w-full flex-wrap items-center gap-2">
                  {tagNames.map((tag) => (
                    <Tag
                      key={tag}
                      name={tag}
                      active={values.general.tags.includes(tag)}
                      variant="inline"
                      size="lg"
                      onClick={() => {
                        if (!touched.general?.tags) {
                          setFieldTouched('general.tags', true);
                        }
                        if (
                          values.general.tags.length >= 3 &&
                          !values.general.tags.includes(tag)
                        )
                          return;
                        if (values.general.tags.includes(tag)) {
                          setFieldValue(
                            'general.tags',
                            values.general.tags.filter((t) => t !== tag)
                          );
                        } else {
                          setFieldValue('general.tags', [
                            ...values.general.tags,
                            tag,
                          ]);
                        }
                      }}
                    />
                  ))}
                </div>
                <FieldError
                  touched={touched.general?.tags}
                  error={errors.general?.tags}
                />
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
                  <Field
                    name="meetingInformation.location"
                    component={TextInput}
                    placeholder="A101"
                  />
                </InputLabel>
                <InputLabel value="Meeting Date and Time" required>
                  <div className="flex items-start gap-2">
                    <InputLabel value="Days">
                      <Field
                        name="meetingInformation.days"
                        component={TextInput}
                        placeholder="Tuesday, Thursday"
                      />
                    </InputLabel>
                    <InputLabel value="Frequency" required>
                      <Field
                        name="meetingInformation.frequency"
                        component={TextInput}
                        placeholder="Weekly"
                      />
                    </InputLabel>
                    <InputLabel value="Time" required>
                      <Field
                        name="meetingInformation.time"
                        component={TextInput}
                        placeholder="7-8:30 PM"
                      />
                    </InputLabel>
                  </div>
                </InputLabel>
                <InputLabel value="Contact Email" required>
                  <Field
                    name="contactInformation.email"
                    component={TextInput}
                    placeholder="dhns.engineering@gmail.com"
                  />
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
                                'border-blue-70 bg-blue-10': isActive,
                                'border-black-20 hover:bg-black-10': !isActive,
                              },
                              'flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border transition-colors'
                            )}
                            onClick={() => {
                              if (isActive) {
                                setSelectedPlatforms(
                                  selectedPlatforms.filter(
                                    (p) => p !== platform
                                  )
                                );
                              } else {
                                setSelectedPlatforms([
                                  ...selectedPlatforms,
                                  platform,
                                ]);
                              }
                            }}
                          >
                            <Icon
                              className={cn(
                                { 'text-blue-70': isActive },
                                'text-lg'
                              )}
                            />
                          </div>
                        );
                      })}
                    </div>
                    {selectedPlatforms.length !== 0 ? (
                      selectedPlatforms.map((platform) => (
                        <Field
                          key={platform}
                          name={`contactInformation.media.${platform}`}
                          component={TextInput}
                          placeholder={`${
                            platform === 'website'
                              ? 'https://www.dnhsengineering.com/'
                              : '@dnhsengineering'
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
                  <Field
                    name="members.president"
                    component={TextInput}
                    placeholder="First Last"
                    accessory="President"
                  />
                  <Field
                    name="members.vicePresident"
                    component={TextInput}
                    placeholder="First Last"
                    accessory="Vice President"
                  />
                  <Field
                    name="members.secretary"
                    component={TextInput}
                    placeholder="First Last"
                    accessory="Secretary"
                  />
                  <Field
                    name="members.treasurer"
                    component={TextInput}
                    placeholder="First Last"
                    accessory="Treasurer"
                  />
                  <Field
                    name="members.advisor"
                    component={TextInput}
                    placeholder="First Last"
                    accessory="Advisor"
                  />
                </InputLabel>
              </Page.Section>
            </div>
            <div className="col-span-1 flex w-full flex-col lg:col-span-2">
              <div className="mb-8 h-[1px] w-full bg-black-20" />
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => resetForm()}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={isSubmitting}
                  disabled={!dirty || !isValid || isSubmitting}
                  variant="primary"
                >
                  {isSubmitting ? 'Creating Club' : 'Create Club'}
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
  view: 'dashboard',
  config: {},
};

export default AdminDashboardNewClub;
