import type { NextPageWithConfig } from '~/shared/types';
import type { IconType } from 'react-icons';
import { GetClub, EditClub, DeleteClub, GetTags } from '@/cc';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useMutation, useQuery } from 'react-query';
import { type FormikHelpers, Formik, Field, Form } from 'formik';
import { z } from 'zod';
import cn from 'classnames';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { toast } from 'react-hot-toast';
import { TbBrandFacebook, TbBrandInstagram, TbBrandTwitter, TbCheck, TbLink } from 'react-icons/tb';
import { type Error, queryClient, api } from '~/lib/api';
import { handleServerValidationErrors, isValidationError } from '~/shared/utils';
import { DashboardContainer as Page, TextInput, InputLabel, FieldError, Tag, Button } from '~/shared/components';

type SupportedPlatforms = (typeof supportedPlatforms)[number];

const supportedPlatforms = ['instagram', 'facebook', 'twitter', 'website'] as const;

const AdminDashboardClub: NextPageWithConfig = () => {
  const router = useRouter();

  const clubQuery = useQuery<GetClub['payload'], Error>(
    ['club', { id: router.query.clubId }],
    async () =>
      await api.clubs.get({
        query: { method: 'id' },
        params: { identifier: router.query.clubId as string },
      }),
    {
      onError: (e) => console.log(e),
      enabled: !!router.query.clubId,
    }
  );

  const tagsQuery = useQuery<GetTags['payload'], Error>('tags', async () => api.tags.all());

  const editClubMutation = useMutation<EditClub['payload'], Error, EditClub['args']>(api.clubs.edit, {
    onSuccess: async ({ id }) => {
      await queryClient.refetchQueries(['club', { id }]);
      toast.success('Club updated successfully');
    },
    onError: (e) => {
      if (!isValidationError(e)) {
        console.log(e);
        toast.error('Failed to update club');
      }
    },
  });

  const deleteClubMutation = useMutation<DeleteClub['payload'], Error, DeleteClub['args']>(api.clubs.delete, {
    onSuccess: async (d) => {
      await router.push('/admin/clubs');
      toast.success('Club deleted successfully');
    },
    onError: (e) => {
      toast.error('Failed to delete club');
    },
  });

  const [selectedPlatforms, setSelectedPlatforms] = useState<Array<SupportedPlatforms>>([
    'website',
    'instagram',
    'facebook',
    'twitter',
  ] as Array<SupportedPlatforms>);

  const club = clubQuery.data;

  const initialValues: EditClub['args']['body'] = {
    // type will be club
    name: club?.name,
    tags: club?.tags.map((tag) => tag.name),
    availability: club?.availability,
    applicationLink: club?.applicationLink,
    description: club?.description,

    president: club?.president,
    vicePresident: club?.vicePresident,
    secretary: club?.secretary,
    treasurer: club?.treasurer,
    advisor: club?.advisor,

    meetingFrequency: club?.meetingFrequency,
    meetingTime: club?.meetingTime,
    meetingDays: club?.meetingDays,
    meetingLocation: club?.meetingLocation,

    contactEmail: club?.contactEmail,
    website: club?.website ?? undefined,
    instagram: club?.instagram ?? undefined,
    facebook: club?.facebook ?? undefined,
    twitter: club?.twitter ?? undefined,
  };

  const handleSubmit = async (
    values: EditClub['args']['body'],
    { setFieldError }: FormikHelpers<EditClub['args']['body']>
  ): Promise<void> => {
    try {
      const filteredValues = Object.entries(values).reduce((acc, [key, value]) => {
        const hasChanged = initialValues[key] !== value;
        if (hasChanged) acc[key] = value;
        return acc;
      }, {} as Partial<typeof initialValues>);

      await editClubMutation.mutateAsync({
        params: { identifier: club?.id },
        query: { method: 'id' },
        body: filteredValues,
      });
    } catch (e) {
      handleServerValidationErrors(e, setFieldError);
      // server side validation
    }
  };

  const handleDeleteClub = async () => {
    if (!club?.id) return; // shouldn't happen (toast)
    //! confirmation modal (modal provider)
    await deleteClubMutation.mutateAsync({ query: { method: 'id' }, params: { identifier: club?.id } });
  };

  const editClubValidation = z
    .object({
      name: z
        .string()
        .max(50, 'Club name cannot be longer than 50 characters')
        .min(3, 'Club name must be at least 3 characters'),
      description: z.string().min(10, 'Club description must be at least 10 characters'),
      availability: z.enum(['OPEN', 'APPLICATION', 'CLOSED']),
      applicationLink: z.string().optional().nullable(),
      tags: z.string().array().max(3, 'You can only select up to 3 tags').min(1, 'You must select at least 1 tag'),

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
      if (input.availability === 'APPLICATION' && !input.applicationLink) {
        ctx.addIssue({
          path: ['applicationLink'],
          code: z.ZodIssueCode.custom,
          message: 'Required if the club requires an application',
        });
      }
    });

  const availabilityOptions = [
    {
      value: 'OPEN',
      description:
        'An open availability for a club means that the club is open to anyone who wants to join. There are no requirements or restrictions on who can join.',
    },
    {
      value: 'APPLICATION',
      description:
        'An application availability for a club means interested users must fill out an application then be invited by the club president through their ccid.',
    },
    {
      value: 'CLOSED',
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
    <Page state={clubQuery.status}>
      <Page.Header
        title={`Manage ${club?.name}`} // conditional name
        description={`Edit and get an overview of the ${club?.name} club`}
      />
      <Page.Navigation
        links={[
          { label: 'Manage', query: 'manage', active: true },
          { label: 'Metrics', query: 'metrics', disabled: true },
        ]}
      />
      <Formik<EditClub['args']['body']>
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={toFormikValidationSchema(editClubValidation)}
        enableReinitialize
      >
        {({
          // change to f? this is verbose
          values,
          initialValues,
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
              <InputLabel value="Club Name" edited={initialValues.name !== values.name}>
                <Field name="name" component={TextInput} placeholder="Engineering" />
              </InputLabel>
              <InputLabel value="Description" edited={initialValues.description !== values.description}>
                <Field
                  name="description"
                  textArea
                  component={TextInput}
                  placeholder="To identify a real-world problem and develop a solution to it. Equips students to become tech entrepreneurs and leaders."
                />
              </InputLabel>
              <InputLabel value="Availability" edited={initialValues.availability !== values.availability}>
                {availabilityOptions.map(({ value: option, description }) => {
                  const isActive = values.availability === option;
                  return (
                    <div
                      key={option}
                      className={cn('box-border flex cursor-pointer flex-col gap-4 rounded-lg p-6 pr-24', {
                        'border border-black-20': !isActive,
                        'border-[2px] border-blue-70': isActive,
                      })}
                      onClick={() => {
                        if (!touched?.availability) {
                          setFieldTouched('availability', true);
                        }

                        setFieldValue('availability', option);
                        // if (option !== 'APPLICATION') setFieldValue('applicationLink', null); //! NO REASON THIS SHOULDNT WORK
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={cn('flex h-6 w-6 items-center justify-center rounded-md', {
                            'bg-black-20': !isActive,
                            'bg-blue-70': isActive,
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
              {values.availability === 'APPLICATION' ? (
                <InputLabel value="Application Link" edited={initialValues.applicationLink !== values.applicationLink}>
                  <Field name="applicationLink" component={TextInput} placeholder="https://docs.google.com/forms/..." />
                </InputLabel>
              ) : null}
              <InputLabel value={`Tags (${values.tags.length}/3`} edited={initialValues.tags !== values.tags}>
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
                          setFieldTouched('tags', true);
                        }
                        if (values.tags.length >= 3 && !values.tags.includes(tag)) return;
                        if (values.tags.includes(tag)) {
                          setFieldValue(
                            'tags',
                            values.tags.filter((t) => t !== tag)
                          );
                        } else {
                          setFieldValue('tags', [...values.tags, tag]);
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
                                'border-blue-70 bg-blue-10': isActive,
                                'border-black-20 hover:bg-black-10': !isActive,
                              },
                              'flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border transition-colors'
                            )}
                            onClick={() => {
                              if (isActive) {
                                setSelectedPlatforms(selectedPlatforms.filter((p) => p !== platform));
                                setFieldValue(`media.${platform}`, null);
                              } else {
                                setSelectedPlatforms([...selectedPlatforms, platform]);
                              }
                            }}
                          >
                            <Icon className={cn({ 'text-blue-70': isActive }, 'text-lg')} />
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
                            platform === 'website' ? 'https://www.dnhsengineering.com/' : 'dnhsengineering'
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
                  <Button type="button" variant="secondary" onClick={() => router.push('/admin/clubs')}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    loading={isSubmitting}
                    disabled={!dirty || !isValid || initialValues === values || isSubmitting}
                    variant="primary"
                  >
                    {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
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
  view: 'dashboard',
  config: {},
};

export default AdminDashboardClub;
