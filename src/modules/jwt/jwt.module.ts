import { Module } from "@nestjs/common";
import { JwtService } from "./service/jwt.service";

@Module({
    providers: [JwtService],
    exports: [JwtService]
})
export class JwtModule { }