import { Audio } from "aws-sdk/clients/alexaforbusiness";

export interface Block  {
    run(): Promise<string> | Promise<Audio>;
}
