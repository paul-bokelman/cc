import { type Availability, Prisma } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { tags } from "./tags.data";

const availabilityOptions = ["APPLICATION", "OPEN", "CLOSED"];
const meetingFrequency = ["Weekly", "Bi-Weekly", "Monthly"];

const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

export const generateClub = (school: string): Prisma.ClubCreateInput => {
  const name = faker.company.name();
  const availability = faker.helpers.arrayElement(availabilityOptions);

  return Prisma.validator<Prisma.ClubCreateInput>()({
    school: { connect: { name: school } },
    name: name,
    slug: generateSlug(name),
    description: faker.lorem.paragraph(),
    tags: {
      connect: faker.helpers.arrayElements(tags, 3).map((tag) => ({ name: tag })),
    },
    availability: availability as Availability,
    advisor: faker.person.fullName(),
    president: faker.person.fullName(),
    vicePresident: faker.person.fullName(),
    treasurer: faker.person.fullName(),
    secretary: faker.person.fullName(),
    applicationLink: availability === "APPLICATION" ? faker.internet.url() : null,
    meetingDays: Array.from({ length: 2 })
      .map((_) => faker.date.weekday())
      .join(", "),
    meetingFrequency: faker.helpers.arrayElement(meetingFrequency),
    meetingTime: "6:00-7:30 PM", //! UPDATE
    meetingLocation: faker.location.streetAddress(),
    contactEmail: faker.internet.email(),
    facebook: generateSlug(name),
    instagram: generateSlug(name),
    twitter: generateSlug(name),
    website: generateSlug(name),
  });
};
