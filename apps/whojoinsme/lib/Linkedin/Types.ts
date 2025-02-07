export type LinkedinProfileScrapeResult = {
  success: LinkedinProfileScrapeSuccess[];
  failure: LinkedinProfileScrapeFailure[];
};

export type LinkedinProfileScrapeFailure = {
  entry: string;
  error: string;
};

export type LinkedinProfileScrapeSuccess = {
  entry: string;
  data: {
    urn: string;
    about: string;
    promos: any[];
    skills: LinkedinSkill[];
    courses: any[];
    patents: any[];
    updates: any[];
    fullName: string;
    headline: string;
    lastName: string;
    projects: any[];
    firstName: string;
    followers: number;
    languages: any[];
    educations: LinkedinEducation[];
    highlights: any[];
    testScores: any[];
    connections: number;
    experiences: LinkedinExperience[];
    publications: any[];
    emailRequired: boolean;
    organizations: any[];
    verifications: any[];
    openConnection: boolean;
    honorsAndAwards: any[];
    volunteerCauses: any[];
    publicIdentifier: string;
    addressWithCountry: string;
    volunteerAndAwards: LinkedinVolunteerAward[];
    addressWithoutCountry: string;
    licenseAndCertificates: LinkedinCertificate[];
    profilePicAllDimensions: any[];
    profilePic: string;
  };
};

export type LinkedinSkill = {
  title: string;
  subComponents: {
    description: LinkedinInsightComponent[];
  }[];
};

export type LinkedinInsightComponent = {
  text: string;
  type: string;
};

export type LinkedinEducation = {
  logo?: string;
  title: string;
  caption: string;
  subtitle: string;
  breakdown: boolean;
  companyId?: string;
  companyUrn?: string;
  companyLink1: string;
  subComponents: {
    description: LinkedinInsightComponent[];
  }[];
};

export type LinkedinExperience = {
  logo?: string;
  title: string;
  caption: string;
  metadata?: string;
  subtitle: string;
  breakdown: boolean;
  companyId: string;
  companyUrn: string;
  companyLink1: string;
  subComponents: {
    description: LinkedinInsightComponent[];
  }[];
};

export type LinkedinVolunteerAward = {
  logo: string;
  title: string;
  caption: string;
  subtitle: string;
  breakdown: boolean;
  companyId: string;
  companyUrn: string;
  companyLink1: string;
  subComponents: {
    description: any[];
  }[];
};

export type LinkedinCertificate = {
  logo: string;
  title: string;
  caption: string;
  subtitle: string;
  breakdown: boolean;
  companyId: string;
  companyUrn: string;
  companyLink1: string;
  subComponents: {
    description: any[];
  }[];
};
