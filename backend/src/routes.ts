/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { TsoaRoute, fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
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
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from 'express';

const expressAuthenticationRecasted = expressAuthentication as (req: ExRequest, securityName: string, scopes?: string[], res?: ExResponse) => Promise<any>;


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
        "enums": ["adventuring-gear","ammunition","arcane-foci","armor","artisans-tool","druidic-foci","equipment-pack","gaming-set","heavy-armor","holy-symbol","kit","land-vehicle","light-armor","martial-melee-weapon","martial-ranged-weapon","martial-weapon","magic-item","medium-armor","melee-weapon","mount-or-other-animal","mount-or-vehicle","musical-instrument","other-tool","potion","ranged-weapon","ring","necklace","rod","scroll","shield","simple-melee-weapon","simple-ranged-weapon","simple-weapon","staff","standard-gear","tack-harness-or-drawn-vehicle","tool","vehicle","wand","waterborne-vehicle","weapon","wondrous-item"],
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
    "PageStatsResponse": {
        "dataType": "refObject",
        "properties": {
            "featuredItem": {"ref":"ItemResponse","required":true},
            "trendingItems": {"dataType":"array","array":{"dataType":"refAlias","ref":"ItemResponse"},"required":true},
            "latestItems": {"dataType":"array","array":{"dataType":"refAlias","ref":"ItemResponse"},"required":true},
        },
        "additionalProperties": false,
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
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"itemsPerPage":{"dataType":"double"},"pageNumber":{"dataType":"double"},"onlyMyItems":{"dataType":"boolean"},"search":{"dataType":"string"},"source":{"dataType":"array","array":{"dataType":"union","subSchemas":[{"dataType":"enum","enums":["5th_e_SRD"]},{"dataType":"enum","enums":["Homebrew"]},{"dataType":"enum","enums":["My_Items"]},{"dataType":"enum","enums":["System"]}]}},"visibility":{"dataType":"array","array":{"dataType":"union","subSchemas":[{"dataType":"enum","enums":["public"]},{"dataType":"enum","enums":["logged_in"]},{"dataType":"enum","enums":["private"]}]}},"rarity":{"dataType":"array","array":{"dataType":"union","subSchemas":[{"dataType":"enum","enums":["uncommon"]},{"dataType":"enum","enums":["common"]},{"dataType":"enum","enums":["very_rare"]},{"dataType":"enum","enums":["rare"]},{"dataType":"enum","enums":["legendary"]},{"dataType":"enum","enums":["artifact"]},{"dataType":"enum","enums":["varies"]}]}},"category":{"dataType":"array","array":{"dataType":"union","subSchemas":[{"dataType":"enum","enums":["adventuring-gear"]},{"dataType":"enum","enums":["ammunition"]},{"dataType":"enum","enums":["arcane-foci"]},{"dataType":"enum","enums":["armor"]},{"dataType":"enum","enums":["artisans-tool"]},{"dataType":"enum","enums":["druidic-foci"]},{"dataType":"enum","enums":["equipment-pack"]},{"dataType":"enum","enums":["gaming-set"]},{"dataType":"enum","enums":["heavy-armor"]},{"dataType":"enum","enums":["holy-symbol"]},{"dataType":"enum","enums":["kit"]},{"dataType":"enum","enums":["land-vehicle"]},{"dataType":"enum","enums":["light-armor"]},{"dataType":"enum","enums":["martial-melee-weapon"]},{"dataType":"enum","enums":["martial-ranged-weapon"]},{"dataType":"enum","enums":["martial-weapon"]},{"dataType":"enum","enums":["magic-item"]},{"dataType":"enum","enums":["medium-armor"]},{"dataType":"enum","enums":["melee-weapon"]},{"dataType":"enum","enums":["mount-or-other-animal"]},{"dataType":"enum","enums":["mount-or-vehicle"]},{"dataType":"enum","enums":["musical-instrument"]},{"dataType":"enum","enums":["other-tool"]},{"dataType":"enum","enums":["potion"]},{"dataType":"enum","enums":["ranged-weapon"]},{"dataType":"enum","enums":["ring"]},{"dataType":"enum","enums":["necklace"]},{"dataType":"enum","enums":["rod"]},{"dataType":"enum","enums":["scroll"]},{"dataType":"enum","enums":["shield"]},{"dataType":"enum","enums":["simple-melee-weapon"]},{"dataType":"enum","enums":["simple-ranged-weapon"]},{"dataType":"enum","enums":["simple-weapon"]},{"dataType":"enum","enums":["staff"]},{"dataType":"enum","enums":["standard-gear"]},{"dataType":"enum","enums":["tack-harness-or-drawn-vehicle"]},{"dataType":"enum","enums":["tool"]},{"dataType":"enum","enums":["vehicle"]},{"dataType":"enum","enums":["wand"]},{"dataType":"enum","enums":["waterborne-vehicle"]},{"dataType":"enum","enums":["weapon"]},{"dataType":"enum","enums":["wondrous-item"]}]}},"property":{"dataType":"array","array":{"dataType":"union","subSchemas":[{"dataType":"enum","enums":["ammunition"]},{"dataType":"enum","enums":["finesse"]},{"dataType":"enum","enums":["heavy"]},{"dataType":"enum","enums":["light"]},{"dataType":"enum","enums":["loading"]},{"dataType":"enum","enums":["monk"]},{"dataType":"enum","enums":["reach"]},{"dataType":"enum","enums":["special"]},{"dataType":"enum","enums":["thrown"]},{"dataType":"enum","enums":["two-handed"]},{"dataType":"enum","enums":["versatile"]}]}},"priceComparison":{"dataType":"union","subSchemas":[{"dataType":"enum","enums":["max"]},{"dataType":"enum","enums":["exactly"]},{"dataType":"enum","enums":["min"]}]},"priceQuantity":{"dataType":"string"},"priceUnit":{"dataType":"string"},"weightComparison":{"dataType":"union","subSchemas":[{"dataType":"enum","enums":["max"]},{"dataType":"enum","enums":["exactly"]},{"dataType":"enum","enums":["min"]}]},"weight":{"dataType":"string"},"requiresAttunement":{"dataType":"boolean"},"hasImage":{"dataType":"boolean"}},"validators":{}},
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
            "category": {"dataType":"array","array":{"dataType":"union","subSchemas":[{"dataType":"enum","enums":["adventuring-gear"]},{"dataType":"enum","enums":["ammunition"]},{"dataType":"enum","enums":["arcane-foci"]},{"dataType":"enum","enums":["armor"]},{"dataType":"enum","enums":["artisans-tool"]},{"dataType":"enum","enums":["druidic-foci"]},{"dataType":"enum","enums":["equipment-pack"]},{"dataType":"enum","enums":["gaming-set"]},{"dataType":"enum","enums":["heavy-armor"]},{"dataType":"enum","enums":["holy-symbol"]},{"dataType":"enum","enums":["kit"]},{"dataType":"enum","enums":["land-vehicle"]},{"dataType":"enum","enums":["light-armor"]},{"dataType":"enum","enums":["martial-melee-weapon"]},{"dataType":"enum","enums":["martial-ranged-weapon"]},{"dataType":"enum","enums":["martial-weapon"]},{"dataType":"enum","enums":["magic-item"]},{"dataType":"enum","enums":["medium-armor"]},{"dataType":"enum","enums":["melee-weapon"]},{"dataType":"enum","enums":["mount-or-other-animal"]},{"dataType":"enum","enums":["mount-or-vehicle"]},{"dataType":"enum","enums":["musical-instrument"]},{"dataType":"enum","enums":["other-tool"]},{"dataType":"enum","enums":["potion"]},{"dataType":"enum","enums":["ranged-weapon"]},{"dataType":"enum","enums":["ring"]},{"dataType":"enum","enums":["necklace"]},{"dataType":"enum","enums":["rod"]},{"dataType":"enum","enums":["scroll"]},{"dataType":"enum","enums":["shield"]},{"dataType":"enum","enums":["simple-melee-weapon"]},{"dataType":"enum","enums":["simple-ranged-weapon"]},{"dataType":"enum","enums":["simple-weapon"]},{"dataType":"enum","enums":["staff"]},{"dataType":"enum","enums":["standard-gear"]},{"dataType":"enum","enums":["tack-harness-or-drawn-vehicle"]},{"dataType":"enum","enums":["tool"]},{"dataType":"enum","enums":["vehicle"]},{"dataType":"enum","enums":["wand"]},{"dataType":"enum","enums":["waterborne-vehicle"]},{"dataType":"enum","enums":["weapon"]},{"dataType":"enum","enums":["wondrous-item"]}]}},
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
const templateService = new ExpressTemplateService(models, {"noImplicitAdditionalProperties":"throw-on-extras","bodyCoercion":true});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

