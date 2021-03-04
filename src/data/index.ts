export type CardItemType = {
  id: string;
  content: string;
};

export type ListCard = {
  id: string;
  name: string;
  items: CardItemType[];
};
