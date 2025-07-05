import { SetMetadata } from "@nestjs/common";

export const IS_Public_KEY = "IS_Public";
export const Public = () => SetMetadata(IS_Public_KEY, true);
