import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  ContactMethod: a.customType({
    type: a.enum(["EMAIL", "CAREERS_PAGE"]),
    value: a.string().required(),
  }),

  User: a
    .model({
      cognitoId: a.id().required(),
      role: a.enum(["STUDENT", "COMPANY_REP", "ADMIN"]),
      phoneNumber: a.string().required(),
      // Student fields
      graduationYear: a.integer(),
      // Company rep fields
      companyName: a.string(),
      jobTitle: a.string(),
      industry: a.string(),
      jobPostings: a.hasMany("JobPosting", "postedBy"),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .identifier(["cognitoId"])
    .secondaryIndexes((index: any) => [
      index("role").name("byRole"),
    ])
    .authorization((allow: any) => [
      allow.authenticated(),
      allow.owner().to(["read", "update"]),
    ]),

  JobPosting: a
    .model({
      title: a.string().required(),
      company: a.string().required(),
      industry: a.string().required(),
      jobType: a.enum(["INTERNSHIP", "FULL_TIME", "CONTRACT"]),
      description: a.string().required(),
      skills: a.string().array().required(),
      deadline: a.datetime().required(),
      contactMethod: a.ref("ContactMethod").required(),
      postedBy: a.id().required(),
      status: a.enum(["DRAFT", "PENDING", "APPROVED", "ARCHIVED"]),
      viewCount: a.integer().default(0),
      applicationCount: a.integer().default(0),
      user: a.belongsTo("User", "postedBy"),
    })
    .secondaryIndexes((index: any) => [
      index("postedBy").name("byPostedBy"),
      index("status").name("byStatus"),
      index("jobType").name("byJobType"),
      index("industry").name("byIndustry"),
    ])
    .authorization((allow: any) => [
      allow.authenticated().to(["read"]),
      allow.owner().to(["create", "read", "update", "delete"]),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});

/*
Usage in your React components:

import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";

const client = generateClient<Schema>();

// Create a user profile (after Cognito authentication)
await client.models.User.create({
  cognitoId: "cognito-user-sub-id",
  role: "STUDENT",
  phoneNumber: "555-0123",
  graduationYear: 2025
});

// Create a job posting
await client.models.JobPosting.create({
  title: "Software Engineer Intern",
  company: "Tech Corp",
  industry: "Technology",
  jobType: "INTERNSHIP",
  description: "Great internship opportunity for MIS students",
  skills: ["JavaScript", "React", "Node.js", "Database Management"],
  deadline: "2024-12-31T23:59:59Z",
  contactMethod: {
    type: "EMAIL",
    value: "hr@techcorp.com"
  },
  postedBy: "cognito-user-sub-id"
});

// List approved job postings
const { data: jobPostings } = await client.models.JobPosting.list({
  filter: { status: { eq: "APPROVED" } }
});

// Get user's job postings
const { data: userJobs } = await client.models.JobPosting.list({
  filter: { postedBy: { eq: "cognito-user-sub-id" } }
});
*/