import { Input } from "antd";
import { useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import { ListCard } from "../data";
import { useData } from "../DataContext";

const InputStyled = styled(Input)`
  padding: 4px;
  flex-grow: 1;
  border: none;
`;

const Container = styled.div`
  padding: 8;
`;

const getListStyle = (isDraggingOver: boolean) => ({
  background: isDraggingOver ? "lightblue" : "#ebecf0",
  padding: 8,
  margin: 8,
  width: 250,
  borderRadius: 4,
});

const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: 8 * 2,
  margin: `0 0 ${8}px 0`,

  borderRadius: 4,
  // change background colour if dragging
  background: isDragging ? "lightgreen" : "white",

  // styles we need to apply on draggables
  ...draggableStyle,
});

type Props = { list: ListCard };

export const List = ({ list }: Props) => {
  const { addNewCard } = useData();

  const onAddNewCard = (value: string) => {
    if (!value) return;
    addNewCard(list.id, value);
  };

  return (
    <Droppable droppableId={list.id}>
      {(provided, snapshot) => (
        <Container
          ref={provided.innerRef}
          style={getListStyle(snapshot.isDraggingOver)}
        >
          <div>{list?.name}</div>
          {list.items?.map((item, index) => (
            <Draggable key={item.id} draggableId={item.id} index={index}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  style={getItemStyle(
                    snapshot.isDragging,
                    provided.draggableProps.style
                  )}
                >
                  {item.content}
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
          <AddNewCard onAddNewCard={onAddNewCard} />
        </Container>
      )}
    </Droppable>
  );
};

type AddNewCardProps = { onAddNewCard: (value: string) => void };

const AddNewCard = ({ onAddNewCard }: AddNewCardProps) => {
  const [value, setValue] = useState<string>("");

  const handleSubmit = () => {
    if (!value) return;
    onAddNewCard(value);
    setValue("");
  };

  return (
    <div style={{ width: "100%", display: "flex" }}>
      <InputStyled
        onChange={(e) => setValue(e.target.value)}
        value={value}
        placeholder="Add new card"
        onBlur={handleSubmit}
        onPressEnter={handleSubmit}
      />
    </div>
  );
};
