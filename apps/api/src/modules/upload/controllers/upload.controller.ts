import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UploadedFile, UseInterceptors } from "@nestjs/common";
import { ApiBody, ApiConsumes } from "@nestjs/swagger";
import { Controller, Post } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { SwaggerConsumes } from "src/common/enums/swagger-consume.enum";
import { diskStorage } from "multer";
import { extname } from "path";
import { Public } from "src/common/decorators/public.decorator";

@ApiTags("Upload")
@Controller("upload")
export class UploadController {
  @Public()
  @Post()
  @ApiOperation({ summary: "Upload a single file" })
  @ApiConsumes(SwaggerConsumes.MultipartData)
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: "File uploaded successfully" })
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "./src/common/uploads",
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1e9);
          callback(
            null,
            `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`
          );
        },
      }),
    })
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return {
      originalname: file.originalname,
      filename: file.filename,
    };
  }
}
