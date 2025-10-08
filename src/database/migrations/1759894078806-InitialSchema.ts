import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1759894078806 implements MigrationInterface {
  name = 'InitialSchema1759894078806';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."organizations_subscriptionstatus_enum" AS ENUM('trial', 'active', 'past_due', 'canceled')`,
    );
    await queryRunner.query(
      `CREATE TABLE "organizations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "version" integer NOT NULL DEFAULT '0', "name" character varying(255) NOT NULL, "slug" character varying(100) NOT NULL, "description" character varying(500), "email" character varying(255), "phone" character varying(20), "address" text, "taxId" character varying(10), "subscriptionStatus" "public"."organizations_subscriptionstatus_enum" NOT NULL DEFAULT 'trial', "trial_ends_at" TIMESTAMP, "subscription_ends_at" TIMESTAMP, "settings" json, "is_active" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_963693341bd612aa01ddf3a4b68" UNIQUE ("slug"), CONSTRAINT "PK_6b031fcd0863e3f6b44230163f9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_963693341bd612aa01ddf3a4b6" ON "organizations" ("slug") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_role_enum" AS ENUM('super-admin', 'owner', 'admin', 'manager', 'member')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_status_enum" AS ENUM('active', 'inactive', 'suspended', 'pending')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "version" integer NOT NULL DEFAULT '0', "organization_id" uuid NOT NULL, "firstName" character varying(100) NOT NULL, "lastName" character varying(100) NOT NULL, "email" character varying(255) NOT NULL, "passwordHash" character varying(255) NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'member', "status" "public"."users_status_enum" NOT NULL DEFAULT 'pending', "phone" character varying(20), "last_login_at" TIMESTAMP, "email_verified_at" TIMESTAMP, "preferences" json, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_21a659804ed7bf61eb91688dea" ON "users" ("organization_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_21a659804ed7bf61eb91688dea7" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_21a659804ed7bf61eb91688dea7"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_21a659804ed7bf61eb91688dea"`,
    );
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_963693341bd612aa01ddf3a4b6"`,
    );
    await queryRunner.query(`DROP TABLE "organizations"`);
    await queryRunner.query(
      `DROP TYPE "public"."organizations_subscriptionstatus_enum"`,
    );
  }
}
