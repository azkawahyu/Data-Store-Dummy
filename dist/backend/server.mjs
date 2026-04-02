// backend/server.ts
import express from "express";
import cors from "cors";
import morgan from "morgan";
import path4 from "path";
import { createProxyMiddleware } from "http-proxy-middleware";

// backend/routes/auth.ts
import { Router } from "express";
import { randomUUID } from "crypto";

// lib/generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// lib/generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.4.2",
  "engineVersion": "94a226be1cf2967af2541cca5529f0f7ba866919",
  "activeProvider": "postgresql",
  "inlineSchema": 'generator client {\n  provider = "prisma-client"\n  output   = "../lib/generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nenum DocumentStatus {\n  pending\n  verified\n  rejected\n}\n\nmodel activity_logs {\n  id          String    @id @default(uuid()) @db.Uuid\n  user_id     String?   @db.Uuid\n  action      String?   @db.VarChar(100)\n  description String?\n  created_at  DateTime? @default(now()) @db.Timestamp(6)\n  users       users?    @relation(fields: [user_id], references: [id], onDelete: NoAction, onUpdate: NoAction)\n}\n\nmodel documents {\n  id            String         @id @default(uuid()) @db.Uuid\n  employee_id   String?        @db.Uuid\n  document_type String         @db.VarChar(50)\n  file_path     String\n  file_name     String\n  file_size     Int\n  mime_type     String\n  status        DocumentStatus @default(pending)\n  uploaded_at   DateTime?      @default(now()) @db.Timestamp(6)\n  verified_by   String?        @db.Uuid\n  verified_at   DateTime?      @db.Timestamp(6)\n  employees     employees?     @relation(fields: [employee_id], references: [id], onDelete: Cascade, onUpdate: NoAction)\n  users         users?         @relation(fields: [verified_by], references: [id], onDelete: NoAction, onUpdate: NoAction)\n}\n\nmodel employees {\n  id         String      @id @default(uuid()) @db.Uuid\n  nip        String      @unique @db.VarChar(50)\n  nama       String      @db.VarChar(150)\n  jabatan    String?     @db.VarChar(100)\n  unit       String?     @db.VarChar(100)\n  status     String?     @db.VarChar(50)\n  alamat     String?\n  no_hp      String?     @db.VarChar(20)\n  email      String?     @db.VarChar(150)\n  created_at DateTime?   @default(now()) @db.Timestamp(6)\n  updated_at DateTime?   @updatedAt\n  documents  documents[]\n  users      users?\n}\n\nmodel roles {\n  id    String  @id @default(uuid()) @db.Uuid\n  name  String  @unique @db.VarChar(50)\n  users users[]\n}\n\nmodel users {\n  id            String          @id @default(uuid()) @db.Uuid\n  employee_id   String?         @unique @db.Uuid\n  role_id       String?         @db.Uuid\n  username      String          @unique @db.VarChar(100)\n  password_hash String\n  nip           String?         @unique @db.VarChar(50)\n  email         String?         @db.VarChar(150)\n  created_at    DateTime?       @default(now()) @db.Timestamp(6)\n  activity_logs activity_logs[]\n  documents     documents[]\n  employees     employees?      @relation(fields: [employee_id], references: [id], onDelete: NoAction, onUpdate: NoAction)\n  roles         roles?          @relation(fields: [role_id], references: [id], onDelete: NoAction, onUpdate: NoAction)\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"activity_logs":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"user_id","kind":"scalar","type":"String"},{"name":"action","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"created_at","kind":"scalar","type":"DateTime"},{"name":"users","kind":"object","type":"users","relationName":"activity_logsTousers"}],"dbName":null},"documents":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"employee_id","kind":"scalar","type":"String"},{"name":"document_type","kind":"scalar","type":"String"},{"name":"file_path","kind":"scalar","type":"String"},{"name":"file_name","kind":"scalar","type":"String"},{"name":"file_size","kind":"scalar","type":"Int"},{"name":"mime_type","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"DocumentStatus"},{"name":"uploaded_at","kind":"scalar","type":"DateTime"},{"name":"verified_by","kind":"scalar","type":"String"},{"name":"verified_at","kind":"scalar","type":"DateTime"},{"name":"employees","kind":"object","type":"employees","relationName":"documentsToemployees"},{"name":"users","kind":"object","type":"users","relationName":"documentsTousers"}],"dbName":null},"employees":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"nip","kind":"scalar","type":"String"},{"name":"nama","kind":"scalar","type":"String"},{"name":"jabatan","kind":"scalar","type":"String"},{"name":"unit","kind":"scalar","type":"String"},{"name":"status","kind":"scalar","type":"String"},{"name":"alamat","kind":"scalar","type":"String"},{"name":"no_hp","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"created_at","kind":"scalar","type":"DateTime"},{"name":"updated_at","kind":"scalar","type":"DateTime"},{"name":"documents","kind":"object","type":"documents","relationName":"documentsToemployees"},{"name":"users","kind":"object","type":"users","relationName":"employeesTousers"}],"dbName":null},"roles":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"users","kind":"object","type":"users","relationName":"rolesTousers"}],"dbName":null},"users":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"employee_id","kind":"scalar","type":"String"},{"name":"role_id","kind":"scalar","type":"String"},{"name":"username","kind":"scalar","type":"String"},{"name":"password_hash","kind":"scalar","type":"String"},{"name":"nip","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"created_at","kind":"scalar","type":"DateTime"},{"name":"activity_logs","kind":"object","type":"activity_logs","relationName":"activity_logsTousers"},{"name":"documents","kind":"object","type":"documents","relationName":"documentsTousers"},{"name":"employees","kind":"object","type":"employees","relationName":"employeesTousers"},{"name":"roles","kind":"object","type":"roles","relationName":"rolesTousers"}],"dbName":null}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","activity_logs","documents","users","_count","employees","roles","activity_logs.findUnique","activity_logs.findUniqueOrThrow","activity_logs.findFirst","activity_logs.findFirstOrThrow","activity_logs.findMany","data","activity_logs.createOne","activity_logs.createMany","activity_logs.createManyAndReturn","activity_logs.updateOne","activity_logs.updateMany","activity_logs.updateManyAndReturn","create","update","activity_logs.upsertOne","activity_logs.deleteOne","activity_logs.deleteMany","having","_min","_max","activity_logs.groupBy","activity_logs.aggregate","documents.findUnique","documents.findUniqueOrThrow","documents.findFirst","documents.findFirstOrThrow","documents.findMany","documents.createOne","documents.createMany","documents.createManyAndReturn","documents.updateOne","documents.updateMany","documents.updateManyAndReturn","documents.upsertOne","documents.deleteOne","documents.deleteMany","_avg","_sum","documents.groupBy","documents.aggregate","employees.findUnique","employees.findUniqueOrThrow","employees.findFirst","employees.findFirstOrThrow","employees.findMany","employees.createOne","employees.createMany","employees.createManyAndReturn","employees.updateOne","employees.updateMany","employees.updateManyAndReturn","employees.upsertOne","employees.deleteOne","employees.deleteMany","employees.groupBy","employees.aggregate","roles.findUnique","roles.findUniqueOrThrow","roles.findFirst","roles.findFirstOrThrow","roles.findMany","roles.createOne","roles.createMany","roles.createManyAndReturn","roles.updateOne","roles.updateMany","roles.updateManyAndReturn","roles.upsertOne","roles.deleteOne","roles.deleteMany","roles.groupBy","roles.aggregate","users.findUnique","users.findUniqueOrThrow","users.findFirst","users.findFirstOrThrow","users.findMany","users.createOne","users.createMany","users.createManyAndReturn","users.updateOne","users.updateMany","users.updateManyAndReturn","users.upsertOne","users.deleteOne","users.deleteMany","users.groupBy","users.aggregate","AND","OR","NOT","id","employee_id","role_id","username","password_hash","nip","email","created_at","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","name","every","some","none","nama","jabatan","unit","status","alamat","no_hp","updated_at","document_type","file_path","file_name","file_size","mime_type","DocumentStatus","uploaded_at","verified_by","verified_at","user_id","action","description","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide"]'),
  graph: "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-ACALZAEAyAEAIWUBAMkBACF-AADaAYgBIoIBAQDIAQAhgwEBAMgBACGEAQEAyAEAIYUBAgDZAQAhhgEBAMgBACGIAUAAygEAIYkBAQDJAQAhigFAAMoBACECAAAACAAgDgAAQAAgAgAAAAgAIA4AAEAAIAEAAAAMACABAAAAAwAgAwAAAAoAIBUAADcAIBYAAD4AIAEAAAAKACABAAAACAAgCQYAAJoCACAbAACdAgAgHAAAnAIAIC0AAJsCACAuAACeAgAgZQAAxAEAIIgBAADEAQAgiQEAAMQBACCKAQAAxAEAIA5hAACwAQAwYgAASQAQYwAAsAEAMGQBAJcBACFlAQCYAQAhfgAAsgGIASKCAQEAmQEAIYMBAQCZAQAhhAEBAJkBACGFAQIAsQEAIYYBAQCZAQAhiAFAAJsBACGJAQEAmAEAIYoBQACbAQAhAwAAAAgAIAEAAEgAMBoAAEkAIAMAAAAIACABAAAJADACAAAKACAQBAAArgEAIAUAAK8BACBhAACqAQAwYgAADAAQYwAAqgEAMGQBAAAAAWkBAAAAAWoBAKwBACFrQACtAQAhewEAqwEAIXwBAKwBACF9AQCsAQAhfgEArAEAIX8BAKwBACGAAQEArAEAIYEBQACtAQAhAQAAAEwAIAEAAABMACAKBAAAmAIAIAUAAJkCACBqAADEAQAgawAAxAEAIHwAAMQBACB9AADEAQAgfgAAxAEAIH8AAMQBACCAAQAAxAEAIIEBAADEAQAgAwAAAAwAIAEAAE8AMAIAAEwAIAMAAAAMACABAABPADACAABMACADAAAADAAgAQAATwAwAgAATAAgDQQAAJYCACAFAACXAgAgZAEAAAABaQEAAAABagEAAAABa0AAAAABewEAAAABfAEAAAABfQEAAAABfgEAAAABfwEAAAABgAEBAAAAAYEBQAAAAAEBDgAAUwAgC2QBAAAAAWkBAAAAAWoBAAAAAWtAAAAAAXsBAAAAAXwBAAAAAX0BAAAAAX4BAAAAAX8BAAAAAYABAQAAAAGBAUAAAAABAQ4AAFUAMAEOAABVADANBAAAhAIAIAUAAIUCACBkAQDIAQAhaQEAyAEAIWoBAMkBACFrQADKAQAhewEAyAEAIXwBAMkBACF9AQDJAQAhfgEAyQEAIX8BAMkBACGAAQEAyQEAIYEBQADKAQAhAgAAAEwAIA4AAFgAIAtkAQDIAQAhaQEAyAEAIWoBAMkBACFrQADKAQAhewEAyAEAIXwBAMkBACF9AQDJAQAhfgEAyQEAIX8BAMkBACGAAQEAyQEAIYEBQADKAQAhAgAAAAwAIA4AAFoAIAIAAAAMACAOAABaACADAAAATAAgFQAAUwAgFgAAWAAgAQAAAEwAIAEAAAAMACALBgAAgQIAIBsAAIMCACAcAACCAgAgagAAxAEAIGsAAMQBACB8AADEAQAgfQAAxAEAIH4AAMQBACB_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_AQCsAQAhgAEBAKwBACGBAUAArQEAIY4BAAAMACCPAQAADAAgCAUAAKgBACBhAACnAQAwYgAAEwAQYwAApwEAMGQBAL4BACF3AQCrAQAhjgEAABMAII8BAAATACAIbAEAAAABbQEAAAAFbgEAAAAFbwEAAAABcAEAAAABcQEAAAABcgEAAAABcwEAvQEAIQhsAQAAAAFtAQAAAARuAQAAAARvAQAAAAFwAQAAAAFxAQAAAAFyAQAAAAFzAQC_AQAhCGwBAAAAAW0BAAAABG4BAAAABG8BAAAAAXABAAAAAXEBAAAAAXIBAAAAAXMBAL8BACEQBQAArwEAIAcAALsBACBhAADAAQAwYgAACAAQYwAAwAEAMGQBAL4BACFlAQC5AQAhfgAAwgGIASKCAQEAqwEAIYMBAQCrAQAhhAEBAKsBACGFAQIAwQEAIYYBAQCrAQAhiAFAAK0BACGJAQEAuQEAIYoBQACtAQAhCGwCAAAAAW0CAAAABG4CAAAABG8CAAAAAXACAAAAAXECAAAAAXICAAAAAXMCAKIBACEEbAAAAIgBAm0AAACIAQhuAAAAiAEIcwAAtAGIASIJBQAArwEAIGEAAMMBADBiAAAFABBjAADDAQAwZAEAvgEAIWtAAK0BACGLAQEAuQEAIYwBAQCsAQAhjQEBAKwBACEAAAAAAZMBAQAAAAEBkwEBAAAAAQGTAUAAAAABCxUAAN8BADAWAADkAQAwkAEAAOABADCRAQAA4QEAMJIBAADiAQAgkwEAAOMBADCUAQAA4wEAMJUBAADjAQAwlgEAAOMBADCXAQAA5QEAMJgBAADmAQAwCxUAAM8BADAWAADUAQAwkAEAANABADCRAQAA0QEAMJIBAADSAQAgkwEAANMBADCUAQAA0wEAMJUBAADTAQAwlgEAANMBADCXAQAA1QEAMJgBAADWAQAwBxUAALUCACAWAADCAgAgkAEAALYCACCRAQAAwQIAIJQBAAAMACCVAQAADAAglgEAAEwAIAcVAACzAgAgFgAAvwIAIJABAAC0AgAgkQEAAL4CACCUAQAAEwAglQEAABMAIJYBAABkACALBwAA3gEAIGQBAAAAAWUBAAAAAX4AAACIAQKCAQEAAAABgwEBAAAAAYQBAQAAAAGFAQIAAAABhgEBAAAAAYgBQAAAAAGKAUAAAAABAgAAAAoAIBUAAN0BACADAAAACgAgFQAA3QEAIBYAANsBACABDgAAvQIAMBAFAACvAQAgBwAAuwEAIGEAAMABADBiAAAIABBjAADAAQAwZAEAAAABZQEAuQEAIX4AAMIBiAEiggEBAKsBACGDAQEAqwEAIYQBAQCrAQAhhQECAMEBACGGAQEAqwEAIYgBQACtAQAhiQEBALkBACGKAUAArQEAIQIAAAAKACAOAADbAQAgAgAAANcBACAOAADYAQAgDmEAANYBADBiAADXAQAQYwAA1gEAMGQBAL4BACFlAQC5AQAhfgAAwgGIASKCAQEAqwEAIYMBAQCrAQAhhAEBAKsBACGFAQIAwQEAIYYBAQCrAQAhiAFAAK0BACGJAQEAuQEAIYoBQACtAQAhDmEAANYBADBiAADXAQAQYwAA1gEAMGQBAL4BACFlAQC5AQAhfgAAwgGIASKCAQEAqwEAIYMBAQCrAQAhhAEBAKsBACGFAQIAwQEAIYYBAQCrAQAhiAFAAK0BACGJAQEAuQEAIYoBQACtAQAhCmQBAMgBACFlAQDJAQAhfgAA2gGIASKCAQEAyAEAIYMBAQDIAQAhhAEBAMgBACGFAQIA2QEAIYYBAQDIAQAhiAFAAMoBACGKAUAAygEAIQWTAQIAAAABmQECAAAAAZoBAgAAAAGbAQIAAAABnAECAAAAAQGTAQAAAIgBAgsHAADcAQAgZAEAyAEAIWUBAMkBACF-AADaAYgBIoIBAQDIAQAhgwEBAMgBACGEAQEAyAEAIYUBAgDZAQAhhgEBAMgBACGIAUAAygEAIYoBQADKAQAhBxUAALgCACAWAAC7AgAgkAEAALkCACCRAQAAugIAIJQBAAAMACCVAQAADAAglgEAAEwAIAsHAADeAQAgZAEAAAABZQEAAAABfgAAAIgBAoIBAQAAAAGDAQEAAAABhAEBAAAAAYUBAgAAAAGGAQEAAAABiAFAAAAAAYoBQAAAAAEDFQAAuAIAIJABAAC5AgAglgEAAEwAIARkAQAAAAFrQAAAAAGMAQEAAAABjQEBAAAAAQIAAAABACAVAADqAQAgAwAAAAEAIBUAAOoBACAWAADpAQAgAQ4AALcCADAJBQAArwEAIGEAAMMBADBiAAAFABBjAADDAQAwZAEAAAABa0AArQEAIYsBAQC5AQAhjAEBAKwBACGNAQEArAEAIQIAAAABACAOAADpAQAgAgAAAOcBACAOAADoAQAgCGEAAOYBADBiAADnAQAQYwAA5gEAMGQBAL4BACFrQACtAQAhiwEBALkBACGMAQEArAEAIY0BAQCsAQAhCGEAAOYBADBiAADnAQAQYwAA5gEAMGQBAL4BACFrQACtAQAhiwEBALkBACGMAQEArAEAIY0BAQCsAQAhBGQBAMgBACFrQADKAQAhjAEBAMkBACGNAQEAyQEAIQRkAQDIAQAha0AAygEAIYwBAQDJAQAhjQEBAMkBACEEZAEAAAABa0AAAAABjAEBAAAAAY0BAQAAAAEEFQAA3wEAMJABAADgAQAwkgEAAOIBACCWAQAA4wEAMAQVAADPAQAwkAEAANABADCSAQAA0gEAIJYBAADTAQAwAxUAALUCACCQAQAAtgIAIJYBAABMACADFQAAswIAIJABAAC0AgAglgEAAGQAIAAAAAsVAADzAQAwFgAA-AEAMJABAAD0AQAwkQEAAPUBADCSAQAA9gEAIJMBAAD3AQAwlAEAAPcBADCVAQAA9wEAMJYBAAD3AQAwlwEAAPkBADCYAQAA-gEAMAoDAADrAQAgBAAA7AEAIAcAAO0BACBkAQAAAAFlAQAAAAFnAQAAAAFoAQAAAAFpAQAAAAFqAQAAAAFrQAAAAAECAAAAFgAgFQAA_gEAIAMAAAAWACAVAAD-AQAgFgAA_QEAIAEOAACyAgAwDwMAALoBACAEAACuAQAgBwAAuwEAIAgAALwBACBhAAC4AQAwYgAAAwAQYwAAuAEAMGQBAAAAAWUBAAAAAWYBALkBACFnAQAAAAFoAQCrAQAhaQEAAAABagEArAEAIWtAAK0BACECAAAAFgAgDgAA_QEAIAIAAAD7AQAgDgAA_AEAIAthAAD6AQAwYgAA-wEAEGMAAPoBADBkAQC-AQAhZQEAuQEAIWYBALkBACFnAQCrAQAhaAEAqwEAIWkBAKwBACFqAQCsAQAha0AArQEAIQthAAD6AQAwYgAA-wEAEGMAAPoBADBkAQC-AQAhZQEAuQEAIWYBALkBACFnAQCrAQAhaAEAqwEAIWkBAKwBACFqAQCsAQAha0AArQEAIQdkAQDIAQAhZQEAyQEAIWcBAMgBACFoAQDIAQAhaQEAyQEAIWoBAMkBACFrQADKAQAhCgMAAMsBACAEAADMAQAgBwAAzQEAIGQBAMgBACFlAQDJAQAhZwEAyAEAIWgBAMgBACFpAQDJAQAhagEAyQEAIWtAAMoBACEKAwAA6wEAIAQAAOwBACAHAADtAQAgZAEAAAABZQEAAAABZwEAAAABaAEAAAABaQEAAAABagEAAAABa0AAAAABBBUAAPMBADCQAQAA9AEAMJIBAAD2AQAglgEAAPcBADAAAAAACxUAAIsCADAWAACPAgAwkAEAAIwCADCRAQAAjQIAMJIBAACOAgAgkwEAANMBADCUAQAA0wEAMJUBAADTAQAwlgEAANMBADCXAQAAkAIAMJgBAADWAQAwBxUAAIYCACAWAACJAgAgkAEAAIcCACCRAQAAiAIAIJQBAAADACCVAQAAAwAglgEAABYAIAoDAADrAQAgBAAA7AEAIAgAAO4BACBkAQAAAAFmAQAAAAFnAQAAAAFoAQAAAAFpAQAAAAFqAQAAAAFrQAAAAAECAAAAFgAgFQAAhgIAIAMAAAADACAVAACGAgAgFgAAigIAIAwAAAADACADAADLAQAgBAAAzAEAIAgAAM4BACAOAACKAgAgZAEAyAEAIWYBAMkBACFnAQDIAQAhaAEAyAEAIWkBAMkBACFqAQDJAQAha0AAygEAIQoDAADLAQAgBAAAzAEAIAgAAM4BACBkAQDIAQAhZgEAyQEAIWcBAMgBACFoAQDIAQAhaQEAyQEAIWoBAMkBACFrQADKAQAhCwUAAJUCACBkAQAAAAF-AAAAiAECggEBAAAAAYMBAQAAAAGEAQEAAAABhQECAAAAAYYBAQAAAAGIAUAAAAABiQEBAAAAAYoBQAAAAAECAAAACgAgFQAAlAIAIAMAAAAKACAVAACUAgAgFgAAkgIAIAEOAACxAgAwAgAAAAoAIA4AAJICACACAAAA1wEAIA4AAJECACAKZAEAyAEAIX4AANoBiAEiggEBAMgBACGDAQEAyAEAIYQBAQDIAQAhhQECANkBACGGAQEAyAEAIYgBQADKAQAhiQEBAMkBACGKAUAAygEAIQsFAACTAgAgZAEAyAEAIX4AANoBiAEiggEBAMgBACGDAQEAyAEAIYQBAQDIAQAhhQECANkBACGGAQEAyAEAIYgBQADKAQAhiQEBAMkBACGKAUAAygEAIQcVAACsAgAgFgAArwIAIJABAACtAgAgkQEAAK4CACCUAQAAAwAglQEAAAMAIJYBAAAWACALBQAAlQIAIGQBAAAAAX4AAACIAQKCAQEAAAABgwEBAAAAAYQBAQAAAAGFAQIAAAABhgEBAAAAAYgBQAAAAAGJAQEAAAABigFAAAAAAQMVAACsAgAgkAEAAK0CACCWAQAAFgAgBBUAAIsCADCQAQAAjAIAMJIBAACOAgAglgEAANMBADADFQAAhgIAIJABAACHAgAglgEAABYAIAAJAwAApAIAIAQAAJgCACAHAAClAgAgCAAApgIAIGUAAMQBACBmAADEAQAgaQAAxAEAIGoAAMQBACBrAADEAQAgAAAAAAAAAAAHFQAApwIAIBYAAKoCACCQAQAAqAIAIJEBAACpAgAglAEAAAMAIJUBAAADACCWAQAAFgAgAxUAAKcCACCQAQAAqAIAIJYBAAAWACAACgQAAJgCACAFAACZAgAgagAAxAEAIGsAAMQBACB8AADEAQAgfQAAxAEAIH4AAMQBACB_AADEAQAggAEAAMQBACCBAQAAxAEAIAEFAACAAgAgCwQAAOwBACAHAADtAQAgCAAA7gEAIGQBAAAAAWUBAAAAAWYBAAAAAWcBAAAAAWgBAAAAAWkBAAAAAWoBAAAAAWtAAAAAAQIAAAAWACAVAACnAgAgAwAAAAMAIBUAAKcCACAWAACrAgAgDQAAAAMAIAQAAMwBACAHAADNAQAgCAAAzgEAIA4AAKsCACBkAQDIAQAhZQEAyQEAIWYBAMkBACFnAQDIAQAhaAEAyAEAIWkBAMkBACFqAQDJAQAha0AAygEAIQsEAADMAQAgBwAAzQEAIAgAAM4BACBkAQDIAQAhZQEAyQEAIWYBAMkBACFnAQDIAQAhaAEAyAEAIWkBAMkBACFqAQDJAQAha0AAygEAIQsDAADrAQAgBwAA7QEAIAgAAO4BACBkAQAAAAFlAQAAAAFmAQAAAAFnAQAAAAFoAQAAAAFpAQAAAAFqAQAAAAFrQAAAAAECAAAAFgAgFQAArAIAIAMAAAADACAVAACsAgAgFgAAsAIAIA0AAAADACADAADLAQAgBwAAzQEAIAgAAM4BACAOAACwAgAgZAEAyAEAIWUBAMkBACFmAQDJAQAhZwEAyAEAIWgBAMgBACFpAQDJAQAhagEAyQEAIWtAAMoBACELAwAAywEAIAcAAM0BACAIAADOAQAgZAEAyAEAIWUBAMkBACFmAQDJAQAhZwEAyAEAIWgBAMgBACFpAQDJAQAhagEAyQEAIWtAAMoBACEKZAEAAAABfgAAAIgBAoIBAQAAAAGDAQEAAAABhAEBAAAAAYUBAgAAAAGGAQEAAAABiAFAAAAAAYkBAQAAAAGKAUAAAAABB2QBAAAAAWUBAAAAAWcBAAAAAWgBAAAAAWkBAAAAAWoBAAAAAWtAAAAAAQJkAQAAAAF3AQAAAAECAAAAZAAgFQAAswIAIAwEAACWAgAgZAEAAAABaQEAAAABagEAAAABa0AAAAABewEAAAABfAEAAAABfQEAAAABfgEAAAABfwEAAAABgAEBAAAAAYEBQAAAAAECAAAATAAgFQAAtQIAIARkAQAAAAFrQAAAAAGMAQEAAAABjQEBAAAAAQwFAACXAgAgZAEAAAABaQEAAAABagEAAAABa0AAAAABewEAAAABfAEAAAABfQEAAAABfgEAAAABfwEAAAABgAEBAAAAAYEBQAAAAAECAAAATAAgFQAAuAIAIAMAAAAMACAVAAC4AgAgFgAAvAIAIA4AAAAMACAFAACFAgAgDgAAvAIAIGQBAMgBACFpAQDIAQAhagEAyQEAIWtAAMoBACF7AQDIAQAhfAEAyQEAIX0BAMkBACF-AQDJAQAhfwEAyQEAIYABAQDJAQAhgQFAAMoBACEMBQAAhQIAIGQBAMgBACFpAQDIAQAhagEAyQEAIWtAAMoBACF7AQDIAQAhfAEAyQEAIX0BAMkBACF-AQDJAQAhfwEAyQEAIYABAQDJAQAhgQFAAMoBACEKZAEAAAABZQEAAAABfgAAAIgBAoIBAQAAAAGDAQEAAAABhAEBAAAAAYUBAgAAAAGGAQEAAAABiAFAAAAAAYoBQAAAAAEDAAAAEwAgFQAAswIAIBYAAMACACAEAAAAEwAgDgAAwAIAIGQBAMgBACF3AQDIAQAhAmQBAMgBACF3AQDIAQAhAwAAAAwAIBUAALUCACAWAADDAgAgDgAAAAwAIAQAAIQCACAOAADDAgAgZAEAyAEAIWkBAMgBACFqAQDJAQAha0AAygEAIXsBAMgBACF8AQDJAQAhfQEAyQEAIX4BAMkBACF_AQDJAQAhgAEBAMkBACGBAUAAygEAIQwEAACEAgAgZAEAyAEAIWkBAMgBACFqAQDJAQAha0AAygEAIXsBAMgBACF8AQDJAQAhfQEAyQEAIX4BAMkBACF_AQDJAQAhgAEBAMkBACGBAUAAygEAIQEFBAIFAwcBBAsDBgAIBxIECBQGAgURAgcNBAMEDgMFDwIGAAUBBBAAAgUXAgYABwEFGAACAxkABBoAAAEFJAIBBSoCAwYADRsADhwADwAAAAMGAA0bAA4cAA8CBT0CBzwEAgVEAgdDBAUGABQbABccABgtABUuABYAAAAAAAUGABQbABccABgtABUuABYAAAMGAB0bAB4cAB8AAAADBgAdGwAeHAAfAAADBgAkGwAlHAAmAAAAAwYAJBsAJRwAJgIHhgEECIcBBgIHjQEECI4BBgMGACsbACwcAC0AAAADBgArGwAsHAAtCQIBChsBCxwBDB0BDR4BDyABECIJESMKEiYBEygJFCkLFysBGCwBGS0JHTAMHjEQHzIDIDMDITQDIjUDIzYDJDgDJToJJjsRJz8DKEEJKUISKkUDK0YDLEcJL0oTMEsZMU0EMk4EM1AENFEENVIENlQEN1YJOFcaOVkEOlsJO1wbPF0EPV4EPl8JP2IcQGMgQWUGQmYGQ2gGRGkGRWoGRmwGR24JSG8hSXEGSnMJS3QiTHUGTXYGTncJT3ojUHsnUXwCUn0CU34CVH8CVYABAlaCAQJXhAEJWIUBKFmJAQJaiwEJW4wBKVyPAQJdkAECXpEBCV-UASpglQEu"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer } = await import("buffer");
  const wasmArray = Buffer.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// lib/generated/prisma/internal/prismaNamespace.ts
