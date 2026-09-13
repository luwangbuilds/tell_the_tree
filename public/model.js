export const STORAGE_KEY = 'tell-the-tree.v1';
export const blankGarden = () => ({ version: 1, leaves: [], flowers: [], harvests: [] });
const id = () => globalThis.crypto.randomUUID();
const now = () => new Date().toISOString();
const clean = (value) => {
  if (typeof value !== 'string' || !value.trim()) throw new Error('Please write a few words first.');
  if (value.trim().length > 1000) throw new Error('Keep it within 1,000 characters.');
  return value.trim();
};
export function addWorry(garden, text) {
  return { ...garden, leaves: [...garden.leaves, { id: id(), text: clean(text), createdAt: now() }] };
}
export function releaseWorry(garden, leafId) {
  if (!garden.leaves.some(leaf => leaf.id === leafId)) throw new Error('That leaf has already been tended.');
  return { ...garden, leaves: garden.leaves.filter(leaf => leaf.id !== leafId) };
}
export function chooseAction(garden, leafId, action) {
  const leaf = garden.leaves.find(leaf => leaf.id === leafId);
  if (!leaf) throw new Error('That leaf has already been tended.');
  return {
    ...garden,
    leaves: garden.leaves.filter(item => item.id !== leafId),
    flowers: [...garden.flowers, { id: leaf.id, worry: leaf.text, action: clean(action), createdAt: now() }],
  };
}
export function harvestFlowers(garden, flowerIds) {
  if (!Array.isArray(flowerIds) || !flowerIds.length) throw new Error('Choose at least one flower to harvest.');
  const selected = new Set(flowerIds);
  if (selected.size !== flowerIds.length || flowerIds.some(flowerId => !garden.flowers.some(flower => flower.id === flowerId))) {
    throw new Error('Some selected flowers are no longer available. Please choose again.');
  }
  return {
    ...garden,
    flowers: garden.flowers.filter(flower => !selected.has(flower.id)),
    harvests: [{ id: id(), createdAt: now(), actions: garden.flowers.filter(flower => selected.has(flower.id)).map(flower => ({ ...flower })) }, ...garden.harvests],
  };
}
export function deleteHarvest(garden, harvestId) {
  if (!garden.harvests.some(harvest => harvest.id === harvestId)) throw new Error('That diamond is no longer in your treasure box.');
  return { ...garden, harvests: garden.harvests.filter(harvest => harvest.id !== harvestId) };
}
export function decodeGarden(raw) {
  const value = JSON.parse(raw);
  const record = item => item && typeof item.id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(item.id) && typeof item.createdAt === 'string' && Number.isFinite(Date.parse(item.createdAt));
  const string = item => typeof item === 'string' && item.trim().length > 0 && item.length <= 1000;
  const action = item => record(item) && string(item.action) && (item.worry === undefined || string(item.worry));
  if (!value || value.version !== 1 || (value.breathingCompleted !== undefined && typeof value.breathingCompleted !== 'boolean') || !Array.isArray(value.leaves) || !Array.isArray(value.flowers) || !Array.isArray(value.harvests)
    || !value.leaves.every(item => record(item) && string(item.text)) || !value.flowers.every(action)
    || !value.harvests.every(item => record(item) && Array.isArray(item.actions) && item.actions.length >= 1 && item.actions.every(action))) {
    throw new Error('Your saved garden could not be read. It has not been changed.');
  }
  const ids = [...value.leaves, ...value.flowers, ...value.harvests].map(item => item.id);
  if (new Set(ids).size !== ids.length) throw new Error('Your saved garden contains duplicate records. It has not been changed.');
  return value;
}
export function breathingPhase(seconds) {
  const t = ((seconds % 19) + 19) % 19;
  if (t < 4) return { key: 'inhale', label: 'Breathe in', remaining: Math.ceil(4 - t), progress: t / 4 };
  if (t < 11) return { key: 'hold', label: 'Hold gently', remaining: Math.ceil(11 - t), progress: (t - 4) / 7 };
  return { key: 'exhale', label: 'Breathe out', remaining: Math.ceil(19 - t), progress: (t - 11) / 8 };
}
