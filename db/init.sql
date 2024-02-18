
CREATE TABLE IF NOT EXISTS users (
  id           varchar(255)    NOT NULL,
  name         varchar(255)    NOT NULL,
  password     varchar(255)    NOT NULL,
  email        varchar(255)    NOT NULL,
  active       tinyint(1)      NOT NULL,
  roles        longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(roles)),
  createdAt    int(11)         NOT NULL,
  updatedAt    int(11),
  PRIMARY KEY (id)
);

INSERT INTO users (id, name, password, email, active, roles, createdAt, updatedAt) VALUES
  ('1','admin','$2a$10$lZzKUHY5zCIbCcfKmv2RaOH412mNfemffeQUBKpGqsWOrsZZGsJmO','admin@admin.com',1,'["superAdmin", "admin", "creator"]',1707508500,1707511589);

CREATE TABLE IF NOT EXISTS items  (
  id                varchar(255)      NOT NULL,
  name              varchar(255)      NOT NULL,
  visibility        varchar(255)      NOT NULL,
  imageId           varchar(255),
  source            varchar(255),
  shortDescription  TEXT,
  mainDescription   TEXT,
  price             varchar(255),
  rarity            varchar(255),
  weight            INT,
  features          longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(features)),
  createdBy         varchar(255)      NOT NULL,
  createdAt         int(11)           NOT NULL,
  updatedAt         int(11),
  PRIMARY KEY (id),
  KEY visibility (visibility),
  KEY updated (updatedAt)
);

INSERT INTO items (id, name, visibility, imageId, source, shortDescription, mainDescription, price, rarity, weight, features, createdBy, createdAt, updatedAt) VALUES
  ('defaultItem','Bag of Holding','public','defaultItemImage','Homebrew','Wondrous item, uncommon','The Bag of Holding is a wondrous item, uncommon in rarity. It appears to be a simple cloth sack about 2 feet by 4 feet in size but opens into a non-dimensional space: its inside is larger than its outside dimensions, unlike a normal bag.','2500gp','uncommon','15','[{"featureName":"Dimensions","featureDescription":"This bag has an interior space considerably larger than its outside dimensions, roughly 2 feet in diameter at the mouth and 4 feet deep. The bag can hold up to 500 pounds, not exceeding a volume of 64 cubic feet. The bag weighs 15 pounds, regardless of its contents."},{"featureName":"Usage","featureDescription":"Retrieving an item from the bag requires an action. If the bag is overloaded, pierced, or torn, it ruptures and is destroyed, and its contents are scattered in the Astral Plane. If the bag is turned inside out, its contents spill forth, unharmed, but the bag must be put right before it can be used again. Breathing creatures inside the bag can survive up to a number of minutes equal to 10 divided by the number of creatures (minimum 1 minute), after which time they begin to suffocate."},{"featureName":"Divide by zero","featureDescription":"Placing a bag of holding inside an extradimensional space created by a handy haversack, portable hole, or similar item instantly destroys both items and opens a gate to the Astral Plane. The gate originates where the one item was placed inside the other. Any creature within 10 feet of the gate is sucked through it to a random location on the Astral Plane. The gate then closes. The gate is one-way only and can''t be reopened."}]','1',1707508500,1707511589);


CREATE TABLE IF NOT EXISTS images  (
  id            varchar(255)    NOT NULL,
  fileName      varchar(255)    NOT NULL,
  mimeType      varchar(255)    NOT NULL,
  size          INT             NOT NULL,
  visibility    varchar(255)    NOT NULL,
  source        varchar(255),
  description   TEXT,
  ownerId       varchar(255),
  ownerType     varchar(255),
  createdBy     varchar(255)      NOT NULL,
  createdAt     int(11)         NOT NULL,
  updatedAt     int(11),
  PRIMARY KEY (id),
  KEY visibility (visibility),
  KEY updated (updatedAt)
);


INSERT INTO images (id, fileName, mimeType, size, visibility, source, description, ownerId, ownerType, createdBy, createdAt, updatedAt) VALUES
  ('defaultItemImage','bagofholding.png','image/png',1537565,'public','Homebrew','\N','defaultItem','item','1',1707499636,1707506272);

