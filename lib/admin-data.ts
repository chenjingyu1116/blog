import fs from 'fs/promises';
import path from 'path';

const ALBUMS_FILE = path.join(process.cwd(), 'data', 'albums.ts');
const FRIENDS_FILE = path.join(process.cwd(), 'data', 'friends.ts');

export interface Photo { url: string; caption?: string; }
export interface Album { id: string; title: string; description: string; cover: string; date: string; photos: Photo[]; }
export interface Friend { id: string; name: string; url: string; description: string; avatar: string; themeColor: string; }

// ---------- 相册 ----------
function parseAlbumsTs(content: string): Album[] {
  const match = content.match(/export const albums:\s*Album\[\]\s*=\s*([\s\S]*?);\s*$/);
  if (!match) throw new Error('无法解析 albums.ts');
  return JSON.parse(match[1].trim());
}

function stringifyAlbumsTs(albums: Album[]): string {
  return `// 🛡️ 本文件由 XingHuiSama 控制台自动生成，请勿手动修改
export interface Photo { url: string; caption?: string; }
export interface Album { id: string; title: string; description: string; cover: string; date: string; photos: Photo[]; }

export const albums: Album[] = ${JSON.stringify(albums, null, 2)};
`;
}

export async function listAlbums(): Promise<Album[]> {
  const raw = await fs.readFile(ALBUMS_FILE, 'utf-8');
  return parseAlbumsTs(raw);
}

export async function saveAlbums(albums: Album[]) {
  await fs.writeFile(ALBUMS_FILE, stringifyAlbumsTs(albums), 'utf-8');
}

// ---------- 友链 ----------
function parseFriendsTs(content: string): Friend[] {
  const match = content.match(/export const friendsData:\s*Friend\[\]\s*=\s*([\s\S]*?);\s*$/);
  if (!match) throw new Error('无法解析 friends.ts');
  return JSON.parse(match[1].trim());
}

function stringifyFriendsTs(friends: Friend[]): string {
  return `// 🛡️ 本文件由 XingHuiSama 控制台自动生成，请勿手动修改
export interface Friend { id: string; name: string; url: string; description: string; avatar: string; themeColor: string; }

export const friendsData: Friend[] = ${JSON.stringify(friends, null, 2)};
`;
}

export async function listFriends(): Promise<Friend[]> {
  const raw = await fs.readFile(FRIENDS_FILE, 'utf-8');
  return parseFriendsTs(raw);
}

export async function saveFriends(friends: Friend[]) {
  await fs.writeFile(FRIENDS_FILE, stringifyFriendsTs(friends), 'utf-8');
}
