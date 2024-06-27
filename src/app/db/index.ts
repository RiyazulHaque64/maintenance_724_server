import { UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import config from "../../config";
import prisma from "../shared/prisma";

const superAdmin = {
  name: config.super_admin_name,
  userName: config.super_admin_user_name,
  email: config.super_admin_email,
  role: UserRole.SUPER_ADMIN,
};

export const seedSuperAdmin = async () => {
  const isExistSuperAdmin = await prisma.user.findFirst({
    where: {
      role: UserRole.SUPER_ADMIN,
    },
  });
  const hashedPassword = await bcrypt.hash(
    config.super_admin_password,
    Number(config.salt_rounds)
  );
  if (!isExistSuperAdmin?.id) {
    await prisma.user.create({
      data: {
        ...superAdmin,
        password: hashedPassword,
      },
    });
  }
};