import * as runtime2 from "@prisma/client/runtime/client";
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var defineExtension = runtime2.Extensions.defineExtension;

// lib/generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// lib/prisma.ts
import { PrismaPg } from "@prisma/adapter-pg";
var globalForPrisma = global;
var prisma = globalForPrisma.prisma || new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// lib/jwt.ts
import jwt from "jsonwebtoken";
var JWT_SECRET = process.env.JWT_SECRET;
function signToken(payload) {
  const options = {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d"
  };
  return jwt.sign(payload, JWT_SECRET, options);
}
function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

// lib/logActivity.ts
async function createActivity(opts) {
  const { userId = null, action, description = null } = opts;
  const desc = description === null || typeof description === "string" ? description : JSON.stringify(description);
  return prisma.activity_logs.create({
    data: {
      user_id: userId,
      action,
      description: desc
    }
  });
}

// lib/services/auth/registerPublicUser.ts
import { z as z2 } from "zod";

// lib/services/users/createUser.ts
import bcrypt from "bcrypt";

// lib/services/users/employeeLinking.ts
function normalizeValue(value) {
  return value?.trim() ?? "";
}
function normalizeEmail(email) {
  const value = normalizeValue(email).toLowerCase();
  return value.length > 0 ? value : "";
}
function normalizeNip(nip) {
  const value = normalizeValue(nip);
  return value.length > 0 ? value : "";
}
function evaluateCandidates({
  matchesByNip,
  matchesByEmail
}) {
  const nipSingle = matchesByNip.length === 1 ? matchesByNip[0] : null;
  const emailSingle = matchesByEmail.length === 1 ? matchesByEmail[0] : null;
  if (matchesByNip.length > 1 || matchesByEmail.length > 1) {
    return {
      employeeId: null,
      status: "conflict",
      message: "Ditemukan lebih dari satu kandidat pegawai. Perlu pengaitan manual."
    };
  }
  if (nipSingle && emailSingle && nipSingle.id !== emailSingle.id) {
    return {
      employeeId: null,
      status: "conflict",
      message: "Data NIP dan email mengarah ke pegawai berbeda. Perlu pengaitan manual."
    };
  }
  if (nipSingle) {
    return {
      employeeId: nipSingle.id,
      status: "linked_auto",
      message: "Akun berhasil dikaitkan otomatis berdasarkan NIP."
    };
  }
  if (emailSingle) {
    return {
      employeeId: emailSingle.id,
      status: "linked_auto",
      message: "Akun berhasil dikaitkan otomatis berdasarkan email."
    };
  }
  return {
    employeeId: null,
    status: "unlinked",
    message: "Belum ada pegawai yang cocok otomatis."
  };
}
async function resolveEmployeeLinkForUser(input) {
  const manualEmployeeId = normalizeValue(input.manualEmployeeId);
  if (manualEmployeeId) {
    return {
      employeeId: manualEmployeeId,
      status: "linked_manual",
      message: "Akun dikaitkan manual oleh admin."
    };
  }
  const normalizedEmail = normalizeEmail(input.email);
  const normalizedNip = normalizeNip(input.nip);
  if (!normalizedEmail && !normalizedNip) {
    return {
      employeeId: null,
      status: "unlinked",
      message: "Tidak ada data pencocokan otomatis (NIP/email)."
    };
  }
  const candidates = await prisma.employees.findMany({
    where: {
      OR: [
        normalizedNip ? { nip: normalizedNip } : void 0,
        normalizedEmail ? {
          email: {
            equals: normalizedEmail,
            mode: "insensitive"
          }
        } : void 0
      ].filter((v) => v != null)
    },
    select: {
      id: true,
      nip: true,
      email: true
    }
  });
  const matchesByNip = normalizedNip ? candidates.filter(
    (candidate) => normalizeNip(candidate.nip) === normalizedNip
  ) : [];
  const matchesByEmail = normalizedEmail ? candidates.filter(
    (candidate) => normalizeEmail(candidate.email) === normalizedEmail
  ) : [];
  return evaluateCandidates({ matchesByNip, matchesByEmail });
}
async function resolveUserLinkForEmployee(input) {
  const normalizedNip = normalizeNip(input.nip);
  const normalizedEmail = normalizeEmail(input.email);
  if (!normalizedNip && !normalizedEmail) {
    return {
      userId: null,
      status: "unlinked",
      message: "Tidak ada data pencocokan otomatis (NIP/email)."
    };
  }
  const users = await prisma.users.findMany({
    where: {
      employee_id: null,
      OR: [
        normalizedNip ? { nip: normalizedNip } : void 0,
        normalizedEmail ? {
          email: {
            equals: normalizedEmail,
            mode: "insensitive"
          }
        } : void 0
      ].filter((v) => v != null)
    },
    select: {
      id: true,
      username: true,
      nip: true,
      email: true
    }
  });
  const matchesByNip = normalizedNip ? users.filter((user) => normalizeNip(user.nip) === normalizedNip) : [];
  const matchesByEmail = normalizedEmail ? users.filter((user) => normalizeEmail(user.email) === normalizedEmail) : [];
  if (matchesByNip.length > 1 || matchesByEmail.length > 1) {
    return {
      userId: null,
      status: "conflict",
      message: "Ditemukan lebih dari satu kandidat user. Perlu pengaitan manual."
    };
  }
  const nipSingle = matchesByNip.length === 1 ? matchesByNip[0] : null;
  const emailSingle = matchesByEmail.length === 1 ? matchesByEmail[0] : null;
  if (nipSingle && emailSingle && nipSingle.id !== emailSingle.id) {
    return {
      userId: null,
      status: "conflict",
      message: "Data NIP dan email mengarah ke user berbeda. Perlu pengaitan manual."
    };
  }
  if (nipSingle) {
    return {
      userId: nipSingle.id,
      status: "linked_auto",
      message: "Pegawai berhasil dikaitkan otomatis ke user berdasarkan NIP."
    };
  }
  if (emailSingle) {
    return {
      userId: emailSingle.id,
      status: "linked_auto",
      message: "Pegawai berhasil dikaitkan otomatis ke user berdasarkan email."
    };
  }
  return {
    userId: null,
    status: "unlinked",
    message: "Belum ada user yang cocok otomatis."
  };
}

