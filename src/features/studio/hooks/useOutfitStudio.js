import { useMemo, useState } from 'react';
import confetti from 'canvas-confetti';
import { CULTURAL_OUTFITS } from '../data/outfits';
import { COLOR_PALETTES } from '../data/palettes';
import { BOTTOM_OPTIONS } from '../data/bottoms';
import {
  MODERN_ACCESSORIES,
  TRADITIONAL_ACCESSORIES,
} from '../data/accessories';
import { findCulturalAlert } from '../domain/culturalSafety';

const randomItem = (items) => items[Math.floor(Math.random() * items.length)];
const shuffled = (items) => [...items].sort(() => 0.5 - Math.random());

export default function useOutfitStudio() {
  const [selectedEvent, setSelectedEvent] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedWeather, setSelectedWeather] = useState('all');
  const [gender, setGender] = useState('female');

  const [currentOutfit, setCurrentOutfit] = useState(CULTURAL_OUTFITS[0]);
  const [currentPalette, setCurrentPalette] = useState(COLOR_PALETTES[1]);
  const [currentBottom, setCurrentBottom] = useState(BOTTOM_OPTIONS[0]);
  const [traditionalAccs, setTraditionalAccs] = useState([
    'khan_van',
    'quat_xep',
    'guoc_moc',
  ]);
  const [modernAccs, setModernAccs] = useState([
    'sneakers_white',
    'kinh_ram_tron',
    'tui_tote_canvas',
  ]);
  const [isLookbookModalOpen, setIsLookbookModalOpen] = useState(false);

  const culturalAlert = useMemo(
    () => findCulturalAlert(currentOutfit, currentBottom),
    [currentOutfit, currentBottom],
  );

  const handleRandomize = () => {
    const headItems = TRADITIONAL_ACCESSORIES.filter(
      (item) => item.category === 'Đầu & Tóc',
    );
    const otherTraditionalItems = TRADITIONAL_ACCESSORIES.filter(
      (item) => item.category !== 'Đầu & Tóc',
    );
    const glassesItems = MODERN_ACCESSORIES.filter(
      (item) => item.category === 'Mắt kính',
    );
    const shoeItems = MODERN_ACCESSORIES.filter(
      (item) => item.category === 'Giày',
    );
    const otherModernItems = MODERN_ACCESSORIES.filter(
      (item) => !['Mắt kính', 'Giày'].includes(item.category),
    );

    const pickedHead = Math.random() > 0.25 ? [randomItem(headItems).id] : [];
    const pickedTraditional = shuffled(otherTraditionalItems)
      .slice(0, Math.floor(Math.random() * 2) + 1)
      .map((item) => item.id);
    const pickedGlasses = Math.random() > 0.3 ? [randomItem(glassesItems).id] : [];
    const pickedShoes = Math.random() > 0.3 ? [randomItem(shoeItems).id] : [];
    const pickedModern = shuffled(otherModernItems)
      .slice(0, Math.floor(Math.random() * 2) + 1)
      .map((item) => item.id);

    setCurrentOutfit(randomItem(CULTURAL_OUTFITS));
    setCurrentPalette(randomItem(COLOR_PALETTES));
    setCurrentBottom(randomItem(BOTTOM_OPTIONS));
    setTraditionalAccs([...pickedHead, ...pickedTraditional]);
    setModernAccs([...pickedGlasses, ...pickedShoes, ...pickedModern]);

    confetti({ particleCount: 60, spread: 70, origin: { y: 0.25 } });
  };

  const handleResetTraditional = () => {
    setCurrentBottom(BOTTOM_OPTIONS[0]);
    setCurrentPalette(COLOR_PALETTES[0]);
    setTraditionalAccs(['khan_van', 'quat_xep', 'guoc_moc']);
    setModernAccs([]);
  };

  const handleApplyPreset = (preset) => {
    const outfit = CULTURAL_OUTFITS.find((item) => item.id === preset.outfitId);
    const palette = COLOR_PALETTES.find((item) => item.id === preset.paletteId);
    const bottom = BOTTOM_OPTIONS.find((item) => item.id === preset.bottomId);

    if (outfit) setCurrentOutfit(outfit);
    if (palette) setCurrentPalette(palette);
    if (bottom) setCurrentBottom(bottom);
    if (preset.traditionalAccs) setTraditionalAccs(preset.traditionalAccs);
    if (preset.modernAccs) setModernAccs(preset.modernAccs);
    if (preset.gender && preset.gender !== 'both') setGender(preset.gender);

    confetti({ particleCount: 45, spread: 60, origin: { y: 0.5 } });
  };

  return {
    selectedEvent,
    setSelectedEvent,
    selectedRegion,
    setSelectedRegion,
    selectedWeather,
    setSelectedWeather,
    gender,
    setGender,
    currentOutfit,
    setCurrentOutfit,
    currentPalette,
    setCurrentPalette,
    currentBottom,
    setCurrentBottom,
    traditionalAccs,
    setTraditionalAccs,
    modernAccs,
    setModernAccs,
    isLookbookModalOpen,
    openLookbookModal: () => setIsLookbookModalOpen(true),
    closeLookbookModal: () => setIsLookbookModalOpen(false),
    culturalAlert,
    handleRandomize,
    handleResetTraditional,
    handleApplyPreset,
  };
}
