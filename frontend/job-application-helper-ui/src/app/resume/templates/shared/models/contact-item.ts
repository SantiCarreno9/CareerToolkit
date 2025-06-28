import { ContactOptions } from "../../../shared/models/user-personal-info";

export interface ContactItem
{
  contactOption: ContactOptions,
  displayText: string,
  isUrl: boolean,
  url?: string,
  icon: string
};