export interface UserType {
  user: {
    id: number;
    username: string;
    email: string;
  };
  age: number;
  hometown: string;
  gender: "M" | "F";
  id: number;
}

export enum SearchCriteria {
  Username = "username",
  Age = "age",
  Hometown = "hometown",
}
