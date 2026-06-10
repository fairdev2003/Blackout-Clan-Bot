export interface ClanMember {
  id: string;
  level: string;
  name: string;
  rank: string;
  valor: number;
}

export interface ClanInfo {
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
  type: string;
  valor_points: number;
}

export interface Snapshot {
  clan_info: ClanInfo;
  members: ClanMember[];
  timestamp?: number;
}

export interface ClanData {
  clan_info: ClanInfo;
  members: ClanMember[];
  search_count: number;
  snapshots: Snapshot[];
}