// lib/validations/userValidations.ts
import { z } from "zod";

// lib/validations/userRules.ts
var USERNAME_REGEX = /^[a-zA-Z0-9_.-]+$/;
var NIP_REGEX = /^\d+$/;
var PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)\S+$/;
var UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
var USERNAME_MIN_LENGTH = 3;
var USERNAME_MAX_LENGTH = 100;
var NIP_MIN_LENGTH = 8;
var NIP_MAX_LENGTH = 50;
var PASSWORD_MIN_LENGTH = 8;
var EMAIL_MAX_LENGTH = 150;
function isValidUuid(value) {
  return UUID_REGEX.test(value.trim());
}

// lib/validations/userValidations.ts
var usernameSchema = z.string({ error: "Username wajib diisi" }).trim().min(1, "Username wajib diisi").min(USERNAME_MIN_LENGTH, "Username minimal 3 karakter").max(USERNAME_MAX_LENGTH, "Username maksimal 100 karakter").regex(
  USERNAME_REGEX,
  "Username hanya boleh huruf, angka, titik, garis bawah, atau strip"
);
var nipSchema = z.string({ error: "NIP wajib diisi" }).trim().min(1, "NIP wajib diisi").min(NIP_MIN_LENGTH, "NIP minimal 8 digit").max(NIP_MAX_LENGTH, "NIP maksimal 50 digit").regex(NIP_REGEX, "NIP hanya boleh berisi angka");
var passwordSchema = z.string({ error: "Password wajib diisi" }).min(1, "Password wajib diisi").min(PASSWORD_MIN_LENGTH, "Password minimal 8 karakter").regex(
  PASSWORD_REGEX,
  "Password harus mengandung huruf dan angka tanpa spasi"
);
var emailSchema = z.string({ error: "Email wajib diisi" }).trim().min(1, "Email wajib diisi").max(EMAIL_MAX_LENGTH, "Email maksimal 150 karakter").email("Format email tidak valid");
var roleIdSchema = z.string({ error: "Role wajib dipilih" }).trim().min(1, "Role wajib dipilih").refine((value) => isValidUuid(value), {
  message: "Format role tidak valid"
});
var employeeIdSchema = z.string().trim().optional().nullable().transform((value) => value && value.length > 0 ? value : null).refine((value) => value === null || isValidUuid(value), {
  message: "Format pegawai tidak valid"
});
var userCreateSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
  nip: nipSchema,
  email: emailSchema,
  role_id: roleIdSchema,
  employee_id: employeeIdSchema
});
var userUpdateSchema = z.object({
  nip: nipSchema,
  email: emailSchema,
  role_id: roleIdSchema,
  employee_id: employeeIdSchema
});

