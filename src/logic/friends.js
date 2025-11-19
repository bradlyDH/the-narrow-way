// src/logic/friends.js
import {
  loadFriendsData,
  sendFriendRequest,
  acceptFriendRequest,
  removeFriendship,
  syncFriends,
} from '../services/friendsService';

export {
  loadFriendsData,
  sendFriendRequest,
  acceptFriendRequest,
  removeFriendship,
  syncFriends,
};

// Legacy-ish aliases (if needed)
export async function getFriends() {
  return loadFriendsData();
}
export async function addFriend(addresseeId) {
  return sendFriendRequest(addresseeId);
}
export async function acceptFriend(id) {
  return acceptFriendRequest(id);
}
export async function deleteFriend(id) {
  return removeFriendship(id);
}
