import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import config from "../../config";
import { TCloudinaryResponse } from "../interfaces/file";

cloudinary.config({
  cloud_name: "dmcbqkmcd",
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
});

const storage = multer.memoryStorage();

const multipleUpload = multer({ storage }).fields([
  {
    name: "images",
    maxCount: 10,
  },
]);

const singleUpload = multer({ storage });

const uploadToCloudinary = async (
  file: string
): Promise<TCloudinaryResponse | undefined> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file,
      (error: Error, result: TCloudinaryResponse) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
};

const deleteToCloudinary = async (publicIds: string[]) => {
  return new Promise((resolve, reject) => {
    cloudinary.api.delete_resources(publicIds, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

export const fileUploader = {
  singleUpload,
  uploadToCloudinary,
  multipleUpload,
  deleteToCloudinary,
};