// lib/services/users/createUser.ts
async function createUser(data) {
  const parsed = userCreateSchema.parse(data);
  const { username, password, nip, email, role_id, employee_id } = parsed;
  const existingUser = await prisma.users.findUnique({
    where: { username }
  });
  if (existingUser) {
    throw new Error("Username sudah digunakan");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const linkResolution = await resolveEmployeeLinkForUser({
    nip,
    email,
    manualEmployeeId: employee_id
  });
  const user = await prisma.users.create({
    data: {
      username,
      password_hash: hashedPassword,
      nip,
      email,
      role_id,
      employee_id: linkResolution.employeeId
    }
  });
  return {
    ...user,
    link_status: linkResolution.status,
    link_message: linkResolution.message
  };
}

// lib/services/auth/registerPublicUser.ts
var publicRegisterSchema = z2.object({
  username: z2.string(),
  password: z2.string(),
  nip: z2.string(),
  email: z2.string()
});
async function registerPublicUser(input) {
  const parsed = publicRegisterSchema.parse(input);
  const employeeRole = await prisma.roles.findUnique({
    where: { name: "employee" },
    select: { id: true }
  });
  if (!employeeRole) {
    throw new Error("Role employee belum tersedia. Hubungi admin.");
  }
  const user = await createUser({
    username: parsed.username,
    password: parsed.password,
    nip: parsed.nip,
    email: parsed.email,
    role_id: employeeRole.id,
    employee_id: null
  });
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    link_status: user.link_status,
    link_message: user.link_message
  };
}

// lib/cookie-options.ts
var DEFAULT_MAX_AGE = 60 * 60 * 24;
function parseBoolean(value, fallback) {
  if (value === void 0) return fallback;
  return ["1", "true", "yes", "on"].includes(value.toLowerCase());
}
function parseSameSite(value, fallback) {
  const normalized = value?.toLowerCase();
  if (normalized === "strict") return "strict";
  if (normalized === "none") return "none";
  if (normalized === "lax") return "lax";
  return fallback;
}
function parseMaxAge(value) {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_MAX_AGE;
}
function getSessionCookieOptions(overrides = {}) {
  return {
    httpOnly: true,
    secure: parseBoolean(
      process.env.SESSION_COOKIE_SECURE,
      process.env.NODE_ENV === "production"
    ),
    sameSite: parseSameSite(process.env.SESSION_COOKIE_SAMESITE, "lax"),
    path: "/",
    maxAge: parseMaxAge(process.env.SESSION_COOKIE_MAX_AGE),
    domain: process.env.SESSION_COOKIE_DOMAIN || void 0,
    ...overrides
  };
}
function getClearedSessionCookieOptions() {
  return getSessionCookieOptions({ expires: /* @__PURE__ */ new Date(0), maxAge: 0 });
}

// lib/password.ts
import bcrypt2 from "bcrypt";
import { randomBytes } from "crypto";
var TEMP_PASSWORD_PREFIX = "TEMP::";
function isTemporaryPasswordHash(value) {
  return value.startsWith(TEMP_PASSWORD_PREFIX);
}
function unwrapPasswordHash(value) {
  return isTemporaryPasswordHash(value) ? value.slice(TEMP_PASSWORD_PREFIX.length) : value;
}
async function hashPassword(password) {
  return bcrypt2.hash(password, 10);
}
async function hashTemporaryPassword(password) {
  const hash = await bcrypt2.hash(password, 10);
  return `${TEMP_PASSWORD_PREFIX}${hash}`;
}
async function compareStoredPassword(password, storedHash) {
  return bcrypt2.compare(password, unwrapPasswordHash(storedHash));
}
function generateTemporaryPassword() {
  return `Tmp${randomBytes(6).toString("hex")}`;
}

// backend/lib/auth.ts
function getCookieValue(cookieHeader, key) {
  if (!cookieHeader) return null;
  const pairs = cookieHeader.split(";");
  for (const pair of pairs) {
    const [rawName, ...rawValueParts] = pair.trim().split("=");
    if (rawName !== key) continue;
    return decodeURIComponent(rawValueParts.join("="));
  }
  return null;
}
async function requireJWT(req) {
  const authHeader = req.headers.authorization;
  const cookieHeader = req.headers.cookie;
  const tokenFromCookie = getCookieValue(cookieHeader, "token");
  const sessionIdFromCookie = getCookieValue(cookieHeader, "session_id");
  const tokenFromHeader = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
  const token = tokenFromCookie ?? tokenFromHeader;
  if (!token) {
    throw new Error("TOKEN_NOT_FOUND");
  }
  if (tokenFromCookie && tokenFromHeader && tokenFromHeader !== tokenFromCookie) {
    throw new Error("TOKEN_OUT_OF_SYNC");
  }
  const payload = verifyToken(token);
  const user = await prisma.users.findUnique({
    where: { id: String(payload.userId) },
    select: { password_hash: true }
  });
  if (!user) {
    throw new Error("INVALID_TOKEN");
  }
  if (payload.passwordHash !== user.password_hash) {
    throw new Error("INVALID_TOKEN");
  }
  if (sessionIdFromCookie && payload.sessionId !== sessionIdFromCookie) {
    throw new Error("SESSION_MISMATCH");
  }
  return payload;
}

