import React, { useEffect, useState } from "react";
import { DropResult } from "react-beautiful-dnd";
import { ListCard } from "./data";

const STORAGE_KEY = "trello_clone";

type ContextType = {
  list: ListCard[];
  addNewCard: (id: string, content: string) => void;
  reorderItem: (res: DropResult) => void;
  addNewList: (name: string) => void;
  reorderList: (res: DropResult) => void;
};

const DataContext = React.createContext<ContextType | string>(
  "should use inside DataContext"
);

type Props = { children: React.ReactNode };

export const DataProvider = ({ children }: Props) => {
  const [data, setData] = useState<ListCard[]>([]);

  const addNewList = (name: string) => {
    setData((prev) => [
      ...prev,
      { id: new Date().getTime().toString(), name, items: [] },
    ]);
  };

  const addNewCard = (listId: string, content: string) => {
    const list = data.find((d) => d.id === listId) as ListCard;
    const newList = data.map((l) => {
      if (l.id === listId)
        return {
          ...list,
          items: [
            ...(list?.items || []),
            { id: new Date().getTime().toString(), content },
          ],
        };
      return l;
    });
    setData(newList);
  };

  const deleteCard = (listId: string, index: number) => {
    const newData = data.map((d) => {
      if (d.id !== listId) {
        return d;
      }
      const newItems = [...d.items];
      newItems.splice(index, 1);
      return { ...d, items: newItems };
    });
    setData(newData);
  };

  const reorderList = ({ source, destination }: DropResult) => {
    if (!destination) {
      return;
    }

    const list = data[source.index];
    if (!list) return;

    const newData = [...data];
    newData.splice(source.index, 1);
    newData.splice(destination.index, 0, list);

    setData(newData);
  };

  const reorderItem = ({ source, destination }: DropResult) => {
    if (!destination) {
      return;
    }

    const item = data.find((d) => d.id === source.droppableId)?.items[
      source.index
    ];
    if (!item) return;

    const newData = data.map((d) => {
      const newItems = [...d.items];

      if (d.id === source.droppableId) {
        newItems.splice(source.index, 1);
      }

      if (d.id === destination.droppableId) {
        newItems.splice(destination.index, 0, item);
      }

      return { ...d, items: newItems };
    });

    setData(newData);
  };

  useEffect(() => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      try {
        setData(JSON.parse(data));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const value: ContextType = {
    list: data,
    addNewCard,
    reorderItem,
    addNewList,
    reorderList,
  };
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export function useData(): ContextType {
  const context = React.useContext(DataContext);
  if (typeof context === "string") {
    throw new Error(context);
  }
  return context;
}
