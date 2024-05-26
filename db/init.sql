CREATE TABLE IF NOT EXISTS users (
  id           VARCHAR(255)    NOT NULL,
  name         VARCHAR(255)    NOT NULL,
  password     VARCHAR(255)    NOT NULL,
  email        VARCHAR(255)    NOT NULL,
  active       tinyint(1)      NOT NULL,
  roles        longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(roles)),
  createdAt    INT(11)         NOT NULL,
  updatedAt    INT(11),
  PRIMARY KEY (id)
);

INSERT INTO users (id, name, password, email, active, roles, createdAt, updatedAt) VALUES
  ('0','system','$2a$10$lZzKUHY5zCIbCcfKmv2RaOH412mNfemffeQUBKpGqsWOrsZZGsJmO','admin@admin.com',1,'["superAdmin"]',1707508500,1707511589),
  ('1','dmtool','$2a$10$lZzKUHY5zCIbCcfKmv2RaOH412mNfemffeQUBKpGqsWOrsZZGsJmO','admin@admin.com',1,'["superAdmin", "admin", "creator"]',1707508500,1707511589);


CREATE TABLE IF NOT EXISTS items  (
  id                    VARCHAR(255)      NOT NULL,
  name                  VARCHAR(255)      NOT NULL,
  visibility            VARCHAR(255)      NOT NULL,
  imageId               VARCHAR(255),
  source                VARCHAR(255),
  shortDescription      TEXT,
  mainDescription       TEXT,
  price                 longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT '{"quantity":0,"unit":"gp"}' CHECK (json_valid(price)),
  rarity                VARCHAR(255),
  weight                INT(11),
  features              longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT '[]' CHECK (json_valid(features)),
  categories            longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT '[]' CHECK (json_valid(categories)),
  armorClass            longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(armorClass)),
  strengthMinimum       VARCHAR(255),
  stealthDisadvantage   tinyint(1),
  attunement            longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT '{"required": false, "qualifier": ""}' CHECK (json_valid(categories)),
  damage                longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(damage)),
  twoHandedDamage       longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(twoHandedDamage)),
  throwRange            longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(throwRange)),
  useRange              longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(useRange)),
  properties            longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT '[]' CHECK (json_valid(properties)),
  createdBy             VARCHAR(255)      NOT NULL,
  createdAt             INT(11)           NOT NULL,
  updatedAt             INT(11),
  PRIMARY KEY (id, source),
  KEY visibility (visibility),
  KEY updated (updatedAt)
);

INSERT INTO items (
  id,
  name,
  visibility,
  imageId,
  source,
  shortDescription,
  mainDescription,
  price,
  rarity,
  weight,
  features,
  categories,
  armorClass,
  strengthMinimum,
  stealthDisadvantage,
  damage,
  twoHandedDamage,
  throwRange,
  useRange,
  properties,
  createdBy,
  createdAt,
  updatedAt) VALUES
  (
    'defaultItem',
    'Bag of Holding',
    'public',
    'defaultItemImage',
    'System',
    'Wondrous item',
    'The Bag of Holding is a wondrous item, uncommon in rarity. It appears to be a simple cloth sack about 2 feet by 4 feet in size but opens into a non-dimensional space: its inside is larger than its outside dimensions, unlike a normal bag.',
    '{"quantity":2500,"unit":"gp"}',
    'uncommon',
    15,
    '[{"featureName":"Dimensions","featureDescription":"This bag has an interior space considerably larger than its outside dimensions, roughly 2 feet in diameter at the mouth and 4 feet deep. The bag can hold up to 500 pounds, not exceeding a volume of 64 cubic feet. The bag weighs 15 pounds, regardless of its contents."},{"featureName":"Usage","featureDescription":"Retrieving an item from the bag requires an action. If the bag is overloaded, pierced, or torn, it ruptures and is destroyed, and its contents are scattered in the Astral Plane. If the bag is turned inside out, its contents spill forth, unharmed, but the bag must be put right before it can be used again. Breathing creatures inside the bag can survive up to a number of minutes equal to 10 divided by the number of creatures (minimum 1 minute), after which time they begin to suffocate."},{"featureName":"Divide by zero","featureDescription":"Placing a bag of holding inside an extradimensional space created by a handy haversack, portable hole, or similar item instantly destroys both items and opens a gate to the Astral Plane. The gate originates where the one item was placed inside the other. Any creature within 10 feet of the gate is sucked through it to a random location on the Astral Plane. The gate then closes. The gate is one-way only and can''t be reopened."}]',
    '["wondrous-item"]',
    '',
    0,
    false,
    null,
    null,
    null,
    null,
    '[]',
    '0',
    1707508500,
    1707511589
    );


CREATE TABLE IF NOT EXISTS images  (
  id            VARCHAR(255)    NOT NULL,
  fileName      VARCHAR(255)    NOT NULL,
  mimeType      VARCHAR(255)    NOT NULL,
  size          INT             NOT NULL,
  visibility    VARCHAR(255)    NOT NULL,
  source        VARCHAR(255),
  description   TEXT,
  ownerId       VARCHAR(255),
  ownerType     VARCHAR(255),
  createdBy     VARCHAR(255)      NOT NULL,
  createdAt     INT(11)         NOT NULL,
  updatedAt     INT(11),
  PRIMARY KEY (id),
  KEY visibility (visibility),
  KEY updated (updatedAt)
);

INSERT INTO images (id, fileName, mimeType, size, visibility, source, description, ownerId, ownerType, createdBy, createdAt, updatedAt) VALUES
  ('defaultItemImage','bagofholding.png','image/png',1537565,'public','Homebrew','\N','defaultItem','item','0',1707499636,1707506272);


CREATE TABLE IF NOT EXISTS itemViews (
    itemId VARCHAR(255),
    source VARCHAR(255),
    viewCount BIGINT DEFAULT 0,
    PRIMARY KEY (itemId, source),
    FOREIGN KEY (itemId, source) REFERENCES items(id, source)
);


CREATE TABLE IF NOT EXISTS featured (
    entityType VARCHAR(50),
    entityId VARCHAR(255),
    startDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    endDate DATETIME,
    isActive BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (EntityType, entityId)
);

INSERT INTO featured (entityType, entityId, startDate, endDate, isActive) VALUES
('Item', 'defaultItem', NOW(), DATE_ADD(NOW(), INTERVAL 1 WEEK), TRUE);