// backend/routes/auth.ts
var router = Router();
function getCookieValue2(cookieHeader, key) {
  if (!cookieHeader) return null;
  const pairs = cookieHeader.split(";");
  for (const pair of pairs) {
    const [rawName, ...rawValueParts] = pair.trim().split("=");
    if (rawName !== key) continue;
    return decodeURIComponent(rawValueParts.join("="));
  }
  return null;
}
router.post("/api/register", async (req, res) => {
  try {
    const user = await registerPublicUser({
      username: req.body?.username,
      password: req.body?.password,
      nip: req.body?.nip,
      email: req.body?.email
    });
    return res.status(201).json({
      message: "Registrasi berhasil. Silakan login.",
      data: user
    });
  } catch (error) {
    console.error("Public register error:", error);
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
});
router.post("/api/login", async (req, res) => {
  try {
    const activeToken = getCookieValue2(req.headers.cookie, "token");
    const activeSessionId = getCookieValue2(req.headers.cookie, "session_id");
    if (activeToken && activeSessionId) {
      try {
        const payload = verifyToken(activeToken);
        if (payload.sessionId === activeSessionId) {
          const currentUser = await prisma.users.findUnique({
            where: { id: String(payload.userId) },
            select: { password_hash: true }
          });
          if (currentUser && currentUser.password_hash === payload.passwordHash) {
            return res.json({
              message: "Sesi aktif ditemukan",
              token: activeToken,
              alreadyLoggedIn: true,
              mustChangePassword: Boolean(payload.mustChangePassword)
            });
          }
        }
      } catch (error) {
        console.warn("Token verification failed:", error);
      }
    }
    const { username, password } = req.body ?? {};
    if (!username || !password) {
      return res.status(400).json({
        message: "Username dan password wajib diisi"
      });
    }
    const user = await prisma.users.findUnique({
      where: { username },
      include: { roles: true }
    });
    if (!user) {
      return res.status(401).json({ message: "User tidak ditemukan" });
    }
    const passwordMatch = await compareStoredPassword(
      password,
      user.password_hash
    );
    if (!passwordMatch) {
      return res.status(401).json({ message: "Username atau Password salah" });
    }
    const mustChangePassword = isTemporaryPasswordHash(user.password_hash);
    const sessionId = randomUUID();
    const token = signToken({
      userId: user.id,
      username: user.username,
      role: user.roles?.name,
      sessionId,
      passwordHash: user.password_hash,
      mustChangePassword
    });
    await createActivity({
      userId: user.id,
      action: "login",
      description: { username: user.username, message: "login" }
    });
    res.cookie("token", token, getSessionCookieOptions());
    res.cookie("session_id", sessionId, getSessionCookieOptions());
    return res.json({
      message: "Login berhasil",
      token,
      mustChangePassword
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
router.post("/api/change-password", async (req, res) => {
  try {
    const auth = await requireJWT(req);
    const { currentPassword, newPassword, confirmPassword } = req.body ?? {};
    if (!newPassword || !confirmPassword) {
      return res.status(400).json({ message: "Password baru wajib diisi" });
    }
    if (String(newPassword) !== String(confirmPassword)) {
      return res.status(400).json({ message: "Konfirmasi password tidak sama" });
    }
    if (String(newPassword).trim().length < 8) {
      return res.status(400).json({ message: "Password minimal 8 karakter" });
    }
    const user = await prisma.users.findUnique({
      where: { id: String(auth.userId) },
      select: { id: true, username: true, password_hash: true }
    });
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }
    if (!auth.mustChangePassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: "Password lama wajib diisi" });
      }
      const currentMatch = await compareStoredPassword(
        String(currentPassword),
        user.password_hash
      );
      if (!currentMatch) {
        return res.status(401).json({ message: "Password lama salah" });
      }
    }
    const nextPasswordHash = await hashPassword(String(newPassword));
    const sessionId = randomUUID();
    const nextToken = signToken({
      userId: user.id,
      username: auth.username,
      role: auth.role,
      sessionId,
      passwordHash: nextPasswordHash,
      mustChangePassword: false
    });
    await prisma.users.update({
      where: { id: user.id },
      data: { password_hash: nextPasswordHash }
    });
    await createActivity({
      userId: user.id,
      action: "change_password",
      description: { username: user.username, message: "password changed" }
    });
    res.cookie("token", nextToken, getSessionCookieOptions());
    res.cookie("session_id", sessionId, getSessionCookieOptions());
    return res.json({
      message: "Password berhasil diubah",
      token: nextToken,
      mustChangePassword: false
    });
  } catch (error) {
    if (error instanceof Error && error.message === "TOKEN_NOT_FOUND") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (error instanceof Error && error.message === "INVALID_TOKEN") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    console.error("Change password error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
router.post("/api/logout", async (_req, res) => {
  res.cookie("token", "", getClearedSessionCookieOptions());
  res.cookie("session_id", "", getClearedSessionCookieOptions());
  return res.json({ message: "Logout berhasil" });
});
var auth_default = router;

// backend/routes/users.ts
import { Router as Router2 } from "express";

// lib/services/users/getAllUsers.ts
async function getUsers() {
  const users = await prisma.users.findMany({ orderBy: { id: "desc" } });
  const mappedUsers = await Promise.all(
    users.map(async (user) => {
      const resolution = await resolveEmployeeLinkForUser({
        nip: user.nip,
        email: user.email,
        manualEmployeeId: user.employee_id
      });
      return {
        ...user,
        link_status: resolution.status,
        link_message: resolution.message
      };
    })
  );
  return mappedUsers;
}

// lib/services/users/getUserById.ts
async function getUserById(id) {
  const user = await prisma.users.findUnique({
    where: {
      id
    }
  });
  if (!user) return null;
  const resolution = await resolveEmployeeLinkForUser({
    nip: user.nip,
    email: user.email,
    manualEmployeeId: user.employee_id
  });
  return {
    ...user,
    link_status: resolution.status,
    link_message: resolution.message
  };
}

// lib/services/users/updateUser.ts
async function updateUser(id, data) {
  const currentUser = await prisma.users.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      nip: true,
      email: true,
      employee_id: true
    }
  });
  if (!currentUser) {
    throw new Error("User not found");
  }
  const nextNip = typeof data.nip === "string" ? data.nip : data.nip === null ? null : currentUser.nip ?? null;
  const normalizedNip = nextNip?.trim() ?? "";
  if (!normalizedNip) {
    throw new Error("NIP wajib diisi");
  }
  const nextEmail = typeof data.email === "string" ? data.email : data.email === null ? null : currentUser.email;
  let nextEmployeeId;
  if (typeof data.employee_id === "string") {
    nextEmployeeId = data.employee_id;
  } else if (data.employee_id === null) {
    nextEmployeeId = null;
  }
  const linkResolution = await resolveEmployeeLinkForUser({
    nip: normalizedNip,
    email: nextEmail,
    manualEmployeeId: nextEmployeeId
  });
  const updated = await prisma.users.update({
    where: {
      id
    },
    data: {
      ...data,
      nip: normalizedNip,
      employee_id: linkResolution.employeeId
    }
  });
  const resolvedEmployeeId = linkResolution.employeeId ?? updated.employee_id;
  const isNewLink = resolvedEmployeeId && resolvedEmployeeId !== currentUser.employee_id;
  const isEmailChanged = resolvedEmployeeId && nextEmail && nextEmail !== currentUser.email;
  if (isNewLink) {
    await prisma.employees.update({
      where: { id: resolvedEmployeeId },
      data: {
        ...nextEmail ? { email: nextEmail } : {},
        ...normalizedNip ? { nip: normalizedNip } : {}
      }
    }).catch(() => {
    });
  } else if (isEmailChanged) {
    await prisma.employees.update({
      where: { id: resolvedEmployeeId },
      data: { email: nextEmail }
    }).catch(() => {
    });
  }
  return {
    ...updated,
    link_status: linkResolution.status,
    link_message: linkResolution.message
  };
}

// lib/services/users/deleteUser.ts
async function deleteUser(id) {
  return prisma.users.delete({
    where: {
      id
    }
  });
}

// lib/require-role.ts
function requireRole(user, roles) {
  if (!roles.includes(user.role)) {
    throw new Error("FORBIDDEN");
  }
}

// backend/routes/users.ts
var router2 = Router2();
router2.get("/api/user", async (req, res) => {
  try {
    const user = await requireJWT(req);
    if (!user.role || typeof user.role !== "string") {
      return res.status(400).json({ message: "User role is required" });
    }
    requireRole({ ...user, role: user.role }, ["admin"]);
    const users = await getUsers();
    return res.json(users);
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return res.status(403).json({ message: "Forbidden" });
    }
    if (error instanceof Error && [
      "TOKEN_NOT_FOUND",
      "TOKEN_OUT_OF_SYNC",
      "SESSION_MISMATCH",
      "INVALID_TOKEN"
    ].includes(error.message)) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    console.error("GET users error:", error);
    return res.status(500).json({ message: "Failed to fetch users" });
  }
});
router2.post("/api/user", async (req, res) => {
  try {
    const user = await requireJWT(req);
    if (!user.role || typeof user.role !== "string") {
      return res.status(400).json({ message: "User role is required" });
    }
    requireRole({ ...user, role: user.role }, ["admin"]);
    const process2 = userCreateSchema.safeParse(req.body);
    if (!process2.success) {
      const firstError = process2.error.issues[0]?.message ?? "Data tidak valid";
      return res.status(400).json({ message: firstError });
    }
    const { username, password, nip, email, role_id, employee_id } = process2.data;
    const userCreate = await createUser({
      username,
      password,
      nip,
      email,
      role_id,
      employee_id
    });
    await createActivity({
      userId: userCreate.id ? String(userCreate.id) : null,
      action: "create_user",
      description: {
        userId: userCreate.id,
        username: userCreate.username,
        message: "created"
      }
    });
    return res.status(201).json({
      message: "User berhasil dibuat",
      data: {
        id: userCreate.id,
        username: userCreate.username,
        email: userCreate.email,
        employee_id: userCreate.employee_id,
        link_status: userCreate.link_status,
        link_message: userCreate.link_message,
        role: {
          role_id: userCreate.role_id
        }
      }
    });
  } catch (error) {
    console.error("Create user error:", error);
    if (error instanceof Error && [
      "TOKEN_NOT_FOUND",
      "TOKEN_OUT_OF_SYNC",
      "SESSION_MISMATCH",
      "INVALID_TOKEN"
    ].includes(error.message)) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
});
router2.get("/api/user/:id", async (req, res) => {
  try {
    const authUser = await requireJWT(req);
    if (!authUser.role || typeof authUser.role !== "string") {
      return res.status(400).json({ message: "User role is required" });
    }
    const { id } = req.params;
    const isAdmin = authUser.role.toLowerCase() === "admin";
    const isSelf = String(authUser.userId ?? "") === id;
    if (!isAdmin && !isSelf) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json(user);
  } catch (error) {
    if (error instanceof Error && [
      "TOKEN_NOT_FOUND",
      "TOKEN_OUT_OF_SYNC",
      "SESSION_MISMATCH",
      "INVALID_TOKEN"
    ].includes(error.message)) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    console.error("GET User Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
router2.put("/api/user/:id", async (req, res) => {
  try {
    const authUser = await requireJWT(req);
    if (!authUser.role || typeof authUser.role !== "string") {
      return res.status(400).json({ message: "User role is required" });
    }
    const { id } = req.params;
    const isAdmin = authUser.role.toLowerCase() === "admin";
    const isSelf = String(authUser.userId ?? "") === id;
    if (!isAdmin && !isSelf) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const process2 = userUpdateSchema.safeParse(req.body);
    if (!process2.success) {
      const firstError = process2.error.issues[0]?.message ?? "Data tidak valid";
      return res.status(400).json({ message: firstError });
    }
    const nextData = { ...process2.data };
    if (!isAdmin) {
      const currentUser = await getUserById(id);
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      if (!currentUser.role_id) {
        return res.status(400).json({ message: "Role user tidak valid" });
      }
      nextData.role_id = currentUser.role_id;
      nextData.employee_id = currentUser.employee_id;
    }
    const user = await updateUser(id, nextData);
    await createActivity({
      userId: authUser.userId === null || authUser.userId === void 0 ? null : String(authUser.userId),
      action: "update_user",
      description: { userId: id, message: "updated" }
    });
    return res.json(user);
  } catch (error) {
    if (error instanceof Error && [
      "TOKEN_NOT_FOUND",
      "TOKEN_OUT_OF_SYNC",
      "SESSION_MISMATCH",
      "INVALID_TOKEN"
    ].includes(error.message)) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (error instanceof Error && error.message === "User not found") {
      return res.status(404).json({ message: "User not found" });
    }
    if (error instanceof Error && error.message === "NIP wajib diisi") {
      return res.status(400).json({ message: error.message });
    }
    if (error?.code === "P2025") {
      return res.status(404).json({ message: "User not found" });
    }
    console.error("PUT user error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
router2.delete("/api/user/:id", async (req, res) => {
  try {
    const authUser = await requireJWT(req);
    if (!authUser.role || authUser.role.toLowerCase() !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    const { id } = req.params;
    await deleteUser(id);
    await createActivity({
      userId: authUser.userId === null || authUser.userId === void 0 ? null : String(authUser.userId),
      action: "delete_user",
      description: { userId: id, message: "deleted" }
    });
    return res.json({ message: "User deleted successfully" });
  } catch (error) {
    if (error instanceof Error && [
      "TOKEN_NOT_FOUND",
      "TOKEN_OUT_OF_SYNC",
      "SESSION_MISMATCH",
      "INVALID_TOKEN"
    ].includes(error.message)) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (error instanceof Error && [
      "TOKEN_NOT_FOUND",
      "TOKEN_OUT_OF_SYNC",
      "SESSION_MISMATCH",
      "INVALID_TOKEN"
    ].includes(error.message)) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (error?.code === "P2025") {
      return res.status(404).json({ message: "User not found" });
    }
    console.error("DELETE user error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
router2.post("/api/user/:id/reset-password", async (req, res) => {
  try {
    const authUser = await requireJWT(req);
    if (!authUser.role || authUser.role.toLowerCase() !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    const { id } = req.params;
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const temporaryPassword = generateTemporaryPassword();
    const temporaryPasswordHash = await hashTemporaryPassword(temporaryPassword);
    await prisma.users.update({
      where: { id },
      data: { password_hash: temporaryPasswordHash }
    });
    await createActivity({
      userId: authUser.userId === null || authUser.userId === void 0 ? null : String(authUser.userId),
      action: "reset_password",
      description: {
        userId: id,
        username: user.username,
        message: "password reset"
      }
    });
    return res.json({
      message: "Password berhasil direset",
      temporaryPassword
    });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return res.status(403).json({ message: "Forbidden" });
    }
    console.error("Reset password error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
var users_default = router2;

// backend/routes/roles.ts
import { Router as Router3 } from "express";

// lib/services/roles/getAllRoles.ts
async function getRoles() {
  return prisma.roles.findMany({ orderBy: { id: "desc" } });
}

// backend/routes/roles.ts
var router3 = Router3();
router3.get("/api/roles", async (req, res) => {
  try {
    const user = await requireJWT(req);
    if (!user.role || typeof user.role !== "string") {
      return res.status(400).json({ message: "User role is required" });
    }
    requireRole({ ...user, role: user.role }, ["admin"]);
    const roles = await getRoles();
    return res.json(roles);
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return res.status(403).json({ message: "Forbidden" });
    }
    if (error instanceof Error && [
      "TOKEN_NOT_FOUND",
      "TOKEN_OUT_OF_SYNC",
      "SESSION_MISMATCH",
      "INVALID_TOKEN"
    ].includes(error.message)) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    console.error("GET roles error:", error);
    return res.status(500).json({ message: "Failed to fetch roles" });
  }
});
var roles_default = router3;

// backend/routes/employees.ts
import { Router as Router4 } from "express";

// lib/services/employee/getEmployees.ts
async function getEmployees() {
  return prisma.employees.findMany({ orderBy: { id: "desc" } });
}

// lib/services/employee/createEmployee.ts
async function createEmployee(data) {
  const employee = await prisma.employees.create({
    data
  });
  const resolution = await resolveUserLinkForEmployee({
    nip: employee.nip,
    email: employee.email
  });
  if (resolution.userId) {
    await prisma.users.update({
      where: { id: resolution.userId },
      data: { employee_id: employee.id }
    });
  }
  return employee;
}

// lib/services/employee/getEmployeeById.ts
async function getEmployeeById(id) {
  return prisma.employees.findUnique({
    where: {
      id
    }
  });
}

// lib/services/employee/updateEmployee.ts
async function updateEmployee(id, data) {
  const directLinkedUser = await prisma.users.findFirst({
    where: { employee_id: id },
    select: { id: true, email: true, nip: true }
  });
  const nextEmployeeData = { ...data };
  if (directLinkedUser) {
    const requestedEmail = typeof data.email === "string" ? data.email.trim() : null;
    const requestedNip = typeof data.nip === "string" ? data.nip.trim() : null;
    const shouldUpdateUserEmail = requestedEmail !== null && requestedEmail !== directLinkedUser.email;
    const shouldUpdateUserNip = requestedNip !== null && requestedNip !== directLinkedUser.nip;
    let masterEmail = directLinkedUser.email;
    let masterNip = directLinkedUser.nip;
    if (shouldUpdateUserEmail || shouldUpdateUserNip) {
      const updatedUser = await prisma.users.update({
        where: { id: directLinkedUser.id },
        data: {
          employee_id: id,
          ...shouldUpdateUserEmail ? { email: requestedEmail } : {},
          ...shouldUpdateUserNip ? { nip: requestedNip } : {}
        },
        select: { email: true, nip: true }
      });
      masterEmail = updatedUser.email;
      masterNip = updatedUser.nip;
    }
    if (masterEmail) {
      nextEmployeeData.email = masterEmail;
    }
    if (masterNip) {
      nextEmployeeData.nip = masterNip;
    }
  }
  const employee = await prisma.employees.update({
    where: {
      id
    },
    data: nextEmployeeData
  });
  if (directLinkedUser) {
    return employee;
  }
  const resolution = await resolveUserLinkForEmployee({
    nip: employee.nip,
    email: employee.email
  });
  const linkedUserId = resolution.userId;
  if (linkedUserId) {
    await prisma.users.update({
      where: { id: linkedUserId },
      data: { employee_id: employee.id }
    });
  }
  return employee;
}

// lib/services/employee/getDocumentsByEmployee.ts
async function getDocumentsByEmployee(employeeId) {
  const docs = await prisma.documents.findMany({
    where: {
      employee_id: employeeId
    },
    include: {
      employees: true,
      users: {
        include: {
          employees: true
        }
      }
    },
    orderBy: {
      uploaded_at: "desc"
    }
  });
  return docs.map((d) => ({
    ...d,
    employee_name: d.employees?.nama ?? null,
    verified_by: d.users?.id ?? d.verified_by ?? null,
    verified_by_name: d.users?.username ?? d.users?.employees?.nama ?? null
  }));
}

// lib/validations/employeeValidations.ts
import { z as z3 } from "zod";
var employeeSchema = z3.object({
  nip: z3.string().min(1, "NIP wajib diisi"),
  nama: z3.string().min(1, "Nama wajib diisi"),
  jabatan: z3.string().min(1, "Jabatan wajib diisi"),
  unit: z3.string().min(1, "Unit wajib diisi"),
  status: z3.string().min(1, "Status wajib diisi"),
  alamat: z3.string().min(1, "Alamat wajib diisi"),
  no_hp: z3.string().min(1, "No HP wajib diisi"),
  email: z3.string({
    error: "Email wajib diisi"
  }).min(1, "Email wajib diisi").email("Format email tidak valid")
});

// backend/routes/employees.ts
var router4 = Router4();
router4.get("/api/employees", async (req, res) => {
  try {
    const user = await requireJWT(req);
    if (!user.role || typeof user.role !== "string") {
      return res.status(400).json({ message: "User role is required" });
    }
    const employees = await getEmployees();
    return res.json(employees);
  } catch (error) {
    if (error instanceof Error && [
      "TOKEN_NOT_FOUND",
      "TOKEN_OUT_OF_SYNC",
      "SESSION_MISMATCH",
      "INVALID_TOKEN"
    ].includes(error.message)) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    console.error("GET employees error:", error);
    return res.status(500).json({ message: "Failed to fetch employees" });
  }
});
router4.post("/api/employees", async (req, res) => {
  try {
    const { role, userId } = await requireJWT(req);
    if (role !== "admin" && role !== "employee" && role !== "hr") {
      return res.status(403).json({ message: "Forbidden" });
    }
    const shouldLinkToCurrentUser = req.body?.linkToCurrentUser === true;
    const process2 = employeeSchema.safeParse(req.body);
    if (!process2.success) {
      return res.status(400).json({ message: process2.error.issues });
    }
    const employee = await createEmployee(process2.data);
    if ((role === "employee" || shouldLinkToCurrentUser) && userId) {
      await prisma.users.update({
        where: { id: String(userId) },
        data: { employee_id: employee.id }
      });
    }
    await createActivity({
      userId: userId === null || userId === void 0 ? null : String(userId),
      action: "create_employee",
      description: {
        employeeId: employee.id,
        name: employee.nama ?? null,
        message: "created"
      }
    });
    return res.status(201).json({
      message: "Employee created successfully",
      data: employee
    });
  } catch (error) {
    console.error("ERROR:", error);
    if (error instanceof Error && [
      "TOKEN_NOT_FOUND",
      "TOKEN_OUT_OF_SYNC",
      "SESSION_MISMATCH",
      "INVALID_TOKEN"
    ].includes(error.message)) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
});
router4.get("/api/employees/:id", async (req, res) => {
  try {
    const auth = await requireJWT(req);
    const { id } = req.params;
    if (!auth.role || typeof auth.role !== "string") {
      return res.status(400).json({ message: "User role is required" });
    }
    if (auth.role !== "admin") {
      if (auth.role !== "employee" && !auth.userId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      const me = await prisma.users.findUnique({
        where: { id: String(auth.userId) },
        select: { employee_id: true }
      });
      if (!me?.employee_id || me.employee_id !== id) {
        return res.status(404).json({ message: "Not Found" });
      }
    }
    const employee = await getEmployeeById(id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    return res.json(employee);
  } catch (error) {
    if (error instanceof Error && [
      "TOKEN_NOT_FOUND",
      "TOKEN_OUT_OF_SYNC",
      "SESSION_MISMATCH",
      "INVALID_TOKEN"
    ].includes(error.message)) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    console.error("GET Employee Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
router4.put("/api/employees/:id", async (req, res) => {
  try {
    const { userId, role } = await requireJWT(req);
    const employeeId = req.params.id;
    if (userId === null || role === null) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (role !== "admin" && role !== "hr") {
      return res.status(403).json({ message: "Forbidden" });
    }
    if (role === "hr") {
      const me = await prisma.users.findUnique({
        where: { id: String(userId) },
        select: { employee_id: true }
      });
      if (!me?.employee_id || me.employee_id !== employeeId) {
        return res.status(403).json({ message: "Forbidden" });
      }
    }
    const employeeOwner = await getEmployeeById(employeeId);
    if (!employeeOwner && role !== "admin") {
      return res.status(404).json({ message: "Employee not found" });
    }
    const employee = await updateEmployee(employeeId, req.body);
    await createActivity({
      userId: userId === null || userId === void 0 ? null : String(userId),
      action: "update_employee",
      description: {
        employeeId,
        employeeName: employeeOwner?.nama ?? null,
        message: "updated"
      }
    });
    return res.json(employee);
  } catch (error) {
    if (error?.code === "P2025") {
      return res.status(404).json({ message: "Employee not found" });
    }
    if (error instanceof Error && [
      "TOKEN_NOT_FOUND",
      "TOKEN_OUT_OF_SYNC",
      "SESSION_MISMATCH",
      "INVALID_TOKEN"
    ].includes(error.message)) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
});
router4.delete("/api/employees/:id", async (req, res) => {
  try {
    const { userId, role } = await requireJWT(req);
    const employeeId = req.params.id;
    if (userId === null || role === null) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    const employeeOwner = await getEmployeeById(employeeId);
    if (!employeeOwner) {
      return res.status(404).json({ message: "Employee not found" });
    }
    await prisma.$transaction(async (tx) => {
      await tx.users.updateMany({
        where: { employee_id: employeeId },
        data: { employee_id: null }
      });
      await tx.employees.delete({ where: { id: employeeId } });
    });
    await createActivity({
      userId: userId === null || userId === void 0 ? null : String(userId),
      action: "delete_employee",
      description: {
        employeeId,
        employeeName: employeeOwner?.nama ?? null,
        message: "deleted"
      }
    });
    return res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    if (error?.code === "P2025") {
      return res.status(404).json({ message: "Employee not found" });
    }
    if (error instanceof Error && [
      "TOKEN_NOT_FOUND",
      "TOKEN_OUT_OF_SYNC",
      "SESSION_MISMATCH",
      "INVALID_TOKEN"
    ].includes(error.message)) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (error?.code === "P2003") {
      return res.status(409).json({
        message: "Employee tidak bisa dihapus karena masih terhubung ke data lain"
      });
    }
    console.error("DELETE employee error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
router4.get("/api/employees/:id/documents", async (req, res) => {
  try {
    const { id } = req.params;
    const documents = await getDocumentsByEmployee(id);
    return res.json({ success: true, data: documents });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({ success: false, message });
  }
});
var employees_default = router4;

// backend/routes/activity.ts
import { Router as Router5 } from "express";

// lib/services/activity/getActivity.ts
async function getActivity() {
  return prisma.activity_logs.findMany({
    orderBy: {
      created_at: "desc"
    }
  });
}

// backend/routes/activity.ts
var router5 = Router5();
router5.get("/api/activity", async (req, res) => {
  try {
    const role = (await requireJWT(req)).role;
    if (!role || typeof role !== "string") {
      return res.status(400).json({ message: "User role is required" });
    }
    requireRole({ username: "system", role }, ["admin"]);
    const activities = await getActivity();
    return res.json({ success: true, data: activities });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return res.status(403).json({ message: "Forbidden" });
    }
    if (error instanceof Error && [
      "TOKEN_NOT_FOUND",
      "TOKEN_OUT_OF_SYNC",
      "SESSION_MISMATCH",
      "INVALID_TOKEN"
    ].includes(error.message)) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    console.error("GET Activity Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
var activity_default = router5;

// backend/routes/documents.ts
import { Router as Router6 } from "express";
import { unlink } from "fs/promises";
import path2 from "path";
import z5 from "zod";

// lib/services/document/getDocuments.ts
async function getDocuments() {
  const docs = await prisma.documents.findMany({
    include: {
      employees: true,
      users: {
        include: {
          employees: true
        }
      }
    }
  });
  return docs.map((d) => ({
    ...d,
    employee_name: d.employees?.nama ?? null,
    verified_by: d.users?.id ?? d.verified_by ?? null,
    verified_by_name: d.users?.username ?? d.users?.employees?.nama ?? null
  }));
}

// lib/services/document/createDocument.ts
async function createDocument(data) {
  return prisma.documents.create({
    data
  });
}

// lib/services/document/getDocumentById.ts
async function getDocumentById(id) {
  return prisma.documents.findUnique({
    where: {
      id
    }
  });
}

// lib/services/document/updateDocument.ts
async function updateDocument(id, data) {
  return prisma.documents.update({
    where: {
      id
    },
    data
  });
}

// lib/services/document/deleteDocument.ts
async function deleteDocument(documentId) {
  return prisma.documents.delete({
    where: {
      id: documentId
    }
  });
}

// lib/services/roles/getRoleById.ts
async function getRoleById(id) {
  return prisma.roles.findUnique({
    where: {
      id
    }
  });
}

// lib/validations/documentValidations.ts
import { z as z4 } from "zod";
var documentCreateSchema = z4.object({
  // employee IDs are UUID strings in the DB
  employee_id: z4.string({
    error: "Employee ID harus diisi sebagai string"
  }).min(1).optional(),
  document_type: z4.string({
    error: "Tipe dokumen wajib diisi"
  }).min(1, "Tipe dokumen tidak boleh kosong").max(50, "Tipe dokumen maksimal 50 karakter"),
  file_path: z4.string({
    error: "File path wajib diisi"
  }).min(1, "File path tidak boleh kosong"),
  uploaded_at: z4.coerce.date().optional(),
  verified_by: z4.string({
    error: "Verified by harus berupa string"
  }).min(1).optional(),
  verified_at: z4.coerce.date().optional()
});
var documentUpdateSchema = z4.object({
  employee_id: z4.string().min(1).optional(),
  document_type: z4.string().min(1, "Tipe dokumen tidak boleh kosong").max(50).optional(),
  file_path: z4.string().min(1, "File path tidak boleh kosong").optional(),
  uploaded_at: z4.coerce.date().optional(),
  verified_by: z4.string().min(1).optional(),
  verified_at: z4.coerce.date().optional()
});

// backend/routes/documents.ts
var router6 = Router6();
router6.get("/api/documents", async (req, res) => {
  try {
    const { role } = await requireJWT(req);
    if (role !== "admin" && role !== "hr") {
      return res.status(403).json({ message: "Forbidden" });
    }
    const documents = await getDocuments();
    return res.json(documents);
  } catch (error) {
    if (error instanceof Error && [
      "TOKEN_NOT_FOUND",
      "TOKEN_OUT_OF_SYNC",
      "SESSION_MISMATCH",
      "INVALID_TOKEN"
    ].includes(error.message)) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    console.error("GET documents error:", error);
    return res.status(500).json({ message: "Failed to fetch documents" });
  }
});
router6.post("/api/documents", async (req, res) => {
  try {
    const { role, userId } = await requireJWT(req);
    if (role !== "admin" && role !== "hr") {
      return res.status(403).json({ message: "Forbidden" });
    }
    const process2 = documentCreateSchema.safeParse(req.body);
    if (!process2.success) {
      return res.status(400).json({ message: process2.error.issues });
    }
    const document = await createDocument({
      ...process2.data,
      file_name: req.body.file_name,
      file_size: req.body.file_size,
      mime_type: req.body.mime_type
    });
    await createActivity({
      userId: userId === null || userId === void 0 ? null : String(userId),
      action: "create_document",
      description: {
        documentId: document.id,
        fileName: document.file_name,
        message: "created"
      }
    });
    return res.status(201).json({
      message: "Document created successfully",
      data: document
    });
  } catch (error) {
    console.error("ERROR:", error);
    if (error instanceof z5.ZodError) {
      return res.status(400).json({ message: error.issues });
    }
    if (error instanceof Error && [
      "TOKEN_NOT_FOUND",
      "TOKEN_OUT_OF_SYNC",
      "SESSION_MISMATCH",
      "INVALID_TOKEN"
    ].includes(error.message)) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
});
router6.get("/api/documents/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const documentGet = await getDocumentById(id);
    const getRole = await getRoleById(
      documentGet?.verified_by?.toString() || "0"
    );
    if (!documentGet) {
      return res.status(404).json({ message: "Document not found" });
    }
    const result = {
      id: documentGet.id,
      employee_id: documentGet.employee_id,
      file_name: documentGet.file_path.split("/").pop(),
      file_path: documentGet.file_path,
      verified_by_id: documentGet.verified_by,
      verified_by_role: getRole ? getRole.name : null,
      uploaded_at: documentGet.uploaded_at,
      verified_at: documentGet.verified_at
    };
    return res.json(result);
  } catch (error) {
    if (error instanceof Error && [
      "TOKEN_NOT_FOUND",
      "TOKEN_OUT_OF_SYNC",
      "SESSION_MISMATCH",
      "INVALID_TOKEN"
    ].includes(error.message)) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    console.error("GET Document Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
router6.put("/api/documents/:id", async (req, res) => {
  try {
    const { role, userId } = await requireJWT(req);
    if (role !== "admin" && role !== "hr") {
      return res.status(403).json({ message: "Forbidden" });
    }
    const { id } = req.params;
    const getDocument = await getDocumentById(id);
    if (!getDocument) {
      return res.status(404).json({ message: "Document not found" });
    }
    const documentUpdate = await updateDocument(id, req.body);
    await createActivity({
      userId: userId === null || userId === void 0 ? null : String(userId),
      action: `update_document ${getDocument.file_name}`,
      description: {
        documentId: id,
        documentName: getDocument?.file_name ?? null,
        message: "updated"
      }
    });
    return res.json(documentUpdate);
  } catch (error) {
    if (error?.code === "P2025") {
      return res.status(404).json({ message: "Document not found" });
    }
    if (error instanceof Error && [
      "TOKEN_NOT_FOUND",
      "TOKEN_OUT_OF_SYNC",
      "SESSION_MISMATCH",
      "INVALID_TOKEN"
    ].includes(error.message)) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
});
router6.delete("/api/documents/:id", async (req, res) => {
  try {
    const { role, userId } = await requireJWT(req);
    if (role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    const { id: documentId } = req.params;
    if (!documentId || typeof documentId !== "string") {
      return res.status(400).json({ message: "Document ID tidak valid" });
    }
    const document = await getDocumentById(documentId);
    if (!document) {
      return res.status(404).json({ message: "Document tidak ditemukan" });
    }
    const filePath = path2.join(process.cwd(), "public", document.file_path);
    await unlink(filePath).catch(() => {
    });
    await deleteDocument(documentId);
    await createActivity({
      userId: userId === null || userId === void 0 ? null : String(userId),
      action: `delete_document ${document.file_name}`,
      description: {
        documentId,
        documentName: document?.file_name ?? null,
        message: "deleted"
      }
    });
    return res.json({
      success: true,
      message: "Document berhasil dihapus"
    });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "Unknown error";
    if ([
      "TOKEN_NOT_FOUND",
      "TOKEN_OUT_OF_SYNC",
      "SESSION_MISMATCH",
      "INVALID_TOKEN"
    ].includes(message)) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    return res.status(500).json({ success: false, message });
  }
});
router6.get("/api/documents/:id/details", async (req, res) => {
  try {
    const { id } = req.params;
    const document = await getDocumentById(id);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }
    return res.json(document);
  } catch (error) {
    console.error("GET Document details error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
var documents_default = router6;

// backend/routes/documentsUpload.ts
import { Router as Router7 } from "express";
import multer from "multer";
import { mkdir, writeFile } from "fs/promises";
import path3 from "path";
import { v4 as uuidv4 } from "uuid";

// lib/validations/document.schema.ts
import { z as z6 } from "zod";
var uploadDocumentSchema = z6.object({
  // employees.id is a UUID string in the database, accept non-empty string
  employee_id: z6.string().min(1),
  employeeName: z6.string().min(2).max(100).optional(),
  document_type: z6.string().min(2).max(100)
});

// utils/fileUpload.ts
var MAX_FILE_SIZE = 5 * 1024 * 1024;
var ALLOWED_TYPES = ["image/jpeg", "image/png", "application/pdf"];
function validateFile(file) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(`File type ${file.type} tidak diizinkan`);
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`Ukuran file maksimal 5MB`);
  }
}

// backend/routes/documentsUpload.ts
var router7 = Router7();
var upload = multer({ storage: multer.memoryStorage() });
var uploadFields = upload.array("files");
var uploadsRoot = path3.join(process.cwd(), "public", "uploads", "documents");
function sanitizeSegment(value) {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_+|_+$/g, "").replace(/_{2,}/g, "_");
}
router7.post("/api/documents/upload", (req, res) => {
  uploadFields(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    try {
      const auth = await requireJWT(req);
      const form = req.body;
      const files = req.files ?? [];
      const employee_id = form.employee_id;
      const document_type = form.document_type;
      const other_document_type = form.other_document_type;
      const employeeNameField = form.employeeName;
      if (!files.length) {
        return res.status(400).json({ message: "File tidak ditemukan" });
      }
      const parsed = uploadDocumentSchema.safeParse({
        employee_id,
        employeeName: employeeNameField,
        document_type
      });
      if (!parsed.success) {
        return res.status(400).json({ message: parsed.error.flatten() });
      }
      const isOtherType = parsed.data.document_type === "LAINNYA";
      const otherTypeLabel = typeof other_document_type === "string" ? other_document_type.trim() : "";
      if (isOtherType && !otherTypeLabel) {
        return res.status(400).json({
          message: "Nama tipe dokumen wajib diisi saat memilih opsi LAINNYA"
        });
      }
      const employee = await prisma.employees.findUnique({
        where: { id: String(parsed.data.employee_id) },
        select: { nama: true }
      });
      const employeeNameFolder = parsed.data.employeeName ?? employee?.nama ?? String(parsed.data.employee_id);
      const employeeFolder = sanitizeSegment(employeeNameFolder) || String(parsed.data.employee_id);
      const employeeSegment = sanitizeSegment(
        employee?.nama || String(parsed.data.employee_id)
      );
      const docTypeSegment = sanitizeSegment(parsed.data.document_type);
      const otherTypeSegment = sanitizeSegment(otherTypeLabel);
      const baseDisplayName = isOtherType ? `${employeeSegment}_${docTypeSegment}_${otherTypeSegment}` : `${employeeSegment}_${docTypeSegment}`;
      const uploadPath = path3.join(uploadsRoot, employeeFolder);
      await mkdir(uploadPath, { recursive: true });
      const documentsData = [];
      for (let index = 0; index < files.length; index++) {
        const file = files[index];
        validateFile({ type: file.mimetype, size: file.size });
        const ext = path3.extname(file.originalname);
        const fileName = `${uuidv4()}${ext}`;
        const sequenceSuffix = files.length > 1 ? `_${index + 1}` : "";
        const displayFileName = `${baseDisplayName}${sequenceSuffix}${ext}`;
        const filePath = path3.join(uploadPath, fileName);
        await writeFile(filePath, file.buffer);
        documentsData.push({
          employee_id: String(parsed.data.employee_id),
          document_type: parsed.data.document_type,
          file_path: `/uploads/documents/${employeeFolder}/${fileName}`,
          uploaded_at: /* @__PURE__ */ new Date(),
          file_name: displayFileName,
          file_size: file.size,
          mime_type: file.mimetype
        });
      }
      const result = await prisma.documents.createMany({ data: documentsData });
      await createActivity({
        userId: auth.userId === null || auth.userId === void 0 ? null : String(auth.userId),
        action: "upload_document",
        description: {
          employeeId: String(parsed.data.employee_id),
          files: documentsData.map((d) => d.file_name),
          message: "uploaded"
        }
      });
      return res.json({
        message: "Upload berhasil",
        count: result.count,
        files: documentsData
      });
    } catch (error) {
      console.error("Upload error:", error);
      if (error instanceof Error) {
        if ([
          "TOKEN_NOT_FOUND",
          "TOKEN_OUT_OF_SYNC",
          "SESSION_MISMATCH",
          "INVALID_TOKEN"
        ].includes(error.message)) {
          return res.status(401).json({ message: "Unauthorized" });
        }
        return res.status(500).json({ message: error.message });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });
});
var documentsUpload_default = router7;

// backend/routes/documentsVerifyReject.ts
import { Router as Router8 } from "express";

// lib/services/document/verifyDocument.ts
async function verifyDocument(documentId, verifiedBy) {
  const doc = await prisma.documents.update({
    where: { id: documentId },
    data: {
      verified_by: verifiedBy,
      verified_at: /* @__PURE__ */ new Date(),
      status: "verified"
    },
    include: {
      users: {
        include: {
          employees: true
        }
      }
    }
  });
  return {
    id: doc.id,
    status: doc.status,
    verified_at: doc.verified_at,
    verified_by: doc.verified_by,
    // prefer users.username since verifier is a user (admin), fallback to employee name
    verified_by_name: doc.users?.username ?? doc.users?.employees?.nama ?? null,
    file_path: doc.file_path
  };
}

// lib/services/document/rejectDocument.ts
async function rejectDocument(documentId, verifiedBy) {
  const doc = await prisma.documents.update({
    where: { id: documentId },
    data: {
      verified_by: verifiedBy,
      verified_at: /* @__PURE__ */ new Date(),
      status: "rejected"
    },
    include: {
      users: {
        include: {
          employees: true
        }
      }
    }
  });
  return {
    id: doc.id,
    status: doc.status,
    verified_at: doc.verified_at,
    verified_by: doc.verified_by,
    // prefer users.username since verifier is a user (admin), fallback to employee name
    verified_by_name: doc.users?.username ?? doc.users?.employees?.nama ?? null,
    file_path: doc.file_path
  };
}

// backend/routes/documentsVerifyReject.ts
var router8 = Router8();
async function handleDecision(req, res, decision) {
  try {
    const { role, userId } = await requireJWT(req);
    if (role !== "admin" && role !== "hr") {
      return res.status(403).json({ message: "Forbidden" });
    }
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const verifiedByStr = String(userId);
    const userToVerify = await getUserById(verifiedByStr);
    if (!userToVerify) {
      return res.status(404).json({ message: "User yang memverifikasi tidak ditemukan" });
    }
    const documentId = String(req.params.id);
    const getDocument = await getDocumentById(documentId);
    if (!getDocument) {
      return res.status(404).json({
        message: decision === "verified" ? "Document yang akan diverifikasi tidak ditemukan" : "Document yang akan ditolak tidak ditemukan"
      });
    }
    const document = decision === "verified" ? await verifyDocument(documentId, verifiedByStr) : await rejectDocument(documentId, verifiedByStr);
    await createActivity({
      userId: verifiedByStr,
      action: `${decision === "verified" ? "verify" : "reject"}_document ${getDocument?.file_name ?? ""}`,
      description: {
        documentId,
        documentName: getDocument?.file_name ?? null,
        [decision === "verified" ? "verifiedBy" : "rejectedBy"]: verifiedByStr,
        message: decision
      }
    });
    return res.json({
      success: true,
      message: decision === "verified" ? "Document berhasil diverifikasi" : "Document berhasil ditolak",
      data: document
    });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "Unknown error";
    if ([
      "TOKEN_NOT_FOUND",
      "TOKEN_OUT_OF_SYNC",
      "SESSION_MISMATCH",
      "INVALID_TOKEN"
    ].includes(message)) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    return res.status(500).json({ success: false, message });
  }
}
router8.patch("/api/documents/verify/:id", async (req, res) => {
  return handleDecision(req, res, "verified");
});
router8.patch("/api/documents/reject/:id", async (req, res) => {
  return handleDecision(req, res, "rejected");
});
var documentsVerifyReject_default = router8;

// backend/routes/rolesId.ts
import { Router as Router9 } from "express";

// lib/services/roles/deleteRole.ts
async function deleteRole(id) {
  return prisma.roles.delete({
    where: {
      id
    }
  });
}

// lib/services/roles/updateRole.ts
async function updateRole(id, data) {
  return prisma.roles.update({
    where: {
      id
    },
    data
  });
}

// backend/routes/rolesId.ts
var router9 = Router9();
router9.get("/api/roles/:id", async (req, res) => {
  try {
    const user = await requireJWT(req);
    if (!user.role || typeof user.role !== "string") {
      return res.status(400).json({ message: "User role is required" });
    }
    requireRole({ ...user, role: user.role }, ["admin"]);
    const role = await getRoleById(req.params.id);
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }
    return res.json(role);
  } catch (error) {
    if (error instanceof Error && [
      "TOKEN_NOT_FOUND",
      "TOKEN_OUT_OF_SYNC",
      "SESSION_MISMATCH",
      "INVALID_TOKEN"
    ].includes(error.message)) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    console.error("GET Role Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
router9.put("/api/roles/:id", async (req, res) => {
  try {
    const user = await requireJWT(req);
    if (!user.role || typeof user.role !== "string") {
      return res.status(400).json({ message: "User role is required" });
    }
    requireRole({ ...user, role: user.role }, ["admin"]);
    const role = await updateRole(req.params.id, req.body);
    await createActivity({
      userId: user.userId === null || user.userId === void 0 ? null : String(user.userId),
      action: "update_role",
      description: { roleId: req.params.id, message: "updated" }
    });
    return res.json(role);
  } catch (error) {
    if (error?.code === "P2025") {
      return res.status(404).json({ message: "Role not found" });
    }
    if (error instanceof Error && [
      "TOKEN_NOT_FOUND",
      "TOKEN_OUT_OF_SYNC",
      "SESSION_MISMATCH",
      "INVALID_TOKEN"
    ].includes(error.message)) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
});
router9.delete("/api/roles/:id", async (req, res) => {
  try {
    const user = await requireJWT(req);
    if (!user.role || typeof user.role !== "string") {
      return res.status(400).json({ message: "User role is required" });
    }
    requireRole({ ...user, role: user.role }, ["admin"]);
    await prisma.$transaction(async (tx) => {
      await tx.users.updateMany({
        where: { role_id: req.params.id },
        data: { role_id: null }
      });
      await deleteRole(req.params.id);
    });
    await createActivity({
      userId: user.userId === null || user.userId === void 0 ? null : String(user.userId),
      action: "delete_role",
      description: { roleId: req.params.id, message: "deleted" }
    });
    return res.json({ message: "Role deleted successfully" });
  } catch (error) {
    if (error?.code === "P2025") {
      return res.status(404).json({ message: "Role not found" });
    }
    if (error instanceof Error && [
      "TOKEN_NOT_FOUND",
      "TOKEN_OUT_OF_SYNC",
      "SESSION_MISMATCH",
      "INVALID_TOKEN"
    ].includes(error.message)) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    console.error("DELETE role error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
var rolesId_default = router9;

// backend/server.ts
var port = Number.parseInt(process.env.BACKEND_PORT ?? "4000", 10);
var upstream = (process.env.BACKEND_UPSTREAM_URL ?? "http://localhost:3000").replace(/\/$/, "");
var corsOrigin = process.env.CORS_ORIGIN ?? upstream;
var proxyEnabled = process.env.BACKEND_PROXY_TO_UPSTREAM === "true";
var app = express();
var uploadsDir = path4.join(process.cwd(), "public", "uploads");
app.set("trust proxy", true);
app.use(morgan("dev"));
app.use("/uploads", express.static(uploadsDir));
app.use(
  cors({
    origin: corsOrigin === "*" ? true : corsOrigin,
    credentials: true
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(auth_default);
app.use(users_default);
app.use(roles_default);
app.use(employees_default);
app.use(activity_default);
app.use(documents_default);
app.use(documentsUpload_default);
app.use(documentsVerifyReject_default);
app.use(rolesId_default);
app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "backend",
    framework: "express",
    upstream,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});
app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "backend-api",
    framework: "express",
    upstream,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});
if (proxyEnabled) {
  const proxyToFrontend = createProxyMiddleware({
    target: upstream,
    changeOrigin: true,
    ws: true
  });
  app.use((req, res, next) => {
    if (req.path === "/health" || req.path === "/api/health") {
      return next();
    }
    return proxyToFrontend(req, res, next);
  });
}
app.use((_req, res) => {
  res.status(404).json({ message: "Not Found" });
});
app.listen(port, () => {
  console.log(`Express backend listening on http://localhost:${port}`);
  if (proxyEnabled) {
    console.log(`Proxying unknown routes to ${upstream}`);
  } else {
    console.log(`Frontend proxy is disabled`);
  }
});
//# sourceMappingURL=server.mjs.map