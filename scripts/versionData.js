/*
  ╱|、
(˚ˎ 。7  
 |、˜〵          
じしˍ,)ノ
Kitty is watching the config >:3
*/
export default {
    defaults: {
        chatformat: `{{has_tag clan-chat "<nc>:small_diamond: " "<bl>"}}{{is_afk "§7AFK "}}{{clan "<bc>[§r§7<nc>[@CLAN]§r<bc>] "}}{{has_tag staffchat "<bc>[<nc> StaffChat §r<bc>] " "<bl>"}}§r<bc>[ <rc>{{rank_joiner "<drj>"}}§r<bc> ] §r<nc><name> §r§l<bc><dra> §r<mc><msg>`
    },
    versionInfo: {
        versionName: "v2.9",
        versionInternalID: 8, // 1 starts with october 2024 update
        versionData: new Map([
            [
                1,
                {
                    versionName: "Spooky Update",
                    versionInternalID: 1
                }
            ],
			[
				2,
				{
					versionName: "Update 2.2.2",
					versionInternalID: 2
				}
			],
            [
				3,
				{
					versionName: "Update 2.8",
					versionInternalID: 3
				}
			],
            [
				4,
				{
					versionName: "Update 2.8.2",
					versionInternalID: 3
				}
			],

            [
				5,
				{
					versionName: "Update 2.8.2",
					versionInternalID: 3
				}
			],
            [
				6,
				{
					versionName: "Update 2.8.3",
					versionInternalID: 3
				}
			],
            [
				7,
				{
					versionName: "Update 2.8.4",
					versionInternalID: 3
				}
			],
            [
				8,
				{
					versionName: "Update 2.9",
					versionInternalID: 8
				}
			],
            
        ])
    },
    tableNames: {
        uis: "uis"
    },
    scripteventNames: {
        open: "leaf:open",
        openDefaultLegacy: "leaf:open_default",
        openDefault: "leafgui:",
    },
    uiNames: {
        LandClaims: {
            Root: "land_claims",
            Manage: "land_claims_manage",
            ManageClaim: "manage_land_claim",
            Configure: "land_claims_config"
        },
        CombatLogConfig: "combat_log",
        ItemIconSelector: "item_icon_selector | Leaf/Items/Icons/Selector",
        PresetBrowser: {
            Root: "preset_browser",
        },
        Zones: {
            Root: "zones | Leaf/Zones/Root",
            Add: "zones_add | Leaf/Zones/Add",
            Edit: "zones_edit | Leaf/Zones/Edit",
            EditFlags: "zones_edit_flags | Leaf/Zones/EditFlags"
        },
        AuctionHouse: {
            Root: "ah_root | Leaf/AuctionHouse/Root",
            ViewAuctions: "ah_view | Leaf/AuctionHouse/View",
            Start: "ah_start | Leaf/AuctionHouse/Start",
            ViewAuction: "ah_view_auction | Leaf/AuctionHouse/View/Auction",
            Settings: {
                Root: "ah_settings | Leaf/AuctionHouse/Settings/Root"
            }
        },
        Bounty: {
            View: "bounty_view | Leaf/Bounty/View",
            Root: "bounty_root | Leaf/Bounty/Root",
            Create: "bounty_create | Leaf/Bounty/Create",
            Config: "bounty_config | Leaf/Bounty/Config"
        },
        PlatformSettings: {
            Root: "platformsettings | Leaf/PlatformSettings",
            Desktop: "platformsettings_desktop | Leaf/PlatformSettings/Desktop",
            Mobile: "platformsettings_mobile | Leaf/PlatformSettings/Mobile",
            Console: "platformsettings_console | Leaf/PlatformSettings/Console",
            EditPlatform: "platformsettings_editplatform | Leaf/PlatformSettings/EditPlatform",
            EditTag: "platformsettings_edittag | Leaf/PlatformSettings/EditPlatformTag",
            GlobalSettings: "platformsettings_global_settings | Leaf/PlatformSettings/GlobalSettings",
			EditPlatformWhitelist: "platformsettings_editplatform_whitelist | Leaf/PlatformSettings/EditPlatform/Whitelist"
        },
        Crates: {
            Root: "crates_root | Leaf/Crates/Root"
        },
		MiscTools: {
			Root: "misctools | Leaf/MiscTools",
			ConfigAPIRawEditor: "configapi_editor | Leaf/MiscTools/ConfigAPIEditor"
		},
		DevSettings: {
			Root: "dev | Leaf/Dev",
			DebugTools: "dev_debugtools | Leaf/DevDebugTools",
			DevToggles: "dev_toggles | Leaf/DevSettings/DevToggles",
			DevSetPassword: "dev_set_password | Leaf/DevSettings/SetPassword",
		},
        DevHub: "dev | Leaf/Dev",
        ImportUI: "ui_import | Leaf/Import/UI",
        Lock: "lock | Leaf/ChestLocking/Lock",
        UIBuilderRoot: "ui_builder_main_page | Leaf/UIBuilder/Root",
        CustomizerSettings: "customizer_settings | Leaf/Customizer/Settings",
        UIBuilderTrash: "ui_builder_trash | Leaf/UIBuilder/Trash",
        UIBuilderAddSeparator: "ui_builder_add_separator | Leaf/UIBuilder/Add/ViewSeparator",
        UIBuilderLeaf: "edit_leaf_uis | Leaf/UIBuilder/Edit/LeafUIs",
        UIBuilderAdd: "ui_builder_create_ui | Leaf/UIBuilder/Add",
        UIBuilderAddSubmenu: "ui_builder_create_ui_selector | Leaf/UIBuilder/Add/Selector",
        UIBuilderSearch: "ui_builder_search_uis | Leaf/UIBuilder/Search",
        UIBuilderEdit: "ui_builder_edit_ui | Leaf/UIBuilder/Edit",
        UIBuilderEditButtons: "ui_builder_edit_buttons | Leaf/UIBuilder/EditButtons",
        UIBuilderAddButton: "ui_builder_add_button | Leaf/UIBuilder/AddButton",
        UIBuilderEditButton: "ui_builder_edit_button | Leaf/UIBuilder/EditButton",
        UIBuilderTemplates: "ui_builder_templates | Leaf/UIBuilder/Templates",
        UIBuilderTemplatesAdd: "ui_builder_templates_add | Leaf/UIBuilder/Templates/Add",
        UIBuilderInfo: "ui_builder_info | Leaf/UIBuilder/Info",
        UIBuilderTabbed: "ui_builder_tabbed | Leaf/UIBuilder/Tabbed",
        UIBuilderTabbedCreate: "ui_builder_tabbed_create | Leaf/UIBuilder/Tabbed/Create",
        UIBuilderTabbedEdit: "ui_builder_tabbed_edit | Leaf/UIBuilder/Tabbed/Edit",
        UIBuilderHelp: "uihelp | Leaf/UIBuilder/Help",
        UIBuilderTabbedEditTabs: "ui_builder_tabbed_edit_tabs | Leaf/UIBuilder/Tabbed/EditTabs",
        ConfigRoot: "config_menu_start_page | Leaf/Config/Root",
        ConfigMain: "config_menu_main_settings | Leaf/Config/Main",
        RoleEditor: {
            Root: "role_editor | Leaf/RoleEditor/Root",
            Add: "add_role | Leaf/RoleEditor/Add",
            Edit: "edit_role | Leaf/RoleEditor/Edit",
            EditPerms: "edit_role_perms | Leaf/RoleEditor/EditPerms",
            EditTags: "edit_role_tags | Leaf/RoleEditor/EditTags"
        },
        CustomCommands: {
            create: "create_custom_command | Leaf/CustomCommands/Create",
            view: "view_custom_command | Leaf/CustomCommands/View",
            root: "custom_commands_root | Leaf/CustomCommands/Root",
        },
        EventsV2: {
            AddStepSelector: "eventsv2_add_selector | Leaf/Events/Add/Selector",
            AddOptionCreator: "eventsv2_add_options | Leaf/Events/Add/Options",
            EditActions: "eventsv2_edit_actions | Leaf/EventsV2/EditActions",
            AddAction: "eventsv2_add_action | Leaf/EventsV2/AddAction",
            AddActionTypeSelector: "eventsv2_add_action_type_selector | Leaf/EventsV2/AddActionTypeSelector",
            EditAction: "eventsv2_edit_action | Leaf/EventsV2/EditAction"
        },
        InviteManager: {
            Add: "invmgr_add | Leaf/InvMgr/Add",
            EditActions: "invmgr_edit_actions | Leaf/InvMgr/EditActions",
            Invite: "invite | Leaf/Invite"
        },
        Leaf: "leaf | Leaf",
        Config: {
            More: "more_settings",
            ProximityChat: "proximity_chat",
            Clans: "clans_config | Leaf/Config/Clans",
            RTP: "rtp_config | Leaf/Config/RTP",
            Modules: "modules_config | Leaf/Config/Modules",
            Misc: "misc_config | Leaf/Config/Misc",
            ChatrankFormat: "chatformat_config | Leaf/Config/Misc/Chatrankformat",
            Advanced: "advanced_config | Leaf/Config/Advanced"
        },
        Modal: {
            Preview: "modal_preview | Leaf/UIs/Modals/Preview",
            Root: "modal_root | Leaf/UIs/Modals/Root",
            Add: "modal_add | Leaf/UIs/Modals/Add",
            Edit: "modal_edit | Leaf/UIs/Modals/Edit",
            EditControls: "modal_edit_controls | Leaf/UIs/Modals/Edit/Controls",
            AddControl: "modal_add_control | Leaf/UIs/Modals/Add/Control",
            EditControl: "modal_edit_control | Leaf/UIs/Modals/Edit/Control"
        },
        PlayerContentManager: {
            Root: "pcm_root",
            Add: "pcm_add",
            Edit: "pcm_edit",
            Moderate: "pcm_moderate"
        },
        ConfigCredits: "credits | Leaf/Config/Credits",
        ChestGuiRoot: "chest_gui_main_page | Leaf/ChestGUIs/Root",
        ChestGuiAdd: "chest_gui_create_ui | Leaf/ChestGUIs/Add",
        ChestGuiAddAdvanced: "chest_gui_create_advanced_ui | Leaf/ChestGUIs/Add/Advanced",
        ChestGuiEdit: "chest_gui_edit_ui | Leaf/ChestGUIs/Edit",
        ChestGuiEditItems: "chest_gui_edit_items | Leaf/ChestGUIs/EditItems",
        ChestGuiEditPattern: "chest_gui_edit_pattern | Leaf/ChestGUIs/EditPattern",
        ChestGuiPatternSelect: "chest_gui_pattern_select | Leaf/ChestGUIs/PatternSelect",
        ChestGuiEditItem: "chest_gui_edit_item | Leaf/ChestGUIs/EditItem",
        ChestGuiAddItem: "chest_gui_add_item | Leaf/ChestGUIs/AddItem",
        ChestGuiAddItemAdvanced: "chest_gui_add_advanced_item | Leaf/ChestGUIs/AddItem/Advanced",
        OnlineGUIsList: "ln/online_guis_list | LeafNetwork/OnlineGUIs/List",
        SidebarEditorRoot: "sidebar_editor_root | Leaf/Sidebar/Root",
        SidebarEditorAdd: "sidebar_editor_create | Leaf/Sidebar/Add",
        SidebarEditorSettings: "sidebar_editor_global_settings | Leaf/Sidebar/Settings",
        SidebarEditorEdit: "sidebar_editor_edit | Leaf/Sidebar/Edit",
        SidebarEditorAddLine: "sidebar_editor_add_line | Leaf/Sidebar/AddLine",
        SidebarEditorEditLine: "sidebar_editor_edit_line | Leaf/Sidebar/EditLine",
        SidebarEditorTrash: "sidebar_editor_trash | Leaf/Sidebar/Trash",
        SidebarEditorTrashEdit: "sidebar_editor_trash_edit | Leaf/Sidebar/TrashEdit",
        BlockEditor: "block_editor | Leaf/BlockEditor",
        EntityEditor: "entity_editor | Leaf/EntityEditor",
        CurrencyEditor: "currency_editor | Leaf/CurrencyEditor/Root",
        CurrencyEditorAdd: "add_currency | Leaf/CurrencyEditor/Add",
        IconViewer: "icon_viewer | Leaf/IconViewer",
        ToastBuilderAdd: "toast_builder_add | Leaf/Toast/Add",
        ToastBuilderEdit: "toast_builder_edit | Leaf/Toast/Edit",
        ChatRanks: {
            Main: "chatranks_config",
            Config: "chatranks_defaults",
            Ranks: {
                Edit: "ranks_edit",
                EditRank: "edit_rank",
                AddRank: "add_rank"
            }
        },
        PlayerShops: {
            Root: "player_shop_root | Leaf/PlayerShops/Root",
            View: "player_shop_view | Leaf/PlayerShops/View",
            Leaderboard: "player_shop_leaderboard | Leaf/PlayerShops/Leaderboard",
            LeaderboardSubmenus: {
                MostSales: "player_shop_most_sales | Leaf/PlayerShops/Leaderboard/MostSales",
                MostMoneyMade: "player_shop_most_money_made | Leaf/PlayerShops/Leaderboard/MostMoneyMade"
            }
        },
        Help: "help_ui | Leaf/Help",
        Generator: {
            Create: "create_generator | Leaf/Generator/Create",
            EditRoot: "edit_generators | Leaf/Generator/Edit/Root",
            EditGenerator: "edit_generator | Leaf/Generator/Edit/Properties",
            EditGeneratorSettings: "edit_generator_settings | Leaf/Generator/Edit/Properties/Settings",
            EditGeneratorUpgrades: "edit_generator_upgrades | Leaf/Generator/Edit/Properties/Upgrades",
        },
        DailyRewards: {
            AddReward: "add_daily_reward | Leaf/DailyRewards/AddReward",
            Claim: "claim_daily_reward | Leaf/DailyRewards/Claim",
            ClaimWeekly: "claim_weekly_reward | Leaf/DailyRewards/ClaimWeekly",
            ClaimMonthly: "claim_monthly_reward | Leaf/DailyRewards/ClaimMonthly",
            EditReward: "edit_daily_reward | Leaf/DailyRewards/EditReward",
            Root: "edit_daily_rewards | Leaf/DailyRewards/Root",
            Rewards: "view_daily_rewards | Leaf/DailyRewards/Rewards"
        },
        Clans: {
            Root: "clans_root | Leaf/Clans/Root",
            Create: "create_clan | Leaf/Clans/Create",
            Invite: "invite_to_clan | Leaf/Clans/Invite",
            ViewInvites: "view_clan_invites | Leaf/Clan/Invites",
            ClanMembers: "manage_clan_members | Leaf/Clan/Manage"
        },
        Gifts: {
            Add: "create_gift_code | Leaf/Gifts/Add",
            Redeem: "redeem_gift_code | Leaf/Gifts/Redeem",
            Edit: "edit_gift_code | Leaf/Gifts/Edit",
            Root: "edit_gift_codes | Leaf/Gifts/Root"
        },
        Shop: {
            Root: "shop_main | Leaf/Shop/Root",
            Category: "shop_category | Leaf/Shop/Root/Category",
            RootAdmin: "shop_admin | Leaf/Shop/Root/Admin",
            CategoryAdmin: "shop_category_admin | Leaf/Shop/Root/Category/Admin",
            ItemAdmin: "shop_edit_item | Leaf/Shop/Root/Admin/Item"
        },
        KillEvents: {
            KillEventsRoot: "kill_events_root | Leaf/KillEvents/Root",
            KillEventsAdd: "kill_events_add | Leaf/KillEvents/Add"
        },
        Events: {
            EventsRoot: "events_editor_root | Leaf/Events/Root",
            EventsEdit: "events_editor_edit | Leaf/Events/Edit",
            EventsAdd: "events_editor_add | Leaf/Events/Add",
            EventsEditCommands: "events_editor_commands | Leaf/Events/Commands/Edit",
            EventsEditCommand: "events_editor_command | Leaf/Events/Command/Edit"
        },
        Leaderboards: {
            Root: "leaderboards_root | Leaf/Leaderboards/Root",
            Edit: "leaderboards_edit | Leaf/Leaderboards/Edit",
            EditTheme: "leaderboards_edit_theme | Leaf/Leaderboards/EditTheme"
        },
        UIBuilderList: "ui_builder_list | Leaf/UIBuilder/List",
        UIBuilderFolders: "ui_builder_folders | Leaf/UIBuilder/Folders",
        UIBuilderFolder: "ui_builder_folder | Leaf/UIBuilder/Folder",
        UIBuilderFoldersView: "ui_builder_folders_view | Leaf/UIBuilder/Folders/View",
        TpaRoot: "tpa_root | Leaf/Tpa/Root",
        TpaIncoming: "tpa_incoming | Leaf/Tpa/Incoming",
        TpaOutgoing: "tpa_outgoing | Leaf/Tpa/Outgoing",
        TpaSend: "tpa_send | Leaf/Tpa/Send",
        SuperMisc: "super_misc | Leaf/SuperMisc",
        Pay: "pay | Leaf/Pay",
        ModerationHub: {
            Root: "moderation_hub | Leaf/ModerationHub/Root",
            Bans: {
                Root: "bans | Leaf/Bans",
                Add: "add_ban | Leaf/Bans/Add"
            },
            Mute: {
                Root: "mute | Leaf/Mute",
                Add: "add_mute | Leaf/Mute/Add"
            }
        },
        MCBEToolsAuth: "mcbetools_auth",
        Basic: {
            PlayerSelector: "player_selector | Leaf/Basic/PlayerSelector",
            PinCode: "pin_code_input | Leaf/Basic/PinCode",
            MuteModal: "mute_modal | Leaf/Basic/MuteModal",
            BanModal: "ban_modal | Leaf/Basic/BanModal",
            Confirmation: "confirmation | Leaf/Basic/Confirmation",
            ItemSelect: "item_select | Leaf/Basic/ItemSelect",
            NumberSelector: "number_select | Leaf/Basic/Number"
        },
        Warps: {
            Wizard: {
                Root: "warps_wizard | Leaf/Warps/Wizard",
                Automatic: "warps_wizard_automatic | Leaf/Warps/Wizard/Automatic",
                Manual: "warps_wizard_manual | Leaf/Warps/Wizard/Manual",
            }
        },
        Homes: {
            Root: "homes | Leaf/Homes/Root",
            Create: "homes_create | Leaf/Homes/Create",
            View: "homes_view | Leaf/Homes/View",
            ViewShared: "homes_viewshared | Leaf/Homes/ViewShared",
            Shared: "homes_shared | Leaf/Homes/Shared",
            Config: "homes_config | Leaf/Homes/Config"
        },
        Reports: {
            Dashboard: 'reports_dashboard | Leaf/Reports/Dashboard',
            Create: 'reports_create | Leaf/Reports/Create',
            View: 'reports_view | Leaf/Reports/View',
            Admin: {
                Dashboard: 'reports_admin_dashboard | Leaf/Reports/Admin/Dashboard',
                View: 'reports_admin_view | Leaf/Reports/Admin/View'
            },
        }
    },
    PermissionList: [
        ["Customize Leaf", "leaf.customize"]
    ],
    Discord: {
        AvatarURL: "https://i.ibb.co/Sx1cF3h/c9268706406510b05e280005280a86ef.png",
        Username: "Leaf Essentials"
    },
    HTTPEnabled: true,
    Endpoint: "https://mcbetools.com/api/leaf",
    items: {
        LeafConfig: "leaf:config_ui"
    }
}