/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { Controller, ValidationService, FieldErrors, ValidateError, TsoaRoute, HttpStatusCodeLiteral, TsoaResponse, fetchMiddlewares } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { UserController } from './controllers/UserController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ProfileController } from './controllers/ProfileController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { PingController } from './controllers/PingController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { PingController1 } from './controllers/PingController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { PingController2 } from './controllers/PingController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { PingController3 } from './controllers/PingController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { PageStatsController } from './controllers/PageStatsController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { MonsterController } from './controllers/MonsterController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ItemController } from './controllers/ItemController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ImageController } from './controllers/ImageController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AuthController } from './controllers/AuthController';
import { expressAuthentication } from './security/AuthenticationProvider';
// @ts-ignore - no great way to install types from subpackage
import type { RequestHandler, Router } from 'express';

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "UserRole": {
        "dataType": "refEnum",
        "enums": ["superAdmin","admin","creator","editor","viewer","player","dm","moderator"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UserResponse": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "email": {"dataType":"string","required":true},
            "roles": {"dataType":"array","array":{"dataType":"refEnum","ref":"UserRole"},"required":true},
            "createdAt": {"dataType":"double","required":true},
            "updatedAt": {"dataType":"double"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UserInsertRequest": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "email": {"dataType":"string","required":true},
            "password": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Partial__name-string--email-string--oldPassword-string--newPassword-string__": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"name":{"dataType":"string"},"email":{"dataType":"string"},"oldPassword":{"dataType":"string"},"newPassword":{"dataType":"string"}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UserUpdateRequest": {
        "dataType": "refAlias",
        "type": {"ref":"Partial__name-string--email-string--oldPassword-string--newPassword-string__","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ProfileResponse": {
        "dataType": "refObject",
        "properties": {
            "itemsCreated": {"dataType":"double","required":true},
            "spellsCreated": {"dataType":"double","required":true},
            "weaponsCreated": {"dataType":"double","required":true},
            "monstersCreated": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PageStatsResponse": {
        "dataType": "refObject",
        "properties": {
            "itemsCreated": {"dataType":"double","required":true},
            "spellsCreated": {"dataType":"double","required":true},
            "weaponsCreated": {"dataType":"double","required":true},
            "monstersCreated": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ItemPrice": {
        "dataType": "refObject",
        "properties": {
            "quantity": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},
            "unit": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ItemCategory": {
        "dataType": "refEnum",
        "enums": ["adventuring-gear","ammunition","arcane-foci","armor","artisans-tool","druidic-foci","equipment-pack","gaming-set","heavy-armor","holy-symbol","kit","land-vehicle","light-armor","martial-melee-weapon","martial-ranged-weapon","martial-weapon","magic-item","medium-armor","melee-weapon","mount-or-other-animal","mount-or-vehicle","musical-instrument","other-tool","potion","ranged-weapon","ring","rod","scroll","shield","simple-melee-weapon","simple-ranged-weapon","simple-weapon","staff","standard-gear","tack-harness-or-drawn-vehicle","tool","vehicle","wand","waterborne-vehicle","weapon","wondrous-item"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ItemRange": {
        "dataType": "refObject",
        "properties": {
            "normal": {"dataType":"string","required":true},
            "long": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Visibility": {
        "dataType": "refEnum",
        "enums": ["public","logged_in","private"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "BaseItem": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "visibility": {"ref":"Visibility","required":true},
            "source": {"dataType":"enum","enums":["5th_e_SRD","Homebrew","My_Items","System"],"required":true},
            "createdBy": {"dataType":"string","required":true},
            "createdAt": {"dataType":"double","required":true},
            "updatedAt": {"dataType":"double"},
            "imageId": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "name": {"dataType":"string","required":true},
            "shortDescription": {"dataType":"string","required":true},
            "mainDescription": {"dataType":"string","required":true},
            "price": {"ref":"ItemPrice","required":true},
            "rarity": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "weight": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},
            "features": {"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"featureDescription":{"dataType":"string","required":true},"featureName":{"dataType":"string","required":true}}},"required":true},
            "categories": {"dataType":"array","array":{"dataType":"refEnum","ref":"ItemCategory"},"required":true},
            "attunement": {"dataType":"nestedObjectLiteral","nestedProperties":{"qualifier":{"dataType":"string"},"required":{"dataType":"boolean","required":true}},"required":true},
            "throwRange": {"dataType":"union","subSchemas":[{"ref":"ItemRange"},{"dataType":"enum","enums":[null]}]},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "BaseItemResponse": {
        "dataType": "refAlias",
        "type": {"dataType":"intersection","subSchemas":[{"ref":"BaseItem"},{"dataType":"nestedObjectLiteral","nestedProperties":{"url":{"dataType":"string"},"createdByUserName":{"dataType":"string","required":true}}}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ArmorItem": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "visibility": {"ref":"Visibility","required":true},
            "source": {"dataType":"enum","enums":["5th_e_SRD","Homebrew","My_Items","System"],"required":true},
            "createdBy": {"dataType":"string","required":true},
            "createdAt": {"dataType":"double","required":true},
            "updatedAt": {"dataType":"double"},
            "imageId": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "name": {"dataType":"string","required":true},
            "shortDescription": {"dataType":"string","required":true},
            "mainDescription": {"dataType":"string","required":true},
            "price": {"ref":"ItemPrice","required":true},
            "rarity": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "weight": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},
            "features": {"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"featureDescription":{"dataType":"string","required":true},"featureName":{"dataType":"string","required":true}}},"required":true},
            "categories": {"dataType":"array","array":{"dataType":"refEnum","ref":"ItemCategory"},"required":true},
            "attunement": {"dataType":"nestedObjectLiteral","nestedProperties":{"qualifier":{"dataType":"string"},"required":{"dataType":"boolean","required":true}},"required":true},
            "throwRange": {"dataType":"union","subSchemas":[{"ref":"ItemRange"},{"dataType":"enum","enums":[null]}]},
            "armorClass": {"dataType":"nestedObjectLiteral","nestedProperties":{"maximumBonus":{"dataType":"string"},"dexterityBonus":{"dataType":"boolean","required":true},"base":{"dataType":"string","required":true}},"required":true},
            "strengthMinimum": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "stealthDisadvantage": {"dataType":"boolean","required":true},
            "properties": {"dataType":"array","array":{"dataType":"string"},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ArmorItemResponse": {
        "dataType": "refAlias",
        "type": {"dataType":"intersection","subSchemas":[{"ref":"BaseItemResponse"},{"ref":"ArmorItem"}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "WeaponDamage": {
        "dataType": "refObject",
        "properties": {
            "damageDice": {"dataType":"string","required":true},
            "damageType": {"dataType":"string","required":true},
            "qualifier": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "WeaponItem": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "visibility": {"ref":"Visibility","required":true},
            "source": {"dataType":"enum","enums":["5th_e_SRD","Homebrew","My_Items","System"],"required":true},
            "createdBy": {"dataType":"string","required":true},
            "createdAt": {"dataType":"double","required":true},
            "updatedAt": {"dataType":"double"},
            "imageId": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "name": {"dataType":"string","required":true},
            "shortDescription": {"dataType":"string","required":true},
            "mainDescription": {"dataType":"string","required":true},
            "price": {"ref":"ItemPrice","required":true},
            "rarity": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "weight": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},
            "features": {"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"featureDescription":{"dataType":"string","required":true},"featureName":{"dataType":"string","required":true}}},"required":true},
            "categories": {"dataType":"array","array":{"dataType":"refEnum","ref":"ItemCategory"},"required":true},
            "attunement": {"dataType":"nestedObjectLiteral","nestedProperties":{"qualifier":{"dataType":"string"},"required":{"dataType":"boolean","required":true}},"required":true},
            "throwRange": {"dataType":"union","subSchemas":[{"ref":"ItemRange"},{"dataType":"enum","enums":[null]}]},
            "damage": {"ref":"WeaponDamage","required":true},
            "twoHandedDamage": {"dataType":"union","subSchemas":[{"ref":"WeaponDamage"},{"dataType":"enum","enums":[null]}],"required":true},
            "useRange": {"dataType":"union","subSchemas":[{"ref":"ItemRange"},{"dataType":"enum","enums":[null]}],"required":true},
            "properties": {"dataType":"array","array":{"dataType":"string"},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "WeaponItemResponse": {
        "dataType": "refAlias",
        "type": {"dataType":"intersection","subSchemas":[{"ref":"BaseItemResponse"},{"ref":"WeaponItem"}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ItemResponse": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"ref":"BaseItemResponse"},{"ref":"ArmorItemResponse"},{"ref":"WeaponItemResponse"}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ItemSearchResponse": {
        "dataType": "refObject",
        "properties": {
            "items": {"dataType":"array","array":{"dataType":"refAlias","ref":"ItemResponse"},"required":true},
            "totalCount": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_ItemSearchRequest.Exclude_keyofItemSearchRequest.order-or-orderBy__": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"itemsPerPage":{"dataType":"double"},"pageNumber":{"dataType":"double"},"onlyMyItems":{"dataType":"boolean"},"search":{"dataType":"string"},"source":{"dataType":"array","array":{"dataType":"union","subSchemas":[{"dataType":"enum","enums":["5th_e_SRD"]},{"dataType":"enum","enums":["Homebrew"]},{"dataType":"enum","enums":["My_Items"]},{"dataType":"enum","enums":["System"]}]}},"visibility":{"dataType":"array","array":{"dataType":"union","subSchemas":[{"dataType":"enum","enums":["public"]},{"dataType":"enum","enums":["logged_in"]},{"dataType":"enum","enums":["private"]}]}},"rarity":{"dataType":"array","array":{"dataType":"union","subSchemas":[{"dataType":"enum","enums":["uncommon"]},{"dataType":"enum","enums":["common"]},{"dataType":"enum","enums":["very_rare"]},{"dataType":"enum","enums":["rare"]},{"dataType":"enum","enums":["legendary"]},{"dataType":"enum","enums":["artifact"]},{"dataType":"enum","enums":["varies"]}]}},"category":{"dataType":"array","array":{"dataType":"union","subSchemas":[{"dataType":"enum","enums":["adventuring-gear"]},{"dataType":"enum","enums":["ammunition"]},{"dataType":"enum","enums":["arcane-foci"]},{"dataType":"enum","enums":["armor"]},{"dataType":"enum","enums":["artisans-tool"]},{"dataType":"enum","enums":["druidic-foci"]},{"dataType":"enum","enums":["equipment-pack"]},{"dataType":"enum","enums":["gaming-set"]},{"dataType":"enum","enums":["heavy-armor"]},{"dataType":"enum","enums":["holy-symbol"]},{"dataType":"enum","enums":["kit"]},{"dataType":"enum","enums":["land-vehicle"]},{"dataType":"enum","enums":["light-armor"]},{"dataType":"enum","enums":["martial-melee-weapon"]},{"dataType":"enum","enums":["martial-ranged-weapon"]},{"dataType":"enum","enums":["martial-weapon"]},{"dataType":"enum","enums":["magic-item"]},{"dataType":"enum","enums":["medium-armor"]},{"dataType":"enum","enums":["melee-weapon"]},{"dataType":"enum","enums":["mount-or-other-animal"]},{"dataType":"enum","enums":["mount-or-vehicle"]},{"dataType":"enum","enums":["musical-instrument"]},{"dataType":"enum","enums":["other-tool"]},{"dataType":"enum","enums":["potion"]},{"dataType":"enum","enums":["ranged-weapon"]},{"dataType":"enum","enums":["ring"]},{"dataType":"enum","enums":["rod"]},{"dataType":"enum","enums":["scroll"]},{"dataType":"enum","enums":["shield"]},{"dataType":"enum","enums":["simple-melee-weapon"]},{"dataType":"enum","enums":["simple-ranged-weapon"]},{"dataType":"enum","enums":["simple-weapon"]},{"dataType":"enum","enums":["staff"]},{"dataType":"enum","enums":["standard-gear"]},{"dataType":"enum","enums":["tack-harness-or-drawn-vehicle"]},{"dataType":"enum","enums":["tool"]},{"dataType":"enum","enums":["vehicle"]},{"dataType":"enum","enums":["wand"]},{"dataType":"enum","enums":["waterborne-vehicle"]},{"dataType":"enum","enums":["weapon"]},{"dataType":"enum","enums":["wondrous-item"]}]}},"property":{"dataType":"array","array":{"dataType":"union","subSchemas":[{"dataType":"enum","enums":["ammunition"]},{"dataType":"enum","enums":["finesse"]},{"dataType":"enum","enums":["heavy"]},{"dataType":"enum","enums":["light"]},{"dataType":"enum","enums":["loading"]},{"dataType":"enum","enums":["monk"]},{"dataType":"enum","enums":["reach"]},{"dataType":"enum","enums":["special"]},{"dataType":"enum","enums":["thrown"]},{"dataType":"enum","enums":["two-handed"]},{"dataType":"enum","enums":["versatile"]}]}},"priceComparison":{"dataType":"union","subSchemas":[{"dataType":"enum","enums":["max"]},{"dataType":"enum","enums":["exactly"]},{"dataType":"enum","enums":["min"]}]},"priceQuantity":{"dataType":"string"},"priceUnit":{"dataType":"string"},"weightComparison":{"dataType":"union","subSchemas":[{"dataType":"enum","enums":["max"]},{"dataType":"enum","enums":["exactly"]},{"dataType":"enum","enums":["min"]}]},"weight":{"dataType":"string"},"requiresAttunement":{"dataType":"boolean"},"hasImage":{"dataType":"boolean"}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SearchQueryParams": {
        "dataType": "refObject",
        "properties": {
            "itemsPerPage": {"dataType":"double"},
            "pageNumber": {"dataType":"double"},
            "onlyMyItems": {"dataType":"boolean"},
            "search": {"dataType":"string"},
            "source": {"dataType":"array","array":{"dataType":"union","subSchemas":[{"dataType":"enum","enums":["5th_e_SRD"]},{"dataType":"enum","enums":["Homebrew"]},{"dataType":"enum","enums":["My_Items"]},{"dataType":"enum","enums":["System"]}]}},
            "visibility": {"dataType":"array","array":{"dataType":"union","subSchemas":[{"dataType":"enum","enums":["public"]},{"dataType":"enum","enums":["logged_in"]},{"dataType":"enum","enums":["private"]}]}},
            "rarity": {"dataType":"array","array":{"dataType":"union","subSchemas":[{"dataType":"enum","enums":["uncommon"]},{"dataType":"enum","enums":["common"]},{"dataType":"enum","enums":["very_rare"]},{"dataType":"enum","enums":["rare"]},{"dataType":"enum","enums":["legendary"]},{"dataType":"enum","enums":["artifact"]},{"dataType":"enum","enums":["varies"]}]}},
            "category": {"dataType":"array","array":{"dataType":"union","subSchemas":[{"dataType":"enum","enums":["adventuring-gear"]},{"dataType":"enum","enums":["ammunition"]},{"dataType":"enum","enums":["arcane-foci"]},{"dataType":"enum","enums":["armor"]},{"dataType":"enum","enums":["artisans-tool"]},{"dataType":"enum","enums":["druidic-foci"]},{"dataType":"enum","enums":["equipment-pack"]},{"dataType":"enum","enums":["gaming-set"]},{"dataType":"enum","enums":["heavy-armor"]},{"dataType":"enum","enums":["holy-symbol"]},{"dataType":"enum","enums":["kit"]},{"dataType":"enum","enums":["land-vehicle"]},{"dataType":"enum","enums":["light-armor"]},{"dataType":"enum","enums":["martial-melee-weapon"]},{"dataType":"enum","enums":["martial-ranged-weapon"]},{"dataType":"enum","enums":["martial-weapon"]},{"dataType":"enum","enums":["magic-item"]},{"dataType":"enum","enums":["medium-armor"]},{"dataType":"enum","enums":["melee-weapon"]},{"dataType":"enum","enums":["mount-or-other-animal"]},{"dataType":"enum","enums":["mount-or-vehicle"]},{"dataType":"enum","enums":["musical-instrument"]},{"dataType":"enum","enums":["other-tool"]},{"dataType":"enum","enums":["potion"]},{"dataType":"enum","enums":["ranged-weapon"]},{"dataType":"enum","enums":["ring"]},{"dataType":"enum","enums":["rod"]},{"dataType":"enum","enums":["scroll"]},{"dataType":"enum","enums":["shield"]},{"dataType":"enum","enums":["simple-melee-weapon"]},{"dataType":"enum","enums":["simple-ranged-weapon"]},{"dataType":"enum","enums":["simple-weapon"]},{"dataType":"enum","enums":["staff"]},{"dataType":"enum","enums":["standard-gear"]},{"dataType":"enum","enums":["tack-harness-or-drawn-vehicle"]},{"dataType":"enum","enums":["tool"]},{"dataType":"enum","enums":["vehicle"]},{"dataType":"enum","enums":["wand"]},{"dataType":"enum","enums":["waterborne-vehicle"]},{"dataType":"enum","enums":["weapon"]},{"dataType":"enum","enums":["wondrous-item"]}]}},
            "property": {"dataType":"array","array":{"dataType":"union","subSchemas":[{"dataType":"enum","enums":["ammunition"]},{"dataType":"enum","enums":["finesse"]},{"dataType":"enum","enums":["heavy"]},{"dataType":"enum","enums":["light"]},{"dataType":"enum","enums":["loading"]},{"dataType":"enum","enums":["monk"]},{"dataType":"enum","enums":["reach"]},{"dataType":"enum","enums":["special"]},{"dataType":"enum","enums":["thrown"]},{"dataType":"enum","enums":["two-handed"]},{"dataType":"enum","enums":["versatile"]}]}},
            "priceComparison": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["max"]},{"dataType":"enum","enums":["exactly"]},{"dataType":"enum","enums":["min"]}]},
            "priceQuantity": {"dataType":"string"},
            "priceUnit": {"dataType":"string"},
            "weightComparison": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["max"]},{"dataType":"enum","enums":["exactly"]},{"dataType":"enum","enums":["min"]}]},
            "weight": {"dataType":"string"},
            "requiresAttunement": {"dataType":"boolean"},
            "hasImage": {"dataType":"boolean"},
            "order": {"dataType":"enum","enums":["asc","desc"]},
            "orderBy": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ImageMetadata": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "visibility": {"ref":"Visibility","required":true},
            "source": {"dataType":"enum","enums":["5th_e_SRD","Homebrew","My_Items","System"],"required":true},
            "createdBy": {"dataType":"string","required":true},
            "createdAt": {"dataType":"double","required":true},
            "updatedAt": {"dataType":"double"},
            "fileName": {"dataType":"string","required":true},
            "mimeType": {"dataType":"string","required":true},
            "size": {"dataType":"double","required":true},
            "description": {"dataType":"string"},
            "ownerId": {"dataType":"string"},
            "ownerType": {"dataType":"enum","enums":["weapon","item","monster"]},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Image": {
        "dataType": "refObject",
        "properties": {
            "metadata": {"ref":"ImageMetadata","required":true},
            "base64": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ItemUpdateResponse": {
        "dataType": "refObject",
        "properties": {
            "item": {"ref":"ItemResponse","required":true},
            "image": {"dataType":"union","subSchemas":[{"ref":"Image"},{"dataType":"enum","enums":[null]}]},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ItemUpdateRequest": {
        "dataType": "refObject",
        "properties": {
            "item": {"dataType":"intersection","subSchemas":[{"ref":"BaseItem"},{"ref":"ArmorItem"},{"ref":"WeaponItem"}],"required":true},
            "image": {"dataType":"union","subSchemas":[{"ref":"Image"},{"dataType":"enum","enums":[null]}]},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ILoginRequest": {
        "dataType": "refObject",
        "properties": {
            "username": {"dataType":"string","required":true},
            "password": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const validationService = new ValidationService(models);

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

export function RegisterRoutes(app: Router) {
    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################
        app.get('/api/v1/user',
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.getAll)),

            function UserController_getAll(request: any, response: any, next: any) {
            const args = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new UserController();


              const promise = controller.getAll.apply(controller, validatedArgs as any);
              // CHANGED
              promiseHandler(controller, promise, undefined, request, response, next);
              // END OF CHANGED
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1/user/:id',
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.get)),

            function UserController_get(request: any, response: any, next: any) {
            const args = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    id: {"in":"path","name":"id","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new UserController();


              const promise = controller.get.apply(controller, validatedArgs as any);
              // CHANGED
              promiseHandler(controller, promise, 200, request, response, next);
              // END OF CHANGED
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/v1/user',
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.insert)),

            function UserController_insert(request: any, response: any, next: any) {
            const args = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    requestBody: {"in":"body","name":"requestBody","required":true,"ref":"UserInsertRequest"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new UserController();


              const promise = controller.insert.apply(controller, validatedArgs as any);
              // CHANGED
              promiseHandler(controller, promise, 200, request, response, next);
              // END OF CHANGED
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.put('/api/v1/user',
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.put)),

            function UserController_put(request: any, response: any, next: any) {
            const args = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    requestBody: {"in":"body","name":"requestBody","required":true,"ref":"UserUpdateRequest"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new UserController();


              const promise = controller.put.apply(controller, validatedArgs as any);
              // CHANGED
              promiseHandler(controller, promise, 200, request, response, next);
              // END OF CHANGED
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.delete('/api/v1/user/:id',
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.delete)),

            function UserController_delete(request: any, response: any, next: any) {
            const args = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    id: {"in":"path","name":"id","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new UserController();


              const promise = controller.delete.apply(controller, validatedArgs as any);
              // CHANGED
              promiseHandler(controller, promise, 200, request, response, next);
              // END OF CHANGED
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1/profile',
            ...(fetchMiddlewares<RequestHandler>(ProfileController)),
            ...(fetchMiddlewares<RequestHandler>(ProfileController.prototype.getAll)),

            function ProfileController_getAll(request: any, response: any, next: any) {
            const args = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new ProfileController();


              const promise = controller.getAll.apply(controller, validatedArgs as any);
              // CHANGED
              promiseHandler(controller, promise, undefined, request, response, next);
              // END OF CHANGED
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1',
            ...(fetchMiddlewares<RequestHandler>(PingController)),
            ...(fetchMiddlewares<RequestHandler>(PingController.prototype.ping)),

            function PingController_ping(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new PingController();


              const promise = controller.ping.apply(controller, validatedArgs as any);
              // CHANGED
              promiseHandler(controller, promise, undefined, request, response, next);
              // END OF CHANGED
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1/ping',
            ...(fetchMiddlewares<RequestHandler>(PingController1)),
            ...(fetchMiddlewares<RequestHandler>(PingController1.prototype.ping)),

            function PingController1_ping(request: any, response: any, next: any) {
            const args = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new PingController1();


              const promise = controller.ping.apply(controller, validatedArgs as any);
              // CHANGED
              promiseHandler(controller, promise, undefined, request, response, next);
              // END OF CHANGED
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1/secureping',
            ...(fetchMiddlewares<RequestHandler>(PingController2)),
            ...(fetchMiddlewares<RequestHandler>(PingController2.prototype.ping)),

            function PingController2_ping(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new PingController2();


              const promise = controller.ping.apply(controller, validatedArgs as any);
              // CHANGED
              promiseHandler(controller, promise, undefined, request, response, next);
              // END OF CHANGED
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1/apikeyping',
            authenticateMiddleware([{"api_key":[]}]),
            ...(fetchMiddlewares<RequestHandler>(PingController3)),
            ...(fetchMiddlewares<RequestHandler>(PingController3.prototype.ping)),

            function PingController3_ping(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new PingController3();


              const promise = controller.ping.apply(controller, validatedArgs as any);
              // CHANGED
              promiseHandler(controller, promise, undefined, request, response, next);
              // END OF CHANGED
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1/pagestats',
            ...(fetchMiddlewares<RequestHandler>(PageStatsController)),
            ...(fetchMiddlewares<RequestHandler>(PageStatsController.prototype.get)),

            function PageStatsController_get(request: any, response: any, next: any) {
            const args = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new PageStatsController();


              const promise = controller.get.apply(controller, validatedArgs as any);
              // CHANGED
              promiseHandler(controller, promise, undefined, request, response, next);
              // END OF CHANGED
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1/monsters',
            ...(fetchMiddlewares<RequestHandler>(MonsterController)),
            ...(fetchMiddlewares<RequestHandler>(MonsterController.prototype.search)),

            function MonsterController_search(request: any, response: any, next: any) {
            const args = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new MonsterController();


              const promise = controller.search.apply(controller, validatedArgs as any);
              // CHANGED
              promiseHandler(controller, promise, undefined, request, response, next);
              // END OF CHANGED
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1/monsters/:monsterName',
            ...(fetchMiddlewares<RequestHandler>(MonsterController)),
            ...(fetchMiddlewares<RequestHandler>(MonsterController.prototype.get)),

            function MonsterController_get(request: any, response: any, next: any) {
            const args = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    monsterName: {"in":"path","name":"monsterName","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new MonsterController();


              const promise = controller.get.apply(controller, validatedArgs as any);
              // CHANGED
              promiseHandler(controller, promise, undefined, request, response, next);
              // END OF CHANGED
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1/items',
            ...(fetchMiddlewares<RequestHandler>(ItemController)),
            ...(fetchMiddlewares<RequestHandler>(ItemController.prototype.search)),

            function ItemController_search(request: any, response: any, next: any) {
            const args = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    queryParams: {"in":"queries","name":"queryParams","required":true,"ref":"SearchQueryParams"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new ItemController();


              const promise = controller.search.apply(controller, validatedArgs as any);
              // CHANGED
              promiseHandler(controller, promise, undefined, request, response, next);
              // END OF CHANGED
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1/items/:userId',
            ...(fetchMiddlewares<RequestHandler>(ItemController)),
            ...(fetchMiddlewares<RequestHandler>(ItemController.prototype.getAllForUser)),

            function ItemController_getAllForUser(request: any, response: any, next: any) {
            const args = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    userId: {"in":"path","name":"userId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new ItemController();


              const promise = controller.getAllForUser.apply(controller, validatedArgs as any);
              // CHANGED
              promiseHandler(controller, promise, undefined, request, response, next);
              // END OF CHANGED
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1/item',
            ...(fetchMiddlewares<RequestHandler>(ItemController)),
            ...(fetchMiddlewares<RequestHandler>(ItemController.prototype.get)),

            function ItemController_get(request: any, response: any, next: any) {
            const args = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    id: {"in":"query","name":"id","required":true,"dataType":"string"},
                    source: {"in":"query","name":"source","required":true,"dataType":"enum","enums":["5th_e_SRD","Homebrew","My_Items","System"]},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new ItemController();


              const promise = controller.get.apply(controller, validatedArgs as any);
              // CHANGED
              promiseHandler(controller, promise, undefined, request, response, next);
              // END OF CHANGED
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1/item/:itemId',
            ...(fetchMiddlewares<RequestHandler>(ItemController)),
            ...(fetchMiddlewares<RequestHandler>(ItemController.prototype.getItem)),

            function ItemController_getItem(request: any, response: any, next: any) {
            const args = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    itemId: {"in":"path","name":"itemId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new ItemController();


              const promise = controller.getItem.apply(controller, validatedArgs as any);
              // CHANGED
              promiseHandler(controller, promise, undefined, request, response, next);
              // END OF CHANGED
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.put('/api/v1/item',
            ...(fetchMiddlewares<RequestHandler>(ItemController)),
            ...(fetchMiddlewares<RequestHandler>(ItemController.prototype.update)),

            function ItemController_update(request: any, response: any, next: any) {
            const args = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    requestBody: {"in":"body","name":"requestBody","required":true,"ref":"ItemUpdateRequest"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new ItemController();


              const promise = controller.update.apply(controller, validatedArgs as any);
              // CHANGED
              promiseHandler(controller, promise, 201, request, response, next);
              // END OF CHANGED
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.delete('/api/v1/item/:itemId',
            ...(fetchMiddlewares<RequestHandler>(ItemController)),
            ...(fetchMiddlewares<RequestHandler>(ItemController.prototype.deleteIem)),

            function ItemController_deleteIem(request: any, response: any, next: any) {
            const args = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    itemId: {"in":"path","name":"itemId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new ItemController();


              const promise = controller.deleteIem.apply(controller, validatedArgs as any);
              // CHANGED
              promiseHandler(controller, promise, 200, request, response, next);
              // END OF CHANGED
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1/image/:imageId',
            ...(fetchMiddlewares<RequestHandler>(ImageController)),
            ...(fetchMiddlewares<RequestHandler>(ImageController.prototype.get)),

            function ImageController_get(request: any, response: any, next: any) {
            const args = {
                    imageId: {"in":"path","name":"imageId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new ImageController();


              const promise = controller.get.apply(controller, validatedArgs as any);
              // CHANGED
              promiseHandler(controller, promise, undefined, request, response, next);
              // END OF CHANGED
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/v1/image',
            ...(fetchMiddlewares<RequestHandler>(ImageController)),
            ...(fetchMiddlewares<RequestHandler>(ImageController.prototype.uploadImage)),

            function ImageController_uploadImage(request: any, response: any, next: any) {
            const args = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    requestBody: {"in":"body","name":"requestBody","required":true,"ref":"Image"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new ImageController();


              const promise = controller.uploadImage.apply(controller, validatedArgs as any);
              // CHANGED
              promiseHandler(controller, promise, 201, request, response, next);
              // END OF CHANGED
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.delete('/api/v1/image/:itemId',
            ...(fetchMiddlewares<RequestHandler>(ImageController)),
            ...(fetchMiddlewares<RequestHandler>(ImageController.prototype.delete)),

            function ImageController_delete(request: any, response: any, next: any) {
            const args = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    itemId: {"in":"path","name":"itemId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new ImageController();


              const promise = controller.delete.apply(controller, validatedArgs as any);
              // CHANGED
              promiseHandler(controller, promise, undefined, request, response, next);
              // END OF CHANGED
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/v1/auth/login',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.login)),

            function AuthController_login(request: any, response: any, next: any) {
            const args = {
                    loginParams: {"in":"body","name":"loginParams","required":true,"ref":"ILoginRequest"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new AuthController();


              const promise = controller.login.apply(controller, validatedArgs as any);
              // CHANGED
              promiseHandler(controller, promise, undefined, request, response, next);
              // END OF CHANGED
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/v1/auth/logout',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.logout)),

            function AuthController_logout(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new AuthController();


              const promise = controller.logout.apply(controller, validatedArgs as any);
              // CHANGED
              promiseHandler(controller, promise, undefined, request, response, next);
              // END OF CHANGED
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/v1/auth/refresh',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.refresh)),

            function AuthController_refresh(request: any, response: any, next: any) {
            const args = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new AuthController();


              const promise = controller.refresh.apply(controller, validatedArgs as any);
              // CHANGED
              promiseHandler(controller, promise, undefined, request, response, next);
              // END OF CHANGED
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1/auth/status',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.status)),

            function AuthController_status(request: any, response: any, next: any) {
            const args = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new AuthController();


              const promise = controller.status.apply(controller, validatedArgs as any);
              // CHANGED
              promiseHandler(controller, promise, undefined, request, response, next);
              // END OF CHANGED
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function authenticateMiddleware(security: TsoaRoute.Security[] = []) {
        return async function runAuthenticationMiddleware(request: any, _response: any, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            // keep track of failed auth attempts so we can hand back the most
            // recent one.  This behavior was previously existing so preserving it
            // here
            const failedAttempts: any[] = [];
            const pushAndRethrow = (error: any) => {
                failedAttempts.push(error);
                throw error;
            };

            const secMethodOrPromises: Promise<any>[] = [];
            for (const secMethod of security) {
                if (Object.keys(secMethod).length > 1) {
                    const secMethodAndPromises: Promise<any>[] = [];

                    for (const name in secMethod) {
                        secMethodAndPromises.push(
                            expressAuthentication(request, name, secMethod[name])
                                .catch(pushAndRethrow)
                        );
                    }

                    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

                    secMethodOrPromises.push(Promise.all(secMethodAndPromises)
                        .then(users => { return users[0]; }));
                } else {
                    for (const name in secMethod) {
                        secMethodOrPromises.push(
                            expressAuthentication(request, name, secMethod[name])
                                .catch(pushAndRethrow)
                        );
                    }
                }
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            try {
                request['user'] = await Promise.any(secMethodOrPromises);
                next();
            }
            catch(err) {
                // Show most recent error as response
                const error = failedAttempts.pop();
                error.status = error.status || 401;
                next(error);
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        }
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function isController(object: any): object is Controller {
        return 'getHeaders' in object && 'getStatus' in object && 'setStatus' in object;
    }

    // CHANGED
    function promiseHandler(controllerObj: any, promise: any, successStatus: any, request: any, response: any, next: any) {
        // END OF CHANGED
        return Promise.resolve(promise)
            .then((data: any) => {
                let statusCode = successStatus;
                let headers;
                if (isController(controllerObj)) {
                    headers = controllerObj.getHeaders();
                    statusCode = controllerObj.getStatus() || statusCode;
                }

                // CHANGED
                if (typeof controllerObj.requestMiddleware === 'function') {
                    controllerObj.requestMiddleware(request, response, next);
                }
                // END OF CHANGED

                // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

                returnHandler(response, statusCode, data, headers)
            })
            .catch((error: any) => next(error));
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function returnHandler(response: any, statusCode?: number, data?: any, headers: any = {}) {
        if (response.headersSent) {
            return;
        }
        Object.keys(headers).forEach((name: string) => {
            response.set(name, headers[name]);
        });
        if (data && typeof data.pipe === 'function' && data.readable && typeof data._read === 'function') {
            response.status(statusCode || 200)
            data.pipe(response);
        } else if (data !== null && data !== undefined) {
            response.status(statusCode || 200).json(data);
        } else {
            response.status(statusCode || 204).end();
        }
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function responder(response: any): TsoaResponse<HttpStatusCodeLiteral, unknown>  {
        return function(status, data, headers) {
            returnHandler(response, status, data, headers);
        };
    };

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function getValidatedArgs(args: any, request: any, response: any): any[] {
        const fieldErrors: FieldErrors  = {};
        const values = Object.keys(args).map((key) => {
            const name = args[key].name;
            switch (args[key].in) {
                case 'request':
                    return request;
                case 'query':
                    return validationService.ValidateParam(args[key], request.query[name], name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                case 'queries':
                    return validationService.ValidateParam(args[key], request.query, name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                case 'path':
                    return validationService.ValidateParam(args[key], request.params[name], name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                case 'header':
                    return validationService.ValidateParam(args[key], request.header(name), name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                case 'body':
                    return validationService.ValidateParam(args[key], request.body, name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                case 'body-prop':
                    return validationService.ValidateParam(args[key], request.body[name], name, fieldErrors, 'body.', {"noImplicitAdditionalProperties":"throw-on-extras"});
                case 'formData':
                    if (args[key].dataType === 'file') {
                        return validationService.ValidateParam(args[key], request.file, name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                    } else if (args[key].dataType === 'array' && args[key].array.dataType === 'file') {
                        return validationService.ValidateParam(args[key], request.files, name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                    } else {
                        return validationService.ValidateParam(args[key], request.body[name], name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                    }
                case 'res':
                    return responder(response);
            }
        });

        if (Object.keys(fieldErrors).length > 0) {
            throw new ValidateError(fieldErrors, '');
        }
        return values;
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa