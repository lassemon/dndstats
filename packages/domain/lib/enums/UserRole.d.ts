export declare enum UserRole {
    SuperAdmin = "superAdmin",// Has unrestricted access to all parts of the application, including user management, content approval, system settings, and more.
    Admin = "admin",// Manages user accounts, can deactivate users, and has oversight over content but with some restrictions compared to SuperAdmin.
    Creator = "creator",// Can create new items, weapons, monsters, campaigns, locations, etc. This role focuses on content creation without access to administrative functions.
    Editor = "editor",//  Can edit existing content but may not have the permissions to create new top-level items. Useful for collaborative content development where certain users are responsible for refining and updating content.
    Viewer = "viewer",// Has read-only access to public content. Cannot create or edit content but can view content shared by others.
    Player = "player",// Similar to a viewer but with additional permissions to interact with campaign-specific content (e.g., managing character sheets, viewing campaign details, and accessing player-specific materials).
    DM = "dm",// A specialized role for users who manage their own campaigns. Can create campaign-specific content, manage player access, and share materials with their players. This role might have more extensive content creation and management capabilities within the context of their own campaigns compared to a general Creator.
    Moderator = "moderator"
}
