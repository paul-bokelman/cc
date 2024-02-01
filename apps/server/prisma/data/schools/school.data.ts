import fs from "fs";
import { parse } from "csv";
import { Prisma, ClubType, ClubStatus } from "@prisma/client";
import { select, confirm } from "@inquirer/prompts";
import { generateSlug, generateClub } from "../generate";
import schools from "./schools.json";

const path = (p: string) => `./prisma/data/schools/${p}`;

const invalid = (field: string, msg: string) => {
  console.log(`Invalid field: ${field} - ${msg}}`);
};

// parses data from cc registration application csv
export const getSchoolClubs = async (school_name: string): Promise<Prisma.ClubCreateInput[]> => {
  const clubs: Prisma.ClubCreateInput[] = [];
  let file = "";

  if (!process.env.SUBDOMAINS?.includes(school_name)) {
    throw new Error(`Invalid school: ${school_name}`);
  }

  const useDefault = await confirm({ message: `Use default dataset for ${school_name}?` });
  const school = schools[school_name as keyof typeof schools];
  if (useDefault) {
    file = path(`${school_name}/${school.default_dataset}`);
  } else {
    file = await select({
      message: `Choose a dataset for ${school_name}`,
      choices: school.datasets.map((name) => ({
        name,
        value: path(`${school_name}/${name}`),
      })),
    });
  }

  return new Promise((resolve, reject) => {
    fs.createReadStream(file)
      .pipe(parse({ delimiter: ",", skipEmptyLines: true, from_line: 2 }))
      .on("data", (row: string[]) => {
        let [
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
          vicePresident: vice_president || undefined,
          secretary: secretary || undefined,
          treasurer: treasurer || undefined,
          meetingLocation: location,
          meetingFrequency: frequency,
          meetingDays: days.split(";").join(","),
          applicationLink: application_link || undefined,
          meetingTime: times,
          availability: (status.toUpperCase() as ClubStatus) === "INACTIVE" ? "CLOSED" : "OPEN",
          website: website || undefined,
          facebook: facebook || undefined,
          twitter: twitter || undefined,
          instagram: instagram || undefined,
          tags: { connect: tags.split(";").map((tag) => ({ name: tag.trim().toLowerCase() })) }, // validate tags?
          contactEmail: contact_email,
        });

        return clubs.push(club);
      })
      .on("end", () => resolve(clubs))
      .on("error", (error) => reject(error));
  });
};

export const getTestClubs = async (school: string = "staging") => {
  const test_clubs: Prisma.ClubCreateInput[] = [];
  for (let i = 0; i < 200; i++) {
    test_clubs.push(generateClub(school));
  }

  return test_clubs;
};
