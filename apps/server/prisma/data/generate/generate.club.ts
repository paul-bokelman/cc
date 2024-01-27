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

const maybe = <T>(d: T, weight?: number): undefined | T => {
  if (!weight) return faker.datatype.boolean() ? d : undefined;
  return faker.number.int({ min: 1, max: 100 }) <= weight ? d : undefined;
};

export const generateClub = (school: string): Prisma.ClubCreateInput => {
  const name = faker.company.name();
  const slug = generateSlug(name);
  const club_type = faker.helpers.arrayElement(Object.keys(ClubType));
  const club_status =
    club_type === ClubType.ORGANIZATION ? ClubStatus.ACTIVE : faker.helpers.arrayElement(Object.keys(ClubStatus));

  return Prisma.validator<Prisma.ClubCreateInput>()({
    school: { connect: { name: school } },
    name: name,
    slug,
    status: club_status as ClubStatus,
    type: club_type as ClubType,
    description: maybe(faker.lorem.paragraph(), 80),
    tags: maybe({ connect: faker.helpers.arrayElements(tags, 3).map((tag) => ({ name: tag })) }, 75),
    availability: club_status === ClubStatus.INACTIVE ? Availability.CLOSED : Availability.OPEN,
    advisor: faker.person.fullName(),
    president: faker.person.fullName(),
    vicePresident: maybe(faker.person.fullName(), 80),
    treasurer: maybe(faker.person.fullName(), 60),
    secretary: maybe(faker.person.fullName(), 60),
    applicationLink: faker.datatype.boolean() ? faker.internet.url() : null,
    // applicationLink: availability === "APPLICATION" ? faker.internet.url() : null,
    meetingDays: maybe(
      Array.from({ length: 2 })
        .map((_) => faker.date.weekday())
        .join(", ")
    ),
    meetingFrequency: maybe(faker.helpers.arrayElement(meetingFrequency), 80),
    meetingTime: maybe("6:00-7:30 PM", 80), //! UPDATE
    meetingLocation: maybe(faker.location.streetAddress(), 80),
    contactEmail: faker.internet.email(),
    facebook: maybe(slug, 65),
    instagram: maybe(slug, 65),
    twitter: maybe(slug, 65),
    website: maybe(slug, 65),
  });
};
