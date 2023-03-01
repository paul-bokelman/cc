import { type Availability, Prisma } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { tags } from './tags.data';

const availabilityOptions = ['APPLICATION', 'OPEN', 'CLOSED'];
const meetingFrequency = ['Weekly', 'Bi-Weekly', 'Monthly'];

const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

export const clubs = Array.from({ length: 10 }).map((_, i) => {
  const name = faker.company.name();
  const availability = faker.helpers.arrayElement(availabilityOptions);

  return Prisma.validator<Prisma.ClubCreateInput>()({
    name: name,
    slug: generateSlug(name),
    description: faker.lorem.paragraph(),
    tags: {
      connect: faker.helpers
        .arrayElements(tags, 3)
        .map((tag) => ({ name: tag })),
    },
    availability: availability as Availability,
    advisor: faker.name.fullName(),
    president: faker.name.fullName(),
    vicePresident: faker.name.fullName(),
    treasurer: faker.name.fullName(),
    secretary: faker.name.fullName(),
    applicationLink:
      availability === 'APPLICATION' ? faker.internet.url() : null,
    meetingDays: Array.from({ length: 2 })
      .map((_) => faker.date.weekday())
      .join(', '),
    meetingFrequency: faker.helpers.arrayElement(meetingFrequency),
    meetingTime: '6:00-7:30 PM', //! UPDATE
    meetingLocation: faker.address.streetAddress(),
    contactEmail: faker.internet.email(),
    facebook: generateSlug(name),
    instagram: generateSlug(name),
    twitter: generateSlug(name),
    website: generateSlug(name),
  });
});
