import { forwardRef, Module } from "@nestjs/common";
import { UploadConsumerService } from "./upload-consumer.service";
import { UploadProducerService } from "./upload-producer.service";
import { UploadModule } from "src/api/upload-service/upload/upload.module";

@Module({
    providers: [UploadConsumerService, UploadProducerService],
    imports: [forwardRef(() => UploadModule)],
    exports: [UploadProducerService],
})
export class UploadQueueModule { }