export function RegisterRoutes(app: Router) {
    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################
        app.get('/api/v1/user',
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.getAll)),

            async function UserController_getAll(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new UserController();

              await templateService.apiHandler({
                methodName: 'getAll',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1/user/:id',
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.get)),

            async function UserController_get(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    id: {"in":"path","name":"id","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new UserController();

              await templateService.apiHandler({
                methodName: 'get',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/v1/user',
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.insert)),

            async function UserController_insert(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    requestBody: {"in":"body","name":"requestBody","required":true,"ref":"UserInsertRequest"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new UserController();

              await templateService.apiHandler({
                methodName: 'insert',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.put('/api/v1/user',
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.put)),

            async function UserController_put(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    requestBody: {"in":"body","name":"requestBody","required":true,"ref":"UserUpdateRequest"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new UserController();

              await templateService.apiHandler({
                methodName: 'put',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.delete('/api/v1/user/:id',
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.delete)),

            async function UserController_delete(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    id: {"in":"path","name":"id","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new UserController();

              await templateService.apiHandler({
                methodName: 'delete',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1/profile',
            ...(fetchMiddlewares<RequestHandler>(ProfileController)),
            ...(fetchMiddlewares<RequestHandler>(ProfileController.prototype.getAll)),

            async function ProfileController_getAll(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new ProfileController();

              await templateService.apiHandler({
                methodName: 'getAll',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1',
            ...(fetchMiddlewares<RequestHandler>(PingController)),
            ...(fetchMiddlewares<RequestHandler>(PingController.prototype.ping)),

            async function PingController_ping(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new PingController();

              await templateService.apiHandler({
                methodName: 'ping',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1/ping',
            ...(fetchMiddlewares<RequestHandler>(PingController1)),
            ...(fetchMiddlewares<RequestHandler>(PingController1.prototype.ping)),

            async function PingController1_ping(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new PingController1();

              await templateService.apiHandler({
                methodName: 'ping',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1/secureping',
            ...(fetchMiddlewares<RequestHandler>(PingController2)),
            ...(fetchMiddlewares<RequestHandler>(PingController2.prototype.ping)),

            async function PingController2_ping(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new PingController2();

              await templateService.apiHandler({
                methodName: 'ping',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1/apikeyping',
            authenticateMiddleware([{"api_key":[]}]),
            ...(fetchMiddlewares<RequestHandler>(PingController3)),
            ...(fetchMiddlewares<RequestHandler>(PingController3.prototype.ping)),

            async function PingController3_ping(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new PingController3();

              await templateService.apiHandler({
                methodName: 'ping',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1/pagestats',
            ...(fetchMiddlewares<RequestHandler>(PageStatsController)),
            ...(fetchMiddlewares<RequestHandler>(PageStatsController.prototype.get)),

            async function PageStatsController_get(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new PageStatsController();

              await templateService.apiHandler({
                methodName: 'get',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1/monsters',
            ...(fetchMiddlewares<RequestHandler>(MonsterController)),
            ...(fetchMiddlewares<RequestHandler>(MonsterController.prototype.search)),

            async function MonsterController_search(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new MonsterController();

              await templateService.apiHandler({
                methodName: 'search',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1/monsters/:monsterName',
            ...(fetchMiddlewares<RequestHandler>(MonsterController)),
            ...(fetchMiddlewares<RequestHandler>(MonsterController.prototype.get)),

            async function MonsterController_get(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    monsterName: {"in":"path","name":"monsterName","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new MonsterController();

              await templateService.apiHandler({
                methodName: 'get',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1/items',
            ...(fetchMiddlewares<RequestHandler>(ItemController)),
            ...(fetchMiddlewares<RequestHandler>(ItemController.prototype.search)),

            async function ItemController_search(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    queryParams: {"in":"queries","name":"queryParams","required":true,"ref":"SearchQueryParams"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new ItemController();

              await templateService.apiHandler({
                methodName: 'search',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1/myitems',
            ...(fetchMiddlewares<RequestHandler>(ItemController)),
            ...(fetchMiddlewares<RequestHandler>(ItemController.prototype.getAllForUser)),

            async function ItemController_getAllForUser(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new ItemController();

              await templateService.apiHandler({
                methodName: 'getAllForUser',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1/item',
            ...(fetchMiddlewares<RequestHandler>(ItemController)),
            ...(fetchMiddlewares<RequestHandler>(ItemController.prototype.get)),

            async function ItemController_get(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    id: {"in":"query","name":"id","required":true,"dataType":"string"},
                    source: {"in":"query","name":"source","required":true,"dataType":"enum","enums":["5th_e_SRD","Homebrew","My_Items","System"]},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new ItemController();

              await templateService.apiHandler({
                methodName: 'get',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1/item/:itemId',
            ...(fetchMiddlewares<RequestHandler>(ItemController)),
            ...(fetchMiddlewares<RequestHandler>(ItemController.prototype.getItem)),

            async function ItemController_getItem(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    itemId: {"in":"path","name":"itemId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new ItemController();

              await templateService.apiHandler({
                methodName: 'getItem',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.put('/api/v1/item',
            ...(fetchMiddlewares<RequestHandler>(ItemController)),
            ...(fetchMiddlewares<RequestHandler>(ItemController.prototype.update)),

            async function ItemController_update(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    requestBody: {"in":"body","name":"requestBody","required":true,"ref":"ItemUpdateRequest"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new ItemController();

              await templateService.apiHandler({
                methodName: 'update',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.delete('/api/v1/item/:itemId',
            ...(fetchMiddlewares<RequestHandler>(ItemController)),
            ...(fetchMiddlewares<RequestHandler>(ItemController.prototype.deleteIem)),

            async function ItemController_deleteIem(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    itemId: {"in":"path","name":"itemId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new ItemController();

              await templateService.apiHandler({
                methodName: 'deleteIem',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1/image/:imageId',
            ...(fetchMiddlewares<RequestHandler>(ImageController)),
            ...(fetchMiddlewares<RequestHandler>(ImageController.prototype.get)),

            async function ImageController_get(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    imageId: {"in":"path","name":"imageId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new ImageController();

              await templateService.apiHandler({
                methodName: 'get',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/v1/image',
            ...(fetchMiddlewares<RequestHandler>(ImageController)),
            ...(fetchMiddlewares<RequestHandler>(ImageController.prototype.uploadImage)),

            async function ImageController_uploadImage(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    requestBody: {"in":"body","name":"requestBody","required":true,"ref":"Image"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new ImageController();

              await templateService.apiHandler({
                methodName: 'uploadImage',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.delete('/api/v1/image/:itemId',
            ...(fetchMiddlewares<RequestHandler>(ImageController)),
            ...(fetchMiddlewares<RequestHandler>(ImageController.prototype.delete)),

            async function ImageController_delete(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    itemId: {"in":"path","name":"itemId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new ImageController();

              await templateService.apiHandler({
                methodName: 'delete',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/v1/auth/login',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.login)),

            async function AuthController_login(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    loginParams: {"in":"body","name":"loginParams","required":true,"ref":"ILoginRequest"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'login',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/v1/auth/logout',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.logout)),

            async function AuthController_logout(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'logout',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/v1/auth/refresh',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.refresh)),

            async function AuthController_refresh(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'refresh',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1/auth/status',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.status)),

            async function AuthController_status(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'status',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function authenticateMiddleware(security: TsoaRoute.Security[] = []) {
        return async function runAuthenticationMiddleware(request: any, response: any, next: any) {

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
                            expressAuthenticationRecasted(request, name, secMethod[name], response)
                                .catch(pushAndRethrow)
                        );
                    }

                    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

                    secMethodOrPromises.push(Promise.all(secMethodAndPromises)
                        .then(users => { return users[0]; }));
                } else {
                    for (const name in secMethod) {
                        secMethodOrPromises.push(
                            expressAuthenticationRecasted(request, name, secMethod[name], response)
                                .catch(pushAndRethrow)
                        );
                    }
                }
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            try {
                request['user'] = await Promise.any(secMethodOrPromises);

                // Response was sent in middleware, abort
                if (response.writableEnded) {
                    return;
                }

                next();
            }
            catch(err) {
                // Show most recent error as response
                const error = failedAttempts.pop();
                error.status = error.status || 401;

                // Response was sent in middleware, abort
                if (response.writableEnded) {
                    return;
                }
                next(error);
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        }
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
