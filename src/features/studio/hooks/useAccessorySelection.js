import {
  MODERN_ACCESSORIES,
  TRADITIONAL_ACCESSORIES,
} from '../data/accessories';

const idsInCategory = (items, category) => (
  items.filter((item) => item.category === category).map((item) => item.id)
);

const replaceCategorySelection = (selectedIds, categoryIds, nextId) => [
  ...selectedIds.filter((id) => !categoryIds.includes(id)),
  nextId,
];

export default function useAccessorySelection({
  setTraditionalAccs,
  setModernAccs,
}) {
  const toggleTraditional = (id) => {
    setTraditionalAccs((selectedIds) => {
      if (selectedIds.includes(id)) {
        return selectedIds.filter((selectedId) => selectedId !== id);
      }

      const accessory = TRADITIONAL_ACCESSORIES.find((item) => item.id === id);
      if (accessory?.category !== 'Đầu & Tóc') {
        return [...selectedIds, id];
      }

      return replaceCategorySelection(
        selectedIds,
        idsInCategory(TRADITIONAL_ACCESSORIES, 'Đầu & Tóc'),
        id,
      );
    });
  };

  const toggleModern = (id) => {
    setModernAccs((selectedIds) => {
      if (selectedIds.includes(id)) {
        return selectedIds.filter((selectedId) => selectedId !== id);
      }

      const accessory = MODERN_ACCESSORIES.find((item) => item.id === id);
      if (!['Mắt kính', 'Giày'].includes(accessory?.category)) {
        return [...selectedIds, id];
      }

      return replaceCategorySelection(
        selectedIds,
        idsInCategory(MODERN_ACCESSORIES, accessory.category),
        id,
      );
    });
  };

  return { toggleTraditional, toggleModern };
}
