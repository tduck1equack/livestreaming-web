import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Matches,
} from "class-validator";
import { Transform } from "class-transformer";

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  username: string;
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  password: string;
  /* @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: "Birthday must be in YYYY-MM-DD format",
  }) */
  // Assuming that incoming date is a valid YYYY-MM-DD string
  // TODO: Resolve the incorrect Regex
  @Transform(({ value }) => {
    const date = new Date(value);
    // Set time to midnight UTC to ensure consistent date storage
    date.setUTCHours(0, 0, 0, 0);
    return date;
  })
  @IsNotEmpty()
  birthday: Date;
  @IsPhoneNumber()
  phoneNumber: string;
}
