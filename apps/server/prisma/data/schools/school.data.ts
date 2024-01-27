import fs from "fs";
import { parse } from "csv";
import { Prisma, ClubType, ClubStatus, Tag } from "@prisma/client";
import select from "@inquirer/select";
import { generateSlug, generateClub } from "../generate";

const path = (p: string) => `./prisma/data/schools/${p}`;

const club_statuses = Object.keys(ClubStatus);
const club_types = Object.keys(ClubType);

const invalid = (field: string, msg: string) => {
  console.log(`Invalid field: ${field} - ${msg}}`);
};

/* -------------------------- Beckman import script ------------------------- */

const beckman_files = {
  fall2023: "beckman/club-roster-fall-2023.csv",
  spring2024: "beckman/club-roster-spring-2024.csv",
  applications_spring2024: "beckman/beckman-applications-spring-2024.csv",
};

// const beckman_cols = ["name", "advisor", "status", "president", "email"] as const;

const getBeckmanClubs = async (): Promise<typeof beckman_clubs> => {
  const beckman_clubs: Prisma.ClubCreateInput[] = [];

  const file = await select({
    message: "Choose a seed option",
    choices: Object.keys(beckman_files).map((file) => ({
      title: file,
      value: path(beckman_files[file as keyof typeof beckman_files]),
    })),
  });

  return new Promise((resolve, reject) => {
    fs.createReadStream(file)
      .pipe(parse({ delimiter: ",", skipEmptyLines: true, from_line: 2 }))
      .on("data", (row: string[]) => {
        // hacky way to check if the file is an application file...
        if (file.includes("applications")) {
          let [
            timestamp,
            name,
            position,
            club_name,
            type,
            status,
            president,
            advisor,
            vice_president,
            secretary,
            treasurer,
            description,
            location,
            frequency,
            days,
            times,
            tags,
            contact_email,
            website,
            instagram,
            twitter,
            facebook,
            using_application,
            application_link,
          ] = row;

          // check against names?
          if (club_name === "") return invalid("club_name", "empty");
          // other validation?

          instagram = instagram.includes("@") ? instagram.split("@")[1] : instagram;
          twitter = twitter.includes("@") ? twitter.split("@")[1] : twitter;
          facebook = facebook.includes("@") ? facebook.split("@")[1] : facebook;

          const club = Prisma.validator<Prisma.ClubCreateInput>()({
            name: club_name,
            school: { connect: { name: "beckman" } },
            slug: generateSlug(club_name),
            status: status.toUpperCase() as ClubStatus,
            type: type.toUpperCase() as ClubType,
            description,
            advisor,
            president,
            vicePresident: vice_president,
            secretary,
            treasurer,
            meetingLocation: location,
            meetingFrequency: frequency,
            meetingDays: days.split(";").join(","),
            applicationLink: using_application.toUpperCase() === "YES" ? application_link : undefined,
            meetingTime: times,
            availability: (status.toUpperCase() as ClubStatus) === "INACTIVE" ? "CLOSED" : "OPEN",
            website: website || undefined,
            facebook: facebook || undefined,
            twitter: twitter || undefined,
            instagram: instagram || undefined,
            tags: { connect: tags.split(";").map((tag) => ({ name: tag.trim().toLowerCase() })) }, // validate tags?
            contactEmail: contact_email,
          });

          beckman_clubs.push(club);

          return;
        }

        let [club_name, advisor, type, president, email] = row;

        if (![...club_statuses, ...club_types].includes(type.toUpperCase())) {
          throw new Error(`Invalid club type: ${type}`);
        }

        const club_status: ClubStatus = club_types.includes(type.toUpperCase())
          ? ClubStatus.ACTIVE
          : (type.toUpperCase() as ClubStatus);
        const club_type: ClubType = club_types.includes(type.toUpperCase())
          ? (type.toUpperCase() as ClubType)
          : ClubType.CLUB;

        email = email.includes(",") ? email.split(",")[0] : email;

        const club = Prisma.validator<Prisma.ClubCreateInput>()({
          name: club_name,
          school: { connect: { name: "beckman" } },
          slug: generateSlug(club_name),
          status: club_status,
          type: club_type,
          advisor,
          president,
          contactEmail: email,
        });

        beckman_clubs.push(club);
        return;
      })
      .on("end", () => {
        resolve(beckman_clubs);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
};

export const getTestClubs = async (school: string = "staging") => {
  const test_clubs: Prisma.ClubCreateInput[] = [];
  for (let i = 0; i < 200; i++) {
    test_clubs.push(generateClub(school));
  }

  return test_clubs;
};

export const get = {
  beckman: getBeckmanClubs,
  staging: getTestClubs,
};
