import type { CardColors } from '../types/flashcard';

export const getCardColors = (color: string): CardColors => {
  const colorMap: { [key: string]: CardColors } = {
    blue: {
      front: 'from-blue-800 to-blue-700 border-blue-600',
      back: 'from-blue-700 to-blue-600 border-blue-500',
      accent: 'bg-blue-500'
    },
    red: {
      front: 'from-red-800 to-red-700 border-red-600',
      back: 'from-red-700 to-red-600 border-red-500',
      accent: 'bg-red-500'
    },
    green: {
      front: 'from-green-800 to-green-700 border-green-600',
      back: 'from-green-700 to-green-600 border-green-500',
      accent: 'bg-green-500'
    },
    yellow: {
      front: 'from-yellow-800 to-yellow-700 border-yellow-600',
      back: 'from-yellow-700 to-yellow-600 border-yellow-500',
      accent: 'bg-yellow-500'
    },
    white: {
      front: 'from-gray-800 to-gray-700 border-gray-600',
      back: 'from-gray-700 to-gray-600 border-gray-500',
      accent: 'bg-gray-500'
    }
  };
  return colorMap[color] || colorMap.blue;
};

export const getDomainColor = (color: string): string => {
  const colorMap: { [key: string]: string } = {
    blue: 'bg-blue-500',
    red: 'bg-red-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    white: 'bg-gray-300',
    gray: 'bg-gray-500'
  };
  return colorMap[color] || colorMap.gray;
}; 