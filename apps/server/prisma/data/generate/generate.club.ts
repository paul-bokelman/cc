import { Prisma, Availability, ClubType, ClubStatus } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { tags } from "../tags.data";

const availabilityOptions = Object.keys(Availability);
const meetingFrequency = ["Weekly", "Bi-Weekly", "Monthly"];

export const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

const maybe = <T>(d: T): undefined | T => {
  return faker.datatype.boolean() ? d : undefined;
};

export const generateClub = (school: string): Prisma.ClubCreateInput => {
  const name = faker.company.name();
  const slug = generateSlug(name);
  const availability = faker.helpers.arrayElement(availabilityOptions);

  const club_type = faker.helpers.arrayElement(Object.keys(ClubType));
  const club_status =
    club_type === ClubType.ORGANIZATION ? ClubStatus.ACTIVE : faker.helpers.arrayElement(Object.keys(ClubStatus));

  return Prisma.validator<Prisma.ClubCreateInput>()({
    school: { connect: { name: school } },
    name: name,
    slug,
    status: club_status as ClubStatus,
    type: club_type as ClubType,
    description: maybe(faker.lorem.paragraph()),
    tags: maybe({
      connect: faker.helpers.arrayElements(tags, 3).map((tag) => ({ name: tag })),
    }),
    availability: availability as Availability,
    advisor: faker.person.fullName(),
    president: faker.person.fullName(),
    vicePresident: maybe(faker.person.fullName()),
    treasurer: maybe(faker.person.fullName()),
    secretary: maybe(faker.person.fullName()),
    applicationLink: availability === "APPLICATION" ? faker.internet.url() : null,
    meetingDays: maybe(
      Array.from({ length: 2 })
        .map((_) => faker.date.weekday())
        .join(", ")
    ),
    meetingFrequency: maybe(faker.helpers.arrayElement(meetingFrequency)),
    meetingTime: maybe("6:00-7:30 PM"), //! UPDATE
    meetingLocation: maybe(faker.location.streetAddress()),
    contactEmail: faker.internet.email(),
    facebook: maybe(slug),
    instagram: maybe(slug),
    twitter: maybe(slug),
    website: maybe(slug),
  });
};
