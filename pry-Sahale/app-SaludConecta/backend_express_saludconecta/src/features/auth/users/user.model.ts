import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";
import { hashPassword } from "../../../shared/auth/password";

/**
 * Modelo `User` (tabla `users`) — la identidad del sistema.
 *
 * Se diferencia de los modelos de business en un punto clave: **`password` nunca
 * se guarda en claro**. El hash se calcula en los hooks, de modo que ningún
 * service, repository o seeder puede olvidarse de hacerlo.
 *
 * El algoritmo y el coste viven en `shared/auth/password.ts` (única fuente), no
 * aquí: si mañana se sube el coste, se cambia en un solo sitio.
 */
export interface UserI {
  id?: number;
  username: string;
  email: string;
  password: string;
  avatar?: string | null;
  status: "active" | "inactive";
  createdAt?: Date;
  updatedAt?: Date;
}

export class User extends Model {
  public id!: number;
  public username!: string;
  public email!: string;
  public password!: string;
  public avatar!: string | null;
  public status!: "active" | "inactive";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    username: {
      type: DataTypes.STRING(80),
      allowNull: false,
      // `unique` con nombre explícito -> la BD nombra la restricción `uq_users_username`
      // (misma nomenclatura que el DDL de referencia en docs/bd-storelab.md §14).
      unique: "uq_users_username",
      validate: {
        notEmpty: { msg: "Username cannot be empty" },
        len: { args: [3, 80], msg: "Username must be between 3 and 80 characters" },
      },
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: "uq_users_email",
      validate: {
        isEmail: { msg: "Email must be a valid email address" },
      },
    },
    password: {
      // 255: el hash bcrypt ocupa 60 y sobra margen para algoritmos futuros.
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Password cannot be empty" },
      },
    },
    avatar: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "inactive",
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: true,
    hooks: {
      // Los tres hooks que crean/actualizan el hash. Cualquier ruta de escritura
      // (create, update, bulkCreate del seeder) pasa por aquí: no hay forma de
      // persistir una contraseña en claro.
      beforeCreate: async (user: User) => {
        if (user.password) {
          user.password = await hashPassword(user.password);
        }
      },
      beforeUpdate: async (user: User) => {
        if (user.changed("password") && user.password) {
          user.password = await hashPassword(user.password);
        }
      },
      beforeBulkCreate: async (users: User[]) => {
        for (const user of users) {
          if (user.password) {
            user.password = await hashPassword(user.password);
          }
        }
      },
      // Normalización: `username` y `email` siempre en minúsculas y sin espacios.
      // Se hace antes de validar para que el `isEmail`/`len` juzgue el valor final
      // y para que el login (que compara por igualdad) sea predecible.
      beforeValidate: (user: User) => {
        if (user.username) user.username = user.username.trim().toLowerCase();
        if (user.email) user.email = user.email.trim().toLowerCase();
      },
    },
  },
);
