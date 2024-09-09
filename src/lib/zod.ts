import { array, boolean, date, number, object, string } from "zod"

export const signInSchema = object({
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: string({ required_error: "Password is required" })
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
})

export const photoSchema = object({
  url: string().max(255),
  width: number(),
  height: number(),
  blurData: string().max(100000),
  aspectRatio: number(),
  focalLength: number(),
  focalLengthIn35mmFormat: number(),
  fNumber: number(),
  iso: number(),
  exposureTime: number(),
  exposureCompensation: number(),
  latitude: number(),
  longitude: number(),
  locationName: string().max(100),
  filmSimulation: string().max(50),
  priorityOrder: number(),
  takenAt: date(),
  takenAtNaive: string(),
  hidden: boolean(),
  title: string().max(100),
  caption: string().max(500),
  semanticDescription: string().max(1000),
  tags: array(string().max(50)), // 使用 array() 包装
  make: string().max(50),
  model: string().max(50),
  lensMake: string().max(50),
  lensModel: string().max(50),
})
