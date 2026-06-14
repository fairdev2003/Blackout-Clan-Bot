export type ClanInfo = {
  clan_announcement: string;
  clan_id: string;
  clan_logo: string;
  clan_name: string;
  continent: string;
  division: string;
  fort_energy: number;
  fort_power: number;
  leader_avatar: string;
  leader_coins: number;
  leader_gems: number;
  leader_id: string;
  leader_join_date: string;
  leader_name: string;
  members_count: number;
  members_valor: number;
  motto: string;
  tank_energy: number;
  tank_power: number;
  type: "Private" | "Public";
  valor_points: number;
};

export type ClanData = {
  clan_info: ClanInfo;
  members: ClanMember[];
};

export type ClanMember = {
  id: string;
  level: string;
  name: string;
  rank:
    | "Newbie"
    | "Lieutenant"
    | "Captain"
    | "Major"
    | "Colonel"
    | "Lt. Colonel"
    | "General"
    | "Emperor"
    | string;
  valor: number;
};

export type ClanSnapshot = {
  clan_info: ClanInfo;
  members: ClanMember[];
  timestamp: number;
};

export type ClanResponse = {
  clan_info: ClanInfo;
  members: ClanMember[];
  search_count: number;
  snapshots: ClanSnapshot[];
  success: boolean;
};

export type PlayerData = {
  info: PlayerInfo;
};

export type PlayerInfo = {
  armor_count: number;
  avatar: string;
  avatar_count: number;
  username: string;
  banned: "Yes" | "No" | string;
  cape: string | null;
  clan: PlayerClan | null;
  creation_date: string;
  creation_date_unix: number;
  currency: PlayerCurrency;
  current_loadout: number;
  eggs_count: number;
  gadgets_count: number;
  id: string;
  last_online: string;
  level: number;
  loadouts: Record<string, PlayerLoadout>;
  lottery: LotteryItem[];
  match_history: MatchHistoryItem[];
  modules: PlayerModules;
  pets_count: number;
  recent_performance: RecentPerformance;
  royale_items_count: number;
  royale_vehicles_count: number;
  searched_player_id: string;
  sets_count: number;
  skin: string;
  skins: PlayerSkin[];
  weapons_count: number;
  wear: WearItem[];
};

export type PlayerClan = {
  clanid: number;
  clanlogo: string;
  clanname: string;
  clanrank: string;
};

export type PlayerCurrency = {
  "Battle Pass Tickets"?: number;
  Coins?: number;
  Coupons?: number;
  Gems?: number;
  "Pixel Pass Tickets"?: number;
  Silver?: number;
  [key: string]: number | undefined;
};

export type EquipmentItem = {
  id: number | null;
  name: string | null;
  code_name?: string | null;
};

export type WeaponItem = {
  id: number | null;
  name: string | null;
};

export type PlayerLoadout = {
  index: number;
  name: string;
  armor: EquipmentItem;
  backup: WeaponItem;
  boots: EquipmentItem;
  cape: EquipmentItem;
  hat: EquipmentItem;
  heavy: WeaponItem;
  mask: EquipmentItem;
  melee: WeaponItem;
  primary: WeaponItem;
  sniper: WeaponItem;
  special: WeaponItem;
  throwable: EquipmentItem;
  tools: EquipmentItem;
};

export type LotteryItem = {
  amount: number;
  index: number;
  name: string;
};

export type MatchPlayer = {
  id: string;
  kills: number;
  name: string;
  score: number;
  team: number;
};

export type MatchHistoryItem = {
  game_mode: number;
  players: MatchPlayer[];
  timestamp: number;
};

export type PlayerModules = {
  [moduleName: string]: number;
};

export type RecentPerformance = {
  avg_deaths: number;
  avg_kd: number;
  avg_kills: number;
  matches_played: number;
  win_rate: number;
  wins: number;
};

export type PlayerSkin = {
  frontview: string;
  name: string;
  skin: string;
};

export type WearItem = {
  code_name: string | null;
  name: string | null;
  type: string;
};

export type ClanValorHistory = {
  history: ValorHistory[];
};

export type ValorHistory = {
  collectors: number;
  period: string;
  valor_gained: number;
};
