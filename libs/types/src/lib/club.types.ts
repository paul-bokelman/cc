import type { Club, Tag } from '@prisma/client';

/* -------------------------------- GET CLUBS ------------------------------- */

export type GetClubs = {
  args: {
    query: {
      limit?: number;
      offset?: number;
    };
  };
  payload: Array<
    Pick<Club, 'id' | 'name' | 'slug' | 'description' | 'availability'> & {
      tags: Tag['name'][];
    }
  >;
};

/* -------------------------------- GET CLUB -------------------------------- */

export type GetClub = {
  args: {
    query: {
      method: 'slug' | 'id' | 'name';
    };
    params: {
      identifier: string;
    };
  };
  payload: Club & { tags: Tag[] };
};

/* -------------------------------- NEW CLUB -------------------------------- */

export type NewClub = {
  args: {
    body: {
      general: Pick<
        Club,
        'name' | 'description' | 'availability' | 'applicationLink'
      > & { tags: Array<Tag['name']> };
      meetingInformation: Pick<
        Club,
        'meetingFrequency' | 'meetingTime' | 'meetingDays' | 'meetingLocation'
      >;
      contactInformation: Pick<Club, 'contactEmail'> & {
        media: {
          instagram?: string;
          facebook?: string;
          twitter?: string;
          website?: string;
        };
      };
      members: {
        president: string;
        vicePresident: string;
        secretary: string;
        treasurer: string;
        advisor: string;
      };
    };
  };
  payload: { id: string };
};

/* -------------------------------- EDIT CLUB ------------------------------- */

export type EditClub = {
  args: {
    query: {
      method: 'slug' | 'id' | 'name';
    };
    params: {
      identifier: string;
    };
    body: {
      general?: Partial<
        Pick<
          Club,
          'name' | 'description' | 'availability' | 'applicationLink'
        > & { tags: Array<Tag['name']> }
      >;
      meetingInformation?: Partial<
        Pick<
          Club,
          'meetingFrequency' | 'meetingTime' | 'meetingDays' | 'meetingLocation'
        >
      >;
      contactInformation?: Partial<
        Pick<Club, 'contactEmail'> & {
          media?: {
            instagram?: string;
            facebook?: string;
            twitter?: string;
            website?: string;
          };
        }
      >;
      members?: {
        president?: string;
        vicePresident?: string;
        secretary?: string;
        treasurer?: string;
        advisor?: string;
      };
    };
  };
  payload: { id: string };
